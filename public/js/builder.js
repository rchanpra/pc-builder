window.onload = function() {
    loadPcPartsListIDs();
    document.getElementById("pcPartsListIDForm").addEventListener("submit", loadPcPartsList);
    document.getElementById("deletePartID").addEventListener("submit", deletePcPartFromList);
};


async function loadPcPartsListIDs() {
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

async function loadPcPartsList() {
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

async function deletePcPartFromList() {
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



async function updatePCPart(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertPartId').value;
    const modelValue = document.getElementById('insertModel').value;
    const nameValue = document.getElementById('insertPartName').value;
    const ratingValue = document.getElementById('insertRating').value;
    const manufacturerValue = document.getElementById('insertManufacturer').value;

    const response = await fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PartID: idValue,
            Name: nameValue,
            Model: modelValue,
            Rating: ratingValue,
            ManufacturerID: manufacturerValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePartResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data updated successfully!";
        loadPcPartsListIDs();
    } else {
        messageElement.textContent = responseData.message;
    }
}