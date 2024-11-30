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

// async function fetchDemotableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM DEMOTABLE');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function updateNameDemotable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }

// module.exports = {
//     testOracleConnection,
//     fetchDemotableFromDb,
//     initiateDemotable, 
//     insertDemotable, 
//     updateNameDemotable, 
//     countDemotable
// };


// ----------------------------------------------------------
// 2.1.1 INSERT
// insert pcparts into pcpartslist
async function INSERT(ListID, PartID) {
    console.log("INSERT");
    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            'Select * FROM PCPartsList c WHERE c.ListID=:ListID',
            [ListID]
        );

        if (result.rows.length == 0) {
            return -1;
        }

        result = await connection.execute(
            `INSERT INTO Contain (ListID, PartID) VALUES (:ListID, :PartID)`,
            [ListID, PartID],
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// 2.1.2 UPDATE
// update pcparts
async function UPDATE(PartID, Name, Model, Rating, ManufacturerID) {
    console.log("UPDATE");
    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            `SELECT * FROM Manufacturer WHERE ManufacturerID=:ManufacturerID`,
            [ManufacturerID]
        );

        if (result.rows.length == 0) {
            return -1
        }

        result = await connection.execute(
            `UPDATE PCParts SET Name=:Name, Model=:Model, Rating=:Rating, ManufacturerID=:ManufacturerID where PartID=:PartID`,
            [Name, Model, Rating, ManufacturerID, PartID],
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// 2.1.3 DELETE
// delete pcparts from pcpartslist
async function DELETE(ListID, PartID) {
    console.log("DELETE");
    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            'Select * FROM PCPartsList c WHERE c.ListID=:ListID',
            [ListID]
        );

        if (result.rows.length == 0) {
            return -1;
        }

        result = await connection.execute(
            `DELETE
            FROM Contain
            WHERE ListID=:ListID AND PartID =:PartID`,
            [ListID, PartID],
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// 2.1.4 Selection
// select pcparts with name and model
async function SELECTION(string) {
    console.log("Selection");
    return await withOracleDB(async (connection) => {
        const SQL = `SELECT p.PartID, p.Name, p.Model, p.Rating, p.ManufacturerID, s.Price, s.DatePriced, r.RetailerID, r.Name, r.Website
            FROM Sell s
            JOIN Retailer r ON r.RetailerID=s.RetailerID
            JOIN PCParts p ON p.PartID=s.PartID
            WHERE ${string}`
        const result = await connection.execute(SQL, {});
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// 2.1.5 Projection
async function PROJECTION(attributes) {
    console.log("Projection");
    console.log(attributes);
    return await withOracleDB(async (connection) => {
        const SQL = `
            SELECT ${attributes}
            FROM BenchmarkTest
            `
        const result = await connection.execute(SQL, {});
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// 2.1.6 Join
// async function JOIN(rating) {
//     console.log("Join");
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `
//             SELECT parentpart.name, childpart.name
//             FROM Compatibility 
//             JOIN PCParts AS parentpart ON Compatibility.ParentPartID = parentpart.PartID
//             JOIN PCParts AS childpart ON Compatibility.ChildPartID = childpart.PartID
//             WHERE parentpart.Rating > :rating AND childpart.Rating > :rating
//             `,
//             [rating]
//         );
//         return result; // stub
//     }).catch(() => {
//         return false;
//     });
// }

// 2.1.7 Aggregation with GROUP BY
async function GROUPBY() {
    console.log("Aggregation with GROUP BY");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT x.ManufacturerID, x.Name, AVG(x.Rating)
            FROM (SELECT p.Rating, p.ManufacturerID, m.Name
                    FROM PcParts p 
                    JOIN Manufacturer m ON p.ManufacturerID=m.ManufacturerID) x
            GROUP BY x.ManufacturerID, x.Name
            `
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// 2.1.8 Aggregation with HAVING
async function HAVING(rating) {
    console.log("Aggregation with HAVING");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT ManufacturerID, Name, COUNT(PartID), MIN(Rating)
            FROM (SELECT p.PartID, p.Rating, p.ManufacturerID, m.Name
                    FROM PcParts p 
                    JOIN Manufacturer m ON p.ManufacturerID=m.ManufacturerID)
            GROUP BY ManufacturerID, Name
            HAVING MIN(Rating) >= :rating
            `,
            [rating]
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// 2.1.9 Nested aggregation with GROUP BY
async function NESTEDGROUPBY() {
    console.log("Nested aggregation with GROUP BY");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT *
            FROM PCParts pe
            WHERE pe.Rating > ALL(SELECT AVG(p.Rating) FROM PCParts p GROUP BY ManufacturerID)
        `);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// 2.1.10 Division
async function DIVISION() {
    console.log("Division");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT * FROM PCParts p
            WHERE NOT EXISTS (
                (SELECT r.RetailerID FROM Retailer r)
                MINUS
                (SELECT s.RetailerID FROM Sell s WHERE p.PartID = s.PartID))
        `);
        return result.rows;
    }).catch(() => {
        return false;
    });
}


// ----------------------------------------------------------
async function SelectPCParts() {
    console.log("SelectPCParts");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT *FROM PcParts p');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectManufacturer() {
    console.log("SelectManufacturer");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Manufacturer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectRetailer() {
    console.log("SelectRetailer");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Retailer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectPCPartsList() {
    console.log("SelectPCPartsList");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PCPartsList');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectBenchmarkTest() {
    console.log("SelectBenchmarkTest");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BenchmarkTest');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectSell() {
    console.log("SelectSell");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT p.PartID, p.Name, p.Model, p.Rating, p.ManufacturerID, s.Price, s.DatePriced, r.RetailerID, r.Name, r. Website
            FROM Sell s
            JOIN Retailer r ON r.RetailerID=s.RetailerID
            JOIN PCParts p ON p.PartID=s.PartID`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function SelectCompatibility() {
    console.log("SelectCompatibility");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT r.PartID, r.Name, r.Model, r.Rating, r.ManufacturerID, p.PartID, p.Name, p.Model, p.Rating, p.ManufacturerID
            FROM Compatibility s
            JOIN PCParts r ON s.ParentPartID=r.PartID
            JOIN PCParts p ON p.PartID=s.ChildPartID`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// 2.1.4 SELECTION
async function FilterPCParts(string) {
    console.log("Selection");
    return await withOracleDB(async (connection) => {
        const SQL = `SELECT * FROM PcParts p WHERE ${string}`
        const result = await connection.execute(SQL, {});
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// 2.1.6 JOIN
async function SelectPCPartsFromPCPartsList(ListID) {
    console.log("SelectPCPartsFromPCPartsList");
    return await withOracleDB(async (connection) => {
        let result = await connection.execute(
            'Select * FROM PCPartsList c WHERE c.ListID=:ListID',
            [ListID]
        );

        if (result.rows.length == 0) {
            return false;
        }

        result = await connection.execute(
            `Select cp.PartID, Name, Model, Rating, ManufacturerID
            FROM (Select * FROM Contain c WHERE c.ListID=:ListID) cp 
            JOIN PCParts p ON p.PartID=cp.PartID`,
            [ListID],
            { autoCommit: true }
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function DeletePCParts(PartID) {
    console.log("DeletePCParts");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE
            FROM PCParts
            WHERE PartID =:PartID`,
            [PartID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


// ----------------------------------------------------------
module.exports = {
    testOracleConnection,
    //
    INSERT,
    UPDATE,
    DELETE,
    SELECTION,
    PROJECTION,
    // JOIN,
    GROUPBY,
    HAVING,
    NESTEDGROUPBY,
    DIVISION,
    //
    SelectPCParts,
    SelectManufacturer,
    SelectRetailer,
    SelectPCPartsList,
    SelectBenchmarkTest,
    SelectSell,
    SelectCompatibility,
    FilterPCParts,
    SelectPCPartsFromPCPartsList,
    DeletePCParts
};