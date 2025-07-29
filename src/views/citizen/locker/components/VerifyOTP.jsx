import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CORRECT_OTP = "123456";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const onChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length <= 6) {
      setOtp(v);
      setError("");
    }
  };

  const verify = async () => {
    if (otp.length !== 6) {
      setError("Enter 6 digits");
      return;
    }
    setLoading(true);
    if (otp === CORRECT_OTP) {
      navigate("/Locker/my-locker");
    } else {
      setError("Invalid OTP");
    }
    setLoading(false);
  };

  const resend = async () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(60);
    setOtp("");
    setError("");
  };

  return (
    <div className="flex mt-20 me-10 h-96 w-full items-center justify-center bg-lightPrimary  dark:bg-navy-900">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl dark:bg-navy-800">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
          Verify OTP
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Enter the 6-digit code we sent you
        </p>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={onChange}
          placeholder="______"
          className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-2xl tracking-[0.6em] text-navy-700 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-700 dark:text-white"
          disabled={loading}
        />

        {error && <div className="mt-3 text-sm text-red-500">{error}</div>}

        <button
          onClick={verify}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-4 flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
          {secondsLeft > 0 ? (
            <span>Resend in {secondsLeft}s</span>
          ) : (
            <button onClick={resend} className="text-brand-500 hover:underline">
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
