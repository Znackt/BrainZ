import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import type { CardProps } from "../components/custom";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../config";

const DashBoard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const contents = useContent();

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-72 min-h-screen max-w-screen bg-gray-50">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            size="xs"
            variant="primary"
            text="Add Content"
            className="rounded-md"
            startIcon={<PlusIcon size="sm" />}
          />
          <Button
            size="xs"
            variant="secondary"
            text="Share Brain"
            className="rounded-md"
            endIcon={<ShareIcon size="sm" />}
            onClick={async () => {
              const res = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true,
              }, {
                withCredentials: true
              });
              const shareUrl = `${FRONTEND_URL}/api/v1/brain/share/${res.data.hash}`;
              alert(shareUrl);
            }}
          />
        </div>

        <div className="flex gap-8 pt-8 flex-wrap">
          {contents.map((props: CardProps) => (
            <Card
              contentId={props.contentId}
              title={props.title}
              link={props.link}
              type={props.type}
              description={props.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
