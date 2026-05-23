const pool = require('../db/pool');

function ok(res, message, data = null) {
  return res.status(200).json({ status: 0, message, data });
}

function badRequest(res, message) {
  return res.status(400).json({ status: 102, message, data: null });
}

function generateInvoice() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `INV${date}-${rand}`;
}

// ── GET /balance ────────────────────────────────────────────────────────────

async function getBalance(req, res, next) {
  try {
    const result = await pool.query('SELECT balance FROM users WHERE email = $1', [req.user.email]);
    return ok(res, 'Get Balance Berhasil', { balance: Number(result.rows[0].balance) });
  } catch (err) {
    next(err);
  }
}

// ── POST /topup ─────────────────────────────────────────────────────────────

async function topUp(req, res, next) {
  const client = await pool.connect();
  try {
    const { top_up_amount } = req.body;

    if (top_up_amount === undefined || top_up_amount === null || isNaN(top_up_amount) || Number(top_up_amount) <= 0) {
      return badRequest(res, 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
    }

    const amount = Number(top_up_amount);

    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT id, balance FROM users WHERE email = $1 FOR UPDATE',
      [req.user.email]
    );
    const user = userResult.rows[0];

    const newBalance = Number(user.balance) + amount;

    await client.query(
      'UPDATE users SET balance = $1, updated_at = NOW() WHERE id = $2',
      [newBalance, user.id]
    );

    await client.query(
      `INSERT INTO transactions (invoice_number, user_id, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top Up balance', $3)`,
      [generateInvoice(), user.id, amount]
    );

    await client.query('COMMIT');

    return ok(res, 'Top Up Balance berhasil', { balance: newBalance });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

// ── POST /transaction ────────────────────────────────────────────────────────

async function createTransaction(req, res, next) {
  const client = await pool.connect();
  try {
    const { service_code } = req.body;

    if (!service_code) {
      return badRequest(res, 'Service atau Layanan tidak ditemukan');
    }

    const serviceResult = await client.query(
      'SELECT id, service_code, service_name, service_tariff FROM services WHERE service_code = $1',
      [service_code]
    );

    if (serviceResult.rows.length === 0) {
      return badRequest(res, 'Service ataus Layanan tidak ditemukan');
    }

    const service = serviceResult.rows[0];
    const tariff = Number(service.service_tariff);

    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT id, balance FROM users WHERE email = $1 FOR UPDATE',
      [req.user.email]
    );
    const user = userResult.rows[0];
    const balance = Number(user.balance);

    if (balance < tariff) {
      await client.query('ROLLBACK');
      return badRequest(res, 'Saldo tidak mencukupi');
    }

    const newBalance = balance - tariff;
    const invoice = generateInvoice();
    const now = new Date();

    await client.query(
      'UPDATE users SET balance = $1, updated_at = NOW() WHERE id = $2',
      [newBalance, user.id]
    );

    await client.query(
      `INSERT INTO transactions (invoice_number, user_id, service_id, transaction_type, description, total_amount, created_on)
       VALUES ($1, $2, $3, 'PAYMENT', $4, $5, $6)`,
      [invoice, user.id, service.id, service.service_name, tariff, now]
    );

    await client.query('COMMIT');

    return ok(res, 'Transaksi berhasil', {
      invoice_number: invoice,
      service_code: service.service_code,
      service_name: service.service_name,
      transaction_type: 'PAYMENT',
      total_amount: tariff,
      created_on: now.toISOString(),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

// ── GET /transaction/history ─────────────────────────────────────────────────

async function getHistory(req, res, next) {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : null;

    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [req.user.email]);
    const userId = userResult.rows[0].id;

    let query = `
      SELECT t.invoice_number, t.transaction_type, t.description, t.total_amount, t.created_on
      FROM transactions t
      WHERE t.user_id = $1
      ORDER BY t.created_on DESC
      OFFSET $2
    `;
    const params = [userId, offset];

    if (limit !== null) {
      query += ' LIMIT $3';
      params.push(limit);
    }

    const result = await pool.query(query, params);

    const records = result.rows.map((r) => ({
      invoice_number: r.invoice_number,
      transaction_type: r.transaction_type,
      description: r.description,
      total_amount: Number(r.total_amount),
      created_on: r.created_on,
    }));

    return ok(res, 'Get History Berhasil', {
      offset,
      limit: limit ?? records.length,
      records,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBalance, topUp, createTransaction, getHistory };
