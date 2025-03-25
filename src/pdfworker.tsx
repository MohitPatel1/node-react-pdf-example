// pdfWorker.js
import { workerData, parentPort } from 'worker_threads';
import React from 'react';
import { Document, Page, Text, pdf, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { PassThrough } from 'stream';
import { ReportPdfUI } from './listDetailedPdf/ReportPdfUI';


// Extract worker data
const { data, chunkSize, itemsPerPage } = workerData;

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: 'column',
  },
  item: {
    margin: 3,
    fontSize: 10,
  },
});

async function generatePDF() {
  try {
    const pdfStream = await renderToStream(<ReportPdfUI data={data} />);
    
    // Stream chunks back to main thread as they become available
    pdfStream.on('data', (chunk) => {
      parentPort.postMessage({
        type: 'data',
        buffer: chunk
      });
    });
    pdfStream.on('end', () => {
      parentPort.postMessage({ type: 'end' });
    });
    
    pdfStream.on('error', (error) => {
      parentPort.postMessage({
        type: 'error',
        message: error.message
      });
    });
    
    // Signal that we're done
    parentPort.postMessage({ type: 'end' });
    
  } catch (error) {
    parentPort.postMessage({ 
      type: 'error', 
      message: error.message 
    });
  }
}

// Start PDF generation
generatePDF();