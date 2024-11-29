window.onload = function () {
    loadSell();
    document.getElementById("addFilter").addEventListener("click", addNewFilterForm);
    document.getElementById("filterSearch").addEventListener("submit", runFilter);
};

async function addNewFilterForm(event) {
    event.preventDefault();

    let mainFilterDiv = document.getElementById("filterSection")
    let newFilterDiv = mainFilterDiv.children[0].cloneNode(true);
    mainFilterDiv.appendChild(newFilterDiv);
    newFilterDiv.querySelector('input[name="searchBar"]').value = '';
    newFilterDiv.querySelectorAll('select').forEach((select) => {
        select.selectedIndex = 0;
    });
    newFilterDiv.querySelector('button[name="removeFilter"]').addEventListener("click", (event) => {
        event.preventDefault();
        if (mainFilterDiv.children.length > 1) {
            newFilterDiv.remove();
        }
    });
}

async function runFilter(event) {
    event.preventDefault();

    const tableElement = document.getElementById('SellTable');
    const tableBody = tableElement.querySelector('tbody');

    let filterArray = [];
    let filterString = "";

    document.getElementById("filterSection").querySelectorAll('div[name="innerFilterSection"]').forEach((child) => {
        let whereFilter = child.querySelector('select[name="whereFilter"]').value;
        let comparisonFilter = child.querySelector('select[name="comparisonFilter"]').value;
        let searchBar = child.querySelector('input[name="searchBar"]').value;
        let logicalFilter = child.querySelector('select[name="logicalFilter"]').value;
        if (whereFilter == "p.Name" || whereFilter == "p.Model" || whereFilter == "r.Name") {
            searchBar = "\'" + searchBar + "\'";
        }
        filterArray.push(whereFilter, comparisonFilter, searchBar, logicalFilter);
    });
    filterArray.pop();
    filterArray.forEach((string) => {
        filterString += string + " ";
    });
    filterString = filterString.substring(0, filterString.length - 1);

    const response = await fetch('/selection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            string: filterString
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('filterMessage');
    if (responseData.success) {
        const tableContent = responseData.data;
        messageElement.textContent = "Filter applied successfully"
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

async function loadSell() {
    const tableElement = document.getElementById('SellTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectSell', {
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