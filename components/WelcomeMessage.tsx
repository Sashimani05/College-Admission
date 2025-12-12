
import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white">Welcome, Future Scholar!</h2>
      <p className="mt-2 text-gray-300">
        Finding the right college is a big step. Let's break it down together.
      </p>
      <p className="mt-4 text-gray-300">
        Enter the name of a college and your intended major to get instant, AI-powered insights on:
      </p>
      <ul className="mt-4 text-left inline-block space-y-2 text-gray-200">
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Admission Requirements (GPA, SAT/ACT)
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Costs & Available Scholarships
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Specialized Academic Tracks (Arts, Med, Engineering, etc.)
        </li>
      </ul>
    </div>
  );
};

export default WelcomeMessage;
