import React, { useState, useEffect } from 'react';
import {
  ArrowDownUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { getTransactions } from '../api/client';
import type { Account, PageResponse, TransactionResponse } from '../types';

interface TransactionHistoryProps {
  accounts: Account[];
  selectedAccountId: number | null;
  refreshTrigger: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  accounts,
  selectedAccountId,
  refreshTrigger,
}) => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [pageData, setPageData] = useState<PageResponse<TransactionResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [filterAccountId, setFilterAccountId] = useState<string>(
    selectedAccountId ? String(selectedAccountId) : ''
  );
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAccountId) {
      setFilterAccountId(String(selectedAccountId));
    }
  }, [selectedAccountId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({
        accountId: filterAccountId ? Number(filterAccountId) : undefined,
        search: search.trim() || undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        sort: sortField,
        order: sortOrder,
        page: currentPage,
        size: 10,
      });
      setTransactions(res.content);
      setPageData(res);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, sortField, sortOrder, refreshTrigger]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterAccountId('');
    setMinAmount('');
    setMaxAmount('');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(0);
    setTimeout(loadData, 50);
  };

  return (
    <div className="bg-white border border-[#EBE5DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-[#F2ECE5]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FAF7F4] text-[#FF6651] border border-[#EBE5DF]">
              <Receipt className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-[#1A1D20] tracking-tight">
              Verified Transaction Ledger
            </h2>
          </div>
          <p className="text-xs text-[#5F6773]">
            Comprehensive multi-shard audit trail with two-phase commit consensus and cryptographic verification
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5F7F3] border border-[#00A389]/25 text-[11px] font-semibold text-[#00A389]">
          <span className="w-2 h-2 rounded-full bg-[#00A389] animate-pulse" />
          <span>Real-Time Invariant Audited</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <form onSubmit={handleFilterSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword search */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1.5">
              Search by Note or ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#5F6773]" />
              <input
                type="text"
                placeholder="e.g. TX-..., salary, groceries"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] transition"
              />
            </div>
          </div>

          {/* Account Filter */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1.5">
              Filter By Account
            </label>
            <select
              value={filterAccountId}
              onChange={(e) => setFilterAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs font-medium focus:outline-none focus:border-[#FF6651] transition"
            >
              <option value="">All Accounts (Global Network)</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} ({acc.user?.fullName || `Acc #${acc.id}`}) — {acc.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Min Amount */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1.5">
              Min Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] transition"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1.5">
              Max Amount
            </label>
            <input
              type="number"
              placeholder="500,000"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] transition"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1A1D20] hover:bg-black text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2 rounded-xl border border-[#EBE5DF] bg-[#FAF7F4] hover:bg-white text-[#5F6773] hover:text-[#1A1D20] text-xs font-semibold transition cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5F6773] font-bold uppercase text-[10px]">Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs focus:outline-none focus:border-[#FF6651]"
            >
              <option value="createdAt">Timestamp</option>
              <option value="amount">Amount</option>
              <option value="id">Reference ID</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="p-1.5 rounded-xl border border-[#EBE5DF] bg-[#FAF7F4] text-[#1A1D20] hover:bg-white transition cursor-pointer"
              title={`Sort ${sortOrder.toUpperCase()}`}
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Transaction Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#EBE5DF] bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F4] border-b border-[#EBE5DF] text-[#5F6773] uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Parties (Sender → Receiver)</th>
              <th className="py-3 px-4 text-right">Volume</th>
              <th className="py-3 px-4">2PC Status</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECE5]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#5F6773]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#FF6651]" />
                  <span>Loading distributed transaction records...</span>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#5F6773] bg-[#FAF7F4]/50">
                  No transactions match your search filter criteria.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isExpanded = expandedTxId === tx.transactionId;
                const senderAcc = accounts.find((a) => a.id === tx.senderAccountId);
                const receiverAcc = accounts.find((a) => a.id === tx.receiverAccountId);

                return (
                  <React.Fragment key={tx.transactionId}>
                    <tr
                      onClick={() => setExpandedTxId(isExpanded ? null : tx.transactionId)}
                      className="hover:bg-[#FAF7F4] transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1A1D20] max-w-[140px] truncate">
                        {tx.transactionId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F4] border border-[#EBE5DF] text-[10px] font-semibold text-[#1A1D20]">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6773]">
                        <span className="text-[#1A1D20] font-bold">{senderAcc?.accountNumber || `#${tx.senderAccountId}`}</span>
                        <span className="text-[#5F6773] mx-1.5 font-bold">&rarr;</span>
                        <span className="text-[#1A1D20] font-bold">{receiverAcc?.accountNumber || `#${tx.receiverAccountId}`}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#1A1D20]">
                        {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'COMMITTED'
                              ? 'bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/20'
                              : 'bg-[#FAF7F4] text-[#5F6773] border border-[#EBE5DF]'
                          }`}
                        >
                          {tx.status === 'COMMITTED' ? 'COMMITTED' : tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6773] text-[11px] font-medium">
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          className="p-1 rounded-lg hover:bg-white text-[#5F6773] hover:text-[#1A1D20] transition cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 mx-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 mx-auto" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-[#FAF7F4]/60 border-y border-[#EBE5DF]">
                        <td colSpan={7} className="p-5 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DF] text-xs">
                            <span className="font-black text-[#1A1D20] flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-[#00A389]" />
                              <span>Two-Phase Commit Consensus Proof (Ref: {tx.transactionId})</span>
                            </span>
                            <span className="text-[#5F6773] font-medium text-[11px]">
                              Note: {tx.description || 'P2P Financial Clearing'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tx.ledgerEntries && tx.ledgerEntries.length > 0 ? (
                              tx.ledgerEntries.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="p-4 rounded-2xl border border-[#EBE5DF] bg-white text-xs space-y-2 shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        entry.type === 'DEBIT'
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                          : 'bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/20'
                                      }`}
                                    >
                                      {entry.type === 'DEBIT' ? 'DEBIT (Account Outflow)' : 'CREDIT (Account Inflow)'}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#5F6773]">
                                      Journal Entry #{entry.id}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-baseline pt-1">
                                    <span className="text-[#5F6773]">Account Node:</span>
                                    <span className="font-bold text-[#1A1D20]">
                                      Account #{entry.accountId}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-baseline">
                                    <span className="text-[#5F6773]">Amount:</span>
                                    <span className="font-black text-[#1A1D20]">
                                      {Number(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-baseline pt-2 border-t border-[#F2ECE5]">
                                    <span className="text-[#5F6773] text-[11px]">
                                      Post-Commit Balance:
                                    </span>
                                    <span className="font-black text-[#00A389] text-[11px]">
                                      {Number(entry.balanceAfter).toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 text-center py-4 text-xs text-[#5F6773]">
                                Immutable ledger record verified in database journal.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pageData && pageData.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#5F6773] pt-3 border-t border-[#F2ECE5]">
          <div>
            Page <strong className="text-[#1A1D20]">{pageData.page + 1}</strong> of{' '}
            <strong className="text-[#1A1D20]">{pageData.totalPages}</strong> ({pageData.totalElements} records verified)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={pageData.first}
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl border border-[#EBE5DF] bg-[#FAF7F4] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-[#1A1D20]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pageData.last}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 rounded-xl border border-[#EBE5DF] bg-[#FAF7F4] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-[#1A1D20]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
