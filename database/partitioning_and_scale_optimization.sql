-- ============================================================================
-- TransMoney: PostgreSQL Declarative Table Partitioning & High-Scale Optimization
-- Course: Distributed Database Systems (Sir Umair)
-- Syllabus Mapping: Week 4 (Horizontal Fragmentation) & Week 15 (Scale & Partition Pruning)
-- Target Database: PostgreSQL 17 (transmoney_db)
--
-- Why Partitioning for 50 Million Records?
-- Without partitioning, a single table with 50,000,000 rows causes:
-- 1. High B-Tree index bloat (tens of gigabytes in RAM).
-- 2. Slow seq-scans and expensive buffer cache thrashing.
-- With Declarative Partitioning:
-- 1. Partition Pruning: Queries hitting specific date/shard ranges read ONLY 1 partition!
-- 2. Parallel sequential scans run across physical chunks simultaneously.
-- 3. Instant data drops via DROP TABLE instead of slow DELETE operations.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DECLARATIVE RANGE PARTITIONING ON TRANSACTIONS BY CREATED_AT (CHRONOLOGICAL)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS transactions_partitioned (
    id BIGSERIAL,
    transaction_id VARCHAR(64) NOT NULL,
    sender_account_id BIGINT,
    receiver_account_id BIGINT,
    amount NUMERIC(18,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    target_amount NUMERIC(18,2),
    target_currency VARCHAR(10),
    exchange_rate NUMERIC(18,6),
    description VARCHAR(500),
    type VARCHAR(32) NOT NULL DEFAULT 'P2P_TRANSFER',
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Monthly partitions for 2026:
CREATE TABLE IF NOT EXISTS transactions_y2026_m08 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2026-08-01 00:00:00') TO ('2026-09-01 00:00:00');

CREATE TABLE IF NOT EXISTS transactions_y2026_m09 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2026-09-01 00:00:00') TO ('2026-10-01 00:00:00');

CREATE TABLE IF NOT EXISTS transactions_y2026_m10 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2026-10-01 00:00:00') TO ('2026-11-01 00:00:00');

CREATE TABLE IF NOT EXISTS transactions_y2026_m11 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2026-11-01 00:00:00') TO ('2026-12-01 00:00:00');

CREATE TABLE IF NOT EXISTS transactions_default PARTITION OF transactions_partitioned
    DEFAULT;

-- Local Partitioned Indexes (B-Tree):
CREATE INDEX IF NOT EXISTS idx_part_tx_sender ON transactions_partitioned (sender_account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_part_tx_receiver ON transactions_partitioned (receiver_account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_part_tx_status ON transactions_partitioned (status, created_at);

-- ----------------------------------------------------------------------------
-- 2. DECLARATIVE LIST PARTITIONING BY SHARD ON ACCOUNTS
-- Demonstrates Horizontal Fragmentation across 4 Regional Nodes (Syllabus Week 4)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS accounts_partitioned (
    account_id BIGSERIAL,
    user_id BIGINT NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    shard VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (account_id, shard)
) PARTITION BY LIST (shard);

-- Physical Fragment Shards:
CREATE TABLE IF NOT EXISTS accounts_shard_north PARTITION OF accounts_partitioned
    FOR VALUES IN ('SHARD_1_NORTH');

CREATE TABLE IF NOT EXISTS accounts_shard_central PARTITION OF accounts_partitioned
    FOR VALUES IN ('SHARD_2_CENTRAL');

CREATE TABLE IF NOT EXISTS accounts_shard_south PARTITION OF accounts_partitioned
    FOR VALUES IN ('SHARD_3_SOUTH');

CREATE TABLE IF NOT EXISTS accounts_shard_enterprise PARTITION OF accounts_partitioned
    FOR VALUES IN ('SHARD_4_ENTERPRISE', 'SHARD_1_US', 'SHARD_2_UK');

-- ----------------------------------------------------------------------------
-- 3. PROOF OF PARTITION PRUNING (SHOW THIS TO SIR UMAIR!)
-- ----------------------------------------------------------------------------
-- When you run EXPLAIN, PostgreSQL automatically discards other partitions!
-- Notice in the output: Only 'transactions_y2026_m10' is scanned; m08, m09, m11 are pruned!

\echo '=== DEMONSTRATING PARTITION PRUNING ON 50 MILLION DATASET ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    id, transaction_id, sender_account_id, receiver_account_id, amount, status, created_at
FROM transactions_partitioned
WHERE created_at >= '2026-10-15 00:00:00' 
  AND created_at <  '2026-10-21 00:00:00'
  AND sender_account_id = 1
ORDER BY created_at DESC
LIMIT 20;
