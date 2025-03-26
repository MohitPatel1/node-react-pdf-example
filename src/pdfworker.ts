import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { generateStreamingPDF } from './listDetailedPdf/ReportPdfUI'; // Assume this function exists
import { workerData, parentPort } from 'worker_threads';

const pipelineAsync = promisify(pipeline);

const GENERATED_PDF_DIR = path.join(__dirname, 'generatedPdf');
const MERGED_PDF_PATH = path.join(GENERATED_PDF_DIR, 'mergedPdf.pdf');

async function generatePDF(data) {
  const pdfData = data || workerData.data;

  console.log("Generating PDF...");

  try {
    // Ensure output directory exists
    if (!fs.existsSync(GENERATED_PDF_DIR)) {
      fs.mkdirSync(GENERATED_PDF_DIR, { recursive: true });
    }

    const pdfStreams = [];
    const chunkSize = 200;

    // Split data into chunks
    for (let i = 0; i < pdfData.filteredData.length; i += chunkSize) {
      const chunk = pdfData.filteredData.slice(i, i + chunkSize);
      const pdfStream = await generateStreamingPDF({ pdfData, filteredData: chunk });

      // Save the generated PDF stream to a file
      const filePath = path.join(GENERATED_PDF_DIR, `pdfChunk_${i / chunkSize}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      await pipelineAsync(pdfStream, writeStream);

      pdfStreams.push(filePath);
    }

    // Merge all generated PDFs
    await mergePDFs(pdfStreams, MERGED_PDF_PATH);
    console.log(`Merged PDF saved at: ${MERGED_PDF_PATH}`);

    parentPort.postMessage({ type: 'success', message: 'PDF generation and merging complete!' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    parentPort.postMessage({ type: 'error', message: error.message });
  }
}

// Function to merge multiple PDFs into one
async function mergePDFs(pdfPaths, outputPath) {
  const mergedPdf = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const pdfBytes = await fs.promises.readFile(pdfPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  await fs.promises.writeFile(outputPath, mergedPdfBytes);
}

export { generatePDF };

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