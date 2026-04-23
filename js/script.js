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
        console.log('Active tab:', tab);
    });
});