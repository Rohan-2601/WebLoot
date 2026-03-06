import cheerio from "cheerio"

export function extractIcons(html, baseUrl){

  const $ = cheerio.load(html)

  let icons = []

  $("link[rel='icon']").each((i,el)=>{

    const href = $(el).attr("href")

    if(href){
      icons.push(new URL(href, baseUrl).href)
    }

  })

  return icons

}