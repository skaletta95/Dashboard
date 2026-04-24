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

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        state.activeTab = tab;

        document.getElementById('projects-view').style.display = tab === 'projects' ? 'block' : 'none';
        document.getElementById('employees-view').style.display = tab === 'employees' ? 'block' : 'none';
    });
});

renderProjectsTable();
renderEmployeesTable();