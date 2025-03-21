import express from 'express'
import createTemplate from './createTemplate'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000

// Add body-parser middleware with increased size limit
app.use(bodyParser.json({ limit: '100mb' })) // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

app.get('/', (req, res) => {
  res.send('Hello From PDF Service!')
})

app.post('/', async (req, res) => {
  try {
    req.body.columnDef = JSON.parse(req.body.columnDef);
    const pageWidth = req.body.pdfSettings?.pageOrientation === "portrait" ? 595 - 20 : 842 - 20;
    const extraWidthExpandablePerColumn = req.body.pdfSettings
      ? req.body.pdfSettings.nonGroupedExpandableColumns.length
        ? (pageWidth - req.body.pdfSettings.totalColWidth) / req.body.pdfSettings.nonGroupedExpandableColumns.length
        : (pageWidth - req.body.pdfSettings.totalColWidth) / req.body.nonGroupColumns.length
      : 0;
    req.body.extraWidthExpandablePerColumn = extraWidthExpandablePerColumn;
    const result = await createTemplate(req.body);
    let fileName = `pdf-${Date.now()}.pdf`
    // fs.writeFileSync(fileName, result);

    // Setting up the response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)

    // Streaming our resulting pdf back to the user
    result.pipe(res)
  } catch (error) {
    console.error('Error processing request:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})