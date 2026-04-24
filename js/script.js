// LOCAL STORAGE

const STORAGE_KEY = 'monthlyData'

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getMonthData(data, year, month) {
    const key = `${year}-${month}`;
    if (!data[key]) {
        data[key] = { employees: [], projects: [] };
    }
    return data[key];
}

function initSampleData() {
    const data = loadData();
    const key = '2026-3';

    if (!data[key]) {
        data[key] = {
            employees: [
                {
                    id: 'e1',
                    name: 'John',
                    surname: 'Smith',
                    dateOfBirth: '1990-05-15',
                    position: 'Senior',
                    salary: 3000,
                    assignments: [],
                    vacationDays: []
                },
                {
                    id: 'e2',
                    name: 'Anna',
                    surname: 'Brown',
                    dateOfBirth: '1995-08-22',
                    position: 'Middle',
                    salary: 2000,
                    assignments: [],
                    vacationDays: []
                }
            ],
            projects: [
                {
                    id: 'p1',
                    projectName: 'Website Redesign',
                    companyName: 'Acme Corp',
                    budget: 10000,
                    capacity: 2
                },
                {
                    id: 'p2',
                    projectName: 'Mobile App',
                    companyName: 'Tech Ltd',
                    budget: 15000,
                    capacity: 3
                }
            ]
        };
        saveData(data);
    }
}

initSampleData();


const state = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    activeTab: 'projects'
};

// TABLE INIT

function renderProjectsTable() {
    const data = loadData();
    const monthData = getMonthData(data, state.year, state.month);
    const projects = monthData.projects;

    const tbody = document.getElementById('projects-tbody');

    if (projects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #606060; padding: 40px;">
                    No projects yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${project.companyName}</td>
            <td>${project.projectName}</td>
            <td>$${project.budget.toFixed(2)}</td>
            <td>${project.capacity}</td>
        </tr>
    `).join('');
}

function calcAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function renderEmployeesTable() {
    const data = loadData();
    const monthData = getMonthData(data, state.year, state.month);
    const employees = monthData.employees;

    const tbody = document.getElementById('employees-tbody');

    if (employees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #606060; padding: 40px;">
                    No employees yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>${emp.name}</td>
            <td>${emp.surname}</td>
            <td>${calcAge(emp.dateOfBirth)}</td>
            <td>${emp.position}</td>
            <td>$${emp.salary.toFixed(2)}</td>
        </tr>
    `).join('');
}



// PERIOD SELECTOR
const now = new Date();
document.getElementById('month-select').value = now.getMonth();
document.getElementById('year-select').value = now.getFullYear();

// SIDEBAR NAVIGATION
const navButtons = document.querySelectorAll('.nav-btn');

// Замени старый addEventListener на навигацию
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        state.activeTab = tab;

        document.getElementById('projects-view').style.display = tab === 'projects' ? 'block' : 'none';
        document.getElementById('employees-view').style.display = tab === 'employees' ? 'block' : 'none';

        // Меняем кнопку в хедере
        const addBtn = document.getElementById('open-add-panel');
        addBtn.textContent = tab === 'projects' ? '+ Add Project' : '+ Add Employee';
    });
});

// Кнопка открывает нужную панель в зависимости от вкладки
document.getElementById('open-add-panel').addEventListener('click', () => {
    if (state.activeTab === 'projects') {
        openPanel('add-project-panel');
    } else {
        openPanel('add-employee-panel');
    }
});

// SLIDE PANEL

// Открыть/закрыть панель
function openPanel(panelId) {
    document.getElementById(panelId).classList.add('active');
    document.getElementById('panel-overlay').classList.add('active');
}

function closePanel(panelId) {
    document.getElementById(panelId).classList.remove('active');
    document.getElementById('panel-overlay').classList.remove('active');
}

// Валидация полей
const validators = {
    projectName: (val) => {
        if (!val) return 'Project name is required';
        if (val.length < 3) return 'Min 3 characters';
        if (!/^[a-zA-Z0-9\s]+$/.test(val)) return 'Letters and numbers only';
        return '';
    },
    companyName: (val) => {
        if (!val) return 'Company name is required';
        if (val.length < 2) return 'Min 2 characters';
        if (!/^[a-zA-Z0-9\s]+$/.test(val)) return 'Letters and numbers only';
        return '';
    },
    budget: (val) => {
        if (!val) return 'Budget is required';
        if (isNaN(val) || Number(val) <= 0) return 'Must be a positive number';
        return '';
    },
    capacity: (val) => {
        if (!val) return 'Capacity is required';
        if (!Number.isInteger(Number(val)) || Number(val) < 1) return 'Must be an integer, min 1';
        return '';
    }
};

function validateField(inputId, errorId, validatorKey) {
    const val = document.getElementById(inputId).value.trim();
    const error = validators[validatorKey](val);
    document.getElementById(errorId).textContent = error;
    document.getElementById(inputId).classList.toggle('invalid', !!error);
    return !error;
}

