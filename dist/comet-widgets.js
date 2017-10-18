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
    Utils.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Utils.shuffle = function (array) {
        if (array.length <= 1) {
            return array;
        }
        for (var i = 0; i < array.length; i++) {
            var randomIndex = Utils.random(i, array.length - 1);
            _a = [array[randomIndex], array[i]], array[i] = _a[0], array[randomIndex] = _a[1];
        }
        return array;
        var _a;
    };
    
    return Utils;
}());

// TODO FIX a onresize is defined whenever a new picture is inserted with watch
// TODO FIX partial duplicate with livereplace and display
var CarouselTemplate = /** @class */ (function () {
    function CarouselTemplate() {
    }
    /**
     * Render the content while waiting for the slides
     * @param {any}
     */
    CarouselTemplate.renderWait = function (options) {
        var carousel = {
            id: options.id,
            uuids: [],
            slides: [],
            tpls: { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' }
        };
        var template = CarouselTemplate.getTemplate('global', { carousel: carousel });
        CarouselTemplate.display(template, options);
    };
    /**
     * Render the slides into html
     * @param {string[]}
     * @param {any}
     */
    CarouselTemplate.render = function (slides, options) {
        // Create the carousel object
        var tpls = { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' };
        var carousel = { id: options.id, uuids: slides.map(function (s) { return s.uuid; }), slides: slides.map(function (s) { return s.link; }), tpls: tpls };
        // Render the subtemplates
        // for (let i in carousel.slides) {
        //   tpls.indicators =
        //     tpls.indicators +
        //     CarouselTemplate.getTemplate('indicator', { carousel, i })
        // }
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
    /**
     * Given a set of slides, make a diff and insert the new ones in the process
     * @param {string[]}
     * @param {any}
     */
    CarouselTemplate.liveRender = function (slides, options) {
        // Create the carousel object
        var tpls = { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' };
        var carousel = { id: options.id, uuids: slides.map(function (s) { return s.uuid; }), slides: slides.map(function (s) { return s.link; }), tpls: tpls };
        // Insert the new ones
        var previousId = '';
        var inserted = [];
        for (var i in carousel.slides) {
            var id = carousel.id + "-" + carousel.uuids[i];
            if (!$$1('#' + id).length) {
                var tpl = CarouselTemplate.getTemplate('item', { carousel: carousel, i: i });
                if (previousId === '') {
                    $$1("#" + id + " .carousel-inner").prepend(tpl);
                }
                else {
                    $$1("#" + previousId).after(tpl);
                }
                inserted.push(id);
            }
            previousId = id;
        }
        if (!inserted.length) {
            return;
        }
        var $items = $$1('#' + inserted.join(',#'));
        // Format the new pictures
        var fullscreen = !options.selector || !$$1("" + options.selector).length;
        var $container = fullscreen ? $$1('body') : $$1("" + options.selector);
        if ($container) {
            $items.height($container.height()).css({
                // backgroundColor: 'black',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            });
            // transform the imgs into background-images
            $items.find('img').each(function () {
                var src = $$1(this).attr('src');
                $$1(this)
                    .parent('.item')
                    .css({ backgroundImage: "url(" + src + ")" });
                $$1(this).remove();
            });
        }
        else {
            // Set height
            var windowHeight = $$1(window).height();
            $items.height(windowHeight).css({ backgroundColor: 'black' });
            // on resize
            $$1(window).on('resize', function () {
                var windowHeight = $$1(window).height();
                $items.height(windowHeight);
            });
        }
    };
    /**
     * Restart a stopped carousel
     * @type {[type]}
     */
    CarouselTemplate.restart = function (options) {
        $$1("#" + options.id)
            .fadeIn()
            .carousel('cycle');
    };
    /**
     * Stop the carousel
     * @param {any}
     */
    CarouselTemplate.stop = function (options) {
        $$1("#" + options.id)
            .fadeOut()
            .carousel('pause');
    };
    /**
     * Move to a specific slide
     * @param {number}
     * @param {any}
     */
    CarouselTemplate.goTo = function (nb, options) {
        $$1("#" + options.id).carousel("" + nb);
    };
    /**
     * Display the html
     * @param {string}
     * @param {any}
     */
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
    /**
     * Start the carousel
     * @param {any}
     */
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
    /**
     * Get one of the templates that makes the carousel
     * @param  {string}
     * @param  {any}
     * @return {string}
     */
    CarouselTemplate.getTemplate = function (template, params) {
        var carousel = params.carousel, i = params.i;
        var global = "\n    <div id=\"" + carousel.id + "\" class=\"carousel slide\" data-ride=\"carousel\">\n      <!-- Slides -->\n      <div class=\"carousel-inner\" role=\"listbox\">\n        " + carousel.tpls.items + "\n      </div>\n\n      <!-- Controls -->\n      " + carousel.tpls.controls + "\n    </div>";
        var indicator = "\n      <li data-target=\"#" + carousel.id + "\" data-slide-to=\"" + i + "\"" + (i === 0
            ? ' class="active"'
            : '') + "></li>";
        var item = "\n      <div id=\"" + carousel.id + "-" + carousel.uuids[i] + "\" class=\"item\"><img src=\"" + carousel.slides[i] + "\" /></div>";
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
                watch: false,
                watchInterval: 20000,
                random: false,
            };
            delete userOptions.id;
            _this.options = $$1.extend({}, defaultOptions, userOptions);
            _this.options.id = "comet-gallery-" + Math.floor(Math.random() * 1000);
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
                    if (_this.options.random) {
                        // Shuffle the medias
                        medias = Utils.shuffle(medias);
                    }
                    else {
                        // Sort the medias older < newer
                        medias.sort(function (m1, m2) {
                            var d1 = new Date(m1.taken_at);
                            var d2 = new Date(m2.taken_at);
                            if (d1 > d2) {
                                return 1;
                            }
                            return d1 < d2 ? -1 : 0;
                        });
                    }
                    _this.medias = medias;
                    resolve(true);
                    console.info("%c" + medias.length + " %cmedias in the album %c" + album.title, 'color:blue', 'color:black', 'color:blue');
                });
            });
        });
    }
    /**
     * Wait for the carousel to be ready
     */
    Carousel.prototype.ready = function () {
        var _this = this;
        if (!this.load) {
            return Promise.reject([]);
        }
        return this.load
            .then(function () {
            var slides = [];
            for (var i in _this.medias) {
                slides.push({
                    uuid: _this.medias[i].uuid,
                    link: _this.medias[i].formats[_this.choosenFormat]
                });
            }
            return slides;
        });
    };
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
                slides.push({
                    uuid: _this.medias[i].uuid,
                    link: _this.medias[i].formats[_this.choosenFormat]
                });
            }
            CarouselTemplate.render(slides, _this.options);
            // if (firstSlide) {
            //   CarouselTemplate.goTo(firstSlide, this.options);
            // }
            // Set state
            _this.cycling = true;
            // Set watch
            if (_this.options.watch) {
                _this.startWatch();
            }
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
        // Clear watch
        if (this.options.watch) {
            this.stopWatch();
        }
        // Stop
        CarouselTemplate.stop(this.options);
    };
    /**
     * Restart the carousel if it was stopped
     */
    Carousel.prototype.restart = function (firstSlide) {
        // Set state
        this.cycling = true;
        // Set watch
        if (this.options.watch) {
            this.startWatch();
        }
        // Restart
        CarouselTemplate.restart(this.options);
        // if (firstSlide) {
        //   CarouselTemplate.goTo(firstSlide, this.options);
        // }
    };
    /**
     * Start watching for new pictures in the album
     */
    Carousel.prototype.startWatch = function () {
        var _this = this;
        this.stopWatch();
        this.watch = window.setInterval(function () {
            if (!_this.album) {
                _this.stopWatch();
                return;
            }
            _this.watchCount++;
            // Find the media
            ApiService.getAlbumMedias(_this.album.uuid, {
                format: _this.choosenFormat
            }).then(function (medias) {
                if (_this.options.random) {
                    // Shuffle the medias
                    medias = Utils.shuffle(medias);
                }
                else {
                    // Sort the medias older < newer
                    medias.sort(function (m1, m2) {
                        var d1 = new Date(m1.taken_at);
                        var d2 = new Date(m2.taken_at);
                        if (d1 > d2) {
                            return 1;
                        }
                        return d1 < d2 ? -1 : 0;
                    });
                }
                // Save the media
                _this.medias = medias;
                // Render
                var slides = [];
                for (var i in _this.medias) {
                    slides.push({
                        uuid: _this.medias[i].uuid,
                        link: _this.medias[i].formats[_this.choosenFormat]
                    });
                }
                CarouselTemplate.liveRender(slides, _this.options);
            });
        }, this.options.watchInterval);
    };
    /**
     * Stop watching for new pictures in the album
     */
    Carousel.prototype.stopWatch = function () {
        if (this.watch) {
            window.clearInterval(this.watch);
        }
    };
    return Carousel;
}());

exports.carousel = Carousel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=comet-widgets.js.map
