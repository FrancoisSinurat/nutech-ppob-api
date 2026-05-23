-- ============================================================
-- DDL - SIMS PPOB API
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500),
  balance     NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id           SERIAL PRIMARY KEY,
  banner_name  VARCHAR(100) NOT NULL,
  banner_image VARCHAR(500) NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id             SERIAL PRIMARY KEY,
  service_code   VARCHAR(50) NOT NULL UNIQUE,
  service_name   VARCHAR(100) NOT NULL,
  service_icon   VARCHAR(500) NOT NULL,
  service_tariff NUMERIC(15, 2) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id               SERIAL PRIMARY KEY,
  invoice_number   VARCHAR(50) NOT NULL UNIQUE,
  user_id          INT NOT NULL REFERENCES users(id),
  service_id       INT REFERENCES services(id),
  transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
  description      VARCHAR(255),
  total_amount     NUMERIC(15, 2) NOT NULL,
  created_on       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_on ON transactions(created_on DESC);
