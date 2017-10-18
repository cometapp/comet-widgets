import $ from 'jquery';

// const $window = $(window);

export default class Utils {

  public static isUuid(uuid: string): boolean {
    if (!uuid || uuid.length !== 24 || !uuid.match(/[a-f0-9]/)) {
      return false;
    }
    return true;
  }

  public static bestMediaFormat(): string {
    class Format { name: string; size: number; constructor(name: string, size: number) { this.name = name; this.size = size; } }
    let mediaFormats: Format[] = [
      new Format('s', 370),
      new Format('m', 555),
      new Format('l', 1110),
      new Format('xl', 1242),
    ];
    let w = {
      width: $(window).width() || 0,
      height: $(window).height() || 0,
    };
    let size = Math.max(w.width, w.height);
    let format = 'xl';
    for (let i = 0; i < mediaFormats.length; i++) {
      if (mediaFormats[i].size > size) {
        format = mediaFormats[i].name;
        break
      }
    }
    // for (let i in mediaFormats) {
    //   if (mediaFormats[i] > size) {
    //     format = (i as string);
    //     break
    //   }
    // }
    return format;
  }

  public static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max-min+1) + min);
  }

  public static shuffle<T>(array: T[]): T[] {
    if (array.length <= 1) {
      return array;
    }
    for (let i = 0; i < array.length; i++) {
      const randomIndex = Utils.random(i, array.length - 1);
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  };

}
