const API_URL = 'http://localhost:3000/api';
let allDonors = [];

// Load donors
async function loadDonors() {
  try {
    const response = await fetch(`${API_URL}/donors`);
    allDonors = await response.json();
    displayDonors(allDonors);
  } catch (error) {
    console.error('Error loading donors:', error);
  }
}

function displayDonors(donors) {
  const tbody = document.getElementById('donorsBody');
  tbody.innerHTML = '';

  donors.forEach(donor => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${donor.donor_id}</td>
      <td>${donor.first_name} ${donor.last_name}</td>
      <td>${donor.age || 'N/A'}</td>
      <td>${donor.blood_type}${donor.rh_factor}</td>
      <td>${donor.phone_number}</td>
      <td>${donor.email}</td>
      <td>${donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'Never'}</td>
      <td>
        <button class="btn btn-success" onclick="openDonationModal(${donor.donor_id}, '${donor.first_name} ${donor.last_name}', '${donor.blood_type}', '${donor.rh_factor}')">Log Donation</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Register donor form
document.getElementById('donorForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const donorData = {
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value,
    age: document.getElementById('age').value,
    blood_type: document.getElementById('bloodType').value,
    rh_factor: document.getElementById('rhFactor').value,
    phone_number: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value
  };

  try {
    const response = await fetch(`${API_URL}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData)
    });

    if (response.ok) {
      alert('Donor registered successfully');
      e.target.reset();
      loadDonors();
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error registering donor');
  }
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = allDonors.filter(donor => 
    `${donor.first_name} ${donor.last_name}`.toLowerCase().includes(searchTerm) ||
    donor.email.toLowerCase().includes(searchTerm) ||
    donor.phone_number.includes(searchTerm)
  );
  displayDonors(filtered);
});

// Modal functionality
const modal = document.getElementById('donationModal');
const span = document.getElementsByClassName('close')[0];

function openDonationModal(donorId, donorName, bloodType, rhFactor) {
  document.getElementById('modalDonorId').value = donorId;
  document.getElementById('donorNameDisplay').value = donorName;
  document.getElementById('collectionDate').value = new Date().toISOString().split('T')[0];
  modal.style.display = 'block';
  
  // Store blood type info for form submission
  modal.dataset.bloodType = bloodType;
  modal.dataset.rhFactor = rhFactor;
}

span.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = 'none';
};

// Submit donation
document.getElementById('donationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const donationData = {
    donor_id: document.getElementById('modalDonorId').value,
    blood_type: modal.dataset.bloodType,
    rh_factor: modal.dataset.rhFactor,
    collection_date: document.getElementById('collectionDate').value
  };

  try {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });

    if (response.ok) {
      alert('Donation logged successfully');
      modal.style.display = 'none';
      loadDonors();
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error logging donation');
  }
});

// Load donors on page load
loadDonors();
