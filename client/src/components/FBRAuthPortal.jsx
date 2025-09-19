import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";

const FBRAuthPortal = ({ isLogin = true }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-red-800 to-blue-300 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-900 text-white p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {isLogin ? (
              <Shield className="h-10 w-10 text-white" />
            ) : (
              <CheckCircle className="h-10 w-10 text-white" />
            )}
            <h1 className="text-2xl font-bold">
              {isLogin ? "Login to Your Account" : "Sign Up to Your Account"}
            </h1>
          </div>
          <p className="text-blue-100">Secure Access Portal</p>
        </div>

        {/* Form Section */}
        {isLogin ? <SignIn /> : <SignUp />}

        {/* Footer Section */}
        <div className="bg-gray-100 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-600">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FBRAuthPortal;
