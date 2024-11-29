window.onload = function() {
    loadBenchmark();
};

async function loadBenchmark() {
    const tableElement = document.getElementById('BenchmarkTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectBenchmarkTest', {
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