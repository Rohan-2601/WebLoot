import axios from "axios";
import { validateUrlSafety } from "./security.js";

export const safeFetch = async (urlStr, options = {}, redirectCount = 0) => {
  if (redirectCount > 5) {
    throw new Error("Too many redirects");
  }

  const parsedUrl = await validateUrlSafety(urlStr);

  const response = await axios({
    url: parsedUrl.href,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
    timeout: 10000,
    ...options,
  });

  if (
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.location
  ) {
    const redirectUrl = new URL(response.headers.location, parsedUrl.href).href;
    return safeFetch(redirectUrl, options, redirectCount + 1);
  }

  return response;
};
