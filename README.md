# Console.log wrapper

*Safe, clear console logging for every browser*

Log to the console &mdash; even legacy browsers without a console. Just pass any data to `log()` and you'll see it printed clearly and well-structured in the console.

If the browser doesn't have a console, Firebug Lite will load. You can pass any variable type: strings, objects, arrays, functions, etc.

**Demo: [patik.github.io/console.log-wrapper](http://patik.github.io/console.log-wrapper/)**

## Installation

**npm**: `npm install consolelog`

**Bower**: `bower install consolelog`

Or just download [consolelog.js](https://github.com/patik/console.log-wrapper/blob/master/consolelog.js) and reference it in your page with a `<script>` tag.

## Usage

Use `log()` wherever you want to write to the console.

### AMD with RequireJS

Consolelog.js is AMD-compliant and supports Common JS:

```js
require(['consolelog'], function(log) {
    log('It works!');
});
```

### Settings

You can change some optional preferences by passing an object to `log.settings()`. The defaults are shown below.

```js
log.settings({
    lineNumber: true,
    group: {
        label: 'Log:',
        collapsed: false
    }
});
```

- `lineNumber` (Boolean)
    + Whether to append the actual line number to each log. Not supported by all browsers.
- `group` (Boolean or object)
    + Groups the arguments for each log together
    + `collapsed: true` will collapse each group (in browsers that support collapsing)
    + `label: "some string"` sets the label or name for the groups
    + Simply setting `group: true` is a shorthand way of selecting the defaults

## Detail Print

This is an optional plugin to provide help information about the data that is being logged, especially in IE and older browsers. Just include [consolelog.detailprint.js](https://github.com/patik/console.log-wrapper/blob/master/consolelog.detailprint.js) along with [consolelog.js](https://github.com/patik/console.log-wrapper/blob/master/consolelog.js).

Firebug, WebKit's Developer Tools, and Opera's Dragonfly print useful, interactive items to the console. For example:

````js
console.log(
    "Here's a string",
     3.14,
     {"alpha": 5, "bravo": false},
     document.getElementById('charlie'),
     new Date()
);
````

Results in:

![Firebug running in Firefox](https://raw.github.com/patik/console.log-wrapper/gh-pages/demo/firebug.png)

Some browsers that have a primitive console &mdash; one that does not expand arrays, does not link DOM elements to the source code, only prints objects as `[object Object]` rather than listing their properties, etc.

![IE8 without Detail Print](https://raw.github.com/patik/console.log-wrapper/gh-pages/demo/ie8-without-detail-print.png)

Some cannot accept multiple arguments to a single `console.log` call. This includes IE 7/8/9/10, iOS 5 and older, and Opera 11 and older, among others.

Using the `detailPrint` companion plugin, special objects are presented in a more readable manner.

![IE8 with Detail Print](https://raw.github.com/patik/console.log-wrapper/gh-pages/demo/ie8-with-detail-print.png)

## Demo

[patik.github.io/console.log-wrapper](http://patik.github.io/console.log-wrapper/)

## Documentation

[patik.com/blog/complete-cross-browser-console-log](http://patik.com/blog/complete-cross-browser-console-log)

## License

Console.log-wrapper is [released under three licenses](LICENSE): MIT, BSD, and GPL.
