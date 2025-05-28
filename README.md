# ort-cache

A unified cache management library for browser and Node.js environments.

## Features

- Simple cache API with expiration time control
- Compatible with both browser and Node.js environments
- Support for localStorage, cookies, and memory storage
- Type definitions with TypeScript

## Installation

```bash
# npm
npm install ort-cache

# yarn
yarn add ort-cache

# pnpm
pnpm i ort-cache
```

## Usage

### Basic Usage

```typescript
import { setCache, getCache, delCache, setCacheLoca, getCacheLoca, clearCache, comCache } from 'ort-cache'

// Set cache with expiration time (1 minute by default)
setCache('key', 'value', 1) // 1 minute expiration

// Get cached value
const value = getCache('key')

// Delete cache
delCache('key')

// Set persistent cache (no expiration)
setCacheLoca('persistentKey', 'persistentValue')

// Get persistent cache
const persistentValue = getCacheLoca('persistentKey')

// Clear all cache
clearCache()

// Calculate remaining time for cache (in seconds)
const remainingTime = comCache('key') // returns seconds remaining
```

### Advanced Usage with Custom Framework

```typescript
import * as ortCache from 'ort-cache'

// Set custom framework (e.g., uni-app)
ortCache.setVariable(uni)

// Use with seconds as time unit
ortCache.setCache('key', 'value', 60, 'ss') // 60 seconds

// Other operations
ortCache.getCache('key')
ortCache.delCache('key')
```

### Cookie Management

```typescript
import { setCookie, getCookie, clearCookie } from 'ort-cache'

// Set cookie (expiration in days)
setCookie('cookieName', 'cookieValue', 7) // 7 days

// Get cookie
const cookieValue = getCookie('cookieName')

// Clear cookie
clearCookie('cookieName')
```

## API Reference

### Cache Functions

- `setCache(key: string, val: any, time?: number, unit?: 'mm' | 'ss'): boolean`
  - Sets a cache value with optional expiration time
  - `key`: Cache key
  - `val`: Value to cache
  - `time`: Expiration time (0 = update without changing expiration)
  - `unit`: Time unit ('mm' for minutes, 'ss' for seconds)
  - Returns: `boolean` indicating success

- `getCache<T = any>(key: string): T`
  - Retrieves a cached value
  - `key`: Cache key
  - Returns: Cached value or null if expired/not found

- `delCache(key: string): void`
  - Deletes a cached value
  - `key`: Cache key

- `setCacheLoca(key: string, val: any): boolean`
  - Sets a persistent value (no expiration)
  - `key`: Storage key
  - `val`: Value to store
  - Returns: `boolean` indicating success

- `getCacheLoca<T = any>(key: string): T`
  - Retrieves a persistent value
  - `key`: Storage key
  - Returns: Stored value or null if not found

- `clearCache(): void`
  - Clears all cached values

- `comCache(key: string, unit?: 'ss' | 'mm'): number`
  - Calculates remaining time for a cache key
  - `key`: Cache key
  - `unit`: Time unit for result ('ss' for seconds, 'mm' for minutes)
  - Returns: Remaining time in specified unit (0 if expired/not found)

### Cookie Functions

- `setCookie(cname: string, cvalue: string, exdays: number): void`
  - Sets a cookie
  - `cname`: Cookie name
  - `cvalue`: Cookie value
  - `exdays`: Expiration in days

- `getCookie(cname: string): string | undefined`
  - Gets a cookie value
  - `cname`: Cookie name
  - Returns: Cookie value or undefined if not found

- `clearCookie(name: string): void`
  - Clears a cookie
  - `name`: Cookie name

### Advanced Functions

- `setVariable(variable: any): void`
  - Sets a custom framework variable
  - `variable`: Framework-specific variable (e.g., uni)

## License

MIT 