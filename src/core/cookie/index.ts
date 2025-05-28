/**
 * 设置 cookie
 * @param cname 键名
 * @param cvalue 键值
 * @param exdays 过期时间/天
 */
export const setCookie = (cname: string, cvalue: string, exdays: number): void => {
  if (typeof document === 'undefined') {
    console.warn('setCookie: 当前环境中 document 不可用')
    return
  }

  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = "expires=" + d.toUTCString()
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

/**
 * 获取 cookie
 * @param cname 键名
 * @returns string
 */
export const getCookie = (cname: string): string | undefined => {
  if (typeof document === 'undefined') {
    console.warn('getCookie: 当前环境中 document 不可用')
    return undefined
  }

  const name = cname + "="
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  
  return undefined
}

/**
 * 清除 cookie
 * @param name 键名
 * @returns string
 */
export const clearCookie = (name: string): void => {
  if (typeof document === 'undefined') {
    console.warn('clearCookie: 当前环境中 document 不可用')
    return
  }
  
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
} 