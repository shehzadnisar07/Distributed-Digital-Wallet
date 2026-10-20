import React, { useState } from 'react';
import {
  ChevronDown,
  LogOut,
  Plus,
  Scale,
  Send,
  Store,
  Users,
  ArrowRightLeft,
  Wallet,
  Terminal,
} from 'lucide-react';
import type { Account, SystemHealth, User } from '../types';

export type AppTab =
  | 'landing'
  | 'console'
  | 'transfer'
  | 'merchant'
  | 'ledger'
  | 'exchange'
  | 'core'
  | 'system'
  | 'simulator'
  | 'architecture';

interface HeaderProps {
  health: SystemHealth | null;
  currentUser: User | null;
  userAccounts: Account[];
  activeAccountId: number | null;
  onSelectAccount: (id: number) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenCreateAccount: () => void;
  onLogout: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  currentUser,
  userAccounts,
  activeAccountId,
  onSelectAccount,
  onOpenAuth,
  onOpenCreateAccount,
  onLogout,
  activeTab,
  setActiveTab,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isHealthy = health?.database?.includes('Connected');

  const activeAccount = userAccounts.find((a) => a.id === activeAccountId) || userAccounts[0];

  // Clean raw database test hashes like 'Muhammad Ashrafz 979fab2f' into clean 'Muhammad Ashrafz'
  const cleanUserName = (name: string | undefined) => {
    if (!name) return 'Personal Account';
    return name.replace(/\s+[a-f0-9]{8}$/i, '').trim();
  };

  const displayName = cleanUserName(currentUser?.fullName);
  const firstName = displayName.split(' ')[0] || displayName;

  return (
    <header className="bg-[#FAF7F4]/95 backdrop-blur-md border-b border-[#EBE5DF] sticky top-0 z-40 h-16 font-sans">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('console')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#EBE5DF] flex items-center justify-center relative shadow-xs group-hover:border-[#FF6651]/40 transition">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#00A389] absolute top-0.5 left-0.5 opacity-90 group-hover:scale-105 transition-transform" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF6651] absolute bottom-0.5 right-0.5 opacity-90 group-hover:scale-105 transition-transform" />
                <div className="relative z-10 w-3.5 h-3.5 rounded-xs bg-white/70 backdrop-blur-xs flex items-center justify-center text-[9px] font-black text-[#1A1D20]">
                  T
                </div>
              </div>
            </div>
            <span className="font-black text-lg tracking-tight text-[#1A1D20]">
              TransMoney
            </span>
          </div>
        </div>

        {/* Center: Clean Segmented Pill Navigation */}
        <nav className="hidden md:flex items-center p-1 bg-white/80 rounded-full border border-[#EBE5DF] shadow-2xs gap-0.5 text-xs">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'console'
                ? 'bg-[#1A1D20] text-white font-bold shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-black/5 font-semibold'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transfer'
                ? 'bg-[#1A1D20] text-white font-bold shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-black/5 font-semibold'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>

          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'exchange'
                ? 'bg-[#1A1D20] text-white font-bold shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-black/5 font-semibold'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Exchange</span>
          </button>

          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'merchant'
                ? 'bg-[#1A1D20] text-white font-bold shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-black/5 font-semibold'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Merchants</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-[#1A1D20] text-white font-bold shadow-xs'
                : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-black/5 font-semibold'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Activity</span>
          </button>
        </nav>

        {/* Right: Consolidated Tools & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Core Banking + Live Pulse in a single neat pill */}
          <button
            onClick={() => setActiveTab('core')}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'core'
                ? 'bg-[#1A1D20] text-white border-[#1A1D20] shadow-xs'
                : 'bg-white hover:bg-[#FAF7F4] text-[#1A1D20] border-[#EBE5DF] shadow-2xs'
            }`}
            title="Open Core Banking & Distributed Infrastructure"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-[#00A389] animate-pulse' : 'bg-rose-500'
              }`}
            />
            <Terminal className="w-3.5 h-3.5 text-[#FF6651]" />
            <span>Core Banking</span>
          </button>

          {/* User Profile Pill / Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 sm:pl-1 sm:pr-3 sm:py-1 rounded-full border border-[#EBE5DF] bg-white hover:border-[#FF6651]/40 text-xs transition cursor-pointer shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF6651] to-[#FF8573] text-white text-xs flex items-center justify-center font-black shadow-xs">
                  {displayName.charAt(0)}
                </div>
                <span className="font-bold text-[#1A1D20] hidden sm:block truncate max-w-[100px]">
                  {firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5F6773] hidden sm:block" />
              </button>

              {/* Session Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-[#EBE5DF] bg-white p-3 shadow-xl z-50 font-sans space-y-2 animate-in fade-in slide-in-from-top-1 text-[#1A1D20]">
                  <div className="p-2.5 bg-[#FAF7F4] rounded-2xl border border-[#EBE5DF]">
                    <span className="text-[10px] uppercase font-bold text-[#5F6773] block tracking-wider">
                      Signed In As
                    </span>
                    <span className="text-xs font-black text-[#1A1D20] block truncate">{displayName}</span>
                    <span className="text-[11px] text-[#5F6773] truncate block">{currentUser.email}</span>
                    {activeAccount && (
                      <div className="mt-1 pt-1 border-t border-[#EBE5DF] flex items-center justify-between text-[11px]">
                        <span className="text-[#5F6773]">Balance:</span>
                        <span className="font-bold text-[#00A389]">
                          {Number(activeAccount.balance).toLocaleString()} {activeAccount.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  {userAccounts.length > 0 && (
                    <div className="py-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#5F6773] px-2 block mb-1">
                        Your Accounts ({userAccounts.length})
                      </span>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {userAccounts.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => {
                              onSelectAccount(acc.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition cursor-pointer border ${
                              acc.id === activeAccountId
                                ? 'bg-[#FFEAE5] text-[#FF6651] font-bold border-[#FF6651]/30'
                                : 'bg-[#FAF7F4] text-[#1A1D20] border-[#EBE5DF] hover:bg-white'
                            }`}
                          >
                            <span className="truncate font-mono">{acc.accountNumber}</span>
                            <span className="shrink-0 text-[11px] ml-1 font-bold">
                              {Number(acc.balance).toLocaleString()} {acc.currency}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-[#F2ECE5] space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenCreateAccount();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-[#1A1D20] hover:bg-[#FAF7F4] flex items-center gap-2 transition cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#00A389]" />
                      <span>Open Currency Account</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAuth('signin');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-[#1A1D20] hover:bg-[#FAF7F4] flex items-center gap-2 transition cursor-pointer font-medium"
                    >
                      <Users className="w-3.5 h-3.5 text-[#FF6651]" />
                      <span>Switch Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-1.5 rounded-full border border-[#EBE5DF] text-xs font-bold text-[#1A1D20] hover:bg-white transition cursor-pointer shadow-2xs"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 rounded-full bg-[#FF6651] hover:bg-[#E54D34] text-white font-bold text-xs transition cursor-pointer shadow-sm shadow-[#FF6651]/30"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
