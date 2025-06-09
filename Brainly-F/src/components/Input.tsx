interface InputProps {
  reference?: any;
  placeholder: string;
  size: "sm" | "md" | "lg" | "var";
  className?: string;
}

const sizeVariants = {
  sm: "py-1",
  md: "py-2",
  lg: "py-3",
  var: "py-[dvh]",
};
const widthVariants = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
  var: "px-[dvw]"
};

const defaultStyles = "border rounded-lg px-2";

export const Input = (props: InputProps) => {
  return (
    <div className="p-2">
      <input
        placeholder={props.placeholder}
        className={`${sizeVariants[props.size]} ${widthVariants[props.size]} ${defaultStyles} ${props.className || ""} placeholder:text-start`}
        ref={props.reference}
      />
    </div>
  );
};
