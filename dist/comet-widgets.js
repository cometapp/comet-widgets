(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('bootstrap')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'bootstrap'], factory) :
	(factory((global.cometWidgets = {}),global.jQuery));
}(this, (function (exports,$$1) { 'use strict';

$$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

var Rest = /** @class */ (function () {
    function Rest() {
    }
    Rest.get = function (url) {
        return $$1.get(url);
    };
    return Rest;
}());

var ApiService = /** @class */ (function () {
    function ApiService() {
    }
    ApiService.getAlbum = function (uuid) {
        return Rest.get(ApiService.API_URL + "albums/" + uuid)
            .then(function (response) { return response.data; })
            .catch(ApiService.handleError);
    };
    ApiService.getAlbumByShortId = function (shortId) {
        return Rest.get(ApiService.API_URL + "albums/short_id/" + shortId)
            .then(function (response) { return response.data; })
            .catch(ApiService.handleError);
    };
    ApiService.getAlbumMedias = function (uuid, params) {
        var url = ApiService.API_URL + "albums/" + uuid + "/medias";
        if (params) {
            url = url + "?" + $.param(params);
        }
        return Rest.get(url)
            .then(function (response) { return response.data; })
            .catch(ApiService.handleError);
    };
    ApiService.handleError = function (response) {
        var err = JSON.parse(response.responseText);
        console.error("(" + err.code + " " + err.message + ") " + err.error.type + ": " + err.error.message);
        return Promise.reject({});
    };
    ApiService.API_URL = 'https://api.cometapp.io/v2/';
    return ApiService;
}());

// const $window = $(window);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.isUuid = function (uuid) {
        if (!uuid || uuid.length !== 24 || !uuid.match(/[a-f0-9]/)) {
            return false;
        }
        return true;
    };
    Utils.bestMediaFormat = function () {
        var Format = /** @class */ (function () {
            function Format(name, size) {
                this.name = name;
                this.size = size;
            }
            return Format;
        }());
        var mediaFormats = [
            new Format('s', 370),
            new Format('m', 555),
            new Format('l', 1110),
            new Format('xl', 1242),
        ];
        var w = {
            width: $$1(window).width() || 0,
            height: $$1(window).height() || 0,
        };
        var size = Math.max(w.width, w.height);
        var format = 'xl';
        for (var i = 0; i < mediaFormats.length; i++) {
            if (mediaFormats[i].size > size) {
                format = mediaFormats[i].name;
                break;
            }
        }
        // for (let i in mediaFormats) {
        //   if (mediaFormats[i] > size) {
        //     format = (i as string);
        //     break
        //   }
        // }
        return format;
    };
    return Utils;
}());

