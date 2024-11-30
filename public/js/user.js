window.onload = function() {
    loadUserEmail();
    document.getElementById("projectionForm").addEventListener("submit", projectUsers);
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

async function projectUsers(event) {
    event.preventDefault();
    let tableElement = document.querySelector('table[name="UserTable"]');

    let email = false;
    let username = false;
    let password = false;

    let sendString = ""

    document.querySelectorAll('input[name="projCheck"]').forEach((checkBox) => {
        if(checkBox.checked) {
            sendString += checkBox.value + ",";
        }
    })
    
    if(sendString.includes("Email")) {
        email = true;
    }
    if(sendString.includes("Username")) {
        username = true;
    }
    if(sendString.includes("Password")) {
        password = true;
    }
    if(sendString.length != 0) {
        sendString = sendString.slice(0, -1); 
    } else {
        sendString = "NULL"
    }
    console.log(sendString);
    
    const response = await fetch('/projection2', {
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

        let userDiv = document.getElementById("UserTableDiv");
        tableElement = document.createElement("table");
        tableElement.setAttribute('name', "UserTable");
        let header = tableElement.insertRow();
        let cell;
        if(email) {
            cell = header.insertCell()
            cell.textContent = "Email";
        }
        if(username) {
            cell = header.insertCell()
            cell.textContent = "Username";
        }
        if(password) {
            cell = header.insertCell()
            cell.textContent = "Password";
        } 
        tableContent.forEach(part => {
            const row = tableElement.insertRow();
            part.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
        userDiv.appendChild(tableElement);
    } else {
        messageElement.textContent = responseData.message;
    }
}