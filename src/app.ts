import express from 'express'
import createTemplate from './createTemplate'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/createPDF', async (req, res) => {
  const result = await createTemplate(req.body)
  let fileName = `pdf-${Date.now()}.pdf`

  // Setting up the response headers
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)

  // Streaming our resulting pdf back to the user
  result.pipe(res)
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})