var CarouselTemplate = /** @class */ (function () {
    function CarouselTemplate() {
    }
    CarouselTemplate.renderWait = function (options) {
        var carousel = {
            id: options.id,
            slides: [],
            tpls: { indicators: '', items: '', controls: '' }
        };
        var template = CarouselTemplate.getTemplate('global', { carousel: carousel });
        CarouselTemplate.display(template, options);
    };
    CarouselTemplate.render = function (slides, options) {
        // Create the carousel object
        var tpls = { indicators: '', items: '', controls: '' };
        var carousel = { id: options.id, slides: slides, tpls: tpls };
        // Render the subtemplates
        for (var i in carousel.slides) {
            tpls.indicators =
                tpls.indicators +
                    CarouselTemplate.getTemplate('indicator', { carousel: carousel, i: i });
        }
        for (var i in carousel.slides) {
            tpls.items =
                tpls.items + CarouselTemplate.getTemplate('item', { carousel: carousel, i: i });
        }
        if (options.controls) {
            tpls.controls = CarouselTemplate.getTemplate('controls', { carousel: carousel });
        }
        // Render the template & append to body
        var template = CarouselTemplate.getTemplate('global', { carousel: carousel });
        CarouselTemplate.display(template, options);
        CarouselTemplate.start(options);
    };
    // restart a stopped carousel
    CarouselTemplate.restart = function (options) {
        $$1("#" + options.id)
            .fadeIn()
            .carousel('cycle');
    };
    // stop the carousel
    CarouselTemplate.stop = function (options) {
        $$1("#" + options.id)
            .fadeOut()
            .carousel('pause');
    };
    // move to a slide
    CarouselTemplate.goTo = function (nb, options) {
        $$1("#" + options.id).carousel("" + nb);
    };
    CarouselTemplate.display = function (template, options) {
        var fullscreen = !options.selector || !$$1("" + options.selector).length;
        var $container = fullscreen ? $$1('body') : $$1("" + options.selector);
        // If existing, replace
        if ($$1("#" + options.id).length) {
            $$1("#" + options.id).replaceWith(template);
        }
        else {
            $container.append(template);
        }
        var $items = $$1("#" + options.id + " .item");
        // if I do that in the template, carousel is not working
        $items.eq(0).addClass('active');
        $items.height($container.height()).css({
            // backgroundColor: 'black',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        });
        // transform the imgs into background-images
        $$1("#" + options.id + " img").each(function () {
            var src = $$1(this).attr('src');
            $$1(this)
                .parent('.item')
                .css({ backgroundImage: "url(" + src + ")" });
            $$1(this).remove();
        });
        // Fullscreen options
        if (fullscreen) {
            // Set height
            var windowHeight = $$1(window).height();
            $items.height(windowHeight).css({ backgroundColor: 'black' });
            // on resize
            $$1(window).on('resize', function () {
                var windowHeight = $$1(window).height();
                $items.height(windowHeight);
            });
            // Display the template
            $$1("#" + options.id).css({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
        }
    };
    // start the carousel
    CarouselTemplate.start = function (options) {
        $$1("#" + options.id)
            .hide()
            .carousel({
            pause: 'false',
            interval: options.interval,
            wrap: options.loop
        })
            .fadeIn();
    };
    CarouselTemplate.getTemplate = function (template, params) {
        var carousel = params.carousel, i = params.i;
        var global = "\n    <div id=\"" + carousel.id + "\" class=\"carousel slide\" data-ride=\"carousel\">\n      <!-- Indicators -->\n      <!-- <ol class=\"carousel-indicators\">\n        " + carousel.tpls.indicators + "\n      </ol> -->\n\n      <!-- Slides -->\n      <div class=\"carousel-inner\" role=\"listbox\">\n        " + carousel.tpls.items + "\n      </div>\n\n      <!-- Controls -->\n      " + carousel.tpls.controls + "\n    </div>";
        var indicator = "\n      <li data-target=\"#" + carousel.id + "\" data-slide-to=\"" + i + "\"" + (i === 0
            ? ' class="active"'
            : '') + "></li>";
        var item = "\n      <div class=\"item\"><img src=\"" + carousel.slides[i] + "\" /></div>";
        var controls = "\n      <a class=\"left carousel-control\" href=\"#" + carousel.id + "\" role=\"button\" data-slide=\"prev\">\n        <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\n        <span class=\"sr-only\">Previous</span>\n      </a>\n      <a class=\"right carousel-control\" href=\"#" + carousel.id + "\" role=\"button\" data-slide=\"next\">\n        <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n        <span class=\"sr-only\">Next</span>\n      </a>";
        switch (template) {
            case 'global':
                return global;
            case 'indicator':
                return indicator;
            case 'item':
                return item;
            case 'controls':
                return controls;
            default:
                return '';
        }
    };
    return CarouselTemplate;
}());

/**
 * Carousel component
 */
var Carousel = /** @class */ (function () {
    function Carousel(id, userOptions) {
        if (userOptions === void 0) { userOptions = {}; }
        var _this = this;
        this.id = id;
        // Check dependencies
        if (typeof $$1 === 'undefined') {
            console.error('jQuery was not found');
            return;
        }
        if (!$$1.fn.carousel) {
            console.error('bootstrap was not found');
            return;
        }
        // Get the data
        this.load = new Promise(function (resolve, reject) {
            if (!id) {
                reject(false);
                console.error('An album id is a required parameter');
                return;
            }
            // Define the options
            var defaultOptions = {
                selector: null,
                format: 'o',
                controls: false,
                interval: 5000,
                loop: true,
                infos: true,
                watch: false,
            };
            delete userOptions.id;
            _this.options = $$1.extend({}, defaultOptions, userOptions);
            _this.options.id = "comet-gallery-" + Math.floor(Math.random() * 1000);
            // if (
            //   this.options.selector &&
            //   this.options.selector.match(/^\#[a-zA-Z0-9\_\-]+$/g)
            // ) {
            //   this.options.id = this.options.selector.substring(1)
            // } else {
            //   this.options.id = `comet-gallery-${Math.floor(Math.random() * 1000)}`
            // }
            // Find the album & the medias
            var promise;
            if (Utils.isUuid(id)) {
                promise = ApiService.getAlbum(id);
            }
            else {
                promise = ApiService.getAlbumByShortId(id);
            }
            promise.then(function (album) {
                // Set data
                if (!album.uuid) {
                    reject(false);
                    return;
                }
                _this.album = album;
                // Then find the medias
                // this.choosenFormat = Utils.bestMediaFormat()
                _this.choosenFormat = _this.options.format;
                ApiService.getAlbumMedias(album.uuid, {
                    format: _this.choosenFormat
                }).then(function (medias) {
                    // Set data
                    if (!medias.length) {
                        reject(false);
                        return;
                    }
                    _this.medias = medias;
                    resolve(true);
                    console.info("%c" + medias.length + " %cmedias in the album %c" + album.title, 'color:blue', 'color:black', 'color:blue');
                });
            });
        });
    }
    /**
     * Start to display the carousel
     */
    Carousel.prototype.start = function (firstSlide) {
        var _this = this;
        if (!this.load) {
            return Promise.reject(false);
        }
        // If it's a restart
        if (this.loaded && !this.cycling) {
            this.restart(firstSlide);
            return Promise.resolve(true);
        }
        // Render the waiting page
        CarouselTemplate.renderWait(this.options);
        // When the medias are loaded
        return this.load
            .then(function () {
            // If parallel loadiation
            if (_this.loaded) {
                return Promise.resolve(true);
            }
            // If problem with data
            if (!_this.album || !_this.medias) {
                console.error('could not start the carousel');
                return Promise.reject(false);
            }
            // Set state
            _this.loaded = true;
            // Render the carousel
            var slides = [];
            for (var i in _this.medias) {
                slides.push(_this.medias[i].formats[_this.choosenFormat]);
            }
            CarouselTemplate.render(slides, _this.options);
            // if (firstSlide) {
            //   CarouselTemplate.goTo(firstSlide, this.options);
            // }
            // Set state
            _this.cycling = true;
            return Promise.resolve(true);
        })
            .catch(function (_) {
            console.error('could not start the carousel');
            return Promise.reject(false);
        });
    };
    /**
     * Hide the carousel
     */
    Carousel.prototype.stop = function () {
        // Set state
        this.cycling = false;
        // Stop
        CarouselTemplate.stop(this.options);
    };
    /**
     * Restart the carousel if it was stopped
     */
    Carousel.prototype.restart = function (firstSlide) {
        // Set state
        this.cycling = true;
        // Restart
        CarouselTemplate.restart(this.options);
        // if (firstSlide) {
        //   CarouselTemplate.goTo(firstSlide, this.options);
        // }
    };
    return Carousel;
}());

exports.carousel = Carousel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=comet-widgets.js.map
