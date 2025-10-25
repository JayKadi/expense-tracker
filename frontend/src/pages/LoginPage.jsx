import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Put your actual Google Client ID here
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function LoginPage() {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    console.log("=== GOOGLE LOGIN DEBUG ===");
    console.log("1. Full credentialResponse:", credentialResponse);
    console.log("2. Credential value:", credentialResponse.credential);

    try {
      const response = await api.post("/google-login/", {
       credential: credentialResponse.credential,
      });

      console.log("Backend response:", response.data);

      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Google login error:", err);
      console.log("Error response data:", err.response?.data);
      setError(err.response?.data?.error || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Login
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

           <div>
  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      aria-label="Toggle password visibility"
    >
      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
    </button>
  </div>
</div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
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

          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
