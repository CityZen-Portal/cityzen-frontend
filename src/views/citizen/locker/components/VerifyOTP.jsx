import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { set } from "date-fns";

const url = "https://auth-backend-2-k3ph.onrender.com";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("      ");
  const [loading, setLoading] = useState(false);
  const [generatingOtp, setGeneratingOtp] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const onChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 6) {
      setOtp(digits);
      setError("");
    }
  };

  const generateOtp = async () => {
    if (!userEmail) {
      setError("Invalid user email");
      return;
    }
    try {
      setGeneratingOtp(true);
      await axios.post(
        `${url}/api/auth/generate-otp`,
        { email: userEmail },
        { headers: { token } }
      );
      setSecondsLeft(60);
      setOtpSent(true);
      setOtp("");
      setError("");
    } catch {
      setError("Failed to generate OTP");
    } finally {
      setGeneratingOtp(false);
    }
  };

  const verify = async () => {
    if (otp.length !== 6) {
      console.log(otp.length);
      setError("Enter a 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/auth/validate-otp`,
        { email: userEmail, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        navigate("/citizen/locker/my-locker");
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      if (err.response.data.status === 400) {
        setError("Invalid OTP");
      } else {
        setError("Verification Failed, Please Try Again");
        console.log(err);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-white px-6 py-10 text-gray-800 dark:bg-navy-900 dark:text-white">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Advertise it Locker
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Your trusted platform to securely verify and manage your documents.
        </p>
      </section>

      {/* OTP Section */}
      <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 rounded-3xl border border-gray-200 bg-gray-50 px-10 py-12 shadow-md dark:border-white/10 dark:bg-navy-800 md:flex-row md:gap-20">
        <div className="flex-1">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Secure OTP Verification
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            A time-sensitive OTP sent to your registered email ensures that only
            you can access your locker. Secure and seamless.
          </p>
          <ul className="mb-8 list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-400">
            <li>Instant delivery to email</li>
            <li>Auto-expiry for security</li>
            <li>Cross-device verification</li>
          </ul>

          {!otpSent && (
            <button
              onClick={generateOtp}
              disabled={generatingOtp}
              className="mb-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-medium text-white transition hover:bg-brand-600 disabled:opacity-60 dark:bg-brand-400 dark:hover:bg-brand-300"
            >
              {generatingOtp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                </>
              ) : (
                "Generate OTP"
              )}
            </button>
          )}

          {/* OTP Input + Verify Button */}
          {otpSent && (
            <>
              <div className="mx-auto mb-6 flex w-full max-w-xs justify-between gap-2 sm:gap-3">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, "");
                        if (!val) return;

                        const otpArray = otp.split("");
                        otpArray[index] = val;
                        const newOtp = otpArray.join("");
                        setOtp(newOtp);

                        const nextInput = document.getElementById(
                          `otp-input-${index + 1}`
                        );
                        if (nextInput) nextInput.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          const otpArray = otp.split("");
                          otpArray[index] = "";
                          setOtp(otpArray.join(""));

                          if (!otp[index] && index > 0) {
                            const prevInput = document.getElementById(
                              `otp-input-${index - 1}`
                            );
                            if (prevInput) prevInput.focus();
                          }
                        }
                      }}
                      id={`otp-input-${index}`}
                      className="h-12 w-10 rounded-md border border-gray-300 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/20 dark:bg-navy-700 dark:text-white sm:h-14 sm:w-12"
                    />
                  ))}
              </div>
              {/* Resend countdown or error */}
              <div className="text-md my-4  text-center text-red-500 dark:text-red-400">
                {error}
              </div>

              <button
                onClick={() => {
                  if (otp.length !== 6) {
                    alert("Please enter all 6 digits of the OTP");
                    return;
                  }
                  verify();
                }}
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 px-6 py-3 font-medium text-white transition hover:bg-brand-600 disabled:opacity-60 dark:bg-brand-400 dark:hover:bg-brand-300"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </>
          )}

          {otpSent && secondsLeft > 0 && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You can resend OTP in {secondsLeft}s
            </div>
          )}
        </div>

        {/* Right side image */}
        <div className="flex-1">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
            alt="OTP Verification"
            className="mx-auto w-full max-w-xs rounded-xl bg-white/80 p-3 shadow-md dark:bg-navy-700 md:max-w-sm"
          />
        </div>
      </section>
    </div>
  );
}
