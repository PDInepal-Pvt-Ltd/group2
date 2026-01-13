import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  className = '' 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#6200ea] hover:bg-[#3700b3] text-white focus:ring-[#6200ea]",
    secondary: "bg-[#03dac6] hover:bg-[#018786] text-black focus:ring-[#03dac6]",
    outline: "border border-[var(--text-secondary)] text-[var(--text-primary)] hover:bg-[var(--surface-color)]",
    danger: "bg-[#cf6679] hover:bg-[#b00020] text-white",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
