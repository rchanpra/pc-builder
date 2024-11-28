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

// SANITIZATION FUNCTION
function Sanitization(req) {
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbiddenwords) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ${keyword}`);
            return false;
        }
    }
    return true;
}

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


// ----------------------------------------------------------
// Listen to INSERT endpoint
router.post('/insert-PID', async (req, res) => {
    console.log("POST - INSERT");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.INSERT(ListID, PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to UPDATE endpoint
router.post('/update-PCParts', async (req, res) => {
    console.log("POST - UPDATE");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { PartID, Name, Model, Rating, ManufacturerID } = req.body;

    console.log(PartID +  "   " + Name +  "   " + Model +  "   " + Rating +  "   " + ManufacturerID )

    const result = await appService.UPDATE(PartID, Name, Model, Rating, ManufacturerID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to DELETE endpoint
router.post('/delete-PID', async (req, res) => {
    console.log("POST - DELETE");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.DELETE(ListID, PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to SELECTION endpoint
router.get('/selection', async (req, res) => {
    console.log("GET - SELECTION");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {name, model} = req.body;
    const result = await appService.SELECTION(name, model);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to PROJ endpoint
router.post('/proj', async (req, res) => {
    console.log("POST - PROJ");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {attributes, tablename} = req.body;
    const result = await appService.PROJECTION(attributes, tablename);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to JOIN endpoint
router.post('/join', async (req, res) => {
    console.log("POST - JOIN");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Rating} = req.body;
    const result = await appService.JOIN(Rating);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to AGGB endpoint
router.post('/aggregation-group-by', async (req, res) => {
    console.log("POST - AGGB");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.GROUPBY();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to AGH endpoint
router.post('/aggregation-having', async (req, res) => {
    console.log("POST - AGH");

    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }
    const {Rating} = req.body;
    const result = await appService.HAVING(Rating);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to NAGGB endpoint
router.post('/nested-aggregation-group-by', async (req, res) => {
    console.log("POST - NAGGB");

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

// Listen to DIVISION endpoint
router.post('/division', async (req, res) => {
    console.log("POST - DIVISION");

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


module.exports = router;