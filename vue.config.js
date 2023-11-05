module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-homepage/' // 你需要将'my-homepage'替换为你的GitHub仓库名称
    : '/'
}