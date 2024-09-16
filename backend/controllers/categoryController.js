const pool = require('../db/db');

// Add a new category
exports.addCategory = async (req, res) => {
  const { en_category_name, ar_category_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (en_category_name, ar_category_name) VALUES ($1, $2) RETURNING *',
      [en_category_name, ar_category_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { en_category_name, ar_category_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET en_category_name = $1, ar_category_name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [en_category_name, ar_category_name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};
