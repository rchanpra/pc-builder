window.onload = function() {
    loadPcPartsListIDs();
    document.getElementById("pcPartsListIDForm").addEventListener("submit", loadPcPartsList);
    document.getElementById("deletePartID").addEventListener("submit", deletePcPartFromList);
};

let currentListID;

// load a list of the lists of pc builds
async function loadPcPartsListIDs() {
    const tableElement = document.getElementById('listOfListIDs');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectPCPartsList', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Given a list ID load the pc parts in that list and display on table

async function loadPcPartsList(event) {
    event.preventDefault();
    const tableElement = document.getElementById('pcPartsList');
    const tableBody = tableElement.querySelector('tbody');

    currentListID = document.getElementById('insertListId').value;

    const response = await fetch('/SelectPCPartsFromPCPartsList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ListID: currentListID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('loadListResultMsg');
    if (responseData.success) {
        const tableContent = responseData.data;
        console.log(tableContent);
        messageElement.textContent = "Listed loaded successfully!";
        if (tableBody) {
            tableBody.innerHTML = '';
        }
    
        tableContent.forEach(part => {
            const row = tableBody.insertRow();
            part.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } else {
        messageElement.textContent = responseData.message;
    }
}



// Given a partID delete the part from the list currently selected

async function deletePcPartFromList(event) {
    event.preventDefault();
    const tableElement = document.getElementById('listOfListIDs');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/TODO', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


