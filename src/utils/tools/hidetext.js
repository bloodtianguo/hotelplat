export function hidetextFun(text,num) {
  let newtext;
  if(text.length){
    if(text.length>num){
      newtext=`${text.substring(0,num)}......`
     }else{
      newtext=text
     }
  }

  return newtext
}

