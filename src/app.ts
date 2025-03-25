import express from 'express'
const { Worker } = require('worker_threads');
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();

console.log('Environment variables loaded:', process.env);

const app = express()
const port = process.env.PORT || 3000

// Add body-parser middleware with increased size limit
app.use(bodyParser.json({ limit: '100mb' })) // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(cors())

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

        const workerOptions = {
          workerData: {
            data: req.body,
            config: {
              fontCaching: true,
              compressionLevel: 9,  // Max compression to reduce memory usage
              bufferPages: false     // Don't buffer pages in memory
            }
          }
        };
        console.log("worker path", path.join(__dirname, 'pdfworker.js'));
        try {
          const workerPath = path.join(__dirname, 'pdfworker.js');
          console.log("Attempting to start worker with path:", workerPath);
          const worker = await new Worker(workerPath, workerOptions);

          worker.on('message', (message) => {
            console.log("message");
            if (message.type === 'data') {
              res.write(Buffer.from(message.buffer));
            } else if (message.type === 'end') {
              res.end();
              console.log("res end");
            } else if (message.type === 'progress') {
              console.log(`Progress: ${message.current}/${message.total} chunks processed`);
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

          worker.on('exit', (code) => {
            if (code !== 0) {
              console.error(`Worker stopped with exit code ${code}`);
            }
          });

          // Handle client disconnection
          req.on('close', () => {
            worker.terminate();
          });
          console.log("app ts end");
        } catch (err) {
          console.error('Failed to start worker:', err);
          res.status(500).send('Failed to start PDF generation');
        }
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