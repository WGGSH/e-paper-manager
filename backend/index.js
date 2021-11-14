const express = require('express')
const app = express()
// const { exec } = require('child_process')
const  multer  = require('multer')
const fs = require('fs')
const childProcess = require('child_process')
const util = require('util');
const exec = util.promisify(childProcess.exec);
const semver = require('semver')
const {
  getAccessToken,
  getSharedAlbumList,
  getAlbumImageList,
  saveAlbumImage,
} = require('./google-photos')
const bodyParser = require('body-parser')

// app.get('/', (req, res) => res.send('Hello World!'))

let isExecuting = false

// コンフィグの読み込み
let globalConfig
loadConfig = () => {
  globalConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
}

// 起動時の処理
onBoot = async () => {
  loadConfig()

  if (globalConfig.boot_on_random) {
    if (isExecuting ===  true){
      return;
    }
    isExecuting = true
    const result = await exec('ls ../local_pic')
    const files = result.stdout.split('\n')
    files.pop()
    const file = files[Math.floor(Math.random() * files.length)]
    await exec(`convert ../local_pic/${file} -resize 600x448 -map ../map.bmp +dither -type truecolor ${uploadDir}/image.bmp`)
    await exec(`sudo ../epd -i ${uploadDir}/image.bmp`).catch((err) => {
    })
  }
}
onBoot()

app.use(bodyParser.json())

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

app.post('/api/save', upload.any(), async(req, res) => {
  const file = req.files[0]
  exec(`mv ${uploadDir}/${file.filename} ../local_pic/${file.filename}`).catch((err) => {
    console.log(err)
  })
  res.send('finished')
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

app.get('/api/google-photos/image/:path', (req, res) => {
  fs.readFile(`../google-photos/${req.params.path}`, (err, data) => {
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
  try {
    const favoriteIdList = fs.readFileSync(`./data/${req.query.id}`, 'utf-8').split('\n')
    images.mediaItems.forEach((item) => {
      let result = false
      favoriteIdList.forEach((id) => {
        if (item.id === id) {
          result = true
          return
        }
      })
      item.isFavorite = result
    })
  } catch (err) {
    fs.writeFileSync(`./data/${req.query.id}`, '')
  }
  res.send(images)
})

app.get('/api/photo/album/save', async(req, res) => {
  const token = await getAccessToken()
  const result = await saveAlbumImage(token, req.query.id)
  res.send(result)
})

app.post('/api/favorite', async(req, res) => {
  let favoriteIdList = []
  fs.writeFileSync(`./data/${req.body.albumId}`, `\n${req.body.pictureId}`, { flag: 'a' })
  res.send('success')
})

app.delete('/api/favorite', async(req, res) => {
  let favoriteIdList = fs.readFileSync(`./data/${req.body.albumId}`, 'utf-8').split('\n')
  favoriteIdList = favoriteIdList.filter((value) => {
    return value !== req.body.pictureId
  })
  fs.writeFileSync(`./data/${req.body.albumId}`, favoriteIdList.join('\n'))
  res.send('success')
})

app.get('/api/current_version', async(req, res) => {
  const version = fs.readFileSync('../current_version', 'utf-8')
  res.send(version)
})

app.get('/api/latest_version', async(req, res) => {
  await exec('git fetch').catch((err) => {
    console.log(err)
  })
  const result = await exec('git tag').catch((err) => {
    console.log(err)
  })
  const tags = result.stdout.split('\n')
  tags.pop()
  const maxVer = tags.reduce((a, b) => {
    const va = semver.valid(a)
    const vb = semver.valid(b)
    if (va === null) return b
    if (vb === null) return a
    if (semver.gt(a, b)) return a
    else return b
  })
  res.send(maxVer)
})

app.post('/api/random', async(req, res) => {
  if (isExecuting ===  true){
    res.send('api double requested')
    return;
  }
  isExecuting = true
  const result = await exec('ls ../local_pic')
  const files = result.stdout.split('\n')
  files.pop()
  const file = files[Math.floor(Math.random() * files.length)]
  await exec(`convert ../local_pic/${file} -resize 600x448 -map ../map.bmp +dither -type truecolor ${uploadDir}/image.bmp`)
  await exec(`sudo ../epd -i ${uploadDir}/image.bmp`).catch((err) => {
    isExecuting = false
    res.send('failed')
  })
  res.send('success')
})

app.get('/api/config', async(req, res) => {
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
  res.send(config)
})

app.post('/api/config', async(req, res) => {
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  config[req.body.label] = req.body.value
  fs.writeFileSync('./config.json', JSON.stringify(config));
  globalConfig = config
  res.send('success')
})
