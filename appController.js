const express = require('express');
const appService = require('./appService');

const router = express.Router();

const forbiddenwords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "OR", "AND", "--", "#", "/*", "*/", "*", "%"];

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


// Listen to UPDATE endpoint
router.post('/update-PCParts', async (req, res) => {
    console.log("POST - UPDATE");

    //2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { PartID, Name, Model, Rating, ManufacturerID } = req.body;
    const result = await appService.updatePCP(PartID, Name, Model, Rating, ManufacturerID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to DELETE endpoint
router.post('/delete-PID', async (req, res) => {
    console.log("POST - DELETE");

    //2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.deletePID(ListID, PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


//------------------------------------------------------------------
router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;