const pool = require('../db/db');

// Add a new brand
exports.addBrand = async (req, res) => {
  const { en_brand_name, ar_brand_name, category_id } = req.body;
  if (!en_brand_name || !ar_brand_name || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO brands (en_brand_name, ar_brand_name, category_id) VALUES ($1, $2, $3) RETURNING *',
      [en_brand_name, ar_brand_name, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding brand:', err);
    res.status(500).json({ error: 'Error adding brand', details: err.message });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM brands WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    console.error('Error deleting brand:', err);
    res.status(500).json({ error: 'Error deleting brand', details: err.message });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { en_brand_name, ar_brand_name, category_id } = req.body;
  if (!en_brand_name || !ar_brand_name || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'UPDATE brands SET en_brand_name = $1, ar_brand_name = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [en_brand_name, ar_brand_name, category_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating brand:', err);
    res.status(500).json({ error: 'Error updating brand', details: err.message });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM brands ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching brands:', err);
    res.status(500).json({ error: 'Error fetching brands', details: err.message });
  }
};

// Get brand by ID
exports.getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching brand:', err);
    res.status(500).json({ error: 'Error fetching brand', details: err.message });
  }
};
