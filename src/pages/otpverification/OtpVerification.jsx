"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/authApi.js";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otpId = location.state?.otpId;

  // Redirect if no otpId/email
  useEffect(() => {
    if (!email || !otpId) {
      toast.error("Please register first");
      navigate("/signup");
    }
  }, [email, otpId, navigate]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(4 - newOtp.length).fill("")]);

    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs[nextIndex].current.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter complete 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await verifyOtp({ otpId, otp: otpValue });

      if (res.data?.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        setIsLoading(false);
        return;
      }

      toast.success("Registration successful! Please login");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "OTP verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await resendOtp({ otpId });

      if (res.data?.success === false) {
        toast.error(res.data.message);
        setIsLoading(false);
        return;
      }

      toast.success("OTP resent successfully");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      inputRefs[0].current.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-[#2B85FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-sm text-gray-600">
              We've sent a 4-digit code to <br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#2B85FF] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2B85FF] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#2B85FF] font-semibold text-sm hover:underline disabled:text-gray-400"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend in <span className="font-semibold text-[#2B85FF]">{resendTimer}s</span>
                </p>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button onClick={() => navigate("/signup")} className="w-full text-sm text-gray-600 hover:text-gray-800">
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
