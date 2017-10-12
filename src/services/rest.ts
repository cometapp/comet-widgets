import $ from 'jquery';

import { AlbumModel, MediaModel } from "../models/index"
import { Utils } from "../comet-utils"

export default class Rest {

  public static get(url: string): Promise<any> {
    return $.get(url);
  }

}
