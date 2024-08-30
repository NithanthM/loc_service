/*const express = require('express');
const router = express.Router();
// Sample route
router.get('/', (req, res) => {
  res.send('Location route works!');
});

module.exports = router;*/


const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the MariaDB connection

router.get('/', async (req, res, next) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM location_master');
    console.log(rows);
    res.json(rows);
  } catch (err) {
    next(err); // Handle the error with Express error middleware
  } finally {
    if (conn) conn.end(); // Close the connection
  }
});

// Route to update the location master table
/*
router.put('/update', async (req, res, next) => {
  const { location_id, city_id, location_name, latitude, longitude, updated_by, updated_at} = req.body; // Adjust these variables to match your table columns 
  if (!location_id || !location_name || !city_id || !latitude || !longitude|| !updated_by) {
    return res.status(400).send('Missing required fields. location_id, new_name, new_address');    
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE location_master SET  city_id = ?,  location_name = ?,  latitude = ?, longitude = ?,  updated_by = ?,  updated_time = ?  WHERE location_id = ?;',
      [city_id,location_name, latitude, longitude, updated_by, updated_at, location_id]
    );

    if (result.affectedRows > 0) {
      res.send('Location updated successfully.');
    } else {
      res.status(404).send('Location not found.');
    }
  } catch (err) {
    next(err); // Handle errors using Express middleware
  } finally {
    if (conn) conn.end(); // Close the connection
  }
});
*/

router.put('/update', async (req, res, next) => {
  const requiredFields = ['location_id', 'city_id', 'location_name', 'latitude', 'longitude', 'updated_by'];
  
  // Check for missing required fields
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`Missing required field: ${field}`);
    }
  }

  // Destructure location_id separately since it's used in the WHERE clause
  const { location_id } = req.body;

  // Build the SET clause dynamically
  const updates = [];
  const values = [];
  for (const key in req.body) {
    if (key !== 'location_id' && req.body.hasOwnProperty(key)) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  // Add location_id to the values array for the WHERE clause
  values.push(location_id);

  const query = `UPDATE location_master SET ${updates.join(', ')} WHERE location_id = ?`;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, values);

    if (result.affectedRows > 0) {
      res.send('Location updated successfully.');
    } else {
      res.status(404).send('Location not found.');
    }
  } catch (err) {
    next(err); // Handle errors using Express middleware
  } finally {
    if (conn) conn.end(); // Close the connection
  }
});  


module.exports = router;

/*const express = require('express');
const router = express.Router();
// Import your database connection or relevant model
const pool = require('../config/db'); // Assuming you use a MariaDB connection
// Define the PUT route for updating location
router.put('/update', async (req, res) => {
  const { location_id, new_name, new_address } = req.body;
  if (!location_id || !new_name || !new_address) {
    return res.status(400).json({ error: 'Missing required fields: location_id, new_name, new_address' });
  }
  try {
    // Establish connection to MariaDB
    const conn = await pool.getConnection();
    // Update the location in the database
    const query = `
      UPDATE location_master 
      SET name = ?, address = ? 
      WHERE id = ?
    `;
    const result = await conn.query(query, [new_name, new_address, location_id]);
    // Release the connection
    conn.release();
    if (result.affectedRows > 0) {
      res.json({ message: 'Location updated successfully' });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the location' });
  }
});
module.exports = router;
*/