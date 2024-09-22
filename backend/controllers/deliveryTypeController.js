const pool = require('../db/db');

// Create a new delivery type
exports.createDeliveryType = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO delivery_types (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating delivery type:', error);
    res.status(500).json({ message: 'Error creating delivery type' });
  }
};

// Get all delivery types
exports.getAllDeliveryTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM delivery_types ORDER BY name');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching delivery types:', error);
    res.status(500).json({ message: 'Error fetching delivery types' });
  }
};

// Get a single delivery type by ID
exports.getDeliveryTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM delivery_types WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery type not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching delivery type:', error);
    res.status(500).json({ message: 'Error fetching delivery type' });
  }
};

// Update a delivery type
exports.updateDeliveryType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE delivery_types SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery type not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating delivery type:', error);
    res.status(500).json({ message: 'Error updating delivery type' });
  }
};

// Delete a delivery type
exports.deleteDeliveryType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM delivery_types WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery type not found' });
    }
    res.status(200).json({ message: 'Delivery type deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery type:', error);
    res.status(500).json({ message: 'Error deleting delivery type' });
  }
};
