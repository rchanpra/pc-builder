window.onload = function() {
    loadBenchmark();
    loadScore();
    document.getElementById("projectionForm").addEventListener("submit", projectBenchMarks);
};

async function loadScore() {
    const tableElement = document.getElementById('ScoreTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/SelectScore', {
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

async function projectBenchMarks(event) {
    event.preventDefault();
    let tableElement = document.querySelector('table[name="BenchmarkTable"]');

    let testID = false;
    let testName = false;
    let testType = false;

    let sendString = ""

    document.querySelectorAll('input[name="projCheck"]').forEach((checkBox) => {
        if(checkBox.checked) {
            sendString += checkBox.value + ",";
        }
    })
    
    if(sendString.includes("TestID")) {
        testID = true;
    }
    if(sendString.includes("TestName")) {
        testName = true;
    }
    if(sendString.includes("Type")) {
        testType = true;
    }
    if(sendString.length != 0) {
        sendString = sendString.slice(0, -1); 
    } else {
        sendString = "NULL"
    }
    console.log(sendString);
    
    const response = await fetch('/projection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            attributes: sendString
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('projectionMessage');
    if (responseData.success) {
        const tableContent = responseData.data;
        messageElement.textContent = "Listed loaded successfully!";
        tableElement.remove();

        let benchmarkDiv = document.getElementById("benchMarkTableDiv");
        tableElement = document.createElement("table");
        tableElement.setAttribute('name', "BenchmarkTable");
        let header = tableElement.insertRow();
        let cell;
        if(testID) {
            cell = header.insertCell()
            cell.textContent = "TestID";
        }
        if(testName) {
            cell = header.insertCell()
            cell.textContent = "TestName";
        }
        if(testType) {
            cell = header.insertCell()
            cell.textContent = "Type";
        } 
        tableContent.forEach(part => {
            const row = tableElement.insertRow();
            part.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
        benchmarkDiv.appendChild(tableElement);
    } else {
        messageElement.textContent = responseData.message;
    }
}