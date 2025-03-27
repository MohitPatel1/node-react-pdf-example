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

export function ReportPdfUI({ data }: any) {
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
            filteredData,
            godName,
            lists,
            columnDefMap,
            extraWidthExpandablePerColumn,
        } = data;

        // Log initial document statistics
        logger.info(`Generating PDF for: ${type}`);
        // Configure rows per page
        let groupTotals: any = {};
        // Create page component
        return (<Document>
            <Page
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
                            {type}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        {/* Render table titles on first page or when grouping changes */}
                        {(grouping?.length === 0) && (
                            <GenListPdfDetailTableTitles
                                extraWidthExpandablePerColumn={extraWidthExpandablePerColumn}
                                nonGroupColumns={nonGroupColumns}
                                columnDefMap={columnDefMap}
                            />
                        )}

                        {filteredData.map((row: any, index: number) => {
                            const showTotals = index === filteredData.length - 1 || row.depth > filteredData[index + 1]?.depth;

                            // Reset group totals logic
                            if (row.depth < filteredData[index - 1]?.depth) groupTotals = {};

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
                                        {
                                            // shows column titles. ex: date, inv no, due days
                                            row.depth === 0 && (
                                                <GenListPdfDetailTableTitles
                                                    extraWidthExpandablePerColumn={extraWidthExpandablePerColumn}
                                                    nonGroupColumns={nonGroupColumns}
                                                    columnDefMap={columnDefMap}
                                                />
                                            )
                                        }
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
                    printContinue={false}
                    printedBy={userData.user_name}
                    styles={pdfStyles}
                />
            </Page>
        </Document>
        );
    } catch (error) {
        logger.error(`PDF generation failed: ${error.message}`);
        return null;
    }
}

// Streaming utility function
export async function generateStreamingPDF(pdfData: any) {
    try {
        const startTime = performance.now();

        // Ensure `renderToStream` is properly imported and available
        const pdfStream = await renderToStream(<ReportPdfUI data={pdfData} />);

        const endTime = performance.now();
        logger.info(`Total PDF streaming generation time: ${(endTime - startTime).toFixed(2)} ms`);

        return pdfStream;
    } catch (error) {
        logger.error(`PDF streaming failed: ${error.message}`);
        throw error;
    }
}