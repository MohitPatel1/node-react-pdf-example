// // Alternative implementation using renderToStream
// const { workerData, parentPort } = require('worker_threads');
// const React = require('react');
// const { Document, Page, Text, StyleSheet } = require('@react-pdf/renderer');
// const { renderToStream } = require('@react-pdf/renderer');
// const { PDFDocument } = require('pdf-lib');
// const { PassThrough } = require('stream');

// // Extract worker data
// const { data, chunkSize, itemsPerPage } = workerData;

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     flexDirection: 'column',
//   },
//   item: {
//     margin: 3,
//     fontSize: 10,
//   },
// });

// async function generatePDF() {
//   try {
//     // Calculate total pages and chunks
//     const totalItems = data.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const chunks = Math.ceil(totalPages / (chunkSize / itemsPerPage));
    
//     // Initialize the final PDF document
//     const finalPdfDoc = await PDFDocument.create();
    
//     // Process data in chunks to avoid memory issues
//     for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
//       // Calculate page range for this chunk
//       const startPage = chunkIndex * (chunkSize / itemsPerPage);
//       const endPage = Math.min(startPage + (chunkSize / itemsPerPage), totalPages);
      
//       // Create a document for this chunk using virtual rendering
//       const ChunkDocument = () => (
//         <Document>
//           {Array.from({ length: endPage - startPage }).map((_, relativePageIndex) => {
//             const pageIndex = startPage + relativePageIndex;
//             const startItem = pageIndex * itemsPerPage;
//             const endItem = Math.min(startItem + itemsPerPage, totalItems);
//             const pageItems = data.slice(startItem, endItem);
            
//             return (
//               <Page key={pageIndex} size="A4" style={styles.page}>
//                 {pageItems.map((item, idx) => (
//                   <Text key={idx} style={styles.item}>
//                     {item.toString()}
//                   </Text>
//                 ))}
//               </Page>
//             );
//           })}
//         </Document>
//       );
      
//       // Use renderToStream for better memory efficiency
//       const pdfStream = await renderToStream(<ChunkDocument />);
      
//       // Collect stream data into a buffer
//       const chunks = [];
//       for await (const chunk of pdfStream) {
//         chunks.push(chunk);
//       }
//       const buffer = Buffer.concat(chunks);
      
//       // Load chunk into PDF document
//       const chunkPdfDoc = await PDFDocument.load(buffer);
      
//       // Copy pages from chunk to final document
//       const copiedPages = await finalPdfDoc.copyPages(chunkPdfDoc, chunkPdfDoc.getPageIndices());
//       copiedPages.forEach(page => finalPdfDoc.addPage(page));
      
//       // Free up memory
//       global.gc && global.gc();
      
//       // Send progress update
//       parentPort.postMessage({ 
//         type: 'progress', 
//         current: chunkIndex + 1, 
//         total: chunks 
//       });
//     }
    
//     // Save the final PDF
//     const pdfBytes = await finalPdfDoc.save();
    
//     // Send the PDF data back to the main thread
//     parentPort.postMessage({ 
//       type: 'data', 
//       buffer: pdfBytes 
//     });
    
//     // Signal that we're done
//     parentPort.postMessage({ type: 'end' });
    
//   } catch (error) {
//     parentPort.postMessage({ 
//       type: 'error', 
//       message: error.message 
//     });
//   }
// }

// // Start PDF generation
// generatePDF();