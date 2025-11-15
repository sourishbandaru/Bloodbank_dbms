const express = require('express');
const db = require('../config/database');

const router = express.Router();

// POST /api/requests - Create blood request
router.post('/', async (req, res) => {
  try {
    const { patient_name, hospital_name, blood_type, rh_factor, quantity_required, patient_age, contact_number } = req.body;

    const [result] = await db.query(
      'INSERT INTO Recipients (patient_name, hospital_name, blood_type, rh_factor, quantity_required, patient_age, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patient_name, hospital_name, blood_type, rh_factor, quantity_required, patient_age, contact_number]
    );

    res.status(201).json({
      message: 'Blood request created successfully',
      request_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// GET /api/requests - Get all requests
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Recipients ORDER BY request_date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// PUT /api/requests/:request_id - Update request status
router.put('/:request_id', async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.request_id;

    if (status === 'Fulfilled') {
      // Get request details
      const [requests] = await db.query(
        'SELECT * FROM Recipients WHERE request_id = ?',
        [requestId]
      );

      if (requests.length === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }

      const request = requests[0];

      // Find available units
      const [availableUnits] = await db.query(
        `SELECT unit_id FROM BloodInventory 
         WHERE blood_type = ? AND rh_factor = ? AND status = 'Available' 
         ORDER BY collection_date ASC 
         LIMIT ?`,
        [request.blood_type, request.rh_factor, request.quantity_required]
      );

      if (availableUnits.length < request.quantity_required) {
        return res.status(400).json({
          message: 'Insufficient blood units available',
          available: availableUnits.length,
          required: request.quantity_required
        });
      }

      // Mark units as Used
      const unitIds = availableUnits.map(unit => unit.unit_id);
      await db.query(
        `UPDATE BloodInventory SET status = 'Used' WHERE unit_id IN (?)`,
        [unitIds]
      );
    }

    // Update request status
    await db.query(
      'UPDATE Recipients SET status = ? WHERE request_id = ?',
      [status, requestId]
    );

    res.json({ message: 'Request status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating request status' });
  }
});

module.exports = router;
