<div align="center">
 <img src="https://github.com/fragyjs/fragy/blob/main/assets/logo.png?raw=true" width="88">
 <p>Fragy</p>
 <p>Reborn with Vue 3</p>
</div>

Fragy is a Vue-based, dynamically rendered page lightweight blogging framework, we are committed to bringing the most agile and free experience to users.

## 🔧 Usage

### 🖥 For webmaster

Install `fragy-cli` with `npm` (at least v7):

```bash
npm install fragy-cli -g
```

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

Once everything is ready, you can use the `fragy build` command to build your site. The build product is in the `dist` folder and you can deploy it directly. You can also run `fragy serve` to preview your site locally.

#### 🚀 GitHub Mode

We provide a serverless mode to generate meta files, it was called `GitHub Mode`.

In this mode, you don't need to generate meta of posts anymore, to build your own blog, you only need to build your site once, then push the files to one of your GitHub repository.

To use this mode, you need to be aware of these rules and restrictions:

1. You must use `fragy setup github` to setup GitHub config or set the related options in `fragy.config.js` manually before the site build.

2. In the options, you must specify the `base` of posts if your posts are not in `.fragy/posts`.

3. The folder where the posts are stored needs to be flat in structure due to the limit of the GitHub API, posts in subdirectories will not be retrieved.

4. For users who living in Mainland of China, you need to set `proxy` in the options. The proxy server will receive a request, the request url similar to `https://proxyserver.com/https%3A%2F%2Fapi.github.com%2Frepos%2Ffragyjs%2Ffragy%2Fcontents%2Fsrc`

## ✒ License

MIT
