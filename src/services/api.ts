import Rest from './rest';

import { AlbumModel, MediaModel } from "../models/index"
import { Utils } from "../comet-utils"

export default class ApiService {

  public static API_URL = 'https://api.cometapp.io/v2/';

  public static getAlbum(uuid: string): Promise<AlbumModel> {
    return Rest.get(`${ApiService.API_URL}albums/${uuid}`)
      .then(response => response.data as AlbumModel)
      .catch(ApiService.handleError);
  }

  public static getAlbumByShortId(shortId: string): Promise<AlbumModel> {
    return Rest.get(`${ApiService.API_URL}albums/short_id/${shortId}`)
      .then(response => response.data as AlbumModel)
      .catch(ApiService.handleError);
  }

  public static getAlbumMedias(uuid: string, params?: any): Promise<MediaModel[]> {
    let url = `${ApiService.API_URL}albums/${uuid}/medias`;
    if (params) {
      url = `${url}?${$.param(params)}`;
    }
    return Rest.get(url)
      .then(response => response.data as MediaModel[])
      .catch(ApiService.handleError);
  }

  protected static handleError(response: any): Promise<any> {
    let err = JSON.parse(response.responseText);
    console.error(`(${err.code} ${err.message}) ${err.error.type}: ${err.error.message}`);
    return Promise.reject({});
  }

}
