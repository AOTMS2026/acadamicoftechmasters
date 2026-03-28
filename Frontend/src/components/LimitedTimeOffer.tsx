import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Sparkles,
  User,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "limited_offer_shown";

const LimitedTimeOffer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Hook to check current path

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const closeForever = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsVisible(false);
      return;
    }

    const openTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => {
      clearTimeout(openTimer);
    };
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbers = value.replace(/[^0-9]/g, "");
      if (numbers.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: numbers }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      formData.phone.length !== 10 ||
      !formData.course
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/leads`, {
        ...formData,
        phone: `+91${formData.phone}`,
        type: "limited-time-offer",
        source: "Popup 50% Off",
      });

      setIsSubmitted(true);
      // No need to set localStorage here, it's already set.

      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-[calc(100vw-32px)] md:max-w-[480px] w-full relative border border-white/20 max-h-[90vh] flex flex-col"
          >
            {/* Improved Header with Gradient and Pattern */}
            <div className="relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003D7A]"></div>
              <div className="absolute inset-0 bg-hex-pattern-blue opacity-10"></div>
              <div className="absolute inset-0 bg-scan-lines-blue opacity-5"></div>

              <div className="relative p-6 md:p-8 pb-8 md:pb-10 text-center text-white">
                <div className="absolute top-4 right-4 flex items-center">
                  <button
                    onClick={closeForever}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white transition-all transform hover:rotate-90 duration-300"
                    aria-label="Close offer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative inline-block"
                >
                  <Sparkles className="w-10 h-10 md:w-14 md:h-14 mx-auto text-yellow-400 mb-2 md:mb-3 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2 drop-shadow-sm font-['Plus_Jakarta_Sans']">
                  Get{" "}
                  <span className="text-yellow-400 font-extrabold">
                    50% OFF
                  </span>{" "}
                  Today
                </h2>
                <p className="text-blue-100/90 text-[13px] md:text-base font-medium max-w-[280px] mx-auto leading-relaxed px-4">
                  Register now to claim your exclusive discount on any course!
                </p>
              </div>

              {/* Decorative curve at the bottom of header */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-[2rem]"></div>
            </div>

            <div className="px-5 md:px-8 pb-8 md:pb-10 pt-4 bg-white overflow-y-auto scrollbar-hide">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Discount Unlocked!</h3>
                  <p className="text-slate-600">We’ll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="group">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                      Full Name
                    </label>
                    <div className="relative transition-all duration-300 transform group-focus-within:translate-x-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        name="name"
                        placeholder="Enter Your Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                      Email Address
                    </label>
                    <div className="relative transition-all duration-300 transform group-focus-within:translate-x-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter Your Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                      Mobile Number
                    </label>
                    <div className="relative transition-all duration-300 transform group-focus-within:translate-x-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="absolute inset-y-0 left-10 flex items-center pr-3 text-slate-400 font-semibold border-r border-slate-200 my-3 pr-2">
                        +91
                      </span>
                      <input
                        name="phone"
                        placeholder="Enter Your Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pl-[5.5rem] rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-medium uppercase"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                      Course of Interest
                    </label>
                    <div className="relative transition-all duration-300 transform group-focus-within:translate-x-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <input
                        name="course"
                        placeholder="e.g. Data Science, Web Dev..."
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#FD5A1A] to-[#FF8C00] h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl !mt-6 md:!mt-8 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group-hover:brightness-110"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing…</span>
                      </>
                    ) : (
                      <>
                        <span>Claim My 50%</span>
                        <span className="hidden xs:inline">Discount</span>
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LimitedTimeOffer;
