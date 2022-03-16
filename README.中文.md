<div align="center">
 <img src="./assets/icon-text-dark.svg" width="280">
</div>
<br>

## 🔧 使用方法

### 🖥 建站

使用 `npm@8` 全局安装 `fragy-cli`:

```bash
npm install fragy-cli -g
```

在这之后，使用 `fragy-cli` 执行初始化指令，开始一个 Fragy 项目:

```bash
fragy init
```

**需要注意的是，你至少需要使用 Node.js `v14.5.0` 来运行我们的命令行工具**

你需要根据工具的指示输入必要的信息，之后工具会自动完成整个初始化步骤。

在项目初始化完成后，你便可以使用以下命令来创建一篇文章:

```bash
fragy create post
```

你可以在项目根目录下的 `.fragy/posts` 中找到创建的文章，已经写好的文章请直接放入这个文件夹内。

Fragy 基本兼容 Hexo 的文章格式，你可以直接将之前在 Hexo 内编写的文章迁移到 Fragy。

在你完成了所有的工作后，你可以使用以下命令构建站点:

```bash
fragy build
```

生成产物会被放置于 `dist` 文件夹下，你可以直接部署它们到某个静态文件托管平台或是某个 Web 服务器中。

在本地，你可以使用以下命令启动一个本地服务器，在构建和部署前预览你的站点：

```bash
fragy serve
```

如果你更改了文章或是 Fragy 的配置，页面将会自动刷新，载入最近的内容，便于你即时地对站点的修改进行预览。

#### 🚀 GitHub 模式

在 `v0.2.0` 版本后，Fragy 支持全新的元数据生成模式 —— `GitHub 模式`。

这一模式将不再要求你每次在更新、添加、删除文章后重新生成元数据，以刷新站点的文章目录，你只需要将你的文章简单地推送到 GitHub 仓库内即可。

在这一模式下，Fragy 会自动通过 GitHub 提供的 API 拉取你的文章信息与文章内容，并对文章进行即时的解析，获得元数据。

如果你期望使用这种模式，你需要注意以下几点规则和限制：

1. 首先你必须通过 `fragy setup github` 初始化位于 `fragy.config.js` 内的相关设置项，或者你可以手动编辑配置文件修改相关设置。

2. 如果你存放文章的目录不在 `.fragy/posts` 下，你需要手动指定 `base` 属性至仓库内你存放文章的目录。

3. 存放文章的目录结构必须是扁平的，如果有嵌套子文件夹，子文件夹内的文章将不会被检索到。

4. 如果你的站点主要面向国内用户，你可能需要配置一个代理服务器，该服务器可能会接收到 URL 类似于 `https://proxyserver.com/https%3A%2F%2Fapi.github.com%2Frepos%2Ffragyjs%2Ffragy%2Fcontents%2Fsrc` 的请求。

## ⚙ 配置

详见[站点配置](https://github.com/fragyjs/fragy/blob/main/docs/zh-CN/%E7%AB%99%E7%82%B9%E9%85%8D%E7%BD%AE.md)

## 🪐 主题开发

详见[主题开发指南](https://github.com/fragyjs/fragy/blob/main/docs/zh-CN/%E4%B8%BB%E9%A2%98%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.md)

## ✒ License

MIT
