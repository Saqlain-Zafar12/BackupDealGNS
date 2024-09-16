const pool = require('../db/db');

// Add a new attribute
exports.addAttribute = async (req, res) => {
  const { en_attribute_name, ar_attribute_name } = req.body;

  if (!en_attribute_name || !ar_attribute_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO attributes (en_attribute_name, ar_attribute_name) VALUES ($1, $2) RETURNING *',
      [en_attribute_name, ar_attribute_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding attribute:', err);
    res.status(500).json({ error: 'Error adding attribute', details: err.message });
  }
};

// Delete an attribute
exports.deleteAttribute = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing attribute ID' });
  }

  try {
    const result = await pool.query('DELETE FROM attributes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    res.json({ message: 'Attribute deleted successfully' });
  } catch (err) {
    console.error('Error deleting attribute:', err);
    res.status(500).json({ error: 'Error deleting attribute', details: err.message });
  }
};

// Update an attribute
exports.updateAttribute = async (req, res) => {
  const { id } = req.params;
  const { en_attribute_name, ar_attribute_name } = req.body;

  if (!id || !en_attribute_name || !ar_attribute_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'UPDATE attributes SET en_attribute_name = $1, ar_attribute_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [en_attribute_name, ar_attribute_name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating attribute:', err);
    res.status(500).json({ error: 'Error updating attribute', details: err.message });
  }
};

// Get all attributes
exports.getAllAttributes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attributes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching attributes:', err);
    res.status(500).json({ error: 'Error fetching attributes', details: err.message });
  }
};

// Get attribute by ID
exports.getAttributeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing attribute ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM attributes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching attribute:', err);
    res.status(500).json({ error: 'Error fetching attribute', details: err.message });
  }
};