const pool = require('../db/db');

exports.createOrder = async (req, res) => {
  const {
    web_user_id,
    full_name,
    mobilenumber,
    quantity,
    selected_emirates,
    delivery_address,
    product_id,
    selected_attributes
  } = req.body;

  if (!web_user_id || !full_name || !mobilenumber || !quantity || !selected_emirates || !delivery_address || !product_id || !selected_attributes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (
        web_user_id, full_name, mobilenumber, quantity, selected_emirates,
        delivery_address, product_id, selected_attributes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [web_user_id, full_name, mobilenumber, quantity, selected_emirates, delivery_address, product_id, selected_attributes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error creating order', details: err.message });
  }
};

exports.getPendingOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_type = $1 ORDER BY created_at DESC', ['pending']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending orders:', err);
    res.status(500).json({ error: 'Error fetching pending orders', details: err.message });
  }
};

exports.confirmOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE orders SET order_type = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['confirmed', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error confirming order:', err);
    res.status(500).json({ error: 'Error confirming order', details: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE orders SET order_type = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['cancelled', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: 'Error cancelling order', details: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ error: 'Error fetching order details', details: err.message });
  }
};

exports.getConfirmedOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_type = $1 ORDER BY updated_at DESC', ['confirmed']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching confirmed orders:', err);
    res.status(500).json({ error: 'Error fetching confirmed orders', details: err.message });
  }
};

exports.getDeliveredOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_type = $1 ORDER BY updated_at DESC', ['delivered']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching delivered orders:', err);
    res.status(500).json({ error: 'Error fetching delivered orders', details: err.message });
  }
};

exports.getCancelledOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_type = $1 ORDER BY updated_at DESC', ['cancelled']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cancelled orders:', err);
    res.status(500).json({ error: 'Error fetching cancelled orders', details: err.message });
  }
};
