window.onload = function() {
    loadManufacturer();
    document.getElementById("avgManufacturerIDForm").addEventListener("submit", loadAVGManufacturer);
};

async function loadManufacturer() {
    const tableElement = document.getElementById('ManufacturerTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectManufacturer', {
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

async function loadAVGManufacturer(event) {
    event.preventDefault();
    const tableElement = document.getElementById('avgManufacturer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/groupby', {
        method: 'GET'
    });
    console.log("GET - GROUPBY");

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
