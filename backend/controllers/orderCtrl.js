const db = require('../../config/db.config');

// GET all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single order with its items
exports.getOrderById = async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (order.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [items] = await db.query(
      'SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [req.params.id]
    );
    res.json({ ...order[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create order
exports.createOrder = async (req, res) => {
  const { user_id, items, address, notes } = req.body;
  try {
    let total = 0;
    for (const item of items) {
      const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      total += product[0].price * item.quantity;
    }

    const [order] = await db.query(
      'INSERT INTO orders (user_id, total_price, address, notes) VALUES (?, ?, ?, ?)',
      [user_id, total, address, notes]
    );

    for (const item of items) {
      const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [order.insertId, item.product_id, item.quantity, product[0].price]
      );
    }

    res.status(201).json({ id: order.insertId, message: 'Order created', total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update order status
exports.updateOrder = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};