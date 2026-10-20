import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  X,
  Check,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { login, register } from '../api/client';
import type { Account, ShardType, User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users?: User[];
  accounts?: Account[];
  currentUser?: User | null;
  onSelectUser: (user: User) => void;
  onUserCreated: (newUser: User, newAccount: Account) => void;
  initialMode?: 'signin' | 'signup';
}

const WALLET_CHOICES: {
  currency: 'PKR' | 'USD' | 'GBP' | 'EUR';
  label: string;
  flag: string;
  shard: ShardType;
}[] = [
  {
    currency: 'PKR',
    label: 'PKR (Pakistani Rupee)',
    flag: '🇵🇰',
    shard: 'SHARD_3_SOUTH',
  },
  {
    currency: 'USD',
    label: 'USD (US Dollar)',
    flag: '🇺🇸',
    shard: 'SHARD_1_US',
  },
  {
    currency: 'GBP',
    label: 'GBP (British Pound)',
    flag: '🇬🇧',
    shard: 'SHARD_2_UK',
  },
  {
    currency: 'EUR',
    label: 'EUR (Euro SEPA)',
    flag: '🇪🇺',
    shard: 'SHARD_2_UK',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onUserCreated,
  initialMode = 'signin',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialMode);
  // Step 1: Details (Name, Gmail, Phone, Password, Currency)
  // Step 2: Gmail Verification (OTP)
  // Step 3: Success Confirmation Reveal
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState(() => currentUser?.email || '');
  const [signInPassword, setSignInPassword] = useState('');

  // Step 1 Registration state
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'PKR' | 'USD' | 'GBP' | 'EUR'>('PKR');

  // Step 2 Verification state
  const [otpCode, setOtpCode] = useState('849201');
  const [countdown, setCountdown] = useState(45);

  // Post-registration result for Step 3
  const [createdResult, setCreatedResult] = useState<{ user: User; account: Account } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setSignupStep(1);
      setErrorMsg(null);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    let timer: any;
    if (signupStep === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [signupStep, countdown]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const authRes = await login({
        email: signInEmail.trim().toLowerCase(),
        password: signInPassword,
      });

      onSelectUser(authRes.user);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to log in. Please check your email and password.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Validate all fields, then move to Gmail OTP verification
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address.');
      return;
    }
    if (!phoneRaw.trim() || phoneRaw.replace(/[^0-9]/g, '').length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setCountdown(45);
    setSignupStep(2);
  };

  // Step 2: Verify Gmail OTP and call backend register API
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      const choice = WALLET_CHOICES.find((w) => w.currency === selectedCurrency) || WALLET_CHOICES[0];
      const fullPhone = `${countryCode} ${phoneRaw.trim()}`;

      const authRes = await register({
        fullName: fullName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        password: signUpPassword,
        phoneNumber: fullPhone,
        shard: choice.shard,
        initialBalance: 0,
        currency: choice.currency,
      });

      const primaryAccount =
        authRes.accounts && authRes.accounts.length > 0
          ? authRes.accounts[0]
          : {
              id: 0,
              accountNumber: `ACC-${choice.currency}-001`,
              balance: 0,
              currency: choice.currency,
              shard: choice.shard,
              status: 'ACTIVE',
              version: 0,
              user: authRes.user,
            };

      setCreatedResult({ user: authRes.user, account: primaryAccount });
      setSignupStep(3);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Could not create account. Please check details and try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    if (createdResult) {
      onUserCreated(createdResult.user, createdResult.account);
    }
    onClose();
  };

  const handleTabChange = (nextTab: 'signin' | 'signup') => {
    setTab(nextTab);
    setErrorMsg(null);
    if (nextTab === 'signup' && signupStep === 3) {
      setSignupStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="bg-[#FFFFFF] border border-[#EBE5DF] rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden text-[#1A1D20] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#F2ECE5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F4] flex items-center justify-center relative shadow-xs border border-[#EBE5DF]">
              <span className="w-4 h-4 rounded-full bg-[#00A389] absolute top-1 left-1 opacity-90" />
              <span className="w-4 h-4 rounded-full bg-[#FF6651] absolute bottom-1 right-1 opacity-90" />
              <div className="relative z-10 w-4 h-4 rounded-sm bg-white/50 flex items-center justify-center text-[10px] font-black text-[#1A1D20]">
                T
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1A1D20] tracking-tight">
                TransMoney
              </h3>
              <p className="text-xs text-[#5F6773]">
                {tab === 'signin' ? 'Welcome back to your wallet' : 'Open your free account in 2 simple steps'}
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

        {/* Pill Tab Switch */}
        <div className="px-6 pt-4">
          <div className="p-1 bg-[#FAF7F4] rounded-full flex gap-1 border border-[#EBE5DF]">
            <button
              type="button"
              onClick={() => handleTabChange('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                tab === 'signin'
                  ? 'bg-white text-[#1A1D20] shadow-xs'
                  : 'text-[#5F6773] hover:text-[#1A1D20]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                tab === 'signup'
                  ? 'bg-white text-[#1A1D20] shadow-xs'
                  : 'text-[#5F6773] hover:text-[#1A1D20]'
              }`}
            >
              Open Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto space-y-3.5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-[#FFEAE5] border border-[#FF6651]/20 text-xs text-[#FF6651] font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ==============================================================
              TAB 1: LOG IN
             ============================================================== */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1A1D20] block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#00A389] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A1D20] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#00A389] focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-full bg-[#FF6651] hover:bg-[#E54D34] active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FF6651]/25 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Log In to Wallet</span>}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="text-xs font-bold text-[#00A389] hover:underline cursor-pointer"
                >
                  Don't have an account yet? Open one free &rarr;
                </button>
              </div>
            </form>
          )}

          {/* ==============================================================
              TAB 2: OPEN ACCOUNT (STREAMLINED 2-STEP FLOW)
             ============================================================== */}
          {tab === 'signup' && (
            <div className="space-y-4">
              
              {/* Stepper Progress Indicator */}
              {signupStep < 3 && (
                <div className="pb-1">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[11px] font-black text-[#1A1D20]">
                      Step {signupStep} of 2
                    </span>
                    <span className="text-[10px] font-bold text-[#00A389]">
                      {signupStep === 1 && 'Account Details'}
                      {signupStep === 2 && 'Gmail Verification'}
                    </span>
                  </div>

                  {/* 2 Step Bar */}
                  <div className="grid grid-cols-2 gap-2 h-1.5">
                    <div className={`rounded-full transition-all duration-300 ${signupStep >= 1 ? 'bg-[#FF6651]' : 'bg-[#EFE7DE]'}`} />
                    <div className={`rounded-full transition-all duration-300 ${signupStep >= 2 ? 'bg-[#FF6651]' : 'bg-[#EFE7DE]'}`} />
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------
                  STEP 1: All Inputs (Name, Gmail, Phone, Password, Currency)
                 -------------------------------------------------------- */}
              {signupStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-2.5">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-[#1A1D20]">
                      Create your TransMoney profile
                    </h4>
                    <p className="text-xs text-[#5F6773]">
                      All details are encrypted with bank-grade BCrypt cryptography.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-0.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Muhammad Ashraf"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Gmail / Email */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-0.5">
                      Gmail / Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-0.5">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-24 px-2 py-2 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs font-bold focus:outline-none focus:border-[#FF6651] focus:bg-white transition cursor-pointer"
                      >
                        <option value="+92">🇵🇰 +92</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="300 1234567"
                          value={phoneRaw}
                          onChange={(e) => setPhoneRaw(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs font-mono placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773] block mb-0.5">
                      Create Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-2.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-[#1A1D20] text-xs placeholder:text-[#5F6773]/60 focus:outline-none focus:border-[#FF6651] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Primary Wallet Currency Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6773]">
                        Primary Currency
                      </label>
                      <span className="text-[10px] text-[#00A389] font-bold">
                        Default: PKR
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {WALLET_CHOICES.map((choice) => {
                        const isSelected = selectedCurrency === choice.currency;
                        return (
                          <button
                            key={choice.currency}
                            type="button"
                            onClick={() => setSelectedCurrency(choice.currency)}
                            className={`p-2 rounded-2xl text-left border transition flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-[#1A1D20] text-white border-[#1A1D20] shadow-xs'
                                : 'bg-[#FAF7F4] hover:bg-white text-[#1A1D20] border-[#EBE5DF]'
                            }`}
                          >
                            <span className="text-base">{choice.flag}</span>
                            <div className="truncate">
                              <span className="text-xs font-black block truncate">
                                {choice.currency}
                              </span>
                              <span className={`text-[10px] block truncate ${isSelected ? 'text-white/70' : 'text-[#5F6773]'}`}>
                                {choice.currency === 'PKR' ? 'Pakistan Hub' : choice.currency === 'USD' ? 'US Hub' : 'Global Hub'}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#00A389]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-full bg-[#FF6651] hover:bg-[#E54D34] active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FF6651]/25 transition cursor-pointer mt-1"
                  >
                    <span>Continue to Gmail Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* --------------------------------------------------------
                  STEP 2: Gmail Verification (OTP)
                 -------------------------------------------------------- */}
              {signupStep === 2 && (
                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div className="text-center space-y-1.5 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFEAE5] border border-[#FF6651]/30 text-[#FF6651] flex items-center justify-center mx-auto shadow-xs">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black text-[#1A1D20]">
                      Verify your Gmail address
                    </h4>
                    <p className="text-xs text-[#5F6773] max-w-xs mx-auto">
                      We sent a 6-digit verification code to{' '}
                      <strong className="text-[#1A1D20] font-bold">{signUpEmail}</strong>
                    </p>
                  </div>

                  {/* Verification Code Box */}
                  <div className="p-4 bg-[#FAF7F4] rounded-3xl border border-[#EBE5DF] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1A1D20] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#FF6651]" />
                        <span>Enter 6-Digit Code</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode('849201')}
                        className="text-[11px] font-bold text-[#FF6651] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-fill Demo Code</span>
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="849201"
                        className="w-full text-center tracking-[0.5em] font-mono font-black text-xl py-3 rounded-2xl bg-white border border-[#EBE5DF] text-[#1A1D20] focus:outline-none focus:border-[#FF6651] shadow-xs"
                      />
                    </div>

                    <div className="text-center text-[11px] text-[#5F6773]">
                      Didn't get the code?{' '}
                      <button
                        type="button"
                        disabled={countdown > 0}
                        onClick={() => setCountdown(45)}
                        className={`font-bold ${countdown > 0 ? 'text-[#5F6773]/60' : 'text-[#FF6651] hover:underline cursor-pointer'}`}
                      >
                        Resend code {countdown > 0 ? `(${countdown}s)` : ''}
                      </button>
                    </div>
                  </div>

                  {/* Vertically Stacked Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-full bg-[#FF6651] hover:bg-[#E54D34] active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FF6651]/25 transition disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Provisioning Shard Wallet...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify &amp; Open Account</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="w-full py-2.5 px-4 rounded-full border border-[#EBE5DF] bg-[#FAF7F4] hover:bg-[#F2ECE5] text-[#5F6773] hover:text-[#1A1D20] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Account Details</span>
                    </button>
                  </div>
                </form>
              )}

              {/* --------------------------------------------------------
                  STEP 3: Celebration & Account Provisioning Reveal
                 -------------------------------------------------------- */}
              {signupStep === 3 && createdResult && (
                <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-[#E5F7F3] border-2 border-[#00A389] flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 text-[#00A389] stroke-[3]" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-[#1A1D20]">
                      Account Created Successfully!
                    </h4>
                    <p className="text-xs text-[#5F6773]">
                      Your multi-currency wallet account has been provisioned on PostgreSQL 17 shard.
                    </p>
                  </div>

                  {/* Account Summary Chip */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F4] border border-[#EBE5DF] text-left space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EBE5DF]">
                      <span className="text-[#5F6773]">Account Holder:</span>
                      <span className="font-black text-[#1A1D20]">{createdResult.user.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#EBE5DF]">
                      <span className="text-[#5F6773]">Account Number:</span>
                      <span className="font-mono font-bold text-[#FF6651]">{createdResult.account.accountNumber}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#EBE5DF]">
                      <span className="text-[#5F6773]">Primary Currency:</span>
                      <span className="font-bold text-[#1A1D20]">{createdResult.account.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5F6773]">Assigned Shard:</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E5F7F3] text-[#00A389] font-bold text-[10px]">
                        {createdResult.account.shard}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="w-full py-3.5 px-4 rounded-full bg-[#1A1D20] hover:bg-black active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
