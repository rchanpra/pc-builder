window.onload = function() {
    loadManufacturer();
    document.getElementById("avgManufacturerIDForm").addEventListener("submit", loadAVGManufacturer);
    document.getElementById("minManufacturerIDForm").addEventListener("submit", loadMINManufacturer);
    document.getElementById("ratingManufacturerIDForm").addEventListener("submit", ratingManufacturer);
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

async function loadMINManufacturer(event) {
    event.preventDefault();
    const tableElement = document.getElementById('minManufacturer');
    const tableBody = tableElement.querySelector('tbody');

    cRating = document.getElementById('insertMINId').value;

    const response = await fetch('/having', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Rating: cRating
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('loadManufacturerResultMsg');
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


async function ratingManufacturer(event) {
    event.preventDefault();
    const tableElement = document.getElementById('ratingManufacturer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/nestedgroupby', {
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
