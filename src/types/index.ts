export type Unit = 'mm' | 'ss'

export interface CacheRecord {
  value: any
  expire: number // 时间戳(ms)
}
