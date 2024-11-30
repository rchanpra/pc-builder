window.onload = function() {
    loadUserEmail();
};

async function loadUserEmail() {
    const tableElement = document.getElementById('UserTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectUserEmail', {
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