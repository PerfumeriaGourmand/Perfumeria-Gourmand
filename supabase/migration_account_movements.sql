-- Movimientos de dinero por cuenta/destino (ventas, retiros, gastos, transferencias, ajustes)
-- El saldo de cada cuenta es la suma de sus movimientos (monto positivo = entrada, negativo = salida)

CREATE TABLE IF NOT EXISTS account_movements (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id     UUID NOT NULL REFERENCES payment_destinations(id) ON DELETE RESTRICT,
  kind               TEXT NOT NULL CHECK (kind IN ('venta', 'retiro', 'gasto', 'transferencia', 'ajuste')),
  amount             NUMERIC(10,2) NOT NULL,
  description        TEXT,
  order_id           UUID REFERENCES orders(id) ON DELETE SET NULL,
  transfer_group_id  UUID,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_account_movements_destination ON account_movements(destination_id);
CREATE INDEX IF NOT EXISTS idx_account_movements_created_at ON account_movements(created_at DESC);

ALTER TABLE account_movements ENABLE ROW LEVEL SECURITY;
-- Sin políticas públicas: solo accesible vía service role (admin client) desde rutas /api/admin/*

-- Backfill: las ventas manuales ya cargadas con destino pasan a ser movimientos "venta"
INSERT INTO account_movements (destination_id, kind, amount, description, order_id, created_at)
SELECT payment_destination_id, 'venta', total, customer_name, id, created_at
FROM orders
WHERE source = 'manual' AND payment_destination_id IS NOT NULL;
