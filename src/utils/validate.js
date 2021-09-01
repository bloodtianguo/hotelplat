/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
  // const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号正则
  // return phoneReg.test(str)
}
export function validPhone(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
  const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号正则
  return phoneReg.test(str)
}
export function valid(str) {
  return phoneReg.test(str)
}
//正则校验统一社会信用代码的编码格式
export function isSocialCode(socialCode) {
  const reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
  return reg.test(socialCode);
}
//验证开头为1的手机号
export function isPhone(phone){
  const reg=/^(?:(?:\+|00)86)?1\d{10}$/
  return reg.test(phone);
}
