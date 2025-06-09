import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

type ContentType = {
  youtube: "youtube";
  twitter: "twitter";
  notion: "notion";
  image: "image";
  video: "video";
  audio: "audio";
};

const ContentType: ContentType = {
  youtube: "youtube",
  twitter: "twitter",
  notion: "notion",
  image: "image",
  video: "video",
  audio: "audio",
};
//controlled component
export const CreateContentModal = ({ open, onClose }: any) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<keyof ContentType>("youtube");

  const addContent = async () => {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const description = descriptionRef.current?.value;

    console.log("Content Type:", type);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          title,
          link,
          type,
          description,
        },
        {
          withCredentials: true,
        }
      );
      alert("Content added successfully!");
      onClose();
      window.location.reload()
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  return (
    <div>
      {open && (
        <div className="w-screen h-screen fixed bg-black opacity-95 top-0 left-0 bottom-0 right-0 flex justify-center">
          <div className="flex flex-col justify-center">
            <span className="bg-amber-200 opacity-90 p-4 rounded-lg">
              <div
                className="flex justify-end cursor-pointer pb-2"
                onClick={onClose}
              >
                <CrossIcon size="lg" />
              </div>
              <div>
                <Input placeholder="Title" size="md" reference={titleRef} />
                <Input placeholder="Link" size="md" reference={linkRef} />
                <Input placeholder="Description" size="md" reference={descriptionRef} />
              </div>
              <div className="text-amber-950 text-md font-bold text-left pl-2 pt-2">
                Content Type -
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <Button
                  text="Youtube"
                  variant={"primary"}
                  size="super_xs"
                  className="hover:bg-purple-400 transition ease-in-out hover:text-black duration-150"
                  onClick={() => setType("youtube")}
                ></Button>
                <Button
                  text="Twitter"
                  variant={"secondary"}
                  size="super_xs"
                  className="hover:bg-purple-700 transition ease-in-out hover:text-amber-950 duration-150"
                  onClick={() => {
                    setType("twitter");
                  }}
                ></Button>
                <Button
                  text="Image"
                  variant={"tertiary"}
                  size="super_xs"
                  className="hover:bg-cyan-300 transition ease-in-out hover:text-gray-900 duration-150"
                  onClick={() => {
                    setType("image");
                  }}
                ></Button>
                <Button
                  text="Audio"
                  variant={"quaternary"}
                  size="super_xs"
                  className="hover:bg-teal-500 transition ease-in-out hover:text-black duration-150"
                  onClick={() => {
                    setType("audio");
                  }}
                ></Button>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <Button
                  text="Video"
                  variant={"quinary"}
                  size="super_xs"
                  className="hover:bg-pink-400 transition ease-in-out hover:text-black duration-150"
                  onClick={() => {
                    setType("video");
                  }}
                ></Button>
                <Button
                  text="notion"
                  variant={"senary"}
                  size="super_xs"
                  className="hover:bg-yellow-400 transition ease-in-out hover:text-black duration-150"
                  onClick={() => {
                    setType("notion");
                  }}
                ></Button>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  variant="primary"
                  text="Submit"
                  className="rounded-lg"
                  onClick={addContent}
                />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContentModal;
