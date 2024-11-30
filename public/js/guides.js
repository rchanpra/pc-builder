window.onload = function() {
    loadGuide();
    loadComment();
};

async function loadGuide() {
    const tableElement = document.getElementById('GuideTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectBuildGuide', {
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

async function loadComment() {
    const tableElement = document.getElementById('CommentTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectUserComment', {
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