const {
  getAccessToken,
  getSharedAlbumList,
  getAlbumImageList,
  getAlbumImage,
} = require('./google-photos')

main = async () => {
  const token = await getAccessToken()
  // console.log(token)
  const albumList = await getSharedAlbumList(token)
  const album = await getAlbumImageList(token, albumList.sharedAlbums[0].id, 24)
  const image = await getAlbumImage(token, album.mediaItems[0].id)
  // console.log(image)
}

main()
