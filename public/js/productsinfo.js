window.onload = function() {
    loadCase();
    loadGPU();
    loadRam();
    loadCPU();
    loadCooler();
    loadPSU();
    loadStorage();
    loadMotherboard();
};

async function loadCase() {
    const tableElement = document.getElementById('CaseTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectCase', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadGPU() {
    const tableElement = document.getElementById('GPUTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectGPU', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadRam() {
    const tableElement = document.getElementById('RAMTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectRam', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadCPU() {
    const tableElement = document.getElementById('CPUTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectCPU', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadCooler() {
    const tableElement = document.getElementById('CoolerTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectCooler', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadPSU() {
    const tableElement = document.getElementById('PSUTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectPSU', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadStorage() {
    const tableElement = document.getElementById('StorageTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectStorage', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function loadMotherboard() {
    const tableElement = document.getElementById('MotherboardTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/SelectMotherboard', {method: 'GET'});
    const responseData = await response.json();
    const tableContent = responseData.data;
    if (tableBody) {tableBody.innerHTML = '';}
    tableContent.forEach(part => {
        const row = tableBody.insertRow();
        part.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}