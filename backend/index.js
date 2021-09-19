const express = require('express')
const app = express()
const { exec } = require('child_process')

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

app.post('/api/image', (req, res) => {
  if (isExecuting ===  true){
    res.send('api double requested')
    return;
  }
  isExecuting = true
  // FIXME
  isExecuting = false
  res.send('api finished')
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
})

