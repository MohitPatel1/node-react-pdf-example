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
    try {
      console.log("req received");
      console.log("jsonData", process.env.STORE_REQUEST_JSON);
      if (process.env.STORE_REQUEST_JSON) {
        console.log("test mode, writing request to file");
        fs.writeFileSync(path.join(process.cwd(), "requests", `${Date.now()}.json`), req.body);
        console.log("request written to file");
      }
      console.time("PDF Generation Time");
      // Generate the PDF and stream it directly
      if (process.env.STORE_RESPONSE_PDF) {
        console.log("starting pdf generation");
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="generated.pdf"',
        });
        res.end("test");
        console.time("pdf generation");
        createTemplate(req.body)
          .then((pdfStream) => {
            console.timeEnd("pdf generation");
            const chunks: Buffer[] = [];
            pdfStream.on('data', (chunk) => chunks.push(chunk));
            pdfStream.on('end', () => {
              const pdfBuffer = Buffer.concat(chunks);
              fs.writeFileSync(path.join(process.cwd(), "generatedPdf", `${Date.now()}.pdf`), pdfBuffer);
            });
          })
          .catch((err) => {
            console.error("PDF Generation Error:", err);
          });
      } else {
        createTemplate(req.body)
          .then((pdfStream) => {
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="generated.pdf"',
            });
            console.timeEnd("PDF Generation Time");
            console.log("pdf generated, streaming now...");
            pdfStream.pipe(res)
          })
          .catch((err) => {
            console.error("PDF Generation Error:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
    }
  } catch (error) {
    console.error('Error processing request:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})