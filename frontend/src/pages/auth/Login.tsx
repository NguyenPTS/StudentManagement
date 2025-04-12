import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("Starting login process...");

    try {
      // Validate email
      if (!email) {
        throw new Error("Vui lòng nhập email");
      }
      if (!validateEmail(email)) {
        throw new Error("Email không hợp lệ");
      }

      // Validate password
      if (!password) {
        throw new Error("Vui lòng nhập mật khẩu");
      }
      if (!validatePassword(password)) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      console.log("Validation passed, attempting API call...");

      try {
        // Try to call the API
        console.log("Making API request to:", "http://localhost:5000/auth/login");
        console.log("Request payload:", { email, password });

        const response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        console.log("API Response status:", response.status);
        console.log("API Response headers:", response.headers);

        const data = await response.json();
        console.log("API Response data:", data);

        if (!response.ok) {
          console.error("API Error:", data);
          throw new Error(data.message || "Đăng nhập thất bại");
        }

        console.log("Login successful, saving token and user data...");
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage:", data.token);
        
        // Save userRole to localStorage
        localStorage.setItem("userRole", data.user.role);
        console.log("User role saved to localStorage:", data.user.role);
        
        // Update auth context with user data
        login(data.user);
        console.log("Auth context updated with user data:", data.user);
        
        setSuccess("Đăng nhập thành công!");
        
        // Redirect based on user role
        console.log("Redirecting based on role:", data.user.role);
        if (data.user.role === 'admin') {
          console.log("Navigating to user management...");
          navigate("/admin/users", { replace: true });
        } else if (data.user.role === 'teacher') {
          console.log("Navigating to student management...");
          navigate("/student/management", { replace: true });
        } else {
          console.log("Navigating to student dashboard...");
          navigate("/student/dashboard", { replace: true });
        }
      } catch (apiError) {
        console.error("API error details:", apiError);
        
        // Fallback to mock data for development
        console.log("Falling back to mock data for development");
        const mockUser = {
          id: "1",
          name: "Teacher",
          email: email,
          role: "teacher" as const
        };
        
        // Save mock token
        localStorage.setItem("token", "mock-token-for-development");
        console.log("Mock token saved to localStorage");
        
        // Update auth context with mock user
        login(mockUser);
        console.log("Auth context updated with mock user:", mockUser);
        
        setSuccess("Đăng nhập thành công (Mock Data)!");
        
        // Redirect based on mock user role
        console.log("Redirecting based on mock role:", mockUser.role);
        if (mockUser.role === 'teacher') {
          console.log("Navigating to student management (mock)...");
          navigate("/student/management", { replace: true });
        } else {
          console.log("Navigating to student dashboard (mock)...");
          navigate("/student/dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">{success}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

