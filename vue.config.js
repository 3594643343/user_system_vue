const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8085,//8085
    proxy: {

      // 代理，解决跨域问题
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8090',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
      
    }
  }
})
