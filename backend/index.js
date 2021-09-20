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

const upload = multer({dest: '../pic'})
app.post('/api/image', upload.any(), (req, res) => {
  if (isExecuting ===  true){
    res.send('api double requested')
    return;
  }
  isExecuting = true
  // console.log(`originalname: ${req.file.originalname}`)
  // console.log(`path: ${req.file.path}`)
  console.log(req)
  console.log(req.files)

  let fileName = 'image.bmp'
  let targetPath = '../pic/' + fileName

  isExecuting = false
  res.send('api finished')
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})

