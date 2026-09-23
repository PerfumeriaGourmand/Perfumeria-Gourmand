-- One-time backfill: orders approved before fulfillment_status tracking existed
-- were already shipped/delivered manually, but have fulfillment_status = NULL
-- because the column had no default and nothing populated it retroactively.
-- Without this, the "pending dispatch" badge counts every historic approved
-- order as pending. Run once; new orders keep starting at NULL as intended.
UPDATE orders
SET fulfillment_status = 'delivered'
WHERE payment_status = 'approved'
  AND fulfillment_status IS NULL;
