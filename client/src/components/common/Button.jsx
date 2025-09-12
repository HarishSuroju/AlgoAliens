import React from 'react';
import {  motion as Motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, fullWidth = false }) => {
  const baseClasses = "font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClasses = fullWidth ? "w-full px-4 py-3" : "px-6 py-2";

  const variants = {
    primary: "bg-accent text-primary hover:bg-opacity-80",
    secondary: "bg-neon text-light hover:bg-opacity-80",
  };

  return (
    <Motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variants[variant]}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </Motion.button>
  );
};

export default Button;