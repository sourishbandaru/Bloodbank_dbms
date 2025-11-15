const API_URL = 'http://localhost:3000/api';

// Load requests
async function loadRequests() {
  try {
    const response = await fetch(`${API_URL}/requests`);
    const requests = await response.json();
    displayRequests(requests);
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

function displayRequests(requests) {
  const tbody = document.getElementById('requestsBody');
  tbody.innerHTML = '';

  requests.forEach(request => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${request.request_id}</td>
      <td>${request.patient_name}</td>
      <td>${request.patient_age || 'N/A'}</td>
      <td>${request.hospital_name}</td>
      <td>${request.contact_number || 'N/A'}</td>
      <td>${request.blood_type}${request.rh_factor}</td>
      <td>${request.quantity_required}</td>
      <td><span class="badge badge-${request.status.toLowerCase()}">${request.status}</span></td>
      <td>${new Date(request.request_date).toLocaleDateString()}</td>
      <td>
        ${request.status === 'Pending' ? 
          `<button class="btn btn-success" onclick="fulfillRequest(${request.request_id})">Fulfill</button>
           <button class="btn btn-danger" onclick="cancelRequest(${request.request_id})">Cancel</button>` : 
          '-'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Create request form
document.getElementById('requestForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const requestData = {
    patient_name: document.getElementById('patientName').value,
    patient_age: document.getElementById('patientAge').value,
    hospital_name: document.getElementById('hospitalName').value,
    contact_number: document.getElementById('contactNumber').value,
    blood_type: document.getElementById('reqBloodType').value,
    rh_factor: document.getElementById('reqRhFactor').value,
    quantity_required: document.getElementById('quantity').value
  };

  try {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      alert('Blood request created successfully');
      e.target.reset();
      loadRequests();
    } else {
      const error = await response.json();
      alert('Error: ' + error.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating request');
  }
});

// Fulfill request
async function fulfillRequest(requestId) {
  if (!confirm('Fulfill this blood request? This will mark available units as used.')) return;

  try {
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Fulfilled' })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Request fulfilled successfully');
      loadRequests();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error fulfilling request');
  }
}

// Cancel request
async function cancelRequest(requestId) {
  if (!confirm('Cancel this blood request?')) return;

  try {
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' })
    });

    if (response.ok) {
      alert('Request cancelled successfully');
      loadRequests();
    } else {
      alert('Error cancelling request');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error cancelling request');
  }
}

// Load requests on page load
loadRequests();
