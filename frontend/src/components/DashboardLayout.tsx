import React, { useState } from 'react';
import {
  LayoutDashboard,
  Send,
  ArrowRightLeft,
  QrCode,
  FileText,
  Terminal,
  ExternalLink,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronDown,
  Database,
  Globe,
  ChevronRight,
} from 'lucide-react';
import type { Account, SystemHealth, User } from '../types';
import type { AppTab } from './Header';

interface DashboardLayoutProps {
  health: SystemHealth | null;
  currentUser: User | null;
  accounts: Account[];
  userAccounts: Account[];
  activeAccountId: number | null;
  onSelectAccount: (id: number) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenCreateAccount: () => void;
  onLogout: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  health,
  currentUser,
  userAccounts,
  activeAccountId,
  onSelectAccount,
  onOpenCreateAccount,
  onLogout,
  activeTab,
  setActiveTab,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const isHealthy = health?.database?.includes('Connected');
  const activeAccount = userAccounts.find((a) => a.id === activeAccountId) || userAccounts[0];

  const cleanUserName = (name: string | undefined) => {
    if (!name) return 'Personal Account';
    return name.replace(/\s+[a-f0-9]{8}$/i, '').trim();
  };

  const displayName = cleanUserName(currentUser?.fullName);
  const userInitial = displayName.charAt(0).toUpperCase();

  // Navigation Items
  const mainNavItems = [
    {
      tab: 'console' as AppTab,
      label: 'Wallet Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      tab: 'transfer' as AppTab,
      label: 'Send Money',
      icon: Send,
      badge: '2PC Fast',
    },
    {
      tab: 'exchange' as AppTab,
      label: 'FX Exchange',
      icon: ArrowRightLeft,
      badge: null,
    },
    {
      tab: 'merchant' as AppTab,
      label: 'Merchant QR Pay',
      icon: QrCode,
      badge: 'QR',
    },
    {
      tab: 'ledger' as AppTab,
      label: 'Ledger & Audit',
      icon: FileText,
      badge: null,
    },
  ];

  const getPageTitle = (tab: AppTab) => {
    switch (tab) {
      case 'console':
        return { title: 'Wallet Overview', desc: 'Real-time balances, analytics & recent transactions' };
      case 'transfer':
        return { title: 'Send Money', desc: 'Cross-shard instant payments backed by Two-Phase Commit' };
      case 'exchange':
        return { title: 'FX Currency Exchange', desc: 'Live market rates with atomic multi-currency conversion' };
      case 'merchant':
        return { title: 'Merchant Services & QR Pay', desc: 'Cryptographic POS invoices and instant checkout' };
      case 'ledger':
        return { title: 'Financial Ledger & Statements', desc: 'Zero-sum GAAP immutable audit trail and reconciliations' };
      case 'core':
        return { title: 'Core Banking Infrastructure', desc: 'Distributed PostgreSQL 17 cluster, Redis buffer & 2PC consensus' };
      default:
        return { title: 'Dashboard', desc: 'TransMoney Next-Gen Digital Wallet' };
    }
  };

  const currentMeta = getPageTitle(activeTab);

