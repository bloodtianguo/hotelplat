var now = new Date();                    //当前日期
var nowDayOfWeek = now.getDay();         //今天本周的第几天
var nowDay = now.getDate();              //当前日
var nowMonth = now.getMonth();           //当前月
var nowYear = now.getYear();             //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;  //


// 获取今日开始结束时间
export var todaytime = () => {
  let start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
  start = timeChange(start, 'yyyy-MM-dd HH:mm:ss')
  let end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
  end = timeChange(end, 'yyyy-MM-dd HH:mm:ss')
  return { start, end };
}
/*------------------------------------------------------------------------*/
// 获取本周开始结束时间
export var getRecentlyWeek = () => {
  let nowData = new Date(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime());
  let currentDay = nowData.getDay();
  if (currentDay === 0) {
    currentDay = 7;
  }
  let start = timeChange(nowData.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000, 'yyyy-MM-dd HH:mm:ss');
  let end =  timeChange(nowData.getTime() + (8 - currentDay) * 24 * 60 * 60 * 1000-1, 'yyyy-MM-dd HH:mm:ss')
  return { start, end };
};
/*------------------------------------------------------------------------*/
// 获取本月开始结束时间
export var getLastMonth = () => {
  let nowData = new Date();
  let currentMonth = nowData.getMonth()+1;// 获取今天所在的月份
  let currentYear = nowData.getFullYear();// 获得当前年份4位年
  let start = timeChange(new Date(currentYear, currentMonth - 1, 1).getTime(),'yyyy-MM-dd HH:mm:ss');
  let end = timeChange(new Date(currentYear, currentMonth, 1).getTime()-24 * 60 * 60 * 1000-1,'yyyy-MM-dd HH:mm:ss');
  return { start, end };
};
/*------------------------------------------------------------------------*/
//获得本季度的开始月份
function getQuarterStartMonth(){
  let quarterStartMonth = 0;
  if(nowMonth<3){
     quarterStartMonth = 0;
  }
  if(2<nowMonth && nowMonth<6){
     quarterStartMonth = 3;
  }
  if(5<nowMonth && nowMonth<9){
     quarterStartMonth = 6;
  }
  if(nowMonth>8){
     quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
//获得某月的天数
function getMonthDays(myMonth){
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
  return   days;
}
// 获取本季度开始结束时间
export var quartertime=()=>{
  let start = new Date(nowYear, getQuarterStartMonth(), 1);
  start= timeChange(start,"yyyy-MM-dd HH:mm:ss");
  let end = getQuarterStartMonth() + 2;
  end= timeChange(new Date(nowYear, end, getMonthDays(end)+1).getTime()-24 * 60 * 60 * 1000-1,"yyyy-MM-dd HH:mm:ss");
  return {start,end};
}
// 时间戳格式化
export var timeChange=(dateString, formdate)=>{
  // dateString: 获取的毫秒数或标准时间
  // formdate: 返回的日期格式 默认 yyyy-mm-dd HH:mm
  if (dateString == null || dateString === '') {
    return ''
  }
  const date = new Date(dateString)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var currentDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (formdate == null || formdate === 'yyyy-mm-dd HH:mm') {
    return year + '-' + month + '-' + currentDate + ' ' + hours + ':' + minutes
  } else if (formdate === 'yyyy-MM-dd HH:mm:ss') {
    return year + '-' + month + '-' + currentDate + ' ' + hours + ':' + minutes + ':' + seconds
  } else if (formdate === 'yyyy-MM-dd') {
    // console.log(year + '-' + month + '-' + currentDate)
    return year + '-' + month + '-' + currentDate
  } else if (formdate === 'yyyy-mm') {
    return year + month
  } else if (formdate === 'mm-dd') {
    return month + '-' + currentDate
  } else if (formdate === 'HH:mm') {
    return hours + ':' + minutes
  } else {
    return ''
  }
}
// 时间比较
function getDate(strDate){
  var timestamp = Date.parse(new Date(strDate));
  timestamp = timestamp / 1000;
  return timestamp;
}//将字符串格式的时间转换为时间戳格式
export var timeCompare=(start,end)=>{
  let startTime=getDate(start)
    let endTime=getDate(end)
    return endTime-startTime>0
}
