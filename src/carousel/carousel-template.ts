// TODO FIX a onresize is defined whenever a new picture is inserted with watch
// TODO FIX partial duplicate with livereplace and display

import $ from 'jquery'
import 'bootstrap'

import { Slide } from '../models/index'

export default class CarouselTemplate {

  /**
   * Render the content while waiting for the slides
   * @param {any}
   */
  public static renderWait(options: any) {
    let carousel: any = {
      id: options.id,
      uuids: [],
      slides: [],
      tpls: { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' }
    }
    let template = CarouselTemplate.getTemplate('global', { carousel })
    CarouselTemplate.display(template, options)
  }

  /**
   * Render the slides into html
   * @param {string[]}
   * @param {any}
   */
  public static render(slides: Slide[], options: any) {
    // Create the carousel object
    let tpls: any = { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' }
    let carousel: any = { id: options.id, uuids: slides.map(s => s.uuid), slides: slides.map(s => s.link), tpls: tpls }

    // Render the subtemplates
    // for (let i in carousel.slides) {
    //   tpls.indicators =
    //     tpls.indicators +
    //     CarouselTemplate.getTemplate('indicator', { carousel, i })
    // }
    for (let i in carousel.slides) {
      tpls.items =
        tpls.items + CarouselTemplate.getTemplate('item', { carousel, i })
    }
    if (options.controls) {
      tpls.controls = CarouselTemplate.getTemplate('controls', { carousel });
    }

    // Render the template & append to body
    let template = CarouselTemplate.getTemplate('global', { carousel })
    CarouselTemplate.display(template, options)
    CarouselTemplate.start(options)
  }

  /**
   * Given a set of slides, make a diff and insert the new ones in the process
   * @param {string[]}
   * @param {any}
   */
  public static liveRender(slides: Slide[], options: any) {

    // Create the carousel object
    let tpls: any = { indicators: '<!-- hidden -->', items: '', controls: '<!-- hidden -->' }
    let carousel: any = { id: options.id, uuids: slides.map(s => s.uuid), slides: slides.map(s => s.link), tpls: tpls }

    // Insert the new ones
    let previousId = '';
    let inserted = [];
    for (let i in carousel.slides) {
      let id = `${carousel.id}-${carousel.uuids[i]}`;
      if (!$('#'+id).length) { // if the item doesn't exist
        let tpl = CarouselTemplate.getTemplate('item', { carousel, i });
        if (previousId === '') {
          $(`#${id} .carousel-inner`).prepend(tpl);
        } else {
          $(`#${previousId}`).after(tpl);
        }
        inserted.push(id);
      }
      previousId = id;
    }

    if (!inserted.length) {
      return;
    }

    let $items = $('#'+inserted.join(',#'));

    // Format the new pictures
    let fullscreen = !options.selector || !$(`${options.selector}`).length;
    let $container = fullscreen ? $('body') : $(`${options.selector}`);
    if ($container) {

      $items.height($container.height() as number).css({
        // backgroundColor: 'black',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      })

      // transform the imgs into background-images
      $items.find('img').each(function() {
        let src = $(this).attr('src')
        $(this)
          .parent('.item')
          .css({ backgroundImage: `url(${src})` })
        $(this).remove()
      })

    } else {

      // Set height
      let windowHeight = $(window).height() as number
      $items.height(windowHeight).css({ backgroundColor: 'black' });

      // on resize
      $(window).on('resize', () => {
        let windowHeight = $(window).height() as number
        $items.height(windowHeight)
      })
    }

  }

  /**
   * Restart a stopped carousel
   * @type {[type]}
   */
  public static restart(options: any) {
    $(`#${options.id}`)
      .fadeIn()
      .carousel('cycle')
  }

  /**
   * Stop the carousel
   * @param {any}
   */
  public static stop(options: any) {
    $(`#${options.id}`)
      .fadeOut()
      .carousel('pause')
  }

  /**
   * Move to a specific slide
   * @param {number}
   * @param {any}
   */
  public static goTo(nb: number, options: any) {
    $(`#${options.id}`).carousel(`${nb}`)
  }

  /**
   * Display the html
   * @param {string}
   * @param {any}
   */
  protected static display(template: string, options: any) {

    let fullscreen = !options.selector || !$(`${options.selector}`).length;
    let $container = fullscreen ? $('body') : $(`${options.selector}`);

    // If existing, replace
    if ($(`#${options.id}`).length) {
      $(`#${options.id}`).replaceWith(template)
    } else {
      $container.append(template);
    }

    let $items = $(`#${options.id} .item`);
    // if I do that in the template, carousel is not working
    $items.eq(0).addClass('active')
    $items.height($container.height() as number).css({
      // backgroundColor: 'black',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })
    // transform the imgs into background-images
    $(`#${options.id} img`).each(function() {
      let src = $(this).attr('src')
      $(this)
        .parent('.item')
        .css({ backgroundImage: `url(${src})` })
      $(this).remove()
    })

    // Fullscreen options
    if (fullscreen) {

      // Set height
      let windowHeight = $(window).height() as number
      $items.height(windowHeight).css({ backgroundColor: 'black' });

      // on resize
      $(window).on('resize', () => {
        let windowHeight = $(window).height() as number
        $items.height(windowHeight)
      })

      // Display the template
      $(`#${options.id}`).css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    }
  }

  /**
   * Start the carousel
   * @param {any}
   */
  protected static start(options: any) {
    $(`#${options.id}`)
      .hide()
      .carousel({
        pause: 'false',
        interval: options.interval,
        wrap: options.loop
      })
      .fadeIn()
  }

  /**
   * Get one of the templates that makes the carousel
   * @param  {string}
   * @param  {any}
   * @return {string}
   */
  protected static getTemplate(template: string, params: any): string {
    let { carousel, i } = params
    const global = `
    <div id="${carousel.id}" class="carousel slide" data-ride="carousel">
      <!-- Slides -->
      <div class="carousel-inner" role="listbox">
        ${carousel.tpls.items}
      </div>

      <!-- Controls -->
      ${carousel.tpls.controls}
    </div>`
    const indicator = `
      <li data-target="#${carousel.id}" data-slide-to="${i}"${i === 0
      ? ' class="active"'
      : ''}></li>`
    const item = `
      <div id="${carousel.id}-${carousel.uuids[i]}" class="item"><img src="${carousel.slides[i]}" /></div>`
    const controls = `
      <a class="left carousel-control" href="#${carousel.id}" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#${carousel.id}" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>`

    switch (template) {
      case 'global':
        return global
      case 'indicator':
        return indicator
      case 'item':
        return item
      case 'controls':
        return controls
      default:
        return ''
    }
  }
}
