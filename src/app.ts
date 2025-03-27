import express from 'express'
import bodyParser, { json } from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import { generateStreamingPDF } from './listDetailedPdf/ReportPdfUI'
dotenv.config();

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello From PDF Service!')
})

// Add body-parser middleware with increased size limit
app.use(bodyParser.json({ limit: '100mb' })) // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(cors())

app.post('/', async (req, res) => {
  try {
    const columnDef = JSON.parse(req.body.columnDef);
    req.body.columnDef = columnDef;
    const pageWidth = req.body.pdfSettings?.pageOrientation === "portrait" ? 595 - 20 : 842 - 20;
    req.body.extraWidthExpandablePerColumn = req.body.pdfSettings
      ? req.body.pdfSettings.nonGroupedExpandableColumns.length
        ? (pageWidth - req.body.pdfSettings.totalColWidth) / req.body.pdfSettings.nonGroupedExpandableColumns.length
        : (pageWidth - req.body.pdfSettings.totalColWidth) / req.body.nonGroupColumns.length
      : 0;
    req.body.columnDefMap = columnDef.reduce((acc: any, col: any) => {
      acc[col.id] = col;
      return acc;
    }, {});

    try {   
      const pdfStream = await generateStreamingPDF(req.body);
      res.setHeader('Content-Type', 'application/pdf');
      pdfStream.pipe(res);

      if(process.env.STORE_RESPONSE_PDF){
        const fileStream = fs.createWriteStream('pdf.pdf');
        pdfStream.pipe(fileStream);
      }
      
      // Listen for the 'end' event to close the response
      pdfStream.on('end', () => {
        res.end();
      });

      // Handle errors in the PDF stream
      pdfStream.on('error', (error) => {
        console.error("Error in PDF stream:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      });

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

if(process.env.NODE_ENV === "development"){
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
}