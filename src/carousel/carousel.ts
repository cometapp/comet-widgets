import $ from 'jquery'

import ApiService from '../comet-services'
import { AlbumModel, MediaModel } from '../models/index'
import { Utils } from '../comet-utils'

import { CarouselTemplate } from './carousel-template'

// Carousel component
export class Carousel {
  // state control
  private load: Promise<boolean>
  private loaded: boolean // if true, the data is loaded
  private cycling: boolean // if false, the slider is stopped

  private options: any
  private album: AlbumModel
  private medias: MediaModel[]
  private choosenFormat: string

  constructor(public id: string, userOptions: any = {}) {
    // Check dependencies
    if (typeof $ === 'undefined') {
      console.error('jQuery was not found')
      return
    }
    if (!$.fn.carousel) {
      console.error('bootstrap was not found')
      return
    }

    // Get the data
    this.load = new Promise<boolean>((resolve, reject) => {
      if (!id) {
        reject(false)
        console.error('An album id is a required parameter')
        return
      }

      // Define the options
      let defaultOptions = {
        selector: null, // TODO if a selector is specified, the carousel is not fullscreen
        interval: 5000, // duration of every picture
        infos: true, // TODO wether to display photo informations, like the user or the date
        watch: false, // TODO will regularily ask the server for new pictures and auto-update itself
        loop: true // will start again when reached the last picture
      }
      delete userOptions.id
      this.options = $.extend({}, defaultOptions, userOptions)
      if (
        this.options.selector &&
        this.options.selector.match(/^\#[a-zA-Z0-9\_\-]+$/g)
      ) {
        this.options.id = this.options.selector.substring(1)
      } else {
        this.options.id = `comet-gallery-${Math.floor(Math.random() * 1000)}`
      }

      // Find the album & the medias
      let promise: Promise<AlbumModel>
      if (Utils.isUuid(id)) {
        promise = ApiService.getAlbum(id)
      } else {
        promise = ApiService.getAlbumByShortId(id)
      }
      promise.then(album => {
        // Set data
        if (!album.uuid) {
          reject(false)
          return
        }
        this.album = album

        // Then find the medias
        this.choosenFormat = Utils.bestMediaFormat()
        ApiService.getAlbumMedias(album.uuid, {
          format: this.choosenFormat
        }).then(medias => {
          // Set data
          if (!medias.length) {
            reject(false)
            return
          }
          this.medias = medias
          resolve(true)

          console.info(
            `%c${medias.length} %cmedias in the album %c${album.title}`,
            'color:blue',
            'color:black',
            'color:blue'
          )
        })
      })
    })
  }

  // Start to display the carousel
  start(firstSlide?: number): Promise<boolean> {
    if (!this.load) {
      return Promise.reject(false)
    }

    // If it's a restart
    if (this.loaded && !this.cycling) {
      this.restart(firstSlide)
      return Promise.resolve(true)
    }

    // Render the waiting page
    CarouselTemplate.renderWait(this.options)

    // When the medias are loaded
    return this.load
      .then(() => {
        // If parallel loadiation
        if (this.loaded) {
          return Promise.resolve(true)
        }

        // If problem with data
        if (!this.album || !this.medias) {
          console.error('could not start the carousel')
          return Promise.reject(false)
        }

        // Set state
        this.loaded = true

        // Render the carousel
        let slides: string[] = []
        for (let i in this.medias) {
          slides.push(this.medias[i].formats[this.choosenFormat] as string)
        }
        CarouselTemplate.render(slides, this.options)
        // if (firstSlide) {
        //   CarouselTemplate.goTo(firstSlide, this.options);
        // }

        // Set state
        this.cycling = true

        return Promise.resolve(true)
      })
      .catch(_ => {
        console.error('could not start the carousel')
        return Promise.reject(false)
      })
  }

  // Hide the carousel
  stop() {
    // Set state
    this.cycling = false
    // Stop
    CarouselTemplate.stop(this.options)
  }

  // If the carousel was stopped, restart it
  private restart(firstSlide?: number) {
    // Set state
    this.cycling = true
    // Restart
    CarouselTemplate.restart(this.options)
    // if (firstSlide) {
    //   CarouselTemplate.goTo(firstSlide, this.options);
    // }
  }
}
