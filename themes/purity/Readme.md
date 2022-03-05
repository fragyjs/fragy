# Purity

<div align="center">
 <img src="https://github.com/fragyjs/fragy/blob/main/themes/purity/assets/banner.png?raw=true" width="420">
</div>

`Purity` is the default theme for `Fragy`, it's light-weight, and customizable.

## 📕 How to use

Fisrt of all, you must have an initialized `Fragy` project.

Then, use `npm` to install this theme package:

```bash
npm install @fragy/purity
```

## ⚙ Configuration

For full configuration, see [config.js](https://github.com/fragyjs/fragy/blob/main/themes/purity/config.js).

### Color

You can choose any color as the primary color for `Purity`, here's an example:

```js
{
  theme: {
    package: '@fragy/purity',
    config: {
      color: {
        primary: '#40aeff',
        autoGenerate: true,
      },
    },
  },
}
```

### Prefetch

`Purity` enabled `prefetch` for article and article list by default.

It allows the user to interact with the page in such a way that the content of the article or list appears to be loaded instantly. User no longer have to wait for the loading process.

If you want to disable this feature, you can set `articleList.prefetch` and `article.prefetch` to `false`.

Obviously, you can disable the prefetch of article and article list separately.

### Text Align

`Purity` use `justify` align for the text by default, if you don't want it, you can set `articleList.useJustifyAlign` and `article.useJustifyAlign` to `false`.

### Font

`Purity` supports custom fonts, you can set the font you like to `fontFamily` in the theme config.

If you want to use font from `Google Fonts`, you should visit `Google Fonts` to pick a font, then you will get a `link` tag code looks like this:

`<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500&display=swap" rel="stylesheet">`

You should put the words after `family=` and before the `&display=` to the theme config, here's an example:

```js
{
  theme: {
    package: '@fragy/purity',
    config: {
      gfont: {
        enable: false,
        family: 'Noto+Sans+SC:wght@100;300;400;500;700;900',
      },
    },
  },
}
```

For China users, you may need a proxy to accelerate the loading of fonts, you can set `googleApisHost` and `gstaticHost` under the `gfont` scope to specific a host to load font files.

### Footer

`Purity` provide a default footer which contains the "Powered by" text, `CC-BY-4.0` license icon (disabled by default), and a light/dark mode swticher.

If you don't want it, you can set `footer.poweredby` to `false`.

Each features can be enabled or disabled separately.

### Comment

`Purity` now has integrated [`Valine`](https://github.com/xCss/Valine) as comment component.

See more details on [`Valine's official site`](https://valine.js.org/).

### Vendors

All external vendors will be loaded from CDN, `Purity` uses `CDNJS` by default, which provided by Cloudflare.

You can replace the default source urls with your owns, see more details on [`config.js`](https://github.com/fragyjs/fragy/blob/main/themes/purity/config.js).

## License

MIT
