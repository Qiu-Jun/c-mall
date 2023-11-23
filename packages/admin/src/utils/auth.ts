/*
 * @Author: June
 * @Description: 
 * @Date: 2023-11-23 12:31:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-23 12:35:18
 */
import Cookies from 'js-cookie'

const TokenKey = 'TOKEN'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
