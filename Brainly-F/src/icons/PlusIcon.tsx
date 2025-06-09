import { sizeVariants, type Iconprops } from "./custom.d";

const PlusIcon = (props: Iconprops) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 -2 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={sizeVariants[props.size]}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
export default PlusIcon;
