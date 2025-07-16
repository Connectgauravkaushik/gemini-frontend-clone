import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PHONE SCHEMA 
const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select a country code"),
  phoneNumber: z
    .string()
    .min(7, "Too short")
    .max(15, "Too long")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
  
});

// PHONE SCHEMA 
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
});

export const FormComponent = () => {
  const [step, setStep] = useState("phone");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
  });


  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema), // Automatically infers the output type from the schema
  });

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=idd,name")
      .then((res) => {
        const list = res.data
          .map((c) => {
            const code = c.idd.root + (c.idd.suffixes?.[0] ?? "");
            const name = c.name.common;
            return { code, name };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(console.error);
  }, []);

  const handlePhoneSubmit = () => {
    setLoading(true);
    const fakeOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP sent:", fakeOTP);
    setGeneratedOTP(fakeOTP);

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.info(`OTP sent: ${fakeOTP}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }, 1500);
  };

  const handleOtpVerification = (data) => {
    if (data.otp === generatedOTP) {
      toast.success("OTP verified! 🎉", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
        setStep("phone");
      }, [2000]);
    } else {
      toast.error("Invalid OTP. Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className=" bg-black flex items-center justify-center px-4">
        <form
          onSubmit={
            step === "phone"
              ? handleSubmit(handlePhoneSubmit)
              : handleOtpSubmit(handleOtpVerification)
          }
          className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">
            {step === "phone"
              ? "Enter Your Phone Number"
              : `Enter OTP :  ${generatedOTP}`}
          </h2>

          {step === "phone" && (
            <>
              <div className="flex space-x-3">
                <select
                  {...register("countryCode")}
                  className="w-1/3 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Code
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} {c.code}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  {...register("phoneNumber")}
                  placeholder="Phone number"
                  className="w-2/3 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                />
              </div>

              {errors.countryCode && (
                <p className="text-red-500 text-sm">
                  {errors.countryCode.message}
                </p>
              )}
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-md font-semibold transition duration-200"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <input
                type="text"
                {...registerOtp("otp")}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2 text-center text-lg tracking-widest"
              />

              {otpErrors.otp && (
                <p className="text-red-500 text-sm">{otpErrors.otp.message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 rounded-md font-semibold transition duration-200"
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default FormComponent;
