const pool = require('../db/db');

exports.getStats = async (req, res) => {
  try {
    // Product stats
    const totalProductsResult = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(totalProductsResult.rows[0].count);

    const activeProductsResult = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const activeProducts = parseInt(activeProductsResult.rows[0].count);

    const inactiveProducts = totalProducts - activeProducts;

    const lowStockResult = await pool.query(`
      SELECT id, en_title, quantity
      FROM products
      WHERE quantity < 10 AND is_active = true
      ORDER BY quantity ASC
      LIMIT 5
    `);
    const lowStockProducts = lowStockResult.rows;

    // Category stats
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    const totalCategories = parseInt(categoriesResult.rows[0].count);

    const topCategoriesResult = await pool.query(`
      SELECT c.id, c.en_category_name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY product_count DESC
      LIMIT 5
    `);
    const topCategories = topCategoriesResult.rows;

    // Brand stats
    const brandsResult = await pool.query('SELECT COUNT(*) FROM brands');
    const totalBrands = parseInt(brandsResult.rows[0].count);

    const topBrandsResult = await pool.query(`
      SELECT b.id, b.en_brand_name, COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY product_count DESC
      LIMIT 5
    `);
    const topBrands = topBrandsResult.rows;

    // Attribute stats
    const attributesResult = await pool.query('SELECT COUNT(*) FROM attributes');
    const totalAttributes = parseInt(attributesResult.rows[0].count);

    const topAttributesResult = await pool.query(`
      SELECT a.id, a.en_attribute_name, COUNT(p.id) as usage_count
      FROM attributes a
      LEFT JOIN products p ON p.attributes ? a.en_attribute_name
      GROUP BY a.id
      ORDER BY usage_count DESC
      LIMIT 5
    `);
    const topAttributes = topAttributesResult.rows;

    res.json({
      products: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        lowStockProducts
      },
      categories: {
        totalCategories,
        topCategories
      },
      brands: {
        totalBrands,
        topBrands
      },
      attributes: {
        totalAttributes,
        topAttributes
      }
    });
  } catch (err) {
    console.error('Error fetching manager dashboard stats:', err);
    res.status(500).json({ error: 'Error fetching manager dashboard stats', details: err.message });
  }
};
