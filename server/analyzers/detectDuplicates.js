export function detectDuplicates(list){

  let seen = new Set()
  let duplicates = []

  list.forEach(item=>{

    if(seen.has(item)){
      duplicates.push(item)
    }

    seen.add(item)

  })

  return duplicates

}