const pool = require('../db/pool');

function ok(res, message, data = null) {
  return res.status(200).json({ status: 0, message, data });
}

async function getBanners(_req, res, next) {
  try {
    const result = await pool.query(
      'SELECT banner_name, banner_image, description FROM banners ORDER BY id ASC'
    );
    return ok(res, 'Sukses', result.rows);
  } catch (err) {
    next(err);
  }
}

async function getServices(_req, res, next) {
  try {
    const result = await pool.query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC'
    );

    // cast tariff to number
    const data = result.rows.map((s) => ({
      ...s,
      service_tariff: Number(s.service_tariff),
    }));

    return ok(res, 'Sukses', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBanners, getServices };
