**WORK IN PROGRESS** [![Build Status](https://travis-ci.org/florenthobein/comet-widgets.svg?branch=master)](https://travis-ci.org/florenthobein/comet-widgets)

Comet Widgets
===
> A list of javascript tools to interact with [Comet albums](https://cometapp.io)

# Requirements

These plugins depend on [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com) to work.

# Installation

```sh
git clone git@github.com:cometapp/comet-widgets.git comet-widgets
# the library is in the dist folder
```

# Usage

```html
<!-- include bootstrap.css -->
<!-- include jquery.js -->
<!-- include bootstrap.js -->
<script src="...link/to/the/file/comet-widgets.0.0.1.js"></script>
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
