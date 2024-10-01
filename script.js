// Initialize total expense and expense list from localStorage if available
let totalExpense = parseFloat(localStorage.getItem('totalExpense')) || 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpenseDisplay = document.getElementById('total-expense');

// Set the total expense on load
totalExpenseDisplay.textContent = `Total Expense: $${totalExpense.toFixed(2)}`;

// Function to update localStorage
function updateLocalStorage() {
    localStorage.setItem('totalExpense', totalExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to render expenses list
function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.textContent = `${expense.description} (${expense.category}): $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(expenseItem);
    });
}

// Call the function on page load to render the expenses
renderExpenses();

// Chart initialization using Chart.js
const ctx = document.getElementById('expense-chart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Transport', 'Shopping', 'Others'],
        datasets: [{
            label: 'Expenses by Category',
            data: [0, 0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    }
});

// Function to update chart data
function updateChart() {
    let categoryTotals = { Food: 0, Transport: 0, Shopping: 0, Others: 0 };
    expenses.forEach(expense => {
        categoryTotals[expense.category] += expense.amount;
    });

    expenseChart.data.datasets[0].data = [
        categoryTotals.Food, categoryTotals.Transport, categoryTotals.Shopping, categoryTotals.Others
    ];
    expenseChart.update();
}

// Add event listener to handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description && amount && category) {
        totalExpense += amount;
        expenses.push({ description, amount, category });

        // Update the expense list
        const expenseItem = document.createElement('div');
        expenseItem.textContent = `${description} (${category}): $${amount.toFixed(2)}`;
        expenseList.appendChild(expenseItem);

        // Update total expense
        totalExpenseDisplay.textContent = `Total Expense: $${totalExpense.toFixed(2)}`;

        // Update chart and local storage
        updateChart();
        updateLocalStorage();

        form.reset();
    }
});
