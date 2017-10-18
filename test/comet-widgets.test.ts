// Mocking
jest.mock('../src/services/rest')
jest.useFakeTimers();
console.error = jest.fn(err => {});

// External libraries
import $ from 'jquery'

// Global import
import * as CometWidgets from '../src/comet-widgets'

// Specific imports
import Utils from '../src/comet-utils'
import ApiService from '../src/services/api'
import { Slide } from '../src/models/index'
import CarouselTemplate from '../src/carousel/carousel-template'

afterEach(() => $('.carousel').remove());

describe('Api tests', () => {

  it('should throw an error', () => {
    expect(ApiService.getAlbum('dummy')).rejects.toBeDefined();
  })

  it('should load album data from id', () => {
    return ApiService.getAlbum('5566dcdf0180d753a5002570')
      .then(data => {
        expect(data).toBeDefined()
        expect(data.title).toEqual('Comet story')
      })
  })

  it('should load album data from short id', () => {
    return ApiService.getAlbumByShortId('comet')
      .then(data => {
        expect(data).toBeDefined()
        expect(data.title).toEqual('Comet story')
      })
  })

  it('should load the medias from a timeline', () => {
    return ApiService.getAlbumMedias('5566dcdf0180d753a5002570')
      .then(data => {
        expect(data).toBeDefined()
        expect(data.length).toEqual(4)
      })
  })

  it('should load the medias from a timeline with a specific format', () => {
    return ApiService.getAlbumMedias('5566dcdf0180d753a5002570', { format: 's' })
      .then(data => {
        expect(data).toBeDefined()
        expect(data.length).toEqual(4)
      })
  })
})

describe('Utils tests', () => {
  it("should recognize a uuid", () => {
    expect(Utils.isUuid('5566dcdf0180d753a5002570')).toBeTruthy()
    expect(Utils.isUuid('dummy')).toBeFalsy()
  })
  it ("shoud find the best media size", () => {
    expect(Utils.bestMediaFormat()).toEqual('s') // no window
  })
})

describe('Carousel tests', () => {
  it("should instantiate Carousel", () => {
    expect(new CometWidgets.carousel()).toBeInstanceOf(CometWidgets.carousel)
  })

  it ("shoud throw an error for a wrong album", () => {
    let carousel = new CometWidgets.carousel('dummy');
    expect(carousel.start()).rejects.toBeDefined();
  })

  it ("shoud start with an album id", () => {
    let carousel = new CometWidgets.carousel('5566dcdf0180d753a5002570');
    carousel.start().then((value) => {
      expect(value).toBeTruthy();
    })
  })

  it ("shoud start with an album short id", () => {
    let carousel = new CometWidgets.carousel('comet');
    carousel.start().then((value) => {
      expect(value).toBeTruthy();
    })
  })

  it ("shoud display a waiting screen in the DOM", () => {
    // Directly through carouseltemplate
    CarouselTemplate.renderWait({ id: 'test' });
    expect($('#test').length).toEqual(1);
    expect($('.items').length).toEqual(0);

    $('.carousel').remove();

    // Normal use
    let carousel = new CometWidgets.carousel('comet')
    carousel.start();
    expect($('.carousel').length).toEqual(1);
    expect($('.items').length).toEqual(0);
  })

  it ("shoud add items in the DOM", () => {
    let carousel = new CometWidgets.carousel('comet')
      .ready()
      .then((slides: Slide[]) => {
        CarouselTemplate.render(slides, {id: 'test'});
        expect($('.items').length).toEqual(4);
      });
  })

  it ("shoud watch for changes", () => {
    let carousel = new CometWidgets.carousel('comet', {
      watch: true
    });
    carousel.start().then((value) => {

      expect(carousel.watchCount).toBe(0);

      jest.runOnlyPendingTimers();

      expect(carousel.watchCount).toBe(1);
      expect(setInterval.mock.calls.length).toBe(1);
    })
  })

  it ("shoud add changes in the DOM", () => {
    let carousel = new CometWidgets.carousel('comet', {
      watch: true
    });
    carousel.ready().then((slides: Slide[]) => {
      // Remove one
      let missingOne = slides.filter((_, i) => i !== 0);
      CarouselTemplate.render(missingOne, {id: 'test'});
      expect($('.items').length).toEqual(3);

      // Do a liveRender
      CarouselTemplate.liveRender(slides, {id: 'test'});
      expect($('.items').length).toEqual(4);
    });
  })

})
