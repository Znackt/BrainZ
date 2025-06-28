import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import type { CardProps } from "../components/custom";

export const useContent = () => {
  const [contents, setContents] = useState<CardProps[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        withCredentials: true,
      })
      .then((res) => {
        const formatted = res.data.content.map((x: any) => ({
          contentId: x._id,
          title: x.title,
          link: x.link,
          type: x.type,
          description: x.description
        }))
        setContents(formatted)
      })
      .catch((err) => console.log(err));
  }, []);

  return contents;
};
