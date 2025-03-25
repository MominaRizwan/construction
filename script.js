// API endpoints
const API_URL = 'http://localhost:3000';

// Current state
let currentProjects = [];
let currentSuppliers = [];

// Show/Hide sections
function showProjects() {
    document.getElementById('projectsSection').style.display = 'block';
    document.getElementById('suppliersSection').style.display = 'none';
    loadProjects();
}

function showSuppliers() {
    document.getElementById('projectsSection').style.display = 'none';
    document.getElementById('suppliersSection').style.display = 'block';
    loadSuppliers();
}

// Projects CRUD Operations
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        currentProjects = await response.json();
        displayProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Failed to load projects');
    }
}

function displayProjects() {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '';
    
    currentProjects.forEach(project => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${project.location}</td>
            <td>${new Date(project.startDate).toLocaleDateString()}</td>
            <td>${new Date(project.endDate).toLocaleDateString()}</td>
            <td>$${project.budget.toLocaleString()}</td>
            <td class="action-buttons">
                <button onclick="editProject('${project._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteProject('${project._id}')" class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveProject(event) {
    event.preventDefault();
    
    const projectData = {
        name: document.getElementById('projectName').value,
        location: document.getElementById('projectLocation').value,
        startDate: document.getElementById('projectStartDate').value,
        endDate: document.getElementById('projectEndDate').value,
        budget: Number(document.getElementById('projectBudget').value)
    };

    const projectId = document.getElementById('projectId').value;
    
    try {
        const url = projectId ? 
            `${API_URL}/projects/${projectId}` : 
            `${API_URL}/projects`;
            
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        if (!response.ok) throw new Error('Failed to save project');
        
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        loadProjects();
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project');
    }
}

function editProject(projectId) {
    const project = currentProjects.find(p => p._id === projectId);
    if (project) {
        document.getElementById('projectId').value = project._id;
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectLocation').value = project.location;
        document.getElementById('projectStartDate').value = project.startDate.split('T')[0];
        document.getElementById('projectEndDate').value = project.endDate.split('T')[0];
        document.getElementById('projectBudget').value = project.budget;
    }
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete project');
        
        loadProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
    }
}

// Suppliers CRUD Operations
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_URL}/suppliers`);
        currentSuppliers = await response.json();
        displaySuppliers();
    } catch (error) {
        console.error('Error loading suppliers:', error);
        alert('Failed to load suppliers');
    }
}

function displaySuppliers() {
    const tbody = document.getElementById('suppliersTableBody');
    tbody.innerHTML = '';
    
    currentSuppliers.forEach(supplier => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contactPerson}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.materials}</td>
            <td class="action-buttons">
                <button onclick="editSupplier('${supplier._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteSupplier('${supplier._id}')" class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveSupplier(event) {
    event.preventDefault();
    
    const supplierData = {
        name: document.getElementById('supplierName').value,
        contactPerson: document.getElementById('supplierContact').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        materials: document.getElementById('supplierMaterials').value
    };

    const supplierId = document.getElementById('supplierId').value;
    
    try {
        const url = supplierId ? 
            `${API_URL}/suppliers/${supplierId}` : 
            `${API_URL}/suppliers`;
            
        const method = supplierId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        });

        if (!response.ok) throw new Error('Failed to save supplier');
        
        document.getElementById('supplierForm').reset();
        document.getElementById('supplierId').value = '';
        loadSuppliers();
    } catch (error) {
        console.error('Error saving supplier:', error);
        alert('Failed to save supplier');
    }
}

function editSupplier(supplierId) {
    const supplier = currentSuppliers.find(s => s._id === supplierId);
    if (supplier) {
        document.getElementById('supplierId').value = supplier._id;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierContact').value = supplier.contactPerson;
        document.getElementById('supplierEmail').value = supplier.email;
        document.getElementById('supplierPhone').value = supplier.phone;
        document.getElementById('supplierMaterials').value = supplier.materials;
    }
}

async function deleteSupplier(supplierId) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
        const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete supplier');
        
        loadSuppliers();
    } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier');
    }
}

// Event Listeners
document.getElementById('projectForm').addEventListener('submit', saveProject);
document.getElementById('supplierForm').addEventListener('submit', saveSupplier);

// Initial load
showProjects();
