/**
 * 存储类型定义
 */
export type StorageType = 'local' | 'session' | 'node' | 'memory'

/**
 * 存储接口定义，确保所有存储实现有统一的API
 */
export interface IStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
  key?: (index: number) => string | null
  length?: number
  hasOwnProperty: (key: string) => boolean
}

/**
 * 内存存储实现 (用于不支持localStorage的环境)
 */
class MemoryStorage implements IStorage {
  private data: Map<string, string> = new Map()

  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    try {
      this.data.set(key, value)
    } catch (e) {
      console.error('MemoryStorage 设置值失败:', e)
    }
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  clear(): void {
    this.data.clear()
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys())
    return index >= 0 && index < keys.length ? keys[index] : null
  }

  get length(): number {
    return this.data.size
  }

  hasOwnProperty(key: string): boolean {
    return this.data.has(key)
  }
}

/**
 * NodeJS存储实现
 */
class NodeStorage implements IStorage {
  private data: Map<string, string> = new Map()

  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    try {
      this.data.set(key, value)
    } catch (e) {
      console.error('NodeStorage 设置值失败:', e)
    }
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  clear(): void {
    this.data.clear()
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys())
    return index >= 0 && index < keys.length ? keys[index] : null
  }

  get length(): number {
    return this.data.size
  }

  hasOwnProperty(key: string): boolean {
    return this.data.has(key)
  }
}

// 创建内存存储实例
const memoryStorage = new MemoryStorage()
// 创建Node存储实例
const nodeStorageInstance = new NodeStorage()

/**
 * 检测存储是否可用
 * @param storage 需要检测的存储对象
 * @returns 存储是否可用
 */
const isStorageAvailable = (storage: Storage): boolean => {
  const testKey = '__storage_test__'
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取可用的storage对象
 * @param type 存储类型 'local' | 'session' | 'node' | 'memory'
 * @return 对应的存储对象
 */
const getStorage = (type: StorageType): IStorage => {
  // 浏览器环境
  if (typeof window !== 'undefined') {
    if (type === 'local' || type === 'session') {
      const storageType = type + 'Storage' as 'localStorage' | 'sessionStorage'
      if (window[storageType]) {
        // 检测存储是否真正可用（可能被禁用或已满）
        if (isStorageAvailable(window[storageType])) {
          return window[storageType]
        } else {
          console.warn(`${storageType} 不可用，将使用内存存储替代`)
          return memoryStorage
        }
      }
    }
    // 如果请求的是node或memory，或者浏览器存储不可用，则使用内存存储
    return memoryStorage
  }
  
  // Node.js环境
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return nodeStorageInstance
  }
  
  // 其他环境（如React Native等）使用内存存储
  return memoryStorage
}

/**
 * 安全地处理存储操作，添加额外的错误处理和功能
 * @param baseStorage 基础存储对象
 * @returns 增强的存储对象
 */
