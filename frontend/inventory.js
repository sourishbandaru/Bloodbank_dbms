const API_URL = 'http://localhost:3000/api';
let allInventory = [];

// Load inventory
async function loadInventory() {
  try {
    const response = await fetch(`${API_URL}/inventory`);
    allInventory = await response.json();
    displayInventory(allInventory);
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

function displayInventory(inventory) {
  const tbody = document.getElementById('inventoryBody');
  tbody.innerHTML = '';

  inventory.forEach(unit => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${unit.unit_id}</td>
      <td>${unit.donor_name}</td>
      <td>${unit.blood_type}${unit.rh_factor}</td>
      <td>${new Date(unit.collection_date).toLocaleDateString()}</td>
      <td>${new Date(unit.expiry_date).toLocaleDateString()}</td>
      <td><span class="badge badge-${unit.status.toLowerCase()}">${unit.status}</span></td>
      <td>
        ${unit.status === 'Available' ? 
          `<button class="btn btn-secondary" onclick="markAsUsed(${unit.unit_id})">Mark as Used</button>` : 
          '-'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter functionality
document.getElementById('statusFilter').addEventListener('change', (e) => {
  const status = e.target.value;
  if (status === 'All') {
    displayInventory(allInventory);
  } else {
    const filtered = allInventory.filter(unit => unit.status === status);
    displayInventory(filtered);
  }
});

// Mark as used
async function markAsUsed(unitId) {
  if (!confirm('Mark this unit as used?')) return;

  try {
    const response = await fetch(`${API_URL}/inventory/${unitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Used' })
    });

    if (response.ok) {
      alert('Unit marked as used successfully');
      loadInventory();
    } else {
      alert('Error updating unit status');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error updating unit status');
  }
}

// Load inventory on page load
loadInventory();
