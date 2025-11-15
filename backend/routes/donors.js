const express = require('express');
const db = require('../config/database');

const router = express.Router();

// POST /api/donors - Register donor
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, blood_type, rh_factor, phone_number, email, age, address } = req.body;

    const [result] = await db.query(
      'INSERT INTO Donors (first_name, last_name, blood_type, rh_factor, phone_number, email, age, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, blood_type, rh_factor, phone_number, email, age, address]
    );

    res.status(201).json({
      message: 'Donor registered successfully',
      donor_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering donor', error: error.message });
  }
});

// GET /api/donors - Get all donors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Donors ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// GET /api/donors/:id - Get single donor
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Donors WHERE donor_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donor' });
  }
});

// PUT /api/donors/:id - Update donor
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, age, address } = req.body;

    await db.query(
      'UPDATE Donors SET first_name = ?, last_name = ?, phone_number = ?, email = ?, age = ?, address = ? WHERE donor_id = ?',
      [first_name, last_name, phone_number, email, age, address, req.params.id]
    );

    res.json({ message: 'Donor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating donor' });
  }
});

module.exports = router;
