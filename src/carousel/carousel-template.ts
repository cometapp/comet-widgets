import $ from 'jquery'
import 'bootstrap'

export class CarouselTemplate {
  public static renderWait(options: any) {
    let carousel: any = {
      id: options.id,
      slides: [],
      tpls: { indicators: '', items: '' }
    }
    let template = CarouselTemplate.getTemplate('global', { carousel })
    CarouselTemplate.display(template, options)
  }

  public static render(slides: string[], options: any) {
    // Create the carousel object
    let tpls: any = { indicators: '', items: '' }
    let carousel: any = { id: options.id, slides: slides, tpls: tpls }

    // Render the subtemplates
    for (let i in carousel.slides) {
      tpls.indicators =
        tpls.indicators +
        CarouselTemplate.getTemplate('indicator', { carousel, i })
    }
    for (let i in carousel.slides) {
      tpls.items =
        tpls.items + CarouselTemplate.getTemplate('item', { carousel, i })
    }

    // Render the template & append to body
    let template = CarouselTemplate.getTemplate('global', { carousel })
    CarouselTemplate.display(template, options)
    CarouselTemplate.start(options)
  }

  // restart a stopped carousel
  public static restart(options: any) {
    $(`#${options.id}`)
      .fadeIn()
      .carousel('cycle')
  }

  // stop the carousel
  public static stop(options: any) {
    $(`#${options.id}`)
      .fadeOut()
      .carousel('pause')
  }

  // move to a slide
  public static goTo(nb: number, options: any) {
    $(`#${options.id}`).carousel(`${nb}`)
  }

  protected static display(template: string, options: any) {
    // Replace
    if ($(`#${options.id}`).length) {
      $(`#${options.id}`).replaceWith(template)
    } else {
      $('body').append(template)
    }
    let $items = $(`#${options.id} .item`)
    let windowHeight = $(window).height() as number
    // if I do that in the template, carousel is not working
    $items.eq(0).addClass('active')
    $items.height(windowHeight).css({
      backgroundColor: 'black',
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

  // start the carousel
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

  protected static getTemplate(template: string, params: any): string {
    let { carousel, i } = params
    const global = `
    <div id="${carousel.id}" class="carousel slide" data-ride="carousel">
      <!-- Indicators -->
      <!-- <ol class="carousel-indicators">
        ${carousel.tpls.indicators}
      </ol> -->

      <!-- Slides -->
      <div class="carousel-inner" role="listbox">
        ${carousel.tpls.items}
      </div>

      <!-- Controls -->
      <!-- <a class="left carousel-control" href="#${carousel.id}" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#${carousel.id}" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a> -->
    </div>`
    const indicator = `
      <li data-target="#${carousel.id}" data-slide-to="${i}"${i === 0
      ? ' class="active"'
      : ''}></li>`
    const item = `
      <div class="item"><img src="${carousel.slides[i]}" /></div>`

    switch (template) {
      case 'global':
        return global
      case 'indicator':
        return indicator
      case 'item':
        return item
      default:
        return ''
    }
  }
}
