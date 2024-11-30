const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchDemotableFromDb();
//     res.json({data: tableContent});
// });

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/insert-demotable", async (req, res) => {
//     const { id, name } = req.body;
//     const insertResult = await appService.insertDemotable(id, name);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/update-name-demotable", async (req, res) => {
//     const { oldName, newName } = req.body;
//     const updateResult = await appService.updateNameDemotable(oldName, newName);
//     if (updateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


// module.exports = router;


// ----------------------------------------------------------
const forbiddenwords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "OR", "AND", "--", "#", "/*", "*/", "*", "%"];

// 2.2.2 Sanitization
function Sanitization(req) {
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbiddenwords) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            return false;
        }
    }
    return true;
}

// 2.1.1 INSERT
router.post("/insert", async (req, res) => {
    console.log("POST - INSERT");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.INSERT(ListID, PartID);
    if (result == -1) {
        res.status(500).json({ success: false , message: "Invalid list loaded, please choose a valid list first"});
    } else if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false , message: "Invalid part ID, please choose a valid pc part"});
    }
});

// 2.1.2 UPDATE
router.post("/update", async (req, res) => {
    console.log("POST - UPDATE");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }
    const { PartID, Name, Model, Rating, ManufacturerID } = req.body;
    const result = await appService.UPDATE(PartID, Name, Model, Rating, ManufacturerID);
    if (result == -1) {
        res.json({ success: false, message: "Not a real manufacturer ID, please enter a valid one" });
    } else if (result) {
        res.json({ success: true, message: null });
    } else {
        res.status(500).json({ success: false , message: "Not a real product ID, please enter a valid one"});
    }
});

// 2.1.3 DELETE 
router.post('/delete', async (req, res) => {
    console.log("POST - DELETE");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.DELETE(ListID, PartID);
    if (result == -1) {
        res.status(500).json({ success: false , message: "Invalid list loaded, please choose a valid list first"});
    } else if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false , message: "Invalid part ID, please choose a valid pc part"});
    }
});

// 2.1.4 Selection
router.post('/selection', async (req, res) => {
    console.log("POST - SELECTION");
    // 2.2.2 Sanitization
    let sani = true;
    let forbidden = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "--", "#", "/*", "*/", "*", "%"];
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbidden) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            sani = false;
        }
    }
    if (!sani) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {string} = req.body;
    const result = await appService.SELECTION(string);
    if (result) {
        res.json({ success: true, data: result});
    } else {
        res.status(500).json({ success: false, message: "Invalid Query, please try again" });
    }
});

// 2.1.5 Projection
router.post('/projection', async (req, res) => {
    console.log("POST - PROJECTION");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {attributes} = req.body;
    const result = await appService.PROJECTION(attributes);
    if (result) {
        res.json({ success: true, data: result});
    } else {
        res.status(500).json({ success: false, message: "Failed to select columns, please try again" });
    }
});

router.post('/projection2', async (req, res) => {
    console.log("POST - PROJECTION2");
    // 2.2.2 Sanitization
    let sani = true;
    let forbidden = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "AND", "--", "#", "/*", "*/", "*", "%"];
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbidden) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            sani = false;
        }
    }
    if (!sani) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {attributes} = req.body;
    const result = await appService.PROJECTION2(attributes);
    if (result) {
        res.json({ success: true, data: result});
    } else {
        res.status(500).json({ success: false, message: "Failed to select columns, please try again" });
    }
})

// 2.1.6 Join
// router.post('/join', async (req, res) => {
//     console.log("POST - JOIN");
//     // 2.2.2 Sanitization
//     if (!Sanitization(req)) {
//         return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
//     }

//     const {Rating} = req.body;
//     const result = await appService.JOIN(Rating);
//     if (result) {
//         res.json(result);
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// 2.1.7 Aggregation with GROUP BY
router.get('/groupby', async (req, res) => {
    console.log("GET - GROUPBY");
    const tableContent = await appService.GROUPBY();
    res.json({data: tableContent});
});

