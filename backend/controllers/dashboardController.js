const pool = require('../db/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total number of products
    const productsResult = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get total number of categories
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    const totalCategories = parseInt(categoriesResult.rows[0].count);

    // Get total number of brands
    const brandsResult = await pool.query('SELECT COUNT(*) FROM brands');
    const totalBrands = parseInt(brandsResult.rows[0].count);

    // Get total number of orders
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get orders by status
    const orderStatusResult = await pool.query(`
      SELECT order_type, COUNT(*) 
      FROM orders 
      GROUP BY order_type
    `);
    const ordersByStatus = orderStatusResult.rows.reduce((acc, row) => {
      acc[row.order_type] = parseInt(row.count);
      return acc;
    }, {});

    // Get top 5 selling products
    const topProductsResult = await pool.query(`
      SELECT p.id, p.en_title, COUNT(o.id) as order_count
      FROM products p
      JOIN orders o ON p.id = o.product_id
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 5
    `);
    const topSellingProducts = topProductsResult.rows;

    res.json({
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrders,
      ordersByStatus,
      topSellingProducts
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Error fetching dashboard stats', details: err.message });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    // Get daily revenue for the last 30 days
    const dailyRevenueResult = await pool.query(`
      SELECT DATE(orders.created_at) as date, SUM(orders.quantity * products.price) as revenue
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(orders.created_at)
      ORDER BY date
    `);
    const dailyRevenue = dailyRevenueResult.rows;

    res.json({
      dailyRevenue
    });
  } catch (err) {
    console.error('Error fetching revenue stats:', err);
    res.status(500).json({ error: 'Error fetching revenue stats', details: err.message });
  }
};

exports.getProductStats = async (req, res) => {
  try {
    // Get products with low stock (less than 10)
    const lowStockResult = await pool.query(`
      SELECT id, en_title, quantity
      FROM products
      WHERE quantity < 10 AND is_active = true
      ORDER BY quantity ASC
    `);
    const lowStockProducts = lowStockResult.rows;

    res.json({
      lowStockProducts
    });
  } catch (err) {
    console.error('Error fetching product stats:', err);
    res.status(500).json({ error: 'Error fetching product stats', details: err.message });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', orders.created_at) AS month,
        SUM(orders.quantity * products.price) AS revenue
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', orders.created_at)
      ORDER BY month
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching monthly revenue:', err);
    res.status(500).json({ error: 'Error fetching monthly revenue', details: err.message });
  }
};

exports.getMonthlySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) AS month,
        SUM(quantity) AS sales
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching monthly sales:', err);
    res.status(500).json({ error: 'Error fetching monthly sales', details: err.message });
  }
};

exports.getWeeklyRevenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('week', orders.created_at) AS week,
        SUM(orders.quantity * products.price) AS revenue
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', orders.created_at)
      ORDER BY week
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching weekly revenue:', err);
    res.status(500).json({ error: 'Error fetching weekly revenue', details: err.message });
  }
};

exports.getWeeklySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('week', created_at) AS week,
        SUM(quantity) AS sales
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching weekly sales:', err);
    res.status(500).json({ error: 'Error fetching weekly sales', details: err.message });
  }
};
