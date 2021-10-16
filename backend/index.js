const express = require('express')
const app = express()
const { exec } = require('child_process')
const  multer  = require('multer')
const fs = require('fs')
const {
  getAccessToken,
  getSharedAlbumList,
  getAlbumImageList,
  saveAlbumImage,
} = require('./google-photos')

// app.get('/', (req, res) => res.send('Hello World!'))

let isExecuting = false

app.post('/api/clear', (req,res) => {
  if (isExecuting == true) {
    res.send('api double requested')
    return;
  }
  isExecuting = true
  exec('sudo ../epd -c', (err, stdout, stderr) => {
    if (err) {
      console.log(`stderr: ${stderr}`)
    res.send('api error occured')
      isExecuting = false
      return
    }
    console.log(`stdout: ${stdout}`)
    res.send('api finished')
    isExecuting = false
  })
})

const uploadDir = '../pic'
const upload = multer({dest: uploadDir})
app.post('/api/upload', upload.any(), (req, res) => {
  if (isExecuting ===  true){
    res.send('api double requested')
    return;
  }
  isExecuting = true
  const file = req.files[0]

  exec(`convert ${uploadDir}/${file.filename} -resize 600x448 -map ../map.bmp +dither -type truecolor ${uploadDir}/image.bmp`, (err, stdout, stderr) => {
    if (err) {
      console.log(`stderr: ${stderr}`)
      isExecuting = false
      return
    }
    console.log(`stdout: ${stdout}`)

    exec(`sudo ../epd -i ${uploadDir}/image.bmp`, (err, stdout, stderr) => {
      if (err) {
        console.log(`stderr: ${stderr}`)
        isExecuting = false
        return
      }
      console.log(`stdout: ${stdout}`)
      isExecuting = false

      exec(`rm ${uploadDir}/${file.filename}`, (err, stdout, stderr) => {
        if (err) {
          console.log(`stderr: ${stderr}`)
          isExecuting = false
          return
        }
        isExecuting = false
        res.send('api finished')
      })
    })
  })
})

const localPicDir = '../local_pic'
app.get('/api/image', (req, res) => {
  exec(`ls ${localPicDir}`, (err, stdout, stderr) => {
    if (err) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    const result = stdout.split('\n')
    result.pop()
    res.send(result)
  })
})

app.get('/api/image/:path', (req, res) => {
  fs.readFile(`${localPicDir}/${req.params.path}`, (err, data) => {
    res.send(data)
  })
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})

app.get('/api/photo/album_list', async(req, res) => {
  const token = await getAccessToken()
  const album = await getSharedAlbumList(token)
  res.send(album.sharedAlbums)
})

app.get('/api/photo/album', async(req, res) => {
  const token = await getAccessToken()
  const images = await getAlbumImageList(token, req.query.id, req.query.size, req.query.next)
  res.send(images)
})

app.get('/api/photo/album/save', async(req, res) => {
  const token = await getAccessToken()
  const result = await saveAlbumImage(token, req.query.id)
  res.send(result)
})
