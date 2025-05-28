import type { CacheRecord, Unit } from '../../types'
import type { IStorage } from '../storage'
import { local, nodeStorage } from '../storage'

// 用于潜在框架支持的全局变量（例如，uni-app）
let globalVariable: any = null

/**
 * 设置用于特定框架支持的变量
 * @param variable 
 */
export const setVariable = (variable: any) => {
  globalVariable = variable
}

// 记录所有缓存键以便于清除
const cacheKeys = new Set<string>()

/**
 * 获取基于环境的合适存储对象
 */
export const getStorageGlobal = (): IStorage => {
  if (typeof window !== 'undefined') {
    return local
  }
  if (globalVariable && globalVariable.storage) {
    return globalVariable.storage
  }
  return nodeStorage
}

/**
 * 持久化设置值
 * @param key
 * @param val
 * @returns
 */
export const setCacheLoca = (key: string, val: any): boolean => {
  try {
    const storage = getStorageGlobal()
    const value = JSON.stringify(val)
    storage.setItem(key, value)
    return true
  } catch (error) {
    console.error('setCacheLoca 错误:', error)
    return false
  }
}

/**
 * 持久化获取值
 * @param key
 * @returns
 */
export const getCacheLoca = <T = any>(key: string): T => {
  try {
    const storage = getStorageGlobal()
    const value = storage.getItem(key)
    if (value) {
      return JSON.parse(value) as T
    }
    return null as any
  } catch (error) {
    console.error('getCacheLoca 错误:', error)
    return null as any
  }
}

/**
 * 设置缓存
 * @param key
 * @param val
 * @param time 存放时间 默认为0，为0时只更新值不更新缓存时间
 * @param unit 分钟单位mm 秒单位ss 默认mm分钟
 * @returns
 */
export const setCache = (key: string, val: any, time = 0, unit: Unit = 'mm'): boolean => {
  try {
    const storage = getStorageGlobal()
    
    // 计算过期时间
    let expire = 0
    if (time > 0) {
      const now = Date.now()
      expire = now + (unit === 'mm' ? time * 60 * 1000 : time * 1000)
    } else {
      // 尝试保留现有的过期时间（如果有）
      const existingData = getCacheLoca<CacheRecord>(`cache_${key}`)
      if (existingData) {
        expire = existingData.expire
      }
    }

    const cacheRecord: CacheRecord = {
      value: val,
      expire: expire
    }
    
    storage.setItem(`cache_${key}`, JSON.stringify(cacheRecord))
    cacheKeys.add(key)
    return true
  } catch (error) {
    console.error('setCache 错误:', error)
    return false
  }
}

/**
 * 获取缓存
 * @param key
 * @returns
 */
export const getCache = <T = any>(key: string): T => {
  try {
    const storage = getStorageGlobal()
    const data = storage.getItem(`cache_${key}`)
    
    if (!data) return null as any
    
    const cacheRecord: CacheRecord = JSON.parse(data)
    
    // 检查缓存是否已过期
    if (cacheRecord.expire > 0 && Date.now() > cacheRecord.expire) {
      delCache(key)
      return null as any
    }
    
    return cacheRecord.value as T
  } catch (error) {
    console.error('getCache 错误:', error)
    return null as any
  }
}

/**
 * 删除缓存
 * @param key
 */
export const delCache = (key: string): void => {
  try {
    const storage = getStorageGlobal()
    storage.removeItem(`cache_${key}`)
    cacheKeys.delete(key)
  } catch (error) {
    console.error('delCache 错误:', error)
  }
}

/**
 * 清空记录的缓存名称集合
 * @returns
 */
export const clearCache = (): void => {
  try {
    const storage = getStorageGlobal()
    cacheKeys.forEach(key => {
      storage.removeItem(`cache_${key}`)
    })
    cacheKeys.clear()
  } catch (error) {
    console.error('clearCache 错误:', error)
  }
}

/**
 * 计算缓存过期时间
 * @param key
 * @returns 返回秒单位时间
 */
export const comCache = (key: string, unit: Unit = 'ss'): number => {
  try {
    const storage = getStorageGlobal()
    const data = storage.getItem(`cache_${key}`)
    
    if (!data) return 0
    
    const cacheRecord: CacheRecord = JSON.parse(data)
    
    if (cacheRecord.expire <= 0) return 0
    
    const remainingMs = Math.max(0, cacheRecord.expire - Date.now())
    return unit === 'ss' ? Math.floor(remainingMs / 1000) : Math.floor(remainingMs / (60 * 1000))
  } catch (error) {
    console.error('comCache 错误:', error)
    return 0
  }
}
