const express = require('express');
const db = require('../config/database');

const router = express.Router();

// POST /api/inventory - Add blood unit
router.post('/', async (req, res) => {
  try {
    const { donor_id, blood_type, rh_factor, collection_date } = req.body;

    // Calculate expiry date (collection_date + 42 days)
    const collectionDate = new Date(collection_date);
    const expiryDate = new Date(collectionDate);
    expiryDate.setDate(expiryDate.getDate() + 42);

    const [result] = await db.query(
      'INSERT INTO BloodInventory (donor_id, blood_type, rh_factor, collection_date, expiry_date) VALUES (?, ?, ?, ?, ?)',
      [donor_id, blood_type, rh_factor, collection_date, expiryDate.toISOString().split('T')[0]]
    );

    // Update donor's last_donation_date
    await db.query(
      'UPDATE Donors SET last_donation_date = ? WHERE donor_id = ?',
      [collection_date, donor_id]
    );

    res.status(201).json({
      message: 'Blood unit added successfully',
      unit_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding blood unit', error: error.message });
  }
});

// GET /api/inventory - Get all units with donor names
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        bi.*,
        CONCAT(d.first_name, ' ', d.last_name) as donor_name,
        d.phone_number as donor_phone
      FROM BloodInventory bi
      JOIN Donors d ON bi.donor_id = d.donor_id
      ORDER BY bi.collection_date DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

// GET /api/inventory/search - Search by blood type and rh factor
router.get('/search', async (req, res) => {
  try {
    const { blood_type, rh_factor } = req.query;

    const [rows] = await db.query(
      `SELECT 
        bi.*,
        CONCAT(d.first_name, ' ', d.last_name) as donor_name
      FROM BloodInventory bi
      JOIN Donors d ON bi.donor_id = d.donor_id
      WHERE bi.blood_type = ? AND bi.rh_factor = ? AND bi.status = 'Available'
      ORDER BY bi.collection_date ASC`,
      [blood_type, rh_factor]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching inventory' });
  }
});

// PUT /api/inventory/:unit_id - Update unit status
router.put('/:unit_id', async (req, res) => {
  try {
    const { status } = req.body;

    await db.query(
      'UPDATE BloodInventory SET status = ? WHERE unit_id = ?',
      [status, req.params.unit_id]
    );

    res.json({ message: 'Unit status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating unit status' });
  }
});

module.exports = router;
