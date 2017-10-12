Comet Widgets [![Build Status](https://travis-ci.org/cometapp/comet-widgets.svg?branch=master)](https://travis-ci.org/cometapp/comet-widgets)
===
> A set of javascript tools to interact with [Comet albums](https://cometapp.io)

# Dependencies

These widgets depend on [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com) to work.

# Installation

Get the libraries with [bower](https://bower.io/)
```sh
bower install comet-widgets
```

Import it in your html
```html
<!-- include css dependencies -->
<link rel="stylesheet" href="./bower_components/bootstrap/css/bootstrap.min.css" />

<!-- include js dependencies -->
<script src="./bower_components/jquery/dist/jquery.min.js"></script>
<script src="./bower_components/bootstrap/js/bootstrap.min.js"></script>

<!-- include comet-widget -->
<script src="./bower_components/comet-widgets/dist/comet-widgets.js"></script>
```

# Widgets list

## Carousel
Automatically displays a fullscreen slideshow of the pictures existing in an album.

```js
var carousel = new cometWidgets.carousel('ALBUM_ID');
carousel.start();
// use carousel.stop() to stop the slideshow
```

Thel `ALBUM_ID` is either a comet `short_id` if the album owns one, or the `universal id` of this album.

# Examples

Cf the [example folder](https://github.com/cometapp/comet-widgets/tree/master/example).

# Documentation

Check out the [github page of the project](https://cometapp.github.io/comet-widgets/).

# Licence
[MIT licence](https://opensource.org/licenses/MIT)
