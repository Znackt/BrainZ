import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary" | "senary";
  text: string;
  onClick?: () => void;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  className?: string;
  size?: "super_xs" | "xs" | "sm" | "md" | "lg" | "semi_lg";
  disabled?: boolean;
}

const variantStyles = {
  primary: "bg-purple-600 text-gray-100",
  secondary: "bg-purple-200 text-purple-600",
  tertiary: "bg-gray-100 text-black",
  quaternary: "bg-teal-200 text-black",
  quinary: "bg-pink-200 text-black",
  senary: "bg-yellow-200 text-black"
};

const sizeVariants = {
  super_xs: "px-[dvw] py-[dvh] rounded-full",
  xs: "w-40 py-2",
  sm: "w-64 py-2",
  md: "w-80 py-3",
  semi_lg: "w-96 py-3",
  lg: "w-96 py-4",
};

const defaultStyles = "font-medium flex items-center justify-center";

export const Button = (props: ButtonProps) => {
  const size = props.size || "md";
  
  return (
    <button
      onClick={props.onClick}
      className={`${variantStyles[props.variant]} 
        ${sizeVariants[size]} 
        ${defaultStyles} 
        ${props.className || ""}
        ${props.disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90 active:opacity-100"}
        transition-opacity duration-300 cursor-pointer`}>
      <div className="pr-2">{props.startIcon}</div>
      {props.text}
      <div className="pl-2">{props.endIcon}</div>
    </button>
  );
};
