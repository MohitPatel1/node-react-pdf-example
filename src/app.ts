import express from 'express'
const { Worker } = require('worker_threads');
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import { generatePdf } from './listDetailedPdf/ReportPdfUI'
import dotenv from 'dotenv'
dotenv.config();

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
        fs.writeFileSync(
          path.join(process.cwd(), "requests", `${Date.now()}.json`),
          JSON.stringify(req.body, null, 2)
        );
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
        // res.end("test");
        console.time("pdf generation");



        // worker thread


        const workerOptions = {
          workerData: {
            data: req.body,
            chunkSize: 1000,
            itemsPerPage: 60,
            // Add configuration options
            config: {
              fontCaching: true,
              compressionLevel: 9,  // Max compression to reduce memory usage
              bufferPages: false     // Don't buffer pages in memory
            }
          },
          resourceLimits: {
            maxOldGenerationSizeMb: 512,  // Limit memory for the worker
          }
        };

        const worker = new Worker(path.join(__dirname, 'pdfworker.js'), workerOptions);

        worker.on('message', (message) => {
          if (message.type === 'data') {
            res.write(Buffer.from(message.buffer));
          } else if (message.type === 'end') {
            res.end();
          } else if (message.type === 'progress') {
            console.log(`Progress: ${message.current}/${message.total} chunks processed`);
            // Could emit progress via SSE on a different connection
          } else if (message.type === 'error') {
            console.error('PDF generation error:', message.message);
            res.status(500).end('PDF generation failed');
          }
        });

        worker.on('error', (err) => {
          console.error('Worker error:', err);
          if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
          } else {
            res.end();
          }
        });

        // Handle client disconnection
        req.on('close', () => {
          worker.terminate();
        });






        generatePdf(req.body)
          .then((pdfStream) => {
            console.timeEnd("pdf generation");
            const filePath = path.join(process.cwd(), "generatedPdf", `${Date.now()}.pdf`);
            const writeStream = fs.createWriteStream(filePath);

            pdfStream.pipe(writeStream);

            writeStream.on('finish', () => {
              console.log(`PDF successfully written to ${filePath}`);
            });

            writeStream.on('error', (err) => {
              console.error("Error writing PDF to file:", err);
            });
          })
          .catch((err) => {
            console.error("PDF Generation Error file store error:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          });
      } else {
        generatePdf(req.body)
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