function validateProjectForm() {
    const a = validateField('input-project-name', 'error-project-name', 'projectName');
    const b = validateField('input-company-name', 'error-company-name', 'companyName');
    const c = validateField('input-budget', 'error-budget', 'budget');
    const d = validateField('input-capacity', 'error-capacity', 'capacity');
    document.getElementById('submit-project').disabled = !(a && b && c && d);
}

// События формы
document.getElementById('input-project-name').addEventListener('input', validateProjectForm);
document.getElementById('input-company-name').addEventListener('input', validateProjectForm);
document.getElementById('input-budget').addEventListener('input', validateProjectForm);
document.getElementById('input-capacity').addEventListener('input', validateProjectForm);

// Сабмит
document.getElementById('submit-project').addEventListener('click', () => {
    const projectName = document.getElementById('input-project-name').value.trim();
    const companyName = document.getElementById('input-company-name').value.trim();
    const budget = parseFloat(document.getElementById('input-budget').value);
    const capacity = parseInt(document.getElementById('input-capacity').value);

    const newProject = {
        id: 'p' + Date.now(),
        projectName,
        companyName,
        budget,
        capacity
    };

    const data = loadData();
    const monthData = getMonthData(data, state.year, state.month);
    monthData.projects.push(newProject);
    saveData(data);

    renderProjectsTable();
    closePanel('add-project-panel');

    // Сбросить форму
    ['input-project-name', 'input-company-name', 'input-budget', 'input-capacity'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('submit-project').disabled = true;
});

// Закрытие
document.getElementById('close-project-panel').addEventListener('click', () => closePanel('add-project-panel'));
document.getElementById('panel-overlay').addEventListener('click', () => closePanel('add-project-panel'));


const employeeValidators = {
    name: (val) => {
        if (!val) return 'Name is required';
        if (val.length < 3) return 'Min 3 characters';
        if (!/^[a-zA-Z]+$/.test(val)) return 'Letters only';
        return '';
    },
    surname: (val) => {
        if (!val) return 'Surname is required';
        if (val.length < 3) return 'Min 3 characters';
        if (!/^[a-zA-Z]+$/.test(val)) return 'Letters only';
        return '';
    },
    dob: (val) => {
        if (!val) return 'Date of birth is required';
        const age = calcAge(val);
        if (age < 18) return 'Must be at least 18 years old';
        return '';
    },
    position: (val) => {
        if (!val) return 'Position is required';
        return '';
    },
    salary: (val) => {
        if (!val) return 'Salary is required';
        if (isNaN(val) || Number(val) <= 0) return 'Must be a positive number';
        return '';
    }
};

function validateEmployeeField(inputId, errorId, validatorKey) {
    const val = document.getElementById(inputId).value.trim();
    const error = employeeValidators[validatorKey](val);
    document.getElementById(errorId).textContent = error;
    document.getElementById(inputId).classList.toggle('invalid', !!error);
    return !error;
}

function validateEmployeeForm() {
    const a = validateEmployeeField('input-emp-name', 'error-emp-name', 'name');
    const b = validateEmployeeField('input-emp-surname', 'error-emp-surname', 'surname');
    const c = validateEmployeeField('input-emp-dob', 'error-emp-dob', 'dob');
    const d = validateEmployeeField('input-emp-position', 'error-emp-position', 'position');
    const e = validateEmployeeField('input-emp-salary', 'error-emp-salary', 'salary');
    document.getElementById('submit-employee').disabled = !(a && b && c && d && e);
}

// События валидации
['input-emp-name', 'input-emp-surname', 'input-emp-dob', 'input-emp-position', 'input-emp-salary'].forEach(id => {
    document.getElementById(id).addEventListener('input', validateEmployeeForm);
});

// Сабмит
document.getElementById('submit-employee').addEventListener('click', () => {
    const newEmployee = {
        id: 'e' + Date.now(),
        name: document.getElementById('input-emp-name').value.trim(),
        surname: document.getElementById('input-emp-surname').value.trim(),
        dateOfBirth: document.getElementById('input-emp-dob').value,
        position: document.getElementById('input-emp-position').value,
        salary: parseFloat(document.getElementById('input-emp-salary').value),
        assignments: [],
        vacationDays: []
    };

    const data = loadData();
    const monthData = getMonthData(data, state.year, state.month);
    monthData.employees.push(newEmployee);
    saveData(data);

    renderEmployeesTable();
    closePanel('add-employee-panel');

    ['input-emp-name', 'input-emp-surname', 'input-emp-dob', 'input-emp-position', 'input-emp-salary'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('submit-employee').disabled = true;
});

// Закрытие
document.getElementById('close-employee-panel').addEventListener('click', () => closePanel('add-employee-panel'));

renderProjectsTable();
renderEmployeesTable();