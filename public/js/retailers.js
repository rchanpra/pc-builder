window.onload = function() {
    loadRetailer();
    document.getElementById("productsAllRetailersForm").addEventListener("submit", soldbyall);
};

async function loadRetailer() {
    const tableElement = document.getElementById('RetailerTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectRetailer', {
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

async function soldbyall(event) {
    event.preventDefault();
    const tableElement = document.getElementById('productsRetailer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/division', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData;
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