const pool = require('../db/db');

exports.getRecommendedProducts = async (req, res) => {
  const { query } = req.query;
  console.log('Query received:', query);

  try {
    let sqlQuery;
    let queryParams = [];

    if (query && query.trim() !== '') {
      sqlQuery = `
        SELECT DISTINCT ON (p.id)
          p.id,
          p.off_percentage_value AS discount,
          p.delivery_charges,
          p.image_url AS main_image_url,
          COALESCE(c.en_category_name, '') AS en_category,
          COALESCE(c.ar_category_name, '') AS ar_category,
          COALESCE(b.en_brand_name, '') AS en_brand,
          COALESCE(b.ar_brand_name, '') AS ar_brand,
          p.en_title,
          p.ar_title,
          p.price AS final_price,
          p.vat_included
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE 
          p.is_active = true AND (
          LOWER(p.en_title) LIKE LOWER($1) OR LOWER(p.ar_title) LIKE LOWER($1) OR
          LOWER(COALESCE(b.en_brand_name, '')) LIKE LOWER($1) OR LOWER(COALESCE(b.ar_brand_name, '')) LIKE LOWER($1) OR
          LOWER(COALESCE(c.en_category_name, '')) LIKE LOWER($1) OR LOWER(COALESCE(c.ar_category_name, '')) LIKE LOWER($1))
        ORDER BY p.id, 
          CASE
            WHEN LOWER(p.en_title) LIKE LOWER($1) OR LOWER(p.ar_title) LIKE LOWER($1) THEN 1
            WHEN LOWER(COALESCE(b.en_brand_name, '')) LIKE LOWER($1) OR LOWER(COALESCE(b.ar_brand_name, '')) LIKE LOWER($1) THEN 2
            WHEN LOWER(COALESCE(c.en_category_name, '')) LIKE LOWER($1) OR LOWER(COALESCE(c.ar_category_name, '')) LIKE LOWER($1) THEN 3
            ELSE 4
          END
        LIMIT 20
      `;
      queryParams = [`%${query}%`];
    } else {
      sqlQuery = `
        SELECT 
          p.id,
          p.off_percentage_value AS discount,
          p.delivery_charges,
          p.image_url AS main_image_url,
          COALESCE(c.en_category_name, '') AS en_category,
          COALESCE(c.ar_category_name, '') AS ar_category,
          COALESCE(b.en_brand_name, '') AS en_brand,
          COALESCE(b.ar_brand_name, '') AS ar_brand,
          p.en_title,
          p.ar_title,
          p.price AS final_price,
          p.vat_included
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT 20
      `;
    }

    console.log('Executing SQL query:', sqlQuery);
    console.log('Query parameters:', queryParams);

    const result = await pool.query(sqlQuery, queryParams);
    console.log('Query result:', result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err); 
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching products', 
      details: err.message,
      stack: err.stack
    });
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
        p.attributes,
        p.tabs_image_url,
         p.delivery_charges
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
    let formattedAttributes = [];
    if (product.attributes) {
      try {
        const attributes = JSON.parse(product.attributes);
        const attributeIds = attributes.map(attr => attr.attribute_id);

        // Fetch attribute names
        const attributeNamesQuery = `
          SELECT id, en_attribute_name, ar_attribute_name
          FROM attributes
          WHERE id = ANY($1::int[])
        `;
        const attributeNamesResult = await pool.query(attributeNamesQuery, [attributeIds]);

        // Create a map of attribute IDs to their names
        const attributeNamesMap = attributeNamesResult.rows.reduce((map, attr) => {
          map[attr.id] = { en_name: attr.en_attribute_name, ar_name: attr.ar_attribute_name };
          return map;
        }, {});

        formattedAttributes = attributes.map(attr => ({
          attribute_id: attr.attribute_id,
          en_attribute_name: attributeNamesMap[attr.attribute_id]?.en_name || '',
          ar_attribute_name: attributeNamesMap[attr.attribute_id]?.ar_name || '',
          values: attr.values
        }));
      } catch (parseError) {
        console.error('Error parsing attributes:', parseError);
      }
    }
    console.log(product,"tabs_image_url")
    const response = {
      ...product, 
      quantity_selector_values: quantitySelectorValues,
      attributes: formattedAttributes,
      tabs_image_url: product.tabs_image_url // Include tabs_image_url in the response
    };

    res.json(response);
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

exports.getUserOrders = async (req, res) => {
  const { web_user_id } = req.params;

  try {
    const query = `
      SELECT 
        o.id AS order_id,
        o.created_at AS order_date,
        o.delivery_address AS shipping_address,
        o.full_name,
        o.mobilenumber,
        o.quantity,
        p.id AS product_id,
        p.en_title,
        p.ar_title,
        p.image_url AS product_image,
        p.price AS product_price,
        COALESCE(p.delivery_charges, 0) AS delivery_charges
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.web_user_id = $1
      ORDER BY o.created_at DESC, o.id DESC
    `;

    const result = await pool.query(query, [web_user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    let subtotal = 0;
    let shippingFee = 0;
    const products = result.rows.map(row => {
      const productTotal = row.quantity * parseFloat(row.product_price);
      subtotal += productTotal;
      shippingFee += parseFloat(row.delivery_charges);
      return {
        main_image: row.product_image,
        en_title: row.en_title,
        ar_title: row.ar_title,
        quantity: row.quantity,
        total: productTotal.toFixed(2)
      };
    });

    const grandTotal = subtotal + shippingFee;

    const orderDetails = {
      shipping_address: result.rows[0].shipping_address,
      full_name: result.rows[0].full_name,
      mobilenumber: result.rows[0].mobilenumber,
      products: products,
      subtotal: subtotal.toFixed(2),
      shipping_fee: shippingFee.toFixed(2),
      grand_total: grandTotal.toFixed(2)
    };

    res.json(orderDetails);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Error fetching user orders', details: err.message });
  }
};