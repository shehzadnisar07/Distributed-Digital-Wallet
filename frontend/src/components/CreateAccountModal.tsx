import React, { useState } from 'react';
import { X, Globe, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { createAccount } from '../api/client';
import type { Account, ShardType, User } from '../types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAccountCreated: (account: Account) => void;
}

const SHARD_OPTIONS: { value: ShardType; label: string; desc: string }[] = [
  { value: 'SHARD_1_US', label: 'Shard 1 (US / North America)', desc: 'USD Cluster • AWS us-east-1' },
  { value: 'SHARD_2_UK', label: 'Shard 2 (UK / Europe)', desc: 'EUR/GBP Cluster • AWS eu-west-2' },
  { value: 'SHARD_3_SG', label: 'Shard 3 (Singapore / APAC)', desc: 'APAC Multi-Currency • AWS ap-southeast-1' },
  { value: 'SHARD_4_UAE', label: 'Shard 4 (UAE / Middle East)', desc: 'AED Regional Cluster • AWS me-central-1' },
  { value: 'SHARD_1_NORTH', label: 'Shard 1 (North / PK)', desc: 'Islamabad / KPK Cluster' },
  { value: 'SHARD_2_CENTRAL', label: 'Shard 2 (Central / PK)', desc: 'Lahore / Punjab Cluster' },
  { value: 'SHARD_3_SOUTH', label: 'Shard 3 (South / PK)', desc: 'Karachi / Coastal Cluster' },
  { value: 'SHARD_4_ENTERPRISE', label: 'Shard 4 (Enterprise)', desc: 'Corporate / B2B Cluster' },
];

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAccountCreated,
}) => {
  const [currency, setCurrency] = useState('USD');
  const [shard, setShard] = useState<ShardType>('SHARD_1_US');
  const [accountNumber, setAccountNumber] = useState(
    `ACC-${currentUser?.fullName?.split(' ')[0]?.toUpperCase() || 'USR'}-${currency}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [initialBalance, setInitialBalance] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const handleCurrencyChange = (newCurr: string) => {
    setCurrency(newCurr);
    const prefix = currentUser?.fullName?.split(' ')[0]?.toUpperCase() || 'USR';
    setAccountNumber(`ACC-${prefix}-${newCurr}-${Math.floor(100 + Math.random() * 900)}`);
    if (newCurr === 'USD') setShard('SHARD_1_US');
    else if (newCurr === 'EUR' || newCurr === 'GBP') setShard('SHARD_2_UK');
    else if (newCurr === 'AED') setShard('SHARD_4_UAE');
    else if (newCurr === 'PKR') setShard('SHARD_2_CENTRAL');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const newAcc = await createAccount({
        userId: currentUser.id,
        accountNumber: accountNumber.trim().toUpperCase(),
        currency: currency.toUpperCase(),
        initialBalance: Number(initialBalance) || 0,
        shard,
      });

      onAccountCreated(newAcc);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create account.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="bg-white border border-[#EBE5DF] rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden text-[#1A1D20] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#F2ECE5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F7F3] text-[#00A389] border border-[#00A389]/25 flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1D20] tracking-tight">
                Open Multi-Currency Account
              </h3>
              <p className="text-xs text-[#5F6773]">
                Account Owner: <strong className="text-[#1A1D20]">{currentUser.fullName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF7F4] hover:bg-[#F2ECE5] text-[#5F6773] hover:text-[#1A1D20] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-[#FFEAE5] border border-[#FF6651]/20 text-xs text-[#FF6651] font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Currency Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1.5">
              Account Currency Portfolio *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CURRENCY_OPTIONS.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-0.5 ${
                    currency === c.code
                      ? 'border-[#1A1D20] bg-[#1A1D20] text-white shadow-xs'
                      : 'border-[#EBE5DF] bg-[#FAF7F4] hover:bg-white text-[#1A1D20]'
                  }`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-xs font-black">{c.code}</span>
                  <span className={`text-[10px] ${currency === c.code ? 'text-white/70' : 'text-[#5F6773]'}`}>
                    {c.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Identifier & Initial Deposit (2-column grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1">
                Account Number (IBAN / ID) *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-1">
                Initial Deposit ({currency}) *
              </label>
              <input
                type="number"
                min="0"
                step="10"
                required
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs font-mono font-bold focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Shard Selection (Clean Dropdown - Eliminates Awkward Scrollbar) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773]">
                Regional Shard Routing Node *
              </label>
              <span className="text-[10px] text-[#00A389] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Auto-routed by Currency</span>
              </span>
            </div>
            <select
              value={shard}
              onChange={(e) => setShard(e.target.value as ShardType)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-xs font-bold text-[#1A1D20] focus:outline-none focus:border-[#FF6651] focus:bg-white transition cursor-pointer"
            >
              {SHARD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-full bg-[#FF6651] hover:bg-[#E54D34] active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FF6651]/25 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Provisioning Shard Account...</span>
                </>
              ) : (
                <>
                  <span>Open {currency} Sharded Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
