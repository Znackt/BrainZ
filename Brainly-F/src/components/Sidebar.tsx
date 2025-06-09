import BirdIcon from "../icons/BirdIcon";
import BrainzIcon from "../icons/BrainzIcon";
import DocumentIcon from "../icons/DocumentIcon";
import LinkIcon from "../icons/LinkIcon";
import TagsIcon from "../icons/TagsIcon";
import VideoIcon from "../icons/VideoIcon";

import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <div className="h-screen bg-white border-slate-200 border-2 w-72 fixed left-0 top-0 pl-4">
      <div className="flex text-2xl text-purple-600 p-3 items-center">
        <BrainzIcon size="xl" />
        Brain Z
      </div>

      <div>
        <SidebarItem icon={<BirdIcon size="sm" />} text="Tweets" />
        <SidebarItem icon={<VideoIcon size="sm" />} text="Videos" />
        <SidebarItem icon={<DocumentIcon size="sm" />} text="Documents" />
        <SidebarItem icon={<LinkIcon size="sm" />} text="Link" />
        <SidebarItem icon={<TagsIcon size="sm" />} text="Tags" />
      </div>
    </div>
  );
};

export default Sidebar;
