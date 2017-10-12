**WORK IN PROGRESS**

Comet Widgets [![Build Status](https://travis-ci.org/cometapp/comet-widgets.svg?branch=master)](https://travis-ci.org/cometapp/comet-widgets)
===
> A list of javascript tools to interact with [Comet albums](https://cometapp.io)

# Dependencies

These plugins depend on [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com) to work.

# Installation

## As a typescript library

Get the library file
```sh
npm i --save comet-widgets
```

Import it in your code
```javascript
import * from 'comet-widgets'
```

## In a browser

Get the library file
```sh
git clone git@github.com:cometapp/comet-widgets.git comet-widgets
cd comet-widgets && npm install && npm run build
# the library is in the export folder
```

Import it in your html
```html
<!-- include bootstrap.css -->
<!-- include jquery.js -->
<!-- include bootstrap.js -->
<script src="...link/to/the/file/comet-widgets.js"></script>
```

# Widgets list

## Carousel
Automatically displays a fullscreen slideshow of the pictures existing in an album.

```js
var carousel = new CometWidgets.carousel('ALBUM_ID');
carousel.start();
// use carousel.stop() to stop the slideshow
```

Thel `ALBUM_ID` is either a comet `short_id` if the album owns one, or the `universal id` of this album.

# Examples

Cf the [example folder](https://github.com/cometapp/comet-widgets/tree/master/example).

# Licence
[MIT licence](https://opensource.org/licenses/MIT)
