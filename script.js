const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const entriesListEl = document.getElementById('entries-list');
const form = document.getElementById('entry-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const filters = document.getElementsByName('filter');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

document.addEventListener('DOMContentLoaded', updateUI);
form.addEventListener('submit', addEntry);
filters.forEach(filter => filter.addEventListener('change', applyFilter));

function addEntry(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = document.querySelector('input[name="type"]:checked').value;

    if (description && amount) {
        const entry = { description, amount, type, id: Date.now() };
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        updateUI();
        form.reset();
    }
}
document.getElementById("entry-form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    const addButton = document.querySelector("#entry-form button");
    addButton.classList.add("fly");
    setTimeout(() => {
        addButton.classList.remove("fly");
    }, 2000);
});

function updateUI() {
    const balance = calculateBalance();
    balanceEl.textContent = balance;

    const totalIncome = calculateTotal('income');
    totalIncomeEl.textContent = totalIncome;

    const totalExpenses = calculateTotal('expense');
    totalExpensesEl.textContent = totalExpenses;

    renderEntries(entries);
}

function calculateBalance() {
    const income = calculateTotal('income');
    const expenses = calculateTotal('expense');
    return income - expenses;
}

function calculateTotal(type) {
    return entries
        .filter(entry => entry.type === type)
        .reduce((total, entry) => total + entry.amount, 0);
}

function renderEntries(entriesToRender) {
    entriesListEl.innerHTML = '';

    entriesToRender.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${entry.description} - Rs.${entry.amount}
            <button class="edit-btn" onclick="editEntry(${entry.id})">Edit</button>
            <button class="edit-btn" onclick="deleteEntry(${entry.id})">Delete</button>
        `;
        entriesListEl.appendChild(li);
    });
}

function editEntry(id) {
    const entryToEdit = entries.find(entry => entry.id === id);
    descriptionEl.value = entryToEdit.description;
    amountEl.value = entryToEdit.amount;
    document.querySelector(`input[value="${entryToEdit.type}"]`).checked = true;
    deleteEntry(id); // Remove the entry temporarily for editing
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    updateUI();
}

function applyFilter() {
    const filterValue = document.querySelector('input[name="filter"]:checked').value;

    if (filterValue === 'all') {
        renderEntries(entries);
    } else {
        const filteredEntries = entries.filter(entry => entry.type === filterValue);
        renderEntries(filteredEntries);
    }
}
