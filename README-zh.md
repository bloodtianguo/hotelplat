## Build Setup
```bash

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:8099](http://localhost:8099)

## 发布

```bash
# 构建测试环境
npm run build:prod

# 构建生产环境
npm run build:stage
```

## 其它

```bash

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
