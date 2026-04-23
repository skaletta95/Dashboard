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