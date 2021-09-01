import Cookies from 'js-cookie'

const TokenKey = 'meizhao-token'
const Rolemenu="rolemenu"
//储存token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: 7})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// //贮存账号菜单
export function getMenu() {
  return Cookies.get(Rolemenu)
}
export function setMenu(rolemenu) {
  return Cookies.set(Rolemenu,JSON.stringify(rolemenu), {expires: 7})
}
export function removeMenu() {
  return Cookies.remove(Rolemenu)
}




