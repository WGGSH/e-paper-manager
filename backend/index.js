const express = require('express')
const app = express()
const { exec } = require('child_process')
const  multer  = require('multer')

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
app.post('/api/image', upload.any(), (req, res) => {
  if (isExecuting ===  true){
    res.send('api double requested')
    return;
  }
  isExecuting = true
  const file = req.files[0]
  console.log(`originalname: ${file.originalname}`)
  console.log(`path: ${file.path}`)

  exec(`mv ${uploadDir}/${file.filename} ${uploadDir}/${file.originalname}`, (err, stdout, stderr) => {
    if (err) {
      console.log(`stderr: ${stderr}`)
      isExecuting = false
      return
    }
    console.log(`stdout: ${stdout}`)

    exec(`convert ${uploadDir}/${file.originalname} -resize 600x448 +dither -map ${uploadDir}/map.png -type truecolor ${uploadDir}/image.bmp`, (err, stdout, stderr) => {
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
        res.send('api finished')
      })
    })
  })
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})

