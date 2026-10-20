-- ============================================================================
-- TransMoney: Statistical Model Verification & DDBMS Evaluation Proofs
-- Course: Distributed Database Systems (Sir Umair)
-- Authors: Shehzad Nisar, Muhammad Ashraf, Daniyal Ahmed
-- Database: PostgreSQL 17 (transmoney_db)
--
-- RUN THESE QUERIES IN PGADMIN TO PROVE STATISTICAL COMPLIANCE TO SIR UMAIR:
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROOF 1: PARETO / ZIPF'S LAW (80/20 RULE) VERIFICATION
-- Demonstrates that top 20% most active sender accounts generate ~80% of transactions
-- ----------------------------------------------------------------------------
\echo '=== PROOF 1: PARETO DISTRIBUTION OF SENDER TRANSACTIONS ==='

WITH account_tx_counts AS (
    SELECT 
        sender_account_id,
        COUNT(*) AS tx_count,
        ROUND(SUM(amount), 2) AS total_volume
    FROM transactions
    WHERE sender_account_id IS NOT NULL
    GROUP BY sender_account_id
),
ranked_accounts AS (
    SELECT 
        sender_account_id,
        tx_count,
        total_volume,
        ROW_NUMBER() OVER (ORDER BY tx_count DESC) AS rank,
        COUNT(*) OVER () AS total_accounts,
        SUM(tx_count) OVER () AS global_tx_count
    FROM account_tx_counts
)
SELECT 
    sender_account_id,
    tx_count,
    ROUND((tx_count::numeric / global_tx_count) * 100, 2) AS pct_of_total_tx,
    ROUND((rank::numeric / total_accounts) * 100, 1) AS account_rank_percentile,
    CASE 
        WHEN (rank::numeric / total_accounts) <= 0.20 THEN 'TOP 20% (Pareto Head)'
        ELSE 'BOTTOM 80% (Long Tail)'
    END AS distribution_segment
FROM ranked_accounts
ORDER BY tx_count DESC;

-- ----------------------------------------------------------------------------
-- PROOF 2: LOG-NORMAL DISTRIBUTION OF TRANSACTION AMOUNTS
-- Shows right-skewed percentiles: Low median (retail), high 95th/99th (clearing)
-- ----------------------------------------------------------------------------
\echo '=== PROOF 2: LOG-NORMAL AMOUNT DISTRIBUTION & PERCENTILES ==='

SELECT 
    COUNT(*) AS sample_size,
    ROUND(AVG(amount), 2) AS mean_amount,
    ROUND(percentile_cont(0.10) WITHIN GROUP (ORDER BY amount)::numeric, 2) AS p10_small_retail,
    ROUND(percentile_cont(0.50) WITHIN GROUP (ORDER BY amount)::numeric, 2) AS p50_median,
    ROUND(percentile_cont(0.80) WITHIN GROUP (ORDER BY amount)::numeric, 2) AS p80,
    ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY amount)::numeric, 2) AS p95_commercial,
    ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY amount)::numeric, 2) AS p99_enterprise,
    ROUND(MAX(amount), 2) AS max_amount,
    ROUND(STDDEV(amount), 2) AS standard_deviation
FROM transactions;

-- ----------------------------------------------------------------------------
-- PROOF 3: DIURNAL TIME-OF-DAY ACTIVITY HISTOGRAM
-- Shows Gaussian rush hour transaction traffic by hour of the day (0 to 23)
-- ----------------------------------------------------------------------------
\echo '=== PROOF 3: DIURNAL 24-HOUR TRAFFIC DENSITY HISTOGRAM ==='

SELECT 
    EXTRACT(HOUR FROM created_at) AS hour_of_day,
    COUNT(*) AS total_transactions,
    ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER ()) * 100, 2) AS pct_daily_traffic,
    CASE 
        WHEN EXTRACT(HOUR FROM created_at) IN (12, 13, 14) THEN 'LUNCH RUSH HOUR (Peak)'
        WHEN EXTRACT(HOUR FROM created_at) IN (19, 20, 21) THEN 'EVENING E-COMMERCE RUSH (Peak)'
        WHEN EXTRACT(HOUR FROM created_at) IN (2, 3, 4, 5) THEN 'NIGHT LULL (Off-Peak)'
        ELSE 'STANDARD BUSINESS HOURS'
    END AS activity_period
FROM transactions
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour_of_day ASC;

-- ----------------------------------------------------------------------------
-- PROOF 4: GAAP DOUBLE-ENTRY ZERO-SUM MATHEMATICAL INVARIANT
-- Proves that sum(DEBIT) - sum(CREDIT) = 0.00 across all distributed shards
-- ----------------------------------------------------------------------------
\echo '=== PROOF 4: GAAP DOUBLE-ENTRY BALANCE INVARIANT ==='

SELECT 
    SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END) AS total_debits,
    SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END) AS total_credits,
    SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE -amount END) AS zero_sum_discrepancy,
    CASE 
        WHEN SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE -amount END) = 0.00 
        THEN 'STRICT FINANCIAL BALANCE PRESERVED (PASSED)'
        ELSE 'DISCREPANCY DETECTED (FAILED)'
    END AS gaap_audit_status
FROM ledger_entries;

-- ----------------------------------------------------------------------------
-- PROOF 5: TWO-PHASE COMMIT WRITE-AHEAD LOG (WAL) AUDIT
-- Demonstrates DDBMS Syllabus Week 9 & 10 coordinator logging
-- ----------------------------------------------------------------------------
\echo '=== PROOF 5: 2PC WRITE-AHEAD LOG AUDIT SUMMARY ==='

SELECT 
    phase,
    COUNT(*) AS count_steps,
    ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER ()) * 100, 2) AS pct_of_steps
FROM two_phase_commit_logs
GROUP BY phase
ORDER BY count_steps DESC;

-- ----------------------------------------------------------------------------
-- PROOF 6: HIGH-PERFORMANCE B-TREE INDEX SCAN EXECUTION PLAN
-- Demonstrates sub-millisecond query execution time on high-scale dataset
-- ----------------------------------------------------------------------------
\echo '=== PROOF 6: HIGH-SPEED QUERY EXECUTION PLAN ==='

EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    id, transaction_id, sender_account_id, receiver_account_id, amount, currency, status, created_at
FROM transactions
WHERE sender_account_id = 1
ORDER BY created_at DESC
LIMIT 50;
