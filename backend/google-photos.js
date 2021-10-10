const fs = require('fs')
const axios = require('axios')

const client = JSON.parse(fs.readFileSync('./client.json', 'utf8'))

exports.getAccessToken = async () => {
  const result = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
    refresh_token: client.refresh_token,
    client_id: client.client_id,
    client_secret: client.client_secret,
    grant_type: 'refresh_token',
  }).catch((err) => {
    console.log('auth failed')
    return 'error'
  })

  return result.data.access_token
}

exports.getSharedAlbumList = async (accessToken) => {
  console.log(accessToken)
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
