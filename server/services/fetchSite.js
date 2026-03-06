import axios from "axios"

export async function fetchSite(url) {

  const response = await axios.get(url)

  return response.data

}