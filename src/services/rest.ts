import $ from 'jquery';

export default class Rest {

  public static get(url: string): Promise<any> {
    return $.get(url);
  }

}
