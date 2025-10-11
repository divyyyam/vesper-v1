"use client";
import React from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "../ui/button";
const Hero = () => {
   
  const router = useRouter()
  return (
    <div className="relative h-screen w-full bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="text-center max-w-4xl">
          {/* Top label - close to main text */}
          {/* <div className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm rounded-full border border-gray-700 mb-6 hover:cursor-pointer">
            <span onClick={()=>{router.push("/vesper-ai")}} >Vesper AI</span>
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div> */}

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="text-blue-700 italic">Legal Ally</span> in the
            Digital Age
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Simplify complex legal documents with AI-powered summaries, and
            <br />
            book verified lawyers in minutes —all on a secure Web2 and
            <br />
            blockchain-enabled platform. Whether you're an individual or a
            <br />
            business, navigate legal challenges with confidence and clarity.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button onClick={()=>{router.push("/login")}} className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 hover:cursor-pointer">
              Get Started
            </Button>
            <Button onClick={()=>router.push("/vesper-ai")}className="px-8 py-3 text-white bg-black font-semibold transition-colors duration-200 hover:cursor-pointer hover:bg-black hover:text-white">
               Vesper AI
            </Button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Hero;