  const handleNavClick = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1A1D20] flex font-sans">
      {/* ========================================================
          MOBILE BACKDROP
         ======================================================== */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* ========================================================
          LEFT SIDEBAR (STICKY ON DESKTOP, DRAWER ON MOBILE)
         ======================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-[#EBE5DF] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 shadow-none'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand & Close on Mobile */}
          <div className="p-6 pb-4 border-b border-[#F2ECE5] flex items-center justify-between">
            <div
              onClick={() => handleNavClick('console')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] flex items-center justify-center relative shadow-xs group-hover:border-[#FF6651]/40 transition">
                <span className="w-4 h-4 rounded-full bg-[#00A389] absolute top-1 left-1 opacity-90 group-hover:scale-105 transition-transform" />
                <span className="w-4 h-4 rounded-full bg-[#FF6651] absolute bottom-1 right-1 opacity-90 group-hover:scale-105 transition-transform" />
                <div className="relative z-10 w-4 h-4 rounded-sm bg-white/70 backdrop-blur-xs flex items-center justify-center text-[10px] font-black text-[#1A1D20]">
                  T
                </div>
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-[#1A1D20] block leading-tight">
                  TransMoney
                </span>
                <span className="text-[10px] text-[#5F6773] font-mono block">
                  DDBMS v2.4 • Sharded Core
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-xl bg-[#FAF7F4] hover:bg-[#F2ECE5] text-[#5F6773] hover:text-[#1A1D20] lg:hidden transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Active Account Summary Card */}
            {activeAccount && (
              <div className="bg-[#FAF7F4] border border-[#EBE5DF] rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-[#5F6773] uppercase tracking-wider">
                    Active Wallet
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/20">
                    {activeAccount.currency}
                  </span>
                </div>

                {/* Account Switcher Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="w-full text-left p-2 rounded-xl bg-white border border-[#EBE5DF] hover:border-[#FF6651]/40 flex items-center justify-between transition cursor-pointer shadow-2xs"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-mono font-bold text-[#1A1D20] truncate">
                        {activeAccount.accountNumber}
                      </div>
                      <div className="text-xs font-black text-[#00A389] mt-0.5">
                        {Number(activeAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                        <span className="text-[10px] text-[#5F6773]">{activeAccount.currency}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#8C939E] shrink-0" />
                  </button>

                  {/* Dropdown Options */}
                  {accountDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EBE5DF] rounded-2xl shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                      <div className="text-[10px] font-bold text-[#8C939E] px-2.5 py-1 uppercase tracking-wider">
                        Your Accounts ({userAccounts.length})
                      </div>
                      {userAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            onSelectAccount(acc.id);
                            setAccountDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-between ${
                            acc.id === activeAccountId
                              ? 'bg-[#1A1D20] text-white font-bold'
                              : 'hover:bg-[#FAF7F4] text-[#1A1D20]'
                          }`}
                        >
                          <div className="truncate">
                            <span className="block truncate font-mono text-[11px]">{acc.accountNumber}</span>
                            <span className={`text-[10px] block ${acc.id === activeAccountId ? 'text-white/70' : 'text-[#5F6773]'}`}>
                              {acc.currency} • {Number(acc.balance).toLocaleString()}
                            </span>
                          </div>
                          {acc.id === activeAccountId && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] shrink-0" />
                          )}
                        </button>
                      ))}

                      <div className="pt-1 border-t border-[#F2ECE5]">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            onOpenCreateAccount();
                          }}
                          className="w-full p-2 text-left text-xs font-bold text-[#FF6651] hover:bg-[#FFEAE5] rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Open Another Currency Account</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Group 1: Main Banking */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C939E] px-3 mb-2">
                Personal Banking
              </div>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => handleNavClick(item.tab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1D20] text-white shadow-xs'
                        : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-[#FAF7F4]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#FF6651]' : 'text-[#8C939E]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FFEAE5] text-[#FF6651]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Group 2: DDBMS Engineering & Core Banking */}
            <div className="space-y-1 pt-2 border-t border-[#F2ECE5]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C939E] px-3 mb-2 flex items-center justify-between">
                <span>DDBMS Core</span>
                <span className="text-[9px] text-[#00A389] font-mono">Consensus</span>
              </div>

              {/* Core Banking Console */}
              <button
                type="button"
                onClick={() => handleNavClick('core')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'core'
                    ? 'bg-[#1A1D20] text-white shadow-xs'
                    : 'text-[#5F6773] hover:text-[#1A1D20] hover:bg-[#FAF7F4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Terminal
                    className={`w-4 h-4 transition-colors ${
                      activeTab === 'core' ? 'text-[#00A389]' : 'text-[#8C939E]'
                    }`}
                  />
                  <span>Core Banking Engine</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#00A389] animate-pulse shrink-0" />
              </button>

              {/* Swagger API Docs */}
              <a
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#5F6773] hover:text-[#1A1D20] hover:bg-[#FAF7F4] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-[#8C939E]" />
                  <span>REST API Specs</span>
                </div>
                <span className="text-[9px] font-mono text-[#8C939E]">v1.0</span>
              </a>

              {/* Public Overview / Landing Link */}
              <button
                type="button"
                onClick={() => handleNavClick('landing')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#5F6773] hover:text-[#1A1D20] hover:bg-[#FAF7F4] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#8C939E]" />
                  <span>Public Landing Page</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C939E]" />
              </button>
            </div>
          </div>

          {/* Sidebar Footer: User Profile & Logout */}
          <div className="p-4 border-t border-[#F2ECE5] bg-white space-y-3">
            {/* Cluster Status Pill */}
            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-[#5F6773]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#00A389]" />
                <span>Cluster Node</span>
              </span>
              <span className={`font-bold ${isHealthy ? 'text-[#00A389]' : 'text-[#FF6651]'}`}>
                {isHealthy ? 'PostgreSQL 17' : 'Offline'}
              </span>
            </div>

            {/* User Profile Pill */}
            <div className="p-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate pr-2">
                <div className="w-8 h-8 rounded-full bg-[#FF6651] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {userInitial}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#1A1D20] truncate">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-[#5F6773] truncate">
                    {currentUser?.email || 'Logged In'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8C939E] hover:text-rose-600 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================
          RIGHT MAIN CANVAS (TOP BAR + VIEW BODY)
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#EBE5DF] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#FAF7F4] hover:bg-[#F2ECE5] text-[#1A1D20] lg:hidden transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <h1 className="text-sm sm:text-base font-black text-[#1A1D20] tracking-tight">
                {currentMeta.title}
              </h1>
              <p className="text-[11px] text-[#5F6773] hidden sm:block">
                {currentMeta.desc}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Currency Badges */}
            <div className="hidden md:flex items-center gap-1.5">
              {userAccounts.slice(0, 3).map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onSelectAccount(acc.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition cursor-pointer ${
                    acc.id === activeAccountId
                      ? 'bg-[#1A1D20] text-white shadow-2xs'
                      : 'bg-[#FAF7F4] text-[#5F6773] hover:text-[#1A1D20] border border-[#EBE5DF]'
                  }`}
                >
                  <span>{acc.currency}</span>{' '}
                  <span className="opacity-80">
                    {Number(acc.balance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </button>
              ))}
            </div>

            {/* Open Account CTA */}
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6651] hover:bg-[#E54D34] active:scale-95 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Account</span>
            </button>

            {/* DB Health Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F4] border border-[#EBE5DF] text-[10px] font-bold">
              <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-[#00A389] animate-pulse' : 'bg-[#FF6651]'}`} />
              <span className="text-[#5F6773]">{isHealthy ? 'DB Connected' : 'Offline'}</span>
            </div>
          </div>
        </header>

        {/* View Canvas (Main Children) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* In-App Minimal Footer */}
        <footer className="border-t border-[#EBE5DF] bg-white py-4 px-6 text-center text-xs text-[#8C939E] font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-black text-[#1A1D20]">TransMoney</span>
              <span>•</span>
              <span>Distributed Database Systems (B22 Final Project)</span>
            </div>
            <div>
              Sir Umair Evaluation Portal • Regional Partitions Active
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
