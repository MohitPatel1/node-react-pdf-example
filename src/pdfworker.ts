import React from 'react';
import { workerData, parentPort } from 'worker_threads';
import { renderToStream } from '@react-pdf/renderer';
import { generateStreamingPDF } from './listDetailedPdf/ReportPdfUI';
import fs from 'fs';


export async function generatePDF(data) {
  // Extract worker data
  const pdfData = data || workerData.data;
  // console.log("pdfData", pdfData);

  console.log("Generating PDF");
  try {
    // const pdfStream = await renderToStream(<ReportPdfUI data={pdfData} />);
    const pdfStream = await generateStreamingPDF(pdfData);// Stream chunks back to main thread as they become available
    // const pdfStream = await streamingPdfGenerator.generateStreamingPDF(data);

    // Example: Pipe to a file or send over network
    if (process.env.STORE_RESPONSE_PDF) {
      const writeStream = fs.createWriteStream('generatedPDF/pdfWorker10.pdf');
      pdfStream.pipe(writeStream);
    }
      pdfStream.on('data', (chunk) => {
        console.log("Sending chunk to main thread");
        parentPort.postMessage({  
          type: 'data',
          buffer: chunk
        });
      });
      pdfStream.on('end', () => {
        console.log("End of PDF stream");
        parentPort.postMessage({ type: 'end' });
      });

      pdfStream.on('error', (error) => {
        parentPort.postMessage({
          type: 'error',
          message: error.message
        });
      });
  }
  catch (error) {
    console.error('Error generating PDF:', error);
    parentPort.postMessage({
      type: 'error',
      message: error.message
    });
  }
}

// Listen for messages from the main thread
parentPort.on('message', (message) => {
    if (message.type === 'start') {
      generatePDF(message.data);
    }
  });

  // Auto-start when worker is loaded if workerData contains data
  if (workerData && workerData.data) {
    console.log("Worker starting with initial data");
    generatePDF(workerData.data);
}