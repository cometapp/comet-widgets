import * as fs from 'fs';

// very simple mock

const Rest = {

  cache: {} as any,

  get: (url: string) => new Promise((resolve, reject) => {

    // Matches
    let regAlbum = /\/albums\/([a-z0-9]+)$/g;
    let regAlbumShort = /\/albums\/short_id\/([a-zA-Z0-9]+)$/g;
    let regAlbumMedias = /\/albums\/([a-z0-9]+)\/medias(?:\?.*)?$/g;

    let resource = '';
    let albumId = '';

    if (regAlbum.test(url)) {
      let res = url.split(regAlbum);
      albumId = res[1];
      resource = 'album';
    }
    else if (regAlbumShort.test(url)) {
      let res = url.split(regAlbumShort);
      albumId = res[1];
      resource = 'album';
    }
    else if (url.search(regAlbumMedias)) {
      let res = url.split(regAlbumMedias);
      albumId = res[1];
      resource = 'medias';
    }

    if (Rest.cache[`${resource}_${albumId}.json`]) {
      resolve(Rest.cache[`${resource}_${albumId}.json`]);
      return;
    }


    fs.readFile(`./src/services/__mocks__/data/${resource}_${albumId}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      Rest.cache[`${resource}_${albumId}.json`] = JSON.parse(data);
      resolve(JSON.parse(data))
    })
  })
}

export default Rest;
