import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Flame,
  Network,
  RefreshCw,
  Server,
} from 'lucide-react';
import { ShardClusterView } from './ShardClusterView';
import { SystemBufferDashboard } from './SystemBufferDashboard';
import { ChaosSimulatorView } from './ChaosSimulatorView';
import { ArchitectureView } from './ArchitectureView';
import type { Account, SystemHealth, User } from '../types';

interface CoreBankingConsoleProps {
  health: SystemHealth | null;
  accounts: Account[];
  selectedAccountId: number | null;
  currentUser?: User | null;
  onSelectAccount: (id: number) => void;
  onOpenCreateAccount: () => void;
  onRefreshData: () => void;
}

export const CoreBankingConsole: React.FC<CoreBankingConsoleProps> = ({
  health,
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenCreateAccount,
  onRefreshData,
}) => {
  const [subTab, setSubTab] = useState<'shards' | 'buffer' | 'chaos' | 'architecture'>('shards');
  const isHealthy = health?.database?.includes('Connected');

  return (
    <div className="space-y-6 font-sans">
      {/* Enterprise Infrastructure Header */}
      <div className="bg-[#1A1D20] text-white rounded-[28px] p-6 sm:p-7 border border-[#2C3036] shadow-xl relative overflow-hidden">
        {/* Subtle Brand Accent Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FF6651]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#00A389]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A389] animate-pulse shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider font-mono text-white">
                Core Banking &amp; Distributed Infrastructure
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-[#00A389] font-mono font-bold border border-white/10">
                ENTERPRISE CONSOLE
              </span>
            </div>
            <p className="text-xs text-white/60">
              Distributed Database Management • Regional Shard Partitions • 2PC Consensus Engine • Redis In-Memory Cache
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono">
              <Database className="w-3.5 h-3.5 text-[#00A389]" />
              <span className="text-white/60">DB Status:</span>
              <span className={`font-bold ${isHealthy ? 'text-[#00A389]' : 'text-[#FF6651]'}`}>
                {isHealthy ? 'Connected' : 'Offline'}
              </span>
            </div>

            <button
              onClick={onRefreshData}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition cursor-pointer"
              title="Refresh Engine State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Academic Evaluation & System Attribution (Professionally Framed) */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white/50">Project Specs:</span>
            <span className="text-white font-bold">Distributed Database Systems (Sir Umair)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-[11px] font-mono transition">
              Shehzad Nisar <span className="text-white/40">•</span> <strong className="text-white">B22110006147</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-[11px] font-mono transition">
              Muhammad Ashraf <span className="text-white/40">•</span> <strong className="text-white">B22110006090</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-[11px] font-mono transition">
              Daniyal Ahmed <span className="text-white/40">•</span> <strong className="text-white">B21110006024</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Sub-Navigation Tabs (Unified Segmented Control) */}
      <div className="flex items-center">
        <div className="p-1.5 bg-[#FAF7F4] rounded-full flex flex-wrap gap-1 border border-[#EBE5DF] shadow-2xs">
          <button
            onClick={() => setSubTab('shards')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              subTab === 'shards'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-white/80'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#00A389]" />
            <span>Regional Shard Topology</span>
          </button>

          <button
            onClick={() => setSubTab('buffer')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              subTab === 'buffer'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-white/80'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Redis Cache &amp; Event Buffer</span>
          </button>

          <button
            onClick={() => setSubTab('chaos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              subTab === 'chaos'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-white/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF6651]" />
            <span>Fault Injection &amp; Stress Testing</span>
          </button>

          <button
            onClick={() => setSubTab('architecture')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              subTab === 'architecture'
                ? 'bg-[#1A1D20] text-white shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-white/80'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-500" />
            <span>Architecture Blueprints</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Views */}
      <div className="pt-2">
        {subTab === 'shards' && (
          <div className="space-y-6">
            <ShardClusterView
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={onSelectAccount}
              onOpenCreateAccount={onOpenCreateAccount}
            />
          </div>
        )}

        {subTab === 'buffer' && <SystemBufferDashboard />}

        {subTab === 'chaos' && <ChaosSimulatorView />}

        {subTab === 'architecture' && <ArchitectureView />}
      </div>
    </div>
  );
};
