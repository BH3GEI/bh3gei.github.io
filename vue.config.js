const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/bh3gei.github.io/' : '/',
  outputDir: 'docs',
  productionSourceMap: false
})