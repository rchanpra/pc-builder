window.onload = function() {
    loadPcPartsIDs();
    document.getElementById("updatePCPartsTable").addEventListener("submit", updatePCPart);
    document.getElementById("pcPartsDeleteform").addEventListener("submit", deletePcPart);
    document.getElementById("addPartFilter").addEventListener("click", addNewFilterForm);
    document.getElementById("partFilterSearch").addEventListener("submit", runFilter);
};


async function addNewFilterForm(event) {
    event.preventDefault();

    let mainFilterDiv = document.getElementById("partFilterSection")
    let newFilterDiv = mainFilterDiv.children[0].cloneNode(true);
    mainFilterDiv.appendChild(newFilterDiv);
    newFilterDiv.querySelector('input[name="partSearchBar"]').value = '';
    newFilterDiv.querySelectorAll('select').forEach((select) => {
        select.selectedIndex = 0;
    });
    newFilterDiv.querySelector('button[name="partRemoveFilter"]').addEventListener("click", (event) => {
        event.preventDefault();
        if (mainFilterDiv.children.length > 1) {
            newFilterDiv.remove();
        }
    });
}

async function runFilter(event) {
    event.preventDefault();

    const tableElement = document.getElementById('pcPartsTable');
    const tableBody = tableElement.querySelector('tbody');

    let filterArray = [];
    let filterString = "";

    document.getElementById("partFilterSection").querySelectorAll('div[name="partInnerFilterSection"]').forEach((child) => {
        let whereFilter = child.querySelector('select[name="partWhereFilter"]').value;
        let comparisonFilter = child.querySelector('select[name="partComparisonFilter"]').value;
        let searchBar = child.querySelector('input[name="partSearchBar"]').value;
        let logicalFilter = child.querySelector('select[name="partLogicalFilter"]').value;
        if (whereFilter == "Name" || whereFilter == "Model") {
            searchBar = "\'" + searchBar + "\'";
        }
        filterArray.push(whereFilter, comparisonFilter, searchBar, logicalFilter);
    });
    filterArray.pop();
    filterArray.forEach((string) => {
        filterString += string + " ";
    });
    filterString = filterString.substring(0, filterString.length - 1);

    const response = await fetch('/filterPcParts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            string: filterString
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('partFilterMessage');
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


async function loadPcPartsIDs() {
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
        loadPcPartsIDs();
    } else {
        messageElement.textContent = responseData.message;
    }
}

async function deletePcPart(event) {
    event.preventDefault();
    partID = document.getElementById('deletePartID').value;

    const response = await fetch('/DeletePCParts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PartID: partID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deletePcPartMessage');
    if (responseData.success) {
        loadPcPartsIDs();
        messageElement.textContent = "Part deleted successfully!";
    } else {
        messageElement.textContent = responseData.message;
    }
}