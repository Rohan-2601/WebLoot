import axios from "axios";

export const downloadFile = async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).send("URL parameter is required");
    }

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", "attachment");
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send("Download failed");
  }
};
