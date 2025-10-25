import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { Visibility, VisibilityOff, CheckCircle, TrendingUp, Shield, PieChart } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 1. FLOATING MONEY COMPONENT
const FloatingMoney = () => {
  const moneySymbols = ['💰', '💵', '💸', '💴', '💶', '💷'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -50,
            rotate: 0
          }}
          animate={{
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            rotate: 360,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          {moneySymbols[Math.floor(Math.random() * moneySymbols.length)]}
        </motion.div>
      ))}
    </div>
  );
};

// 2. PASSWORD STRENGTH INDICATOR
const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    if (!pass) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    
    if (strength <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { level: 2, text: 'Medium', color: 'bg-yellow-500' };
    return { level: 3, text: 'Strong', color: 'bg-green-500' };
  };
  
  const strength = getStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength.level ? strength.color : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength.level === 1 ? 'text-red-400' :
        strength.level === 2 ? 'text-yellow-400' : 'text-green-400'
      }`}>
        Password strength: {strength.text}
      </p>
    </div>
  );
};

// 3. SUCCESS ANIMATION
const SuccessAnimation = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-8 shadow-2xl"
    >
      <CheckCircle sx={{ fontSize: 80 }} className="text-white" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute mt-40 text-white text-2xl font-bold"
    >
      Login Successful!
    </motion.div>
  </motion.div>
);

// 4. TYPING ANIMATION
const TypingText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span className={className}>{displayText}</span>;
};

function LoginPage() {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShake(false);

    try {
      await login(username, password);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/google-login/", {
        credential: credentialResponse.credential,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Google login failed. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // 5. FEATURE HIGHLIGHTS
  const features = [
    { icon: <TrendingUp />, title: "Track Expenses", description: "Monitor every transaction" },
    { icon: <PieChart />, title: "Visual Analytics", description: "Beautiful charts & insights" },
    { icon: <Shield />, title: "Secure & Private", description: "Bank-level encryption" }
  ];

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Floating money animations */}
        <FloatingMoney />

        {/* Success animation overlay */}
        <AnimatePresence>
          {showSuccess && <SuccessAnimation />}
        </AnimatePresence>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Left: Login Form */}
        <div className="md:w-1/2 flex flex-col justify-center items-center md:items-end p-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`w-full max-w-md md:mr-12 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50 ${
              shake ? 'animate-shake' : ''
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-2">
                <TypingText 
                  text="Welcome to " 
                  className="text-white"
                />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Expetrack
                </span>
              </h2>
              <p className="text-gray-400">Sign in to manage your finances smartly</p>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>

              {/* Password with strength indicator */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
                Register here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right: Illustration & Features */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-8"
          >
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
            
            {/* Image with backdrop filter to blend */}
            <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30">
              <img
                src="/lady-monitor.png"
                alt="Expense tracking illustration"
                className="w-full max-w-md object-contain relative z-10 drop-shadow-2xl"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>

            {/* Floating stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-600/90 to-emerald-600/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-green-500/30"
            >
              <p className="text-xs text-green-200">Total Income</p>
              <p className="text-2xl font-bold text-white">Ksh 45,230</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-purple-500/30"
            >
              <p className="text-xs text-purple-200">Analytics</p>
              <p className="text-2xl font-bold text-white">Live Charts</p>
            </motion.div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 gap-4 w-full max-w-md"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="flex items-center gap-4 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-indigo-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Shake animation CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;