import type { ReactElement } from "react";

const SidebarItem = ({ icon, text }: { text: string; icon: ReactElement }) => {
  return (
    <div className="flex items-center p-4 cursor-pointer hover:bg-gray-100 rounded max-w-60 duration-300">
      <div className="pr-4">{icon}</div>
      <div>{text}</div>
    </div>
  );
};

export default SidebarItem;
