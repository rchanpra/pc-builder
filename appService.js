const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

//---------- general use

async function initiate() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`start pcpartspicker.sql`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        return true;
    }).catch(() => {
        return false;
    });
}

async function select() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PCParts');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


//----------
// 2.1.1 INSERT user can add partid to a pcpartlist with list id.
async function insertPCPL(ListID, PartID) {
    console.log("Performing INSERT"); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Contain (ListID, PartID) VALUES (:ListID, :PartID)`,
            [ListID, PartID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//2.1.2 UPDATE pcparts
async function updatePCP(PartID, Name, Model, Rating, ManufacturerID) {
    console.log("Performing UPDATE"); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PCParts SET Name=:Name, Model=:Model, Rating:= Rating where PartID=:PartID`,
            [PartID, Name, Model, Rating, ManufacturerID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//2.1.3 DELETE 
async function deletePID(ListID, PartID) {
    console.log("Performing DELETE"); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Contain WHERE ListID=:ListID AND PartID = :PartID`,
            [ ListID, PartID ],
            { autoCommit: true }
        );
        console.log("PCPL deleted")
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//2.1.4 Selection
async function SELECTION(name, model) {
    console.log("Performing SELECTION"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT *
            FROM PCParts
            WHERE Name=:name AND Model = :model
            `,
            [name, model]
        );
        console.log("SELECTION done")
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//2.1.5 Projection
async function PROJ(attributes, tablename) {
    console.log("Performing PROJ"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT :attributes
            FROM :tablename
            `,
            [attributes, tablename]
        );
        console.log("PROJ done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}


//2.1.6 Join
async function JOIN(rating) {
    console.log("Performing JOIN"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT parentpart.name, childpart.name
            FROM Compatibility 
            JOIN PCParts AS parentpart ON Compatibility.ParentPartID = parentpart.PartID
            JOIN PCParts AS childpart ON Compatibility.ChildPartID = childpart.PartID
            WHERE parentpart.Rating > :rating AND childpart.Rating > :rating
            `,
            [rating]
        );
        console.log("JOIN done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}
//2.1.7 Aggregation with GROUP BY
async function AGGB() {
    console.log("Performing Aggregation with GROUP BY"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT AVG(Rating), ManufacturerID 
            FROM PCParts 
            GROUP BY ManufacturerID
            `
        );
        console.log("AGGB done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}

//2.1.8 Aggregation with HAVING
async function AGH(rating) {
    console.log("Performing Aggregation with HAVING"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT COUNT(PartID), MIN(Rating), ManufacturerID 
            FROM PCParts 
            GROUP BY ManufacturerID
            HAVING MIN(Rating) > :rating
            `,
            [rating]
        );
        console.log("AGH done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}

//2.1.9 Nested aggregation with GROUP BY
async function NAGGB() {
    console.log("Nested aggregation with GROUP BY"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT MAX(AvgRating) AS MaxRating, ThreadCount 
            FROM (SELECT AVG(Rating) AS AvgRating, ManufacturerID, ThreadCount
                    FROM (SELECT *
                            FROM CPU c
                            LEFT JOIN PCParts p ON c.PartID = p.PartID
                    GROUP BY ManufacturerID, ThreadCount) 
            GROUP BY ThreadCount
        `);
        console.log("NAGGB done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}

//2.1.10 Division
async function DIVISION() {
    console.log("Division"); 

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT * FROM PCParts p
            WHERE NOT EXISTS (
                (SELECT r.RetailerID FROM Retailer r)
                EXCEPT
                (SELECT s.RetailerID FROM Sell s WHERE p.PartID = s.PartID)
        `);
        console.log("DIVISION done")
        console.log(result);
        return {
            result: result,
            bool: true
        };// still thinking the return value
    }).catch(() => {
        return false;
    });
}



// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    insertPCPL,
    updatePCP,
    deletePID,
    PROJ,
    JOIN,
    AGGB,
    AGH,
    NAGGB,
    DIVISION,
    select,
    initiate,
    //----------DEMO FUNCTION BELOW--------------
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};