const createEnhancedStorage = (baseStorage: IStorage): IStorage => {
  return {
    getItem: (key: string): string | null => {
      try {
        return baseStorage.getItem(key)
      } catch (e) {
        console.error(`获取存储项 ${key} 失败:`, e)
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        baseStorage.setItem(key, value)
      } catch (e) {
        // 检测是否因存储已满导致的错误
        if (e instanceof DOMException && 
            (e.name === 'QuotaExceededError' || 
             e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.error('存储已满，无法继续存储数据')
        } else {
          console.error(`设置存储项 ${key} 失败:`, e)
        }
      }
    },
    removeItem: (key: string): void => {
      try {
        baseStorage.removeItem(key)
      } catch (e) {
        console.error(`删除存储项 ${key} 失败:`, e)
      }
    },
    clear: (): void => {
      try {
        baseStorage.clear()
      } catch (e) {
        console.error('清空存储失败:', e)
      }
    },
    key: baseStorage.key ? 
      (index: number): string | null => {
        try {
          return baseStorage.key ? baseStorage.key(index) : null
        } catch (e) {
          console.error(`获取索引 ${index} 的键失败:`, e)
          return null
        }
      } : undefined,
    length: baseStorage.length,
    hasOwnProperty: (key: string): boolean => {
      try {
        if (typeof baseStorage.hasOwnProperty === 'function') {
          return baseStorage.hasOwnProperty(key)
        }
        return baseStorage.getItem(key) !== null
      } catch (e) {
        console.error(`检查键 ${key} 是否存在失败:`, e)
        return false
      }
    }
  }
}

// 导出增强的存储对象
export const local = createEnhancedStorage(getStorage('local'))
export const session = createEnhancedStorage(getStorage('session'))
export const nodeStorage = createEnhancedStorage(getStorage('node'))
export const memStorage = createEnhancedStorage(memoryStorage)

/**
 * 在指定存储中存储对象，支持序列化
 * @param storage 存储对象
 * @param key 键名
 * @param value 值
 * @returns 是否成功
 */
export const setObject = (storage: IStorage, key: string, value: any): boolean => {
  try {
    const serialized = JSON.stringify(value)
    storage.setItem(key, serialized)
    return true
  } catch (e) {
    console.error(`设置对象 ${key} 失败:`, e)
    return false
  }
}

/**
 * 从指定存储中获取对象，支持反序列化
 * @param storage 存储对象
 * @param key 键名
 * @returns 对象或null
 */
export const getObject = <T = any>(storage: IStorage, key: string): T | null => {
  try {
    const value = storage.getItem(key)
    if (value) {
      return JSON.parse(value) as T
    }
    return null
  } catch (e) {
    console.error(`获取对象 ${key} 失败:`, e)
    return null
  }
}

/**
 * 获取所有存储键
 * @param storage 存储对象
 * @returns 键数组
 */
export const getAllKeys = (storage: IStorage): string[] => {
  const keys: string[] = []
  try {
    // 如果是标准WebStorage
    if (typeof storage.length === 'number' && typeof storage.key === 'function') {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          keys.push(key)
        }
      }
    } 
    // 如果是自定义存储对象（如NodeStorage或MemoryStorage）
    else if (storage instanceof NodeStorage || storage instanceof MemoryStorage) {
      if (storage instanceof NodeStorage) {
        // 获取NodeStorage内部Map的键
        return Array.from((storage as any).data.keys())
      } else if (storage instanceof MemoryStorage) {
        // 获取MemoryStorage内部Map的键
        return Array.from((storage as any).data.keys())
      }
    }
    return keys
  } catch (e) {
    console.error('获取所有键失败:', e)
    return []
  }
}

/**
 * 检查存储空间使用情况
 * @param storage 存储对象
 * @returns 使用的字节数
 */
export const getStorageUsage = (storage: IStorage): number => {
  try {
    let totalSize = 0
    const keys = getAllKeys(storage)
    
    for (const key of keys) {
      const value = storage.getItem(key)
      if (value) {
        // 计算key和value的UTF-16编码大小（每个字符2字节）
        totalSize += (key.length + value.length) * 2
      }
    }
    
    return totalSize
  } catch (e) {
    console.error('获取存储使用情况失败:', e)
    return 0
  }
}

/**
 * 批量设置多个键值对
 * @param storage 存储对象
 * @param entries 键值对对象
 * @returns 是否全部成功
 */
export const setMultiple = (storage: IStorage, entries: Record<string, string>): boolean => {
  try {
    let allSuccess = true
    for (const [key, value] of Object.entries(entries)) {
      try {
        storage.setItem(key, value)
      } catch (e) {
        console.error(`批量设置中的键 ${key} 失败:`, e)
        allSuccess = false
      }
    }
    return allSuccess
  } catch (e) {
    console.error('批量设置失败:', e)
    return false
  }
}

/**
 * 批量获取多个键的值
 * @param storage 存储对象
 * @param keys 键数组
 * @returns 键值对对象
 */
export const getMultiple = (storage: IStorage, keys: string[]): Record<string, string | null> => {
  const result: Record<string, string | null> = {}
  try {
    for (const key of keys) {
      result[key] = storage.getItem(key)
    }
    return result
  } catch (e) {
    console.error('批量获取失败:', e)
    return result
  }
}

/**
 * 批量删除多个键
 * @param storage 存储对象
 * @param keys 键数组
 * @returns 是否全部成功
 */
export const removeMultiple = (storage: IStorage, keys: string[]): boolean => {
  try {
    let allSuccess = true
    for (const key of keys) {
      try {
        storage.removeItem(key)
      } catch (e) {
        console.error(`批量删除中的键 ${key} 失败:`, e)
        allSuccess = false
      }
    }
    return allSuccess
  } catch (e) {
    console.error('批量删除失败:', e)
    return false
  }
}
