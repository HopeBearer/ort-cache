import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      // 库的名称
      name: 'OrtCache',
      // 输出文件名
      fileName: (format) => `ort-cache.${format}.js`,
    },
    // 生成 sourcemap
    sourcemap: true,
    // 目标 ES 版本
    target: 'es2020',
    // 输出目录
    outDir: 'dist',
  },
  plugins: [
    dts({
      // 入口目录
      entryRoot: 'src',
      // 输出目录
      outDir: 'dist',
      // 插入类型入口
      insertTypesEntry: true,
    }),
  ],
}) 