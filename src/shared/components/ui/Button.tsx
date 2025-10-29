import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-linear-to-r from-amber-500 to-yellow-600 text-black hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105",
    secondary:
      "bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50",
    danger:
      "bg-red-900/20 border border-red-800 text-red-400 hover:bg-red-900/40 hover:border-red-700",
    ghost:
      "bg-transparent border border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-amber-400 hover:border-amber-500/50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
