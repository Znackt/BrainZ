import BirdIcon from "../icons/BirdIcon";
import ShareIcon from "../icons/ShareIcon";
import TrashIcon from "../icons/TrashIcon";
import VideoIcon from "../icons/VideoIcon";
import type { CardProps } from "./custom.d";
import DocumentIcon from "../icons/DocumentIcon";
import { useEffect } from "react";
import { Button } from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Card = (props: CardProps) => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  async function deleteContent({ contentId }: {contentId: any}) {
    if (!contentId) {
      console.error("Content ID is missing");
      return;
    }
    
    try {
      await axios({
        method: "delete",
        url: `${BACKEND_URL}/api/v1/content/${contentId}`,
        withCredentials: true,
        
      });
      alert("Content removed successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error removing content", error)
    }
  }
  return (
    <div>
      <div
        className={`p-4 ${
          props.type === "notion" ? "w-[920px]" : "min-w-72"
        } min-h-118 bg-white hover:bg-blue-100 duration-500 rounded-md border border-gray-200 min-w-72`}
      >
        <div className="flex justify-between">
          <div className="flex items-center text-sm font-semibold">
            <div className="text-gray-500 pr-2">
              {props.type === "notion" && <DocumentIcon size="sm" />}
              {props.type === "youtube" && <VideoIcon size="sm" />}
              {props.type === "twitter" && <BirdIcon size="sm" />}
            </div>
            {props.title}
          </div>
          <div className="flex items-center">
            <div className="pr-2 text-gray-500">
              <a href={props.link} target="_blank">
                <ShareIcon size="sm" />
              </a>
            </div>
            <div className="text-gray-500 cursor-pointer">
              <a>
                <Button
                  size="xs"
                  variant="primary"
                  text="hi"
                  onClick={() => deleteContent({ contentId: props.contentId })}
                />{" "}
              </a>
            </div>
          </div>
        </div>
        <div className="pt-4">
          {props.type === "youtube" && (
            <iframe
              className="w-full rounded-lg"
              src={props.link
                .replace("youtu.be", "www.youtube-nocookie.com/embed")
                .replace("?v=", "/")}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen;"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {props.type === "twitter" && (
            <div className="twitter-embed w-full rounded-lg">
              <blockquote className="twitter-tweet">
                <a href={props.link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}
          {props.type === "notion" && (
            <div className="notion-container">
              <iframe
                src={props.link.replace("notion.site/embed/", "notion.site/")}
                className="w-full min-h-[384px] rounded-lg"
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>
            </div>
          )}
        </div>
        {props.description}
      </div>
    </div>
  );

};