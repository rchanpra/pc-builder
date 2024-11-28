window.onload = function() {
    loadCompBuildTable();
    document.getElementById("updatePCPartsTable").addEventListener("submit", updatePCPart);
};


async function loadCompBuildTable() {
    const tableElement = document.getElementById('pcPartsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectPCParts', {
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
        loadCompBuildTable();
    } else {
        messageElement.textContent = responseData.message;
    }
}