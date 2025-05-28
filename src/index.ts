// 导出缓存相关函数
export { 
  setVariable,
  setCache, 
  getCache, 
  delCache, 
  setCacheLoca, 
  getCacheLoca, 
  clearCache, 
  comCache,
  getStorageGlobal
} from './core/cache'

// 导出 Cookie 相关函数
export { 
  setCookie, 
  getCookie, 
  clearCookie 
} from './core/cookie'

// 重新导出存储对象（用于高级用法）
export { 
  local, 
  session, 
  nodeStorage, 
  memStorage,
  setObject,
  getObject,
  getAllKeys,
  getStorageUsage,
  setMultiple,
  getMultiple,
  removeMultiple
} from './core/storage'

// 导出存储类型和接口
export type { IStorage, StorageType } from './core/storage'
