import { useState } from 'react';
import { ArrowLeft, KeyRound, LogIn, ShieldCheck, UserRound } from 'lucide-react';

export default function AdminLogin({ onLogin, onBack }) {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const canSubmit = staffId.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setError('Enter a staff ID and password to continue.');
      return;
    }

    setError('');
    onLogin({
      name: staffId.trim(),
      role: 'Hospital Nurse',
    });
  };

  return (
    <div className="min-h-screen bg-[#eef6ff] px-4 py-6 text-[#0d2545]">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[18px] bg-white shadow-[0_22px_50px_rgba(15,35,63,0.16)] md:grid-cols-[0.95fr_1.05fr]">
          <section className="flex flex-col justify-between bg-[#123b70] p-8 text-white">
            <button
              type="button"
              onClick={onBack}
              className="flex w-fit items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              <ArrowLeft className="h-4 w-4" />
              Patient kiosk
            </button>

            <div className="my-12">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white/12">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold leading-tight">Hospital Nurse Portal</h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                Find patients, record vitals, and prepare clinical intake for the doctor.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-blue-50">
              Demo mode is active while the backend is not connected. Any nurse ID and password will open the dashboard.
            </div>
          </section>

          <section className="p-8 md:p-10">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">Nurse access</p>
              <h2 className="mt-2 text-2xl font-bold text-[#123b70]">Sign in to continue</h2>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Nurse ID</span>
                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                  <UserRound className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={staffId}
                    onChange={(event) => setStaffId(event.target.value)}
                    placeholder="e.g. nurse"
                    className="h-full min-h-0 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                  <KeyRound className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    className="h-full min-h-0 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173968] text-sm font-bold text-white transition hover:bg-[#214b82] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <LogIn className="h-5 w-5" />
                Open Dashboard
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
