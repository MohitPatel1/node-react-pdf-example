import React, { useMemo } from 'react';
import { Document, Page, Text, View, Font, renderToStream } from '@react-pdf/renderer';
import GenListPdfDetailTableTitles from "./GenListPdfDetailTableTitles.js";
import GenListPdfDetailHeader from "./GenListPdfDetailHeader.js";
import { GenListPdfDetailChildRow1 } from "./DetailChildRows.js";
import { HeaderRegular } from "./HeaderWithoutLocalCache.js";
import FooterRegular from "../header-footer/footerRegular.js";
import { pdfStyles } from './pdfStyles.js';
import path from 'path';
import fs from 'fs';

// Logging utility
const logger = {
    info: (message: string) => {
        if (process.env.PDF_GENERATION_LOGS) {
            console.log(`[PDF Generator] ${message}`);
        }
    },
    error: (message: string) => {
        console.error(`[PDF Generator] ERROR: ${message}`);
    }
};

// Font registration
const fontPath = process.env.FONT_PATH || `${process.cwd()}/src/fonts`;

try {
    Font.register({
        family: "Roboto",
        fonts: [
            { src: path.join(fontPath, "Roboto-Regular.ttf") },
            { src: path.join(fontPath, "Roboto-Bold.ttf") }
        ],
    });
    Font.register({ family: "Roboto-bold", fonts: [{ src: path.join(fontPath, "Roboto-Bold.ttf") }] });
    Font.register({ family: "Roboto-Italic", fonts: [{ src: path.join(fontPath, "Roboto-Italic.ttf") }] });
    Font.register({ family: "Roboto-MediumItalic", fonts: [{ src: path.join(fontPath, "Roboto-MediumItalic.ttf") }] });
    Font.register({ family: "Roboto-medium", fonts: [{ src: path.join(fontPath, "Roboto-Medium.ttf") }] });
} catch (fontError) {
    logger.error(`Font registration failed: ${fontError.message}`);
}

export function ReportPdfUI({ data, filteredData }: any) {
    try {
        if (!data) {
            logger.error('No data provided for PDF generation');
            return null;
        }

        const {
            type,
            pdfSettings,
            headerRightStrings,
            sessionOgCompany,
            userData,
            grouping,
            columnDef,
            nonGroupColumns,
            godName,
            lists,
            extraWidthExpandablePerColumn,
        } = data;

        // Log initial document statistics
        logger.info(`Generating PDF for: ${type}`);
        logger.info(`Total rows to process: ${filteredData.length}`);

        // Create column definition map
        const columnDefMap = useMemo(() => columnDef.reduce((acc: any, col: any) => {
            acc[col.id] = col;
            return acc;
        }, {}), [columnDef]);

        // Configure rows per page
        const rowsPerPage = 100;

        // Generate pages array
        const pages = [];
        let groupTotals: any = {};

        for (let pageIndex = 0; pageIndex < Math.ceil(filteredData.length / rowsPerPage); pageIndex++) {
            // Slice data for current page
            const startIndex = pageIndex * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const pageData = filteredData.slice(startIndex, endIndex);

            logger.info(`Generating page ${pageIndex + 1} with ${pageData.length} rows`);

            // Create page component
            const pageComponent = (
                <Page 
                    key={`page-${pageIndex}`} 
                    size="A4" 
                    orientation={pdfSettings?.pageOrientation} 
                    style={pdfStyles.page}
                >
                    <HeaderRegular
                        fixed={pdfSettings.pageHeader}
                        godName={godName || "** !! Shree Ganeshay Namah !! **"}
                        headerRightStrings={headerRightStrings || []}
                        company={sessionOgCompany}
                        styles={pdfStyles}
                    />
                    <View style={{ ...pdfStyles.allSideBorder, fontSize: 10 }}>
                        <View style={{ textAlign: "center", fontSize: 13, fontWeight: 500 }}>
                            <Text style={{ textTransform: "uppercase", fontFamily: "Roboto-bold" }}>
                                {type} - Page {pageIndex + 1}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "column" }}>
                            {/* Render table titles on first page or when grouping changes */}
                            {(pageIndex === 0 || grouping?.length === 0) && (
                                <GenListPdfDetailTableTitles
                                    extraWidthExpandablePerColumn={extraWidthExpandablePerColumn}
                                    nonGroupedExpandableColumns={pdfSettings.nonGroupedExpandableColumns}
                                    nonGroupColumns={nonGroupColumns}
                                    columnDefMap={columnDefMap}
                                />
                            )}

                            {pageData.map((row: any, index: number) => {
                                const showTotals = index === pageData.length - 1 || row.depth > pageData[index + 1]?.depth;
                                
                                // Reset group totals logic
                                if (row.depth < pageData[index - 1]?.depth) groupTotals = {};
                                
                                // Accumulate group totals
                                if (row.depth === grouping.length) {
                                    nonGroupColumns.forEach((colId: any) => {
                                        groupTotals[colId] = Number(groupTotals[colId] || 0) + Number(row._valuesCache[colId]);
                                    });
                                }

                                // Render group header or child row
                                if (row.groupingColumnId !== undefined) {
                                    const sumColumns = nonGroupColumns.filter((colId: any) => 
                                        columnDefMap[colId].aggregationFn === "sum"
                                    );

                                    return (
                                        <View
                                            key={index}
                                            wrap={false}
                                            break={columnDefMap[row.groupingColumnId].header === pdfSettings.newPageforEvery}
                                        >
                                            <GenListPdfDetailHeader
                                                columnDefMap={columnDefMap}
                                                grouping={grouping}
                                                pdfSettings={pdfSettings}
                                                row={row}
                                                type={type}
                                                groupTotals={groupTotals}
                                                sumColumns={sumColumns}
                                                lists={lists}
                                            />
                                        </View>
                                    );
                                }

                                return (
                                    <GenListPdfDetailChildRow1
                                        key={index}
                                        index={index}
                                        nonGroupColumns={nonGroupColumns}
                                        extraWidthExpandablePerColumn={extraWidthExpandablePerColumn}
                                        groupTotals={groupTotals}
                                        rowValueCache={row._valuesCache}
                                        showTotals={showTotals}
                                        columnDefMap={columnDefMap}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <FooterRegular
                        choice={"Footer - Regular"}
                        fixed={true}
                        border={true}
                        printContinue={pageIndex < Math.ceil(filteredData.length / rowsPerPage) - 1}
                        printedBy={userData.user_name}
                        styles={pdfStyles}
                    />
                </Page>
            );

            // Add page to pages array
            pages.push(pageComponent);
            console.log("pages", pageComponent);
            logger.info(`Page ${pageIndex + 1} generated successfully`);
        }

        // Return the document with all pages
        return (
            <Document>
                {pages}
            </Document>
        );
    } catch (error) {
        logger.error(`PDF generation failed: ${error.message}`);
        return null;
    }
}

// Streaming utility function
export async function generateStreamingPDF({pdfData, filteredData}) {
    try {
        const startTime = performance.now();

        // Use renderToStream with the PDF generator
        const pdfStream = await renderToStream(<ReportPdfUI data={pdfData} filteredData={filteredData}/>);
        if (process.env.STORE_RESPONSE_PDF) {
            const writeStream = fs.createWriteStream('generatedPDF/workerThread12.pdf');
            pdfStream.pipe(writeStream);
        }

        const endTime = performance.now();
        logger.info(`Total PDF streaming generation time: ${(endTime - startTime).toFixed(2)} ms`);

        return pdfStream;
    } catch (error) {
        logger.error(`PDF streaming failed: ${error.message}`);
        throw error;
    }
}