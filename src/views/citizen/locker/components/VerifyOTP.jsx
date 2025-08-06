import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// const url = "https://auth-backend-2-k3ph.onrender.com";
const url = "http://localhost:8080";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

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
    const response = await axios.post(
      `${url}/api/auth/validate-otp`,
      {
        email: userEmail,
        otp,
      },
      {
        headers: {
          token,
        },
      }
    );
    if (response.data.status === 200) {
      setShowVerifyModal(false);
      navigate("/citizen/locker/my-locker");
    } else {
      setError("Invalid OTP");
    }
    setLoading(false);
  };

  const resend = async () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(60);
    await axios.post(
      `${url}/api/auth/generate-otp`,
      {
        email: userEmail,
      },
      {
        headers: {
          token,
        },
      }
    );
    setOtp("");
    setError("");
  };

  const generateOtp = async () => {
    if (!userEmail) {
      setError("INVALID USER EMAIL");
      return;
    }
    try {
      await axios.post(
        `${url}/api/auth/generate-otp`,
        { email: userEmail },
        {
          headers: {
            token,
          },
        }
      );
      setSecondsLeft(60);
      setShowVerifyModal(true);
      setOtp("");
      setError("");
    } catch (error) {
      setError("Failed to generate OTP");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-lightPrimary p-6 dark:bg-navy-900">
      {/* Attractive Page Intro */}
      <div className="mb-10 flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-gradient-to-r from-brand-500 to-blue-400 p-8 shadow-lg md:flex-row">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
          alt="OTP"
          className="h-24 w-24 rounded-xl bg-white/80 p-3 shadow"
        />
        <div>
          <h1 className="mb-2 text-4xl font-extrabold text-white drop-shadow">
            Welcome to Secure OTP Verification
          </h1>
          <p className="mb-2 text-lg text-white/90">
            Protecting your digital locker is our top priority. We use a secure
            One-Time Password (OTP) system to ensure only you can access your
            documents.
          </p>
          <ul className="mb-2 list-disc pl-5 text-base text-white/80">
            <li>Quick & easy verification process</li>
            <li>OTP sent instantly to your registered email</li>
            <li>Access your locker with confidence</li>
          </ul>
          <p className="text-base text-white/80">
            Need help? <span className="underline">Contact support</span>
          </p>
        </div>
      </div>

      {/* Generate OTP Section */}
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl dark:bg-navy-800">
        <h2 className="mb-4 text-xl font-semibold text-navy-700 dark:text-white">
          Generate OTP
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Click the button below to receive your OTP on your registered email.
          Enter the code to verify your identity and unlock your digital locker.
        </p>
        <button
          onClick={generateOtp}
          className="mb-2 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Generate OTP
        </button>
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </div>

      {/* Verify OTP Modal */}
      {showVerifyModal && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl dark:bg-navy-800">
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
              Verify OTP
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Enter the 6-digit code sent to your email
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
                <button
                  onClick={resend}
                  className="text-brand-500 hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
            <button
              onClick={() => setShowVerifyModal(false)}
              className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:bg-navy-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
