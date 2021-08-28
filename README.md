# Fragy

Fragy is a Vue-based, dynamically rendered page lightweight blogging framework, we are committed to bringing the most agile and free experience to users.

## Usage

### For webmaster

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

#### Github Mode

From `v0.2.0`, we provide a brand new meta generate mode named `Github Mode`.

In this mode, you won't need to generate meta of posts anymore, to build your own blog, you only need to build your site once, and just push your articles to your Github repository.

You need to be aware of these rules and restrictions:

1. You must use `fragy setup github` to setup Github config or set the related options in `fragy.config.js` manually before the site build.

2. In the options, you must specify the `base` of posts if your posts are not in `.fragy/posts`.

3. For users who living in Mainland of China, you need to set `proxy` in the options.

## Q&A

**Q: Why not use SSG or SSR?**

A: At this stage, Google already supports getting content from client-side rendering of SPA, which minimizes the computational resources and time required for compilation and lowers the development threshold of the theme.

Since we only generate a small amount of metadata, we can further lower the threshold of using Fragy by building some services in the future.

**Q: Why not just render Markdown to HTML and insert it into the page?**

A: In Fragy's design, we wanted all changes to the article to be immediately reflected on the article page, so that if a user wanted to upload a new article, the user could access the article through a constructed URL even if the user did not do any compilation.

**Q: Why not provide some public components to theme developers?**

A: We wanted to give theme developers as much freedom as possible, so we designed Fragy to provide only the most basic capabilities and to allow theme developers full control over the structure and styles of the pages.

It's hard for public components to match all needs and all scenarios. In our opinion, it's a better approach to give developers a very high degree of freedom to decide what dependencies and components should be included in the theme and how the theme should present the articles, based solely on the needs and target scenarios. In this mode, capable theme developers can also make better use of their skills to make the theme perfect.

## License

MIT