// 2.1.8 Aggregation with HAVING
router.post('/having', async (req, res) => {
    console.log("POST - HAVING");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Rating} = req.body;
    const result = await appService.HAVING(Rating);
    if (result) {
        res.json({ success: true, data: result});
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.9 Nested aggregation with GROUP BY
router.get('/nestedgroupby', async (req, res) => {
    console.log("GET - NESTEDGROUPBY");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.NESTEDGROUPBY();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.10 Division
router.get('/division', async (req, res) => {
    console.log("GET - DIVISION");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.DIVISION();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});


// ----------------------------------------------------------
router.get('/SelectPCParts', async (req, res) => {
    console.log("GET - SelectPCParts");
    const tableContent = await appService.SelectPCParts();
    res.json({data: tableContent});
});

router.get('/SelectManufacturer', async (req, res) => {
    console.log("GET - SelectManufacturer");
    const tableContent = await appService.SelectManufacturer();
    res.json({data: tableContent});
});

router.get('/SelectRetailer', async (req, res) => {
    console.log("GET - SelectRetailer");
    const tableContent = await appService.SelectRetailer();
    res.json({data: tableContent});
});

router.get('/SelectPCPartsList', async (req, res) => {
    console.log("GET - SelectPCPartsList");
    const tableContent = await appService.SelectPCPartsList();
    res.json({data: tableContent});
});

router.get('/SelectBenchmarkTest', async (req, res) => {
    console.log("GET - SelectBenchmarkTest");
    const tableContent = await appService.SelectBenchmarkTest();
    res.json({data: tableContent});
});

router.get('/SelectUserEmail', async (req, res) => {
    console.log("GET - SelectUserEmail");
    const tableContent = await appService.SelectUserEmail();
    res.json({data: tableContent});
});

router.get('/SelectUserComment', async (req, res) => {
    console.log("GET - SelectUserComment");
    const tableContent = await appService.SelectUserComment();
    res.json({data: tableContent});
});

router.get('/SelectSell', async (req, res) => {
    console.log("GET - SelectSell");
    const tableContent = await appService.SelectSell();
    res.json({data: tableContent});
});

router.get('/SelectCompatibility', async (req, res) => {
    console.log("GET - SelectCompatibility");
    const tableContent = await appService.SelectCompatibility();
    res.json({data: tableContent});
});

router.get('/SelectScore', async (req, res) => {
    console.log("GET - SelectScore");
    const tableContent = await appService.SelectScore();
    res.json({data: tableContent});
});

router.get('/SelectBuildGuide', async (req, res) => {
    console.log("GET - SelectBuildGuide");
    const tableContent = await appService.SelectBuildGuide();
    res.json({data: tableContent});
});

// 2.1.4 Selection
router.post('/filterPcParts', async (req, res) => {
    console.log("POST - filterPcParts");
    // 2.2.2 Sanitization
    let sani = true;
    let forbidden = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "--", "#", "/*", "*/", "*", "%"];
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbidden) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            sani = false;
        }
    }
    if (!sani) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {string} = req.body;
    const result = await appService.FilterPCParts(string);
    if (result) {
        res.json({ success: true, data: result});
    } else {
        res.status(500).json({ success: false, message: "Invalid Query, please try again" });
    }
});

// 2.1.6 Join
router.post('/SelectPCPartsFromPCPartsList', async (req, res) => {
    console.log("POST - SelectPCPartsFromPCPartsList");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {ListID} = req.body;
    const result = await appService.SelectPCPartsFromPCPartsList(ListID);
    if (result) {
        res.json({success: true, data: result});
    } else {
        res.status(500).json({ success: false , message: "Not a real list ID, please enter a valid one"});
    }
});

router.post('/DeletePCParts', async (req, res) => {
    console.log("POST - DeletePCParts");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { PartID } = req.body;
    const result = await appService.DeletePCParts(PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/register", async (req, res) => {
    console.log("POST - register");
    // 2.2.2 Sanitization
    let sani = true;
    let forbidden = [" SELECT ", " INSERT ", " UPDATE ", " DELETE ", " DROP ", " ALL ", " AND ", " OR ", "--", "#", "/*", "*/", "*", "%"];
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbidden) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            sani = false;
        }
    }
    if (!sani) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Email, Username, Password} = req.body;
    const result = await appService.Register(Email, Username, Password);
    if (result == -1) {
        res.status(500).json({ success: false , message: "email already registered"});
    } else if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false , message: "Invalid input"});
    }
});

router.post("/login", async (req, res) => {
    console.log("POST - login");
    // 2.2.2 Sanitization
    let sani = true;
    let forbidden = [" SELECT ", " INSERT ", " UPDATE ", " DELETE ", " DROP ", " ALL ", " AND ", " OR ", "--", "#", "/*", "*/", "*", "%"];
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbidden) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            sani = false;
        }
    }
    if (!sani) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Email, Password} = req.body;
    const result = await appService.Login(Email, Password);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false , message: "Invalid login, please check your email / password"});
    }
});


// ----------------------------------------------------------
router.get('/SelectCase', async (req, res) => {
    console.log("GET - SelectCase");
    const tableContent = await appService.SelectCase();
    res.json({data: tableContent});
});

router.get('/SelectGPU', async (req, res) => {
    console.log("GET - SelectGPU");
    const tableContent = await appService.SelectGPU();
    res.json({data: tableContent});
});

router.get('/SelectRam', async (req, res) => {
    console.log("GET - SelectRam");
    const tableContent = await appService.SelectRam();
    res.json({data: tableContent});
});

router.get('/SelectCPU', async (req, res) => {
    console.log("GET - SelectCPU");
    const tableContent = await appService.SelectCPU();
    res.json({data: tableContent});
});

router.get('/SelectCooler', async (req, res) => {
    console.log("GET - SelectCooler");
    const tableContent = await appService.SelectCooler();
    res.json({data: tableContent});
});

router.get('/SelectPSU', async (req, res) => {
    console.log("GET - SelectPSU");
    const tableContent = await appService.SelectPSU();
    res.json({data: tableContent});
});

router.get('/SelectStorage', async (req, res) => {
    console.log("GET - SelectStorage");
    const tableContent = await appService.SelectStorage();
    res.json({data: tableContent});
});

router.get('/SelectMotherboard', async (req, res) => {
    console.log("GET - SelectMotherboard");
    const tableContent = await appService.SelectMotherboard();
    res.json({data: tableContent});
});


// ----------------------------------------------------------
module.exports = router;