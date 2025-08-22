"use client";

import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-br from-green-100 via-green-50 to-green-200 overflow-hidden">
      
      {/* Floating Shapes */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-green-300 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-green-200 rounded-full opacity-40 animate-pulse-slow"></div>
      <div className="absolute top-1/3 -right-12 w-48 h-48 bg-green-100 rounded-full opacity-50 animate-pulse-slow"></div>

      {/* Heading */}
      <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-900 mb-4 sm:mb-6 drop-shadow-lg">
        Product Management System
      </h1>

      {/* Descriptive line */}
      <p className="relative z-10 text-base sm:text-lg md:text-xl text-green-800 mb-10 max-w-xl drop-shadow-sm">
        Choose your role below to proceed.
      </p>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
        {/* Admin Button */}
        <Button
          onClick={() => router.push("/admin")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center text-lg font-semibold shadow-2xl transition transform hover:scale-105 w-full sm:w-auto"
        >
          <Settings className="w-5 h-5" />
          Admin
        </Button>

        {/* Customer Button */}
        <Button
          onClick={() => router.push("/customer")}
          className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center text-lg font-semibold shadow-2xl transition transform hover:scale-105 w-full sm:w-auto"
        >
          <User className="w-5 h-5" />
          Customer
        </Button>
      </div>
    </div>
  );
}
