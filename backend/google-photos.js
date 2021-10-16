const fs = require('fs')
const childProcess = require('child_process')
const axios = require('axios')
const util = require('util');
const exec = util.promisify(childProcess.exec);

const client = JSON.parse(fs.readFileSync('./client.json', 'utf8'))

let accessToken = ''
exports.getAccessToken = async () => {
  // TODO: アクセストークンの多重取得は避けられるけど，時間制限を超えると使えなくなってしまう
  if (accessToken !== '') {
    return accessToken
  }
  const result = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
    refresh_token: client.refresh_token,
    client_id: client.client_id,
    client_secret: client.client_secret,
    grant_type: 'refresh_token',
  }).catch((err) => {
    console.log('auth failed')
    return 'error'
  })

  accessToken = result.data.access_token
  return accessToken
}

exports.getSharedAlbumList = async (accessToken) => {
  const result = await axios.get('https://photoslibrary.googleapis.com/v1/sharedAlbums', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((err) => {
    console.log(err)
    return 'error'
  })

  return result.data
}

exports.getAlbumImageList = async (accessToken, albumId, pageSize, pageToken) => {
  const result = await axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
    pageSize: pageSize,
    albumId: albumId,
    pageToken: pageToken,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }).catch((err) => {
    console.log(err)
    return 'error'
  })
  return result.data
}

exports.saveAlbumImage = async (accessToken, imageId) => {
  const result = await axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${imageId}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }).catch((err) => {
    console.log(err)
    return 'error'
  })
  await exec(`wget ${result.data.baseUrl}=w${result.data.mediaMetadata.width}-h${result.data.mediaMetadata.height} -O ../local_pic/image.jpg`).catch((err) => {
    console.log(err)
    return 'error'
  })
  return 'success'
}
