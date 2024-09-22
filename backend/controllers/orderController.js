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
    selected_attributes,
    deliveryTypeName // This might be undefined or null
  } = req.body;

  if (!web_user_id || !full_name || !mobilenumber || !quantity || !selected_emirates || !delivery_address || !product_id || !selected_attributes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if 'pending' delivery type exists, if not, create it
    const deliveryTypeCheck = await client.query('SELECT * FROM delivery_types WHERE name = $1', ['pending']);
    if (deliveryTypeCheck.rows.length === 0) {
      await client.query('INSERT INTO delivery_types (name) VALUES ($1)', ['pending']);
    }

    const result = await client.query(
      `INSERT INTO orders (
        web_user_id, full_name, mobilenumber, quantity, selected_emirates,
        delivery_address, product_id, selected_attributes, delivery_type_name, order_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        web_user_id, 
        full_name, 
        mobilenumber, 
        quantity, 
        selected_emirates, 
        delivery_address, 
        product_id, 
        selected_attributes, 
        'pending', // Use 'pending' as default for delivery_type_name
        'pending'  // Use 'pending' as default for order_type
      ]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error creating order', details: err.message });
  } finally {
    client.release();
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

exports.deliverOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE orders SET order_type = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['delivered', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error delivering order:', err);
    res.status(500).json({ error: 'Error delivering order', details: err.message });
  }
};

// New function to assign delivery type
exports.assignDeliveryType = async (req, res) => {
  const { id } = req.params;
  const { deliveryTypeName } = req.body;

  if (!deliveryTypeName) {
    return res.status(400).json({ error: 'Delivery type name is required' });
  }

  try {
    // First, check if the delivery type exists
    const deliveryTypeCheck = await pool.query('SELECT * FROM delivery_types WHERE name = $1', [deliveryTypeName]);
    
    if (deliveryTypeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery type not found' });
    }

    // If delivery type exists, update the order
    const result = await pool.query(
      'UPDATE orders SET delivery_type_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [deliveryTypeName, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error assigning delivery type:', err);
    res.status(500).json({ error: 'Error assigning delivery type', details: err.message });
  }
};
