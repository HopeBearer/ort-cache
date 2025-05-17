/**
 * 获取可用的storage对象（浏览器 / node.js 模拟）
 * @param type 'local' | 'session' => '浏览器' | 'node.js'
 * @return 如果是浏览器环境则返回 localStorage对象，如果是nodejs环境则使用Map结构进行类存储
 */
const getStorage = (type: 'local' | 'session' | 'node') => {
  if (type !== 'node') {
    const index = (type + 'Storage') as 'localStorage' | 'sessionStorage'
    if (typeof window !== 'undefined' && window[index]) {
      return window[index]
    }
  } else {
    // nodejs 环境
    const storageMap = new Map<string, string>()
    return {
      getItem: (key: string) => storageMap.get(key) ?? null,
      setItem: (key: string, value: string) => storageMap.set(key, value),
      removeItem: (key: string) => storageMap.delete(key)
    }
  }
}

export const local = getStorage('local')
export const session = getStorage('session')
export const nodeStorage = getStorage('node')
