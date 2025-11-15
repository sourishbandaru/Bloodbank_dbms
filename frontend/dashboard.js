const API_URL = 'http://localhost:3000/api';

// Load inventory and calculate stats
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/inventory`);
    const inventory = await response.json();

    // Calculate stats by blood type
    const stats = {};
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    bloodTypes.forEach(type => {
      const [blood, rh] = type.split('');
      const rhSymbol = rh;
      stats[type] = inventory.filter(
        item => item.blood_type === blood && item.rh_factor === rhSymbol && item.status === 'Available'
      ).length;
    });

    displayBloodTypeStats(stats);
    displayRecentActivity(inventory.slice(0, 5));
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function displayBloodTypeStats(stats) {
  const container = document.getElementById('bloodTypeStats');
  container.innerHTML = '';

  for (const [type, count] of Object.entries(stats)) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <h3>${count}</h3>
      <p>${type}</p>
    `;
    container.appendChild(card);
  }
}

function displayRecentActivity(units) {
  const tbody = document.getElementById('recentActivityBody');
  tbody.innerHTML = '';

  units.forEach(unit => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${unit.unit_id}</td>
      <td>${unit.donor_name}</td>
      <td>${unit.blood_type}${unit.rh_factor}</td>
      <td>${new Date(unit.collection_date).toLocaleDateString()}</td>
      <td>${new Date(unit.expiry_date).toLocaleDateString()}</td>
      <td><span class="badge badge-${unit.status.toLowerCase()}">${unit.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Load dashboard on page load
loadDashboard();
