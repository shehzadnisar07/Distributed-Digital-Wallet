import React from 'react';
import { ShieldCheck, Database, Cpu, ArrowRight, Lock, Server, GitMerge } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 font-sans w-full pb-8">
      {/* Hero Header */}
      <div className="bg-white border border-[#EBE5DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F2ECE5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F4] text-[#FF6651] border border-[#EBE5DF] uppercase tracking-wider">
                Distributed Database Systems • Sir Umair
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-pulse" />
                ACID 2PC Verified
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#1A1D20] tracking-tight">
              TransMoney Distributed System Architecture
            </h2>
            <p className="text-xs text-[#5F6773] mt-1">
              Horizontally sharded shared-nothing ledger topology with Two-Phase Commit consensus, ordered row-locking, and immutable GAAP double-entry journals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#FF6651]" /> PostgreSQL 17 Multi-Shard
            </span>
          </div>
        </div>

        {/* Dynamic Architectural Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#FF6651] shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1A1D20]">Two-Phase Commit (2PC)</h4>
              <p className="text-xs text-[#5F6773] mt-1 leading-relaxed">
                Atomic cross-shard transaction coordinator executing Phase 1 (Prepare/Vote) and Phase 2 (Global Commit). Zero partial states.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#FF6651] flex items-center gap-1 pt-1">
              <span>Syllabus Weeks 9 & 10</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#00A389] shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1A1D20]">Horizontal Fragmentation</h4>
              <p className="text-xs text-[#5F6773] mt-1 leading-relaxed">
                Accounts and ledgers physically partitioned across 4 regional shards (North, Central, South, Enterprise) and international nodes.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#00A389] flex items-center gap-1 pt-1">
              <span>Syllabus Weeks 2 & 4</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#1A1D20] shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1A1D20]">Deadlock-Free Locking</h4>
              <p className="text-xs text-[#5F6773] mt-1 leading-relaxed">
                Deterministic hierarchical locking (<code className="text-[#FF6651] font-mono">min(id) &rarr; max(id)</code>) mathematically guarantees elimination of circular-wait deadlocks.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#1A1D20] flex items-center gap-1 pt-1">
              <span>Syllabus Week 12</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Consensus Stepper */}
      <div className="bg-white border border-[#EBE5DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE5]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FAF7F4] text-[#FF6651] border border-[#EBE5DF]">
              <GitMerge className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-[#1A1D20] tracking-tight">
              Life of a Cross-Shard Transfer (2PC Consensus Lifecycle)
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F4] border border-[#EBE5DF] text-[#5F6773]">
            Sub-millisecond latency
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-2 relative">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#1A1D20] text-white">
              STEP 1
            </span>
            <h5 className="text-xs font-bold text-[#1A1D20]">Initiate &amp; Idempotency</h5>
            <p className="text-[11px] text-[#5F6773] leading-relaxed">
              Client submits transfer with UUID <code className="text-[#1A1D20]">X-Idempotency-Key</code>. Deduplication layer checks for prior execution.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF6651] text-white">
              STEP 2
            </span>
            <h5 className="text-xs font-bold text-[#1A1D20]">Ordered Row Locks</h5>
            <p className="text-[11px] text-[#5F6773] leading-relaxed">
              Coordinator acquires pessimistic write locks on both accounts in strictly ascending ID order to eliminate deadlock loops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00A389] text-white">
              STEP 3
            </span>
            <h5 className="text-xs font-bold text-[#1A1D20]">Phase 1: Prepare (Vote)</h5>
            <p className="text-[11px] text-[#5F6773] leading-relaxed">
              Validates sender balance, FX exchange rates, and active account status across regional shards. All participants vote <code className="text-[#00A389]">COMMIT</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] space-y-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00A389] text-white">
              STEP 4
            </span>
            <h5 className="text-xs font-bold text-[#1A1D20]">Phase 2: Global Commit</h5>
            <p className="text-[11px] text-[#5F6773] leading-relaxed">
              Balances update atomically, immutable GAAP double-entry journal records write, Redis cache evicts, and events stream via WebSocket.
            </p>
          </div>
        </div>
      </div>

      {/* Mathematical & Academic Attribution Card */}
      <div className="bg-[#1A1D20] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <h4 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00A389]" />
              <span>Academic Specification &amp; Evaluation Matrix</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              University of Karachi • UBIT • Distributed Database Systems (Sir Umair)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-neutral-300 border border-white/15">
              Scale Target: 50,000,000 Data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Lead Architect</span>
            <span className="font-bold text-white block">Shehzad Nisar</span>
            <span className="text-[11px] font-mono text-[#FF6651]">B22110006147</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Backend &amp; Database Lead</span>
            <span className="font-bold text-white block">Muhammad Ashraf</span>
            <span className="text-[11px] font-mono text-[#00A389]">B22110006090</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Frontend &amp; Integration Lead</span>
            <span className="font-bold text-white block">Daniyal Ahmed</span>
            <span className="text-[11px] font-mono text-amber-400">B21110006024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
