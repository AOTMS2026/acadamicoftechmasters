import { Phone, Mail, LogIn, UserPlus, User } from "lucide-react";
import { FaInstagram, FaYoutube, FaLinkedin, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

interface TopNavbarProps {
    isScrolled: boolean;
    setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
    setShowAuthModal: (show: boolean) => void;
}

export const TopNavbar = ({ isScrolled, setAuthMode, setShowAuthModal }: TopNavbarProps) => {
    const { user, token } = useAuthStore();
    const isLoggedIn = !!token;
    const { items } = useCartStore();
    const cartItemCount = items.length;

    return (
        <div
            className={`bg-[#0066CC] text-white text-xs font-semibold border-b border-primary-foreground/10 relative z-50 transition-all duration-500 ease-in-out overflow-hidden max-h-[52px] opacity-100`}
        >
            <div className="py-1 md:py-0">
                <div className="container mx-auto px-4 h-8 md:h-9 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-6">
                        <a href="tel:+918019952233" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                            <Phone className="w-3 h-3" />
                            <span className="text-[10px] md:text-sm font-bold">8019952233</span>
                        </a>
                        <a href="mailto:Info@aotms.in" className="hidden sm:flex items-center gap-1.5 hover:text-accent transition-colors">
                            <Mail className="w-3 h-3" />
                            <span>Info@aotms.in</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Social Links */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/academyoftechmasters?igsh=enZ5YjYwOXg1cW80&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:brightness-110 hover:scale-110 transition-all shadow-sm border border-white"
                                aria-label="Instagram"
                                title="Instagram"
                            >
                                <FaInstagram className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </a>

                            {/* YouTube */}
                            <a
                                href="https://youtube.com/@aotms?si=mj3-j_JH4lHC3zeF"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:bg-[#CC0000] hover:scale-110 transition-all shadow-sm border border-white"
                                aria-label="YouTube"
                                title="YouTube"
                            >
                                <FaYoutube className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/in/academy-of-tech-masters-aotms-82274537a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white bg-[#0077B5] hover:bg-[#005582] hover:scale-110 transition-all shadow-sm border border-white"
                                aria-label="LinkedIn"
                                title="LinkedIn"
                            >
                                <FaLinkedin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </a>
                        </div>

                        {/* Premium LMS Portal Button */}
                        <a href="https://www.aotms.com/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:scale-105 active:scale-95 uppercase tracking-widest font-extrabold text-[9px] md:text-[10px] transition-all bg-white text-[#0066CC] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out transition-transform z-0 skew-x-12"></div>
                            <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ring-2 ring-green-500/30"></span>
                            <span className="relative z-10">Access LMS Portal</span>
                        </a>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-3 bg-white/60"></div>

                        {!isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setAuthMode('login')} className="flex items-center gap-1.5 hover:text-accent uppercase tracking-wider font-bold text-[9px] md:text-[10px] transition-colors">
                                    <LogIn className="w-3 h-3" />
                                    Sign In
                                </button>
                                <span className="text-white/30">|</span>
                                <button type="button" onClick={() => setAuthMode('register')} className="flex items-center gap-1.5 hover:text-accent uppercase tracking-wider font-bold text-[9px] md:text-[10px] transition-colors">
                                    <UserPlus className="w-3 h-3" />
                                    Register
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/cart" className="hidden md:flex items-center gap-1.5 hover:text-accent uppercase tracking-wider font-bold text-xs transition-colors">
                                    <FaBook className="w-3 h-3" />
                                    <span><span className="lg:hidden">Enroll Cart</span><span className="hidden lg:inline">Enroll Cart</span> ({cartItemCount})</span>
                                </Link>
                                <div className="hidden md:block w-px h-3 bg-white/60"></div>
                                <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-white/10 shrink-0">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <User className="w-3 h-3 text-white" strokeWidth={3} />
                                        )}
                                    </div>
                                    <span className="uppercase tracking-wider font-bold text-xs"><span className="lg:hidden">Profile</span><span className="hidden lg:inline">My Profile</span></span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
