const XLSX = require('xlsx')

//将行,列转换
function transformSheets(sheets) {
 var content = []
 var content1 = []
 var tmplist = []
 for (let key in sheets){
  tmplist.push(XLSX.utils.sheet_to_json(sheets[key]).length)
  content1.push(XLSX.utils.sheet_to_json(sheets[key]))
 }
 var maxLength = Math.max.apply(Math, tmplist)
 //进行行列转换
 for (let y in [...Array(maxLength)]){
  content.push([])
  for (let x in [...Array(tmplist.length)]) {
   try {
    for (let z in content1[x][y]){
     content[y].push(content1[x][y][z])
    }
   } catch (error) {
    content[y].push(' ')
   }
  }
 }
 content.unshift([])
 for (let key in sheets){
  content[0].push(key)
  }
 return content

}

export {transformSheets as default}
