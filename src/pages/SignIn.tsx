import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/auth";
import { SessionContext } from "../SessionProvider";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(SessionContext) || {
    currentUser: null,
    setCurrentUser: () => {},
  };

  const signin = async () => {
    // Call the signin function from authRepository here
    try {
      setErrorMessage(""); // Clear any previous error
      const user = await authRepository.signin(email, password);
      console.log("User signed in:", user);

      // Update the session context with the signed-in user
      if (user && user.email) {
        setCurrentUser({
          id: user.id,
          email: user.email,
        });
        console.log("Current user set in context:", currentUser);
      }

      // Redirect to home page after successful signin
      navigate("/");
    } catch (error) {
      console.error("Signin error:", error);
      setErrorMessage("Sign-in error. Please check email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">SNS APP</h2>
        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Mail address
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    placeholder="Mail address"
                    required
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    type="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={signin}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
                  disabled={email === "" || password === ""}
                >
                  Log in
                </button>
              </div>
              {errorMessage && (
                <div className="text-red-600 text-base text-center">
                  {errorMessage}
                </div>
              )}
              <div className="mt-4 text-center text-sm">
                User registration:
                <Link className="underline" to={"/signup"}>
                  here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
