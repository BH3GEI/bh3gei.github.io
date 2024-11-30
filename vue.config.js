const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/bh3gei.github.io/',
  outputDir: 'docs',
  productionSourceMap: false,
  // 确保不会覆盖重要文件
  indexPath: 'index.html',
  // 配置开发服务器
  devServer: {
    static: {
      directory: './',
      publicPath: '/'
    }
  }
})