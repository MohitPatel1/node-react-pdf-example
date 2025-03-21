import React from 'react';
import { renderToStream } from "@react-pdf/renderer";
import { ListDetailedWebWorkerPDF } from "./listDetailedPdf/DetailedPdfUI";

/**
 * Generates a PDF stream from provided JSON data.
 * @param data The JSON data to be included in the PDF.
 * @returns A readable stream of the generated PDF.
 */
export const generatePdf = (data: any): Promise<NodeJS.ReadableStream> => {
    try {
        return renderToStream(<ListDetailedWebWorkerPDF data={data} />);
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("PDF generation failed");
    }
};
