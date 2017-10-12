jest.mock('../src/services/rest')
console.error = jest.fn(err => {  });

import * as CometWidgets from '../src/index'
import Utils from '../src/comet-utils'
import ApiService from '../src/services/api'

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
    let carousel = new CometWidgets.carousel('comet');
    carousel.start().then((value) => {
      expect(value).toBeTruthy();
    })
  })

  it ("shoud start with an album short id", () => {
    let carousel = new CometWidgets.carousel('5566dcdf0180d753a5002570');
    carousel.start().then((value) => {
      expect(value).toBeTruthy();
    })
  })

})
