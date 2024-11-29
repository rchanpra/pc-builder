window.onload = function() {
    loadSell();
    document.getElementById("addFilter").addEventListener("click", addNewFilterForm);
    document.getElementById("submitFilterSearch").addEventListener("submit", runFilter);
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
        if(mainFilterDiv.children.length > 1) {
            newFilterDiv.remove();
        }
    });
}

async function runFilter(event) {
    event.preventDefault();

    const tableElement = document.getElementById('SellTable');
    const tableBody = tableElement.querySelector('tbody');

    let filterString = '';

    console.log("asdasd");
    
    // document.getElementById("filterSection").querySelectorAll().forEach((child) => {
    //     console.log(child);
    // })


    // const response = await fetch('/update', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         PartID: idValue,
    //         Name: nameValue,
    //         Model: modelValue,
    //         Rating: ratingValue,
    //         ManufacturerID: manufacturerValue
    //     })
    // });

    // const responseData = await response.json();
    // const tableContent = responseData.data;

    // if (tableBody) {
    //     tableBody.innerHTML = '';
    // }

    // tableContent.forEach(part => {
    //     const row = tableBody.insertRow();
    //     part.forEach((field, index) => {
    //         const cell = row.insertCell(index);
    //         cell.textContent = field;
    //     });
    // });
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