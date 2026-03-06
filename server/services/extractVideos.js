import cheerio from "cheerio"

export function extractVideos(html, baseUrl){

  const $ = cheerio.load(html)

  let videos = []

  $("video source").each((i,el)=>{

    const src = $(el).attr("src")

    if(src){
      videos.push(new URL(src, baseUrl).href)
    }

  })

  return videos

}