const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'docs',
  productionSourceMap: false,
  // 确保不会覆盖重要文件
  indexPath: 'index.html'
})