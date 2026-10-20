import React from 'react';
import { Layers, Plus, Wallet } from 'lucide-react';
import type { Account, ShardType } from '../types';

interface ShardClusterViewProps {
  accounts: Account[];
  selectedAccountId: number | null;
  onSelectAccount: (accountId: number) => void;
  onOpenCreateAccount?: () => void;
}

interface RegionMeta {
  code: string;
  label: string;
  region: string;
  role: string;
  port: number;
  currency: string;
}

const REGION_CONFIG: Record<string, RegionMeta> = {
  SHARD_1_NORTH: {
    code: 'HUB-01',
    label: 'North Pakistan Regional Node',
    region: 'Islamabad / Rawalpindi / KP',
    role: 'Primary Partition',
    port: 5432,
    currency: 'PKR',
  },
  SHARD_2_CENTRAL: {
    code: 'HUB-02',
    label: 'Central Pakistan Regional Node',
    region: 'Lahore / Faisalabad / Punjab',
    role: 'Primary Partition',
    port: 5434,
    currency: 'PKR',
  },
  SHARD_3_SOUTH: {
    code: 'HUB-03',
    label: 'South Pakistan Regional Node',
    region: 'Karachi / Hyderabad / Sindh',
    role: 'Primary Partition',
    port: 5436,
    currency: 'PKR',
  },
  SHARD_4_ENTERPRISE: {
    code: 'HUB-04',
    label: 'Enterprise & Merchant Clearing Hub',
    region: 'Karachi FinTech Enterprise Center',
    role: 'High-Volume Settlement Node',
    port: 5438,
    currency: 'PKR',
  },
  SHARD_1_US: {
    code: 'HUB-US',
    label: 'North America FX Gateway',
    region: 'New York, USA',
    role: 'USD Foreign Exchange Settlement',
    port: 5440,
    currency: 'USD',
  },
  SHARD_2_UK: {
    code: 'HUB-UK',
    label: 'Europe & UK Cross-Border Node',
    region: 'London, United Kingdom',
    role: 'GBP International Gateway',
    port: 5442,
    currency: 'GBP',
  },
};

export const ShardClusterView: React.FC<ShardClusterViewProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenCreateAccount,
}) => {
  const primaryRegions: ShardType[] = [
    'SHARD_1_NORTH',
    'SHARD_2_CENTRAL',
    'SHARD_3_SOUTH',
    'SHARD_4_ENTERPRISE',
  ];

  const totalBalancePkr = accounts
    .filter((a) => (a.currency || 'PKR') === 'PKR')
    .reduce((sum, a) => sum + Number(a.balance), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Topology Header */}
      <div className="bg-white border border-[#EBE5DF] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FAF7F4] text-[#FF6651] border border-[#EBE5DF]">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-[#1A1D20] tracking-tight">
              Distributed Shard Cluster Topology
            </h2>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-pulse" />
              Shared-Nothing Active
            </span>
          </div>
          <p className="text-xs text-[#5F6773]">
            Horizontal fragmentation across regional partitions with independent PostgreSQL nodes and deterministic Two-Phase Commit consensus
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5F6773] block">
              Network Liquidity
            </span>
            <span className="text-base font-black text-[#1A1D20]">
              {totalBalancePkr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-semibold text-[#5F6773] ml-1">PKR</span>
            </span>
          </div>

          {onOpenCreateAccount && (
            <button
              onClick={onOpenCreateAccount}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1D20] hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open Shard Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Regional Shards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryRegions.map((regionKey) => {
          const cfg = REGION_CONFIG[regionKey];
          const regionAccounts = accounts.filter(
            (a) =>
              a.shard === regionKey ||
              (regionKey === 'SHARD_1_NORTH' && a.shard === 'SHARD_1_US') ||
              (regionKey === 'SHARD_2_CENTRAL' && a.shard === 'SHARD_2_UK')
          );

          const regionBalance = regionAccounts.reduce(
            (sum, a) => sum + Number(a.balance),
            0
          );

          return (
            <div
              key={regionKey}
              className="bg-white border border-[#EBE5DF] rounded-3xl p-5 shadow-xs hover:border-[#FF6651]/40 transition flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Shard Meta Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE5]">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F4] text-[#1A1D20] border border-[#EBE5DF]">
                    {cfg.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00A389]">
                    <span className="w-2 h-2 rounded-full bg-[#00A389] animate-pulse" />
                    <span>PORT {cfg.port}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-black text-[#1A1D20] tracking-tight">
                    {cfg.label}
                  </h3>
                  <p className="text-xs text-[#5F6773] font-medium truncate">{cfg.region}</p>
                </div>

                {/* Shard Balance Card */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF]">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#5F6773]">
                    <span>Partition Balance</span>
                    <span className="text-[#00A389]">ONLINE</span>
                  </div>
                  <div className="text-lg font-black text-[#1A1D20] mt-0.5">
                    {regionBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    <span className="text-xs font-semibold text-[#5F6773]">PKR</span>
                  </div>
                </div>
              </div>

              {/* Shard Accounts List */}
              <div className="pt-2 border-t border-[#F2ECE5] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#5F6773]">
                  <span>Accounts ({regionAccounts.length})</span>
                  <span>Balance</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {regionAccounts.length === 0 ? (
                    <div className="text-center py-4 text-xs text-[#5F6773] bg-[#FAF7F4] rounded-xl border border-dashed border-[#EBE5DF]">
                      No active accounts
                    </div>
                  ) : (
                    regionAccounts.map((acc) => {
                      const isSelected = selectedAccountId === acc.id;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => onSelectAccount(acc.id)}
                          className={`w-full text-left p-2.5 rounded-2xl text-xs transition flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A1D20] text-white font-bold border-[#1A1D20] shadow-sm'
                              : 'bg-white hover:bg-[#FAF7F4] text-[#1A1D20] border-[#EBE5DF]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10 text-white' : 'bg-[#FAF7F4] text-[#FF6651]'}`}>
                              <Wallet className="w-3.5 h-3.5 shrink-0" />
                            </div>
                            <div className="truncate text-left">
                              <span className="block truncate font-bold">
                                {acc.user?.fullName || `Account #${acc.id}`}
                              </span>
                              <span
                                className={`text-[10px] block font-mono ${
                                  isSelected ? 'text-white/70' : 'text-[#5F6773]'
                                }`}
                              >
                                {acc.accountNumber}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-2">
                            <span className="block font-black">
                              {Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            <span
                              className={`text-[9px] block uppercase font-bold ${
                                isSelected ? 'text-white/70' : 'text-[#5F6773]'
                              }`}
                            >
                              {acc.currency || 'PKR'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
