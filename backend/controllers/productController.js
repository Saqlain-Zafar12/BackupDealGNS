const pool = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const generateUniqueSKU = async () => {
  let sku;
  let isUnique = false;
  while (!isUnique) {
    sku = uuidv4().substring(0, 8).toUpperCase();
    const result = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    if (result.rows.length === 0) {
      isUnique = true;
    }
  }
  return sku;
};

exports.addProduct = async (req, res) => {
  const {
    category_id, brand_id, actual_price, off_percentage_value, price,
    en_title, ar_title, en_description, ar_description, en_attributes,
    ar_attributes, delivery_charges, quantity, image_url, tabs_image_url,
    is_deal, is_hot_deal, vat_included
  } = req.body;

  if (!category_id || !brand_id || !actual_price || !price || !en_title || !ar_title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sku = await generateUniqueSKU();
    const result = await pool.query(
      `INSERT INTO products (
        category_id, brand_id, sku, actual_price, off_percentage_value, price,
        en_title, ar_title, en_description, ar_description, en_attributes,
        ar_attributes, delivery_charges, quantity, image_url, tabs_image_url,
        is_deal, is_hot_deal, vat_included
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
      [category_id, brand_id, sku, actual_price, off_percentage_value, price,
       en_title, ar_title, en_description, ar_description, JSON.stringify(en_attributes),
       JSON.stringify(ar_attributes), delivery_charges, quantity, image_url, JSON.stringify(tabs_image_url),
       is_deal, is_hot_deal, vat_included]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Error adding product', details: err.message });
  }
};

exports.getAllActiveProducts = async (req, res) => {
  const { lang } = req.query;
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_active = true');
    const products = result.rows.map(product => ({
      ...product,
      title: lang === 'ar' ? product.ar_title : product.en_title,
      description: lang === 'ar' ? product.ar_description : product.en_description,
      attributes: lang === 'ar' ? product.ar_attributes : product.en_attributes
    }));
    res.json(products);
  } catch (err) {
    console.error('Error fetching active products:', err);
    res.status(500).json({ error: 'Error fetching active products', details: err.message });
  }
};

exports.getAllDeactivatedProducts = async (req, res) => {
  const { lang } = req.query;
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_active = false');
    const products = result.rows.map(product => ({
      ...product,
      title: lang === 'ar' ? product.ar_title : product.en_title,
      description: lang === 'ar' ? product.ar_description : product.en_description,
      attributes: lang === 'ar' ? product.ar_attributes : product.en_attributes
    }));
    res.json(products);
  } catch (err) {
    console.error('Error fetching deactivated products:', err);
    res.status(500).json({ error: 'Error fetching deactivated products', details: err.message });
  }
};

exports.deactivateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deactivated successfully' });
  } catch (err) {
    console.error('Error deactivating product:', err);
    res.status(500).json({ error: 'Error deactivating product', details: err.message });
  }
};

exports.activateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE products SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product activated successfully' });
  } catch (err) {
    console.error('Error activating product:', err);
    res.status(500).json({ error: 'Error activating product', details: err.message });
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const {
    category_id, brand_id, actual_price, off_percentage_value, price,
    en_title, ar_title, en_description, ar_description, en_attributes,
    ar_attributes, delivery_charges, quantity, image_url, tabs_image_url,
    is_deal, is_hot_deal, vat_included
  } = req.body;

  if (!category_id || !brand_id || !actual_price || !price || !en_title || !ar_title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `UPDATE products SET
        category_id = $1, brand_id = $2, actual_price = $3, off_percentage_value = $4,
        price = $5, en_title = $6, ar_title = $7, en_description = $8, ar_description = $9,
        en_attributes = $10, ar_attributes = $11, delivery_charges = $12, quantity = $13,
        image_url = $14, tabs_image_url = $15, is_deal = $16, is_hot_deal = $17,
        vat_included = $18, updated_at = CURRENT_TIMESTAMP
      WHERE id = $19 RETURNING *`,
      [category_id, brand_id, actual_price, off_percentage_value, price,
       en_title, ar_title, en_description, ar_description, JSON.stringify(en_attributes),
       JSON.stringify(ar_attributes), delivery_charges, quantity, image_url, JSON.stringify(tabs_image_url),
       is_deal, is_hot_deal, vat_included, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Error updating product', details: err.message });
  }
};

exports.getProductDetails = async (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = result.rows[0];
    const response = {
      ...product,
      title: lang === 'ar' ? product.ar_title : product.en_title,
      description: lang === 'ar' ? product.ar_description : product.en_description,
      attributes: lang === 'ar' ? product.ar_attributes : product.en_attributes
    };
    res.json(response);
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ error: 'Error fetching product details', details: err.message });
  }
};