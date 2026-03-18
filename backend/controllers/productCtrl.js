const db = require('../config/db.config');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create product
exports.createProduct = async (req, res) => {
  const { category_id, name, description, price, stock_qty, image_url } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (category_id, name, description, price, stock_qty, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, stock_qty, image_url]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update product
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock_qty, image_url } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, stock_qty=?, image_url=? WHERE id=?',
      [name, description, price, stock_qty, image_url, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};