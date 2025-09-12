import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-neon/20 mt-auto">
      <div className="container mx-auto px-6 py-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} AlgoAliens. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;