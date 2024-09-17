const pool = require('../db/db');

exports.getRecommendedProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.off_percentage_value AS discount,
        p.delivery_charges,
        p.id,
        p.image_url AS main_image_url,
        c.en_category_name AS en_category,
        c.ar_category_name AS ar_category,
        p.en_title,
        p.ar_title,
        p.price AS final_price,
        p.vat_included
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recommended products:', err);
    res.status(500).json({ error: 'Error fetching recommended products', details: err.message });
  }
};

exports.getSuperDeals = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.is_hot_deal AS hot_deal,
        p.delivery_charges,
        p.off_percentage_value AS discount,
        p.en_title,
        p.ar_title,
        p.actual_price,
        p.id,
        p.quantity,
        p.price AS total_price,
        p.sold,
        p.image_url AS main_image
      FROM products p
      WHERE p.is_deal = true AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching super deals:', err);
    res.status(500).json({ error: 'Error fetching super deals', details: err.message });
  }
};

exports.getWebProductDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const productQuery = `
      SELECT 
        p.en_title,
        p.ar_title,
        p.actual_price,
        p.price AS total_price,
        p.sold AS sold_items,
        p.off_percentage_value AS discount,
        p.en_description,
        p.ar_description,
        p.max_quantity_per_user,
        p.attributes
      FROM products p
      WHERE p.id = $1 AND p.is_active = true
    `;
    const productResult = await pool.query(productQuery, [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    
    // Generate quantity selector values
    const quantitySelectorValues = Array.from(
      { length: product.max_quantity_per_user },
      (_, i) => ({ quantity: i + 1, price: (i + 1) * product.total_price })
    );

    // Fetch attributes
    const attributes = JSON.parse(product.attributes);
    const attributeIds = attributes.map(attr => attr.attribute_id);
    
    const attributesQuery = `
      SELECT id, en_attribute_name, ar_attribute_name
      FROM attributes
      WHERE id = ANY($1::int[])
    `;
    const attributesResult = await pool.query(attributesQuery, [attributeIds]);

    const formattedAttributes = attributes.map(attr => {
      const attributeInfo = attributesResult.rows.find(a => a.id === attr.attribute_id);
      return {
        en_attribute_name: attributeInfo.en_attribute_name,
        ar_attribute_name: attributeInfo.ar_attribute_name,
        values: attr.values
      };
    });

    res.json({
      ...product,
      quantity_selector_values: quantitySelectorValues,
      attributes: formattedAttributes
    });
  } catch (err) {
    console.error('Error fetching web product data:', err);
    res.status(500).json({ error: 'Error fetching web product data', details: err.message });
  }
};

exports.createWebOrder = async (req, res) => {
  const { user_id, products, total_amount, shipping_address, payment_method } = req.body;

  if (!user_id || !products || !total_amount || !shipping_address || !payment_method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id
    `;
    const orderResult = await client.query(orderQuery, [user_id, total_amount, shipping_address, payment_method]);
    const orderId = orderResult.rows[0].id;

    for (const product of products) {
      const orderItemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(orderItemQuery, [orderId, product.id, product.quantity, product.price]);

      const updateProductQuery = `
        UPDATE products
        SET quantity = quantity - $1, sold = sold + $1
        WHERE id = $2
      `;
      await client.query(updateProductQuery, [product.quantity, product.id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', order_id: orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating web order:', err);
    res.status(500).json({ error: 'Error creating web order', details: err.message });
  } finally {
    client.release();
  }
};
