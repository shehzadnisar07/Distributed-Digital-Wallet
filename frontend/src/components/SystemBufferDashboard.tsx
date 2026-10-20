import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Radio,
  RefreshCw,
  Trash2,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
} from 'lucide-react';
import {
  getCacheStats,
  clearCache,
  getQueueStats,
  warmCache,
} from '../api/client';
import { walletSocket } from '../api/websocket';
import type { CacheStatsResponse, QueueStatsResponse, TransactionEvent } from '../types';

export const SystemBufferDashboard: React.FC = () => {
  const [cacheStats, setCacheStats] = useState<CacheStatsResponse | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [eventStream, setEventStream] = useState<TransactionEvent[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const refreshMetrics = async () => {
    try {
      const [c, q] = await Promise.all([
        getCacheStats().catch(() => null),
        getQueueStats().catch(() => null),
      ]);
      if (c) setCacheStats(c);
      if (q) setQueueStats(q);
    } catch (err) {
      console.error('Error fetching system buffer metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 3000);

    // Listen to real-time WebSocket connection state
    const unbindStatus = walletSocket.onStatus((connected) => {
      setWsConnected(connected);
    });

    // Listen to real-time incoming transaction events
    const unbindEvent = walletSocket.onEvent((event) => {
      setEventStream((prev) => [event, ...prev.slice(0, 19)]);
      refreshMetrics();
    });

    return () => {
      clearInterval(interval);
      unbindStatus();
      unbindEvent();
    };
  }, []);

  const handleWarmCache = async () => {
    try {
      const count = await warmCache();
      setActionMessage(`Pre-warmed cache for ${count} accounts.`);
      refreshMetrics();
      setTimeout(() => setActionMessage(null), 4000);
    } catch {
      setActionMessage('Failed to warm cache.');
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache();
      setActionMessage('Balance cache purged successfully.');
      refreshMetrics();
      setTimeout(() => setActionMessage(null), 4000);
    } catch {
      setActionMessage('Failed to clear cache.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#1A1D20] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6651]/20 text-[#FF6651] border border-[#FF6651]/30 uppercase tracking-wider">
              Distributed Caching Engine
            </span>
            <span className="text-xs text-neutral-400 font-mono">Redis In-Memory • Sub-Millisecond Reads</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Dual-Tier Balance Cache &amp; Async Queue Buffer</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Accelerates sub-millisecond balance reads via dual-tier Redis caching, decouples post-transaction
            heavy side effects with an async queue buffer, and broadcasts live WebSocket push notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleWarmCache}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Pre-Warm</span>
          </button>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-rose-300 font-bold text-xs rounded-xl border border-neutral-700 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge</span>
          </button>
          <button
            onClick={refreshMetrics}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-700 transition cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-[#E5F7F3] border border-[#00A389]/30 text-[#00A389] rounded-2xl text-xs flex items-center gap-2 font-bold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#00A389] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cache Hit Ratio */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE5DF] shadow-xs">
          <div className="flex items-center justify-between text-[#5F6773] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Cache Hit Ratio</span>
            <Activity className="w-4 h-4 text-[#00A389]" />
          </div>
          <div className="text-2xl font-black text-[#1A1D20]">
            {cacheStats ? `${cacheStats.hitRatePercentage}%` : '0%'}
          </div>
          <div className="mt-2 text-[11px] text-[#5F6773] flex items-center justify-between">
            <span>Hits: {cacheStats?.hits ?? 0}</span>
            <span>Misses: {cacheStats?.misses ?? 0}</span>
          </div>
        </div>

        {/* Metric 2: Cache Evictions */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE5DF] shadow-xs">
          <div className="flex items-center justify-between text-[#5F6773] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>2PC Cache Evictions</span>
            <Database className="w-4 h-4 text-[#FF6651]" />
          </div>
          <div className="text-2xl font-black text-[#1A1D20]">
            {cacheStats?.evictions ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-[#5F6773] flex items-center justify-between">
            <span>In-Memory: {cacheStats?.inMemoryEntries ?? 0}</span>
            <span className={cacheStats?.redisConnected ? 'text-[#00A389] font-bold' : 'text-amber-600 font-bold'}>
              {cacheStats?.redisConnected ? '● Redis Online' : '● Local Fallback'}
            </span>
          </div>
        </div>

        {/* Metric 3: Async Queue Throughput */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE5DF] shadow-xs">
          <div className="flex items-center justify-between text-[#5F6773] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Queue Processed</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-[#1A1D20]">
            {queueStats?.totalProcessed ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-[#5F6773] flex items-center justify-between">
            <span>Enqueued: {queueStats?.totalEnqueued ?? 0}</span>
            <span>Buffer Depth: {queueStats?.pendingBufferSize ?? 0}</span>
          </div>
        </div>

        {/* Metric 4: WebSocket Real-Time Stream */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE5DF] shadow-xs">
          <div className="flex items-center justify-between text-[#5F6773] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>WebSocket Channel</span>
            <Radio className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-[#00A389] animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-lg font-black text-[#1A1D20]">
              {wsConnected ? 'Live Connected' : 'Connecting'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5F6773] flex items-center justify-between">
            <span>Clients: {queueStats?.activeWebSocketConnections ?? (wsConnected ? 1 : 0)}</span>
            <span className="text-[#00A389] font-semibold">Sub-10ms Push</span>
          </div>
        </div>
      </div>

      {/* Architectural Explanation & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pipeline Architecture Explanation */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#EBE5DF] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FAF7F4] text-[#FF6651] border border-[#EBE5DF]">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-[#1A1D20] tracking-tight">
              Asynchronous Buffer Pipeline
            </h3>
          </div>
          <p className="text-xs text-[#5F6773] leading-relaxed">
            When 2PC transfers, FX exchanges, or deposits finalize in PostgreSQL, post-transaction side effects
            are cleanly isolated from the synchronous ACID commit path:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#FAF7F4] border border-[#EBE5DF] rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1A1D20]">
                <span>1. Synchronous 2PC Commit</span>
                <span className="text-[#00A389] text-[10px] px-2 py-0.5 bg-[#E5F7F3] rounded-full">ACID Guaranteed</span>
              </div>
              <p className="text-[11px] text-[#5F6773] leading-relaxed">
                Ordered locks acquire accounts, validate balances, update balances, and write immutable GAAP ledger records.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7F4] border border-[#EBE5DF] rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1A1D20]">
                <span>2. Cache Eviction &amp; Enqueue</span>
                <span className="text-sky-700 text-[10px] px-2 py-0.5 bg-sky-50 rounded-full">Dual-Tier Evict</span>
              </div>
              <p className="text-[11px] text-[#5F6773] leading-relaxed">
                Sender &amp; receiver balance caches evicted in Redis &amp; local memory; <code className="text-[#1A1D20] font-mono">TransactionEvent</code> buffered.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7F4] border border-[#EBE5DF] rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1A1D20]">
                <span>3. Worker Drain &amp; WS Push</span>
                <span className="text-purple-700 text-[10px] px-2 py-0.5 bg-purple-50 rounded-full">Zero Wait</span>
              </div>
              <p className="text-[11px] text-[#5F6773] leading-relaxed">
                Background thread worker pulls events, dispatches notifications, and pushes real-time WebSocket frames to browser.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Stream Terminal */}
        <div className="lg:col-span-7 bg-[#1A1D20] text-neutral-200 p-6 sm:p-7 rounded-3xl shadow-md border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A389] animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live WebSocket Transaction Stream
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {eventStream.length} Events Captured
              </span>
            </div>

            {eventStream.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs font-mono space-y-2">
                <Radio className="w-8 h-8 mx-auto opacity-30 text-[#00A389] animate-pulse" />
                <p>Waiting for live transaction events...</p>
                <p className="text-[11px] text-neutral-600">
                  Execute a Send Money transfer, Deposit, or FX exchange to see live WebSocket push frames appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {eventStream.map((evt) => (
                  <div
                    key={evt.eventId || Math.random()}
                    className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl font-mono text-xs hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#00A389] font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        {evt.eventType}
                      </span>
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-300 mt-1">
                      <span>
                        Tx: <span className="text-white font-bold">{evt.transactionId}</span>
                      </span>
                      <span className="text-emerald-300 font-bold">
                        {evt.amount} {evt.currency}
                      </span>
                    </div>

                    {evt.description && (
                      <p className="text-[11px] text-neutral-400 mt-1 truncate">
                        {evt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800/80 mt-4 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A389]" />
              Endpoint: <code className="text-neutral-300">/ws/wallet</code>
            </span>
            <span>Channel: <code className="text-neutral-300">transmoney:events</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};
