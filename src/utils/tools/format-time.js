// 根据需求修改
export var getchtime = (time) => {
  let nDate = new Date(time)
  let nYear = nDate.getFullYear()
  let nMonth = nDate.getMonth() + 1
  if (nMonth < 10) { nMonth = `0${nMonth}` }
  let nDay = nDate.getDate()
  if (nDay < 10) { nDay = `0${nDay}` }
  return time = nYear + '-' + nMonth + '-' + nDay
}
export var getchtime2 = (time) => {
  let nDate = new Date(time)
  let nYear = nDate.getFullYear() //年
  let nMonth = nDate.getMonth() + 1 //月
  let nDay = nDate.getDate() //日
  let nHours = nDate.getHours() //时
  let nMinutes = nDate.getMinutes() //分
  let nSeconds = nDate.getSeconds() //秒
  if(nDay<10){nDay=`0${nDay}`}
  if(nMonth<10){nMonth=`0${nMonth}`}
  if(nHours<10){nHours=`0${nHours}`}
  if(nMinutes<10){nMinutes=`0${nMinutes}`}
  if(nSeconds<10){nSeconds=`0${nSeconds}`}
  return time = nYear + '-' + nMonth + '-' + nDay + ' ' + nHours + ':' + nMinutes + ':' + nSeconds
}

export var getchtime3 = (time) => {
  let nDate = new Date(time)
  let nHours = nDate.getHours() //时
  let nMinutes = nDate.getMinutes() //分
  let nSeconds = nDate.getSeconds() //秒
  return time = nHours + ':' + nMinutes + ':' + nSeconds
}

export var getchtime4 = (time) => {
  var unixTimestamp = new Date(time * 1000);
  var commonTime = unixTimestamp.toLocaleString();
  return commonTime
}
