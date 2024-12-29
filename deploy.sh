#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
echo "正在构建项目..."
npm run build

# 添加 ads.txt 文件
echo "添加 ads.txt 文件..."
echo "google.com, pub-9131146702581512, DIRECT, f08c47fec0942fa0" > docs/ads.txt

# 添加所有更改
echo "添加更改到Git..."
git add .

# 提示输入commit信息
echo "请输入commit信息:"
read commitMessage

# 提交更改
echo "提交更改..."
git commit -m "$commitMessage"

# 推送到远程仓库
echo "推送到远程仓库..."
git push

echo "完成！网站将在几分钟后更新。"
