import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const useContent = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        withCredentials: true,
      })
      .then((res) => setContents(res.data.content))
      .catch((err) => console.log(err));
  }, []);

  return contents;
};
