import { safeFetch } from "../utils/fetcher.js";

export async function fetchSite(url) {
  const response = await safeFetch(url);
  return response.data;
}