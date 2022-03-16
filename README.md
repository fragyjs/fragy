<div align="center">
  <br>
  <div align="center">
    <img src="./assets/icon-text-dark.svg" width="280">
  </div>
 <br>
 <a href="./README.中文.md">中文文档</a>
</div>

<br>

Fragy is a Vue-based, dynamically rendered page lightweight blogging framework, we are committed to bringing the most agile and free experience to users.

## 🔧 Usage

### 🖥 For webmaster

Install `fragy-cli` with `npm` (at least v7):

```bash
npm install fragy-cli -g
```

**Notice that you need at least Node.js `v14.5.0` to run the command line tool.**

After that, use `fragy-cli` to initialize your site in an empty folder.

```bash
fragy init
```

Follow the instructions and enter the necessary information, then the program will automatically perform the initialization.

Once the site has been initialized, you can create a new post by using the following command:

```bash
fragy create post
```

You can find the post in `.fragy/posts`.

Once everything is ready, you can use the following command to build your site:

```bash
fragy build
```

The bundled files are in the `dist` folder, you can deploy them directly.

You can also run the following command to preview your site locally:

```bash
fragy serve
```

For convenience, pages will auto reload it self when you changed any related files like articles or the configuration.

#### 🚀 GitHub Mode

We provide a serverless mode to generate meta files, it was called `GitHub Mode`.

In this mode, you don't need to generate meta of posts anymore, to build your own blog, you only need to build your site once, then push the files to one of your GitHub repository.

To use this mode, you need to be aware of these rules and restrictions:

1. You must use `fragy setup github` to setup GitHub config or set the related options in `fragy.config.js` manually before the site build.

2. In the options, you must specify the `base` of posts if your posts are not in `.fragy/posts`.

3. The folder where the posts are stored needs to be flat in structure due to the limit of the GitHub API, posts in subdirectories will not be retrieved.

4. For users who living in Mainland of China, you need to set `proxy` in the options. The proxy server will receive a request, the request url similar to `https://proxyserver.com/https%3A%2F%2Fapi.github.com%2Frepos%2Ffragyjs%2Ffragy%2Fcontents%2Fsrc`

#### MarkVue

We used a library called [`MarkVue`](https://github.com/backrunner/markvue) to provide an ability which allows you write Vue 3 SFC.

To enable this feature, you can set `markvue.enable` to `true` in `fragy.config.js`.

You can wrap a SFC with `<vue-sfc></vue-sfc>`, here's an example:

```markdown
# This is an article with Vue SFC

Hey, we can use Vue SFC here.

## SFC Demo

<vue-sfc>
<template>
  <div class="sfc-test">
    <button @click="count++">{{ count }}</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
button {
  padding: 18px 32px;
  margin-bottom: 24px;
  background: #3e3e3e;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
</vue-sfc>
```

WARNING: Enable this feature will enlarge the size of bundled files, because we must add the compiler of Vue SFC to the bundle, it will make the loading slower.

## ✒ License

MIT
