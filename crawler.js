const employeeNames = [
  'Алексеев Александр',
  'Андрияшкин Дмитрий',
  'Аракелян Нона',
  'Булгаков Вадим',
  'Дудникова Инна',
  'Качалкин Глеб',
  'Комкова Анна',
  'Латышев Артём',
  'Пащенко Олег',
  'День Захар',
  'Швецова Ксения',
  'Александров Дмитрий',
  'Каем Софья',
  'Гришанин Кирилл',
  'Криворучко Михаил',
  'Колчеданцев Антон',
  'Постнова Виолетта',
  'Рапацкая Янина',
];

const employees = [];

let table;

function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

function getData() {
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
}

function renderData() {
  const root = document.createElement('div');
  root.classList.add('rootElement');
  document.body.appendChild(root);

  employees.forEach((employee) => {
    const employeeElement = document.createElement('div');
    employeeElement.classList.add('employeeElement');

    const nameElement = document.createElement('h2');
    nameElement.classList.add('nameElement');
    employeeElement.innerText = employee.name;

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
  .rootElement {
    position: fixed;
    z-index: 9999999999999;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 400px;
    overflow: scroll;
    padding: 20px 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    backdrop-filter: blur(16px);
    background-color: rgba(0, 0, 255, 0.05);
  }

  .employeeElement {
    width: 220px;
    border: 1px solid lightgrey;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
  }
`);

setTimeout(() => {
  getData();
  console.log(employees);
  renderData();
}, 3000);
