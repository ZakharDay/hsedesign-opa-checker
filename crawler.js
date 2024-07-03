let employees = [];
let employeeNames = [];
let table;

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

function getChromeStorageEmployeeNamesData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      'employeeListToWatch',
      ({ employeeListToWatch }) => {
        if (employeeListToWatch == undefined) {
          chrome.storage.sync.set({
            employeeListToWatch: [],
          });
        } else {
          employeeNames = employeeListToWatch;
        }

        resolve();
      }
    );
  });
}

function setChromeStorageEmployeeNameData(employeeName) {
  return new Promise((resolve, reject) => {
    employeeNames.push(employeeName);

    chrome.storage.sync.set({
      employeeListToWatch: [...employeeNames],
    });

    resolve();
  });
}

function removeChromeStorageEmployeeNameData(employeeName) {
  return new Promise((resolve, reject) => {
    employeeNames.splice(employeeNames.indexOf(employeeName), 1);

    chrome.storage.sync.set({
      employeeListToWatch: [...employeeNames],
    });

    resolve();
  });
}

function prepareUI() {
  return new Promise((resolve, reject) => {
    table = document.body.querySelector('table');
    const tableRows = table.getElementsByTagName('tr');

    for (let index = 0; index < tableRows.length; index++) {
      const tableRow = tableRows[index];
      const tableRowCells = tableRow.getElementsByTagName('td');

      for (let index = 0; index < tableRowCells.length; index++) {
        const tableRowCell = tableRowCells[index];

        if (index == 0) {
          const employeeName = tableRowCell.querySelector('a').innerText;
          tableRowCell.style.position = 'relative';
          tableRowCell.style.paddingLeft = '46px';
          renderToggleEmployeeButton(tableRowCell, employeeName);
        }
      }
    }

    const root = document.createElement('div');
    root.classList.add('rootElement');
    document.body.appendChild(root);

    updatePanelVisibility();

    resolve();
  });
}

function renderToggleEmployeeButton(container, name) {
  const button = document.createElement('div');
  button.classList.add('employeeButton');
  container.prepend(button);

  if (employeeNames.includes(name)) {
    setEmployeeRowAndButtonStyle(button, 'active');
  } else {
    setEmployeeRowAndButtonStyle(button, 'inactive');
  }

  button.addEventListener('click', () => {
    if (employeeNames.includes(name)) {
      removeChromeStorageEmployeeNameData(name);
      setEmployeeRowAndButtonStyle(button, 'inactive');
      updatePanelVisibility();
    } else {
      setChromeStorageEmployeeNameData(name);
      setEmployeeRowAndButtonStyle(button, 'active');
      updatePanelVisibility();
    }

    getData().then(() => {
      renderData();
    });
  });
}

function setEmployeeRowAndButtonStyle(button, active) {
  const row = button.parentElement.parentElement;

  if (active == 'active') {
    button.innerText = '-';
    row.classList.add('activeEmployeeRow');
  } else {
    button.innerText = '+';
    row.classList.remove('activeEmployeeRow');
  }
}

function updatePanelVisibility() {
  const root = document.querySelector('.rootElement');

  if (employeeNames.length == 0) {
    root.classList.add('empty');
  } else {
    root.classList.remove('empty');
  }
}

function getData() {
  return new Promise((resolve, reject) => {
    employees = [];

    table = document.body.querySelector('table');
    const tableRows = table.getElementsByTagName('tr');

    for (let index = 0; index < tableRows.length; index++) {
      const tableRow = tableRows[index];
      const tableRowCells = tableRow.getElementsByTagName('td');

      const employee = {
        name: '',
        projects: '',
        opa: '',
      };

      for (let index = 0; index < tableRowCells.length; index++) {
        const tableRowCell = tableRowCells[index];

        if (index == 0) {
          const a = tableRowCell.querySelector('a');
          employee.name = a.innerText;
        } else if (index == 2) {
          employee.projects = tableRowCell.innerText;
        } else if (index == 11) {
          employee.opa = tableRowCell.innerText;
        }
      }

      if (employeeNames.includes(employee.name)) {
        employees.push(employee);
      }
    }

    resolve();
  });
}

function renderData() {
  const root = document.querySelector('.rootElement');
  root.innerHTML = '';

  employees.forEach((employee) => {
    const employeeElement = document.createElement('div');
    employeeElement.classList.add('employeeElement');

    const nameElement = document.createElement('div');
    nameElement.classList.add('nameElement');
    nameElement.innerText = employee.name;

    const projectsElement = document.createElement('div');
    projectsElement.classList.add('projectsElement');
    projectsElement.innerText = `Проектов: ${employee.projects}`;

    if (parseInt(employee.projects) < 4) {
      projectsElement.style.color = 'red';
    }

    const opaElement = document.createElement('div');
    opaElement.classList.add('opaElement');
    opaElement.innerText = `Месячный ОПА: ${employee.opa}`;

    if (parseFloat(employee.opa) < 1) {
      opaElement.style.color = 'red';
    }

    employeeElement.appendChild(nameElement);
    employeeElement.appendChild(projectsElement);
    employeeElement.appendChild(opaElement);

    root.appendChild(employeeElement);
  });
}

addStyle(`
  thead {
    z-index: 99999 !important;
  }

  .activeEmployeeRow {
    background-color: rgba(0, 0, 255, 0.05);
  }

  .employeeButton {
    position: absolute;
    left: 10px;
    width: 30px;
    height: 30px;
    background-color: white;
    border: 1px solid black;
    text-align: center;
    border-radius: 5px;
  }

  .employeeButton:hover {
    background-color: rgb(200, 200, 200);
  }

  .rootElement {
    position: fixed;
    z-index: 9999999999999;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 30vh;
    overflow: scroll;
    padding: 20px 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    backdrop-filter: blur(16px);
    background-color: rgba(0, 0, 255, 0.05);
  }
  
  .rootElement.empty {
    display: none;
  }

  .employeeElement {
    width: 220px;
    border: 1px solid lightgrey;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
  }
  
  .employeeElement:hover .removeButton {
    display: block;
  }

  .employeeElement .removeButton {
    display: none;
    width: 30px;
    height: 30px;
  }
  
  .nameElement {
    margin-bottom: 6px;
    font-weight: bold;
  }
`);

setTimeout(() => {
  getChromeStorageEmployeeNamesData().then(() => {
    prepareUI().then(() => {
      if (employeeNames.length > 0) {
        getData().then(() => {
          renderData();
        });
      }
    });
  });
}, 3000);
