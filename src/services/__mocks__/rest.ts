import * as fs from 'fs';

// very simple mock

const Rest = {

  get: (url) => new Promise((resolve, reject) => {

    // Matches
    var regAlbum = /\/albums\/([a-z0-9]+)$/g;
    var regAlbumShort = /\/albums\/short_id\/([a-zA-Z0-9]+)$/g;
    var regAlbumMedias = /\/albums\/([a-z0-9]+)\/medias(?:\?.*)?$/g;

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

    fs.readFile(`./src/services/__mocks__/data/${resource}_${albumId}.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve(JSON.parse(data))
    })
  })
}

export default Rest;
