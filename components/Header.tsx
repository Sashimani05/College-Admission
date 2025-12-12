
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          College Admission Coach AI
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        Your personal guide to navigating the path to higher education. Enter a college to begin.
      </p>
    </header>
  );
};

export default Header;
