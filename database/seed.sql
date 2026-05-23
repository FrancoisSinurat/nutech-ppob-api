-- ============================================================
-- SEED DATA - Banners & Services
-- ============================================================

INSERT INTO banners (banner_name, banner_image, description) VALUES
  ('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
  ('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
  ('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
  ('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
  ('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
  ('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet')
ON CONFLICT DO NOTHING;

INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
  ('PAJAK',          'Pajak PBB',           'https://nutech-integrasi.app/dummy.jpg',  40000),
  ('PLN',            'Listrik',             'https://nutech-integrasi.app/dummy.jpg',  10000),
  ('PDAM',           'PDAM Berlangganan',   'https://nutech-integrasi.app/dummy.jpg',  40000),
  ('PULSA',          'Pulsa',               'https://nutech-integrasi.app/dummy.jpg',  40000),
  ('PGN',            'PGN Berlangganan',    'https://nutech-integrasi.app/dummy.jpg',  50000),
  ('MUSIK',          'Musik Berlangganan',  'https://nutech-integrasi.app/dummy.jpg',  50000),
  ('TV',             'TV Berlangganan',     'https://nutech-integrasi.app/dummy.jpg',  50000),
  ('PAKET_DATA',     'Paket data',          'https://nutech-integrasi.app/dummy.jpg',  50000),
  ('VOUCHER_GAME',   'Voucher Game',        'https://nutech-integrasi.app/dummy.jpg', 100000),
  ('VOUCHER_MAKANAN','Voucher Makanan',     'https://nutech-integrasi.app/dummy.jpg', 100000),
  ('QURBAN',         'Qurban',             'https://nutech-integrasi.app/dummy.jpg', 200000),
  ('ZAKAT',          'Zakat',              'https://nutech-integrasi.app/dummy.jpg', 300000)
ON CONFLICT (service_code) DO NOTHING;
