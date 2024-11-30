window.onload = function () {
    loadCompatibility();
};

async function loadCompatibility() {
    const tableElement = document.getElementById('CompatibilityTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectCompatibility', {
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