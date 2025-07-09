// Default credentials
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'jesusislord';

// On login form submit
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

// Load data from localStorage or initialize empty arrays
let converts = JSON.parse(localStorage.getItem('converts')) || [];
let workers = JSON.parse(localStorage.getItem('workers')) || [];

// Save to localStorage
function saveData() {
    localStorage.setItem('converts', JSON.stringify(converts));
    localStorage.setItem('workers', JSON.stringify(workers));
}

// Tab functionality
function showTab(tabName, event) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab pane
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked nav tab
    event.target.classList.add('active');

    // Refresh displays
    if (tabName === 'view-converts') {
        displayConverts();
    } else if (tabName === 'add-worker') {
        displayWorkers();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Worker form submission
    document.getElementById('workerForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const worker = {
            id: Date.now(),
            firstName: document.getElementById('workerFirstName').value,
            lastName: document.getElementById('workerLastName').value,
            phone: document.getElementById('workerPhone').value,
            email: document.getElementById('workerEmail').value,
            role: document.getElementById('workerRole').value,
            dateAdded: new Date().toLocaleDateString()
        };

        workers.push(worker);
        saveData();
        updateWorkerDropdown();
        displayWorkers();
        showSuccessMessage('worker-success');
        this.reset();
    });

    // Convert form submission
    document.getElementById('convertForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const convert = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            prayedWith: document.getElementById('prayedWith').value,
            notes: document.getElementById('notes').value,
            dateAdded: new Date().toLocaleDateString()
        };

        converts.push(convert);
        saveData();
        showSuccessMessage('convert-success');
        this.reset();
    });

    // Initialize displays
    updateWorkerDropdown();
    displayWorkers();
    displayConverts();
});

// Update worker dropdown
function updateWorkerDropdown() {
    const dropdown = document.getElementById('prayedWith');
    dropdown.innerHTML = '<option value="">Select a worker...</option>';

    workers.forEach(worker => {
        const option = document.createElement('option');
        option.value = `${worker.firstName} ${worker.lastName}`;
        option.textContent = `${worker.firstName} ${worker.lastName}`;
        dropdown.appendChild(option);
    });
}

// Display workers
function displayWorkers() {
    const workersList = document.getElementById('workers-list');

    if (workers.length === 0) {
        workersList.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem;">👥</div>
                <h3>No followup workers added yet</h3>
                <p>Add your first followup worker above to get started.</p>
            </div>
        `;
        return;
    }

    // Sort by latest added
    workers.sort((a, b) => b.id - a.id);

    workersList.innerHTML = workers.map(worker => `
        <div class="worker-card">
            <button class="delete-btn" onclick="deleteWorker(${worker.id})" title="Delete worker">✕</button>
            <h4>${worker.firstName} ${worker.lastName}</h4>
            <div><strong>Role:</strong> ${worker.role || 'Not specified'}</div>
            <div><strong>Phone:</strong> ${worker.phone || 'Not provided'}</div>
            <div><strong>Email:</strong> ${worker.email || 'Not provided'}</div>
            <div><strong>Added:</strong> ${worker.dateAdded}</div>
        </div>
    `).join('');
}

// Display converts
function displayConverts() {
    const convertsList = document.getElementById('converts-list');

    if (converts.length === 0) {
        convertsList.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem;">📋</div>
                <h3>No converts recorded yet</h3>
                <p>Start adding new converts to track your followup ministry.</p>
            </div>
        `;
        return;
    }

    // Sort by latest added
    converts.sort((a, b) => b.id - a.id);

    convertsList.innerHTML = converts.map(convert => `
        <div class="convert-card">
            <button class="delete-btn" onclick="deleteConvert(${convert.id})" title="Delete convert">✕</button>
            <h3>${convert.firstName} ${convert.lastName}</h3>
            <div class="convert-info"><strong>Phone:</strong> ${convert.phone || 'Not provided'}</div>
            <div class="convert-info"><strong>Email:</strong> ${convert.email || 'Not provided'}</div>
            <div class="convert-info"><strong>Address:</strong> ${convert.address || 'Not provided'}</div>
            <div class="convert-info"><strong>Prayed with:</strong> ${convert.prayedWith}</div>
            <div class="convert-info"><strong>Date added:</strong> ${convert.dateAdded}</div>
            ${convert.notes ? `<div class="convert-info"><strong>Notes:</strong> ${convert.notes}</div>` : ''}
        </div>
    `).join('');
}

// Delete functions
function deleteWorker(id) {
    if (confirm('Are you sure you want to delete this worker?')) {
        workers = workers.filter(worker => worker.id !== id);
        saveData();
        displayWorkers();
        updateWorkerDropdown();
    }
}

function deleteConvert(id) {
    if (confirm('Are you sure you want to delete this convert?')) {
        converts = converts.filter(convert => convert.id !== id);
        saveData();
        displayConverts();
    }
}

// Show success message
function showSuccessMessage(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// Export Converts to CSV
function exportConvertsToCSV() {
    if (converts.length === 0) {
        alert("No converts to export.");
        return;
    }

    const header = ['First Name', 'Last Name', 'Phone', 'Email', 'Address', 'Prayed With', 'Date Added', 'Notes'];
    const rows = converts.map(c => [
        c.firstName, c.lastName, c.phone, c.email, c.address, c.prayedWith, c.dateAdded, c.notes || ''
    ]);

    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'converts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print-Friendly Converts View
function printConverts() {
    const win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Convert List</title>');
    win.document.write('<style>body{font-family:sans-serif;padding:20px;} table{border-collapse:collapse;width:100%;} th, td{border:1px solid #ccc;padding:8px;} th{background:#f0f0f0;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>List of Converts</h2>');

    if (converts.length === 0) {
        win.document.write('<p>No converts recorded yet.</p>');
    } else {
        win.document.write('<table>');
        win.document.write('<tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Prayed With</th><th>Date</th><th>Notes</th></tr>');
        converts.forEach(c => {
            win.document.write(`<tr>
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td>${c.address}</td>
                <td>${c.prayedWith}</td>
                <td>${c.dateAdded}</td>
                <td>${c.notes || ''}</td>
            </tr>`);
        });
        win.document.write('</table>');
    }

    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

function logout() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('login-screen').className = 'login-container'
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}