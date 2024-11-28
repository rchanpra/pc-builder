window.onload = function() {
    loadCompBuildTable();
    document.getElementById("updatePCPartsTable").addEventListener("submit", updatePCPart);
};


async function loadCompBuildTable() {
    const tableElement = document.getElementById('pcPartsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/selectAllPcParts', {
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

    const response = await fetch('/update-PCParts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PartID: idValue,
            Name: nameValue,
            Model: modelValue,
            Rating: ratingValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePartResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data updated successfully!";
        loadCompBuildTable();
    } else {
        messageElement.textContent = "Error updating data!";
    }
}