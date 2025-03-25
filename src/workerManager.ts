// // workerManager.ts
// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
// import React from 'react';
// import { renderToStream } from '@react-pdf/renderer';
// import { ReportPdfUI } from './listDetailedPdf/ReportPdfUI';

// // This file serves as both the worker manager and the worker itself
// if (!isMainThread) {
//   // Worker thread code
//   const { functionName, functionArgs } = workerData;
  
//   // Registry of available functions
//   const workerFunctions = {
//     generatePDF: async (data: any) => {
//       console.log("Generating PDF in worker thread");
//       try {
//         const pdfStream = await renderToStream(React.createElement(ReportPdfUI, { data }));
        
//         pdfStream.on('data', (chunk) => {
//           parentPort?.postMessage({
//             type: 'data',
//             buffer: chunk
//           });
//         });
        
//         pdfStream.on('end', () => {
//           parentPort?.postMessage({ type: 'end' });
//         });
        
//         pdfStream.on('error', (error) => {
//           parentPort?.postMessage({
//             type: 'error',
//             message: error.message
//           });
//         });
//       } catch (error) {
//         parentPort?.postMessage({ 
//           type: 'error', 
//           message: error instanceof Error ? error.message : 'Unknown error' 
//         });
//       }
//     }
//   };
  
//   // Execute the requested function
//   if (functionName in workerFunctions) {
//     workerFunctions[functionName](...functionArgs);
//   } else {
//     parentPort?.postMessage({ 
//       type: 'error', 
//       message: `Function ${functionName} not found` 
//     });
//   }
// } else {
//   // Export function to run a worker function
//   export function runInWorker(functionName: string, ...args: any[]) {
//     return new Promise((resolve, reject) => {
//       const worker = new Worker(__filename, {
//         workerData: {
//           functionName,
//           functionArgs: args
//         }
//       });
      
//       let result: any = null;
//       const chunks: Buffer[] = [];
      
//       worker.on('message', (message) => {
//         if (message.type === 'data') {
//           chunks.push(message.buffer);
//         } else if (message.type === 'end') {
//           resolve({ chunks, result });
//           worker.terminate();
//         } else if (message.type === 'error') {
//           reject(new Error(message.message));
//           worker.terminate();
//         } else if (message.type === 'result') {
//           result = message.data;
//         }
//       });
      
//       worker.on('error', (err) => {
//         reject(err);
//         worker.terminate();
//       });
      
//       worker.on('exit', (code) => {
//         if (code !== 0) {
//           reject(new Error(`Worker stopped with exit code ${code}`));
//         }
//       });
//     });
//   }
// }