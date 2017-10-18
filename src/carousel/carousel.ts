import $ from 'jquery'

import ApiService from '../services/api'
import { Album, Media, Slide } from '../models/index'
import Utils from '../comet-utils'

import CarouselTemplate from './carousel-template'

/**
 * Carousel component
 */
export class Carousel {

  public watchCount: number; // usefull for tests

  // state control
  private load: Promise<boolean>
  private loaded: boolean // if true, the data is loaded
  private cycling: boolean // if false, the slider is stopped

  private watch: number; // the interval if watch is activated

  private options: any
  private album: Album
  private medias: Media[]
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
        selector: null, // if a selector is specified, the carousel is not fullscreen
        format: 'o', // dimensions of the pictures (o, xl, l, m, s)
        controls: false, // show the controls or not
        interval: 5000, // duration of every picture
        loop: true, // will start again when reached the last picture
        watch: false, // will regularily ask the server for new pictures and auto-update itself
        watchInterval: 20000,
        random: false, // wether to display the pictures in a random order
        // infos: false, // TODO wether to display photo informations, like the user or the date
      }
      delete userOptions.id
      this.options = $.extend({}, defaultOptions, userOptions)
      this.options.id = `comet-gallery-${Math.floor(Math.random() * 1000)}`

      // Find the album & the medias
      let promise: Promise<Album>
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
        // this.choosenFormat = Utils.bestMediaFormat()
        this.choosenFormat = this.options.format;
        ApiService.getAlbumMedias(album.uuid, {
          format: this.choosenFormat
        }).then(medias => {
          // Set data
          if (!medias.length) {
            reject(false)
            return
          }

          if (this.options.random) {
            // Shuffle the medias
            medias = Utils.shuffle(medias);
          } else {
            // Sort the medias older < newer
            medias.sort((m1,m2) => {
              let d1 = new Date(m1.taken_at);
              let d2 = new Date(m2.taken_at);
              if (d1 > d2) {
                return 1;
              }
              return d1 < d2 ? -1 : 0;
            });
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

  /**
   * Wait for the carousel to be ready
   */
  ready(): Promise<Slide[]> {
    if (!this.load) {
      return Promise.reject([])
    }
    return this.load
      .then(() => {
        let slides: Slide[] = [];
        for (let i in this.medias) {
          slides.push({
            uuid: this.medias[i].uuid,
            link: this.medias[i].formats[this.choosenFormat] as string
          });
        }
        return slides;
      });
  }

  /**
   * Start to display the carousel
   */
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
        let slides: Slide[] = [];
        for (let i in this.medias) {
          slides.push({
            uuid: this.medias[i].uuid,
            link: this.medias[i].formats[this.choosenFormat] as string
          });
        }
        CarouselTemplate.render(slides, this.options)
        // if (firstSlide) {
        //   CarouselTemplate.goTo(firstSlide, this.options);
        // }

        // Set state
        this.cycling = true

        // Set watch
        if (this.options.watch) {
          this.startWatch();
        }

        return Promise.resolve(true)
      })
      .catch(_ => {
        console.error('could not start the carousel')
        return Promise.reject(false)
      })
  }

  /**
   * Hide the carousel
   */
  stop() {
    // Set state
    this.cycling = false
    // Clear watch
    if (this.options.watch) {
      this.stopWatch();
    }
    // Stop
    CarouselTemplate.stop(this.options)
  }

  /**
   * Restart the carousel if it was stopped
   */
  private restart(firstSlide?: number) {
    // Set state
    this.cycling = true
    // Set watch
    if (this.options.watch) {
      this.startWatch();
    }
    // Restart
    CarouselTemplate.restart(this.options)
    // if (firstSlide) {
    //   CarouselTemplate.goTo(firstSlide, this.options);
    // }
  }

  /**
   * Start watching for new pictures in the album
   */
  private startWatch() {
    this.stopWatch();
    this.watch = window.setInterval(() => {

      if (!this.album) {
        this.stopWatch();
        return;
      }

      this.watchCount++;

      // Find the media
      ApiService.getAlbumMedias(this.album.uuid, {
        format: this.choosenFormat
      }).then(medias => {

        if (this.options.random) {
          // Shuffle the medias
          medias = Utils.shuffle(medias);
        } else {
          // Sort the medias older < newer
          medias.sort((m1,m2) => {
            let d1 = new Date(m1.taken_at);
            let d2 = new Date(m2.taken_at);
            if (d1 > d2) {
              return 1;
            }
            return d1 < d2 ? -1 : 0;
          });
        }

        // Save the media
        this.medias = medias;

        // Render
        let slides: Slide[] = [];
        for (let i in this.medias) {
          slides.push({
            uuid: this.medias[i].uuid,
            link: this.medias[i].formats[this.choosenFormat] as string
          });
        }
        CarouselTemplate.liveRender(slides, this.options);
      })

    }, this.options.watchInterval);
  }

  /**
   * Stop watching for new pictures in the album
   */
  private stopWatch() {
    if (this.watch) {
      window.clearInterval(this.watch);
    }
  }
}
