import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`btn btn-outline`} {...props}>
      {children}
    </button>
  );
}
