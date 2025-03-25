import React, { useMemo } from 'react';
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';
import GenListPdfDetailTableTitles from "./GenListPdfDetailTableTitles.js";
import GenListPdfDetailHeader from "./GenListPdfDetailHeader.js";
import { GenListPdfDetailChildRow1 } from "./DetailChildRows.js";
import { HeaderRegular } from "./HeaderWithoutLocalCache.js";
import FooterRegular from "../header-footer/footerRegular.js";
import { pdfStyles } from './pdfStyles.js';
import path from 'path';

// Retain font registration logic from original file
const fontPath = process.env.FONT_PATH || `${process.cwd()}/src/fonts`;

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

// Pagination helper function
const paginateData = (filteredData: any[], rowsPerPage: number) => {
    const pages: any[][] = [];
    for (let i = 0; i < filteredData.length; i += rowsPerPage) {
        pages.push(filteredData.slice(i, i + rowsPerPage));
    }
    return pages;
};

export function ReportPdfUI({ data }: any) {
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
        extraWidthExpandablePerColumn,
    } = data;

    // Memoize column definition map and pagination for performance
    const columnDefMap = useMemo(() => 
        columnDef.reduce((acc: any, col: any) => {
            acc[col.id] = col;
            return acc;
        }, {}), 
        [columnDef]
    );

    // Configure rows per page (can be dynamically adjusted)
    const rowsPerPage = 50;
    const paginatedData = useMemo(() => paginateData(filteredData, rowsPerPage), [filteredData, rowsPerPage]);

    // Render function for page content
    const renderPageContent = (pageData: any[], pageIndex: number) => {
        let groupTotals: any = {};

        return (
            <Page key={`page-${pageIndex}`} size="A4" orientation={pdfSettings?.pageOrientation} style={pdfStyles.page}>
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
                                        key={row.id}
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
                                    key={row.id}
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
                    printContinue={pageIndex < paginatedData.length - 1}
                    printedBy={userData.user_name}
                    styles={pdfStyles}
                />
            </Page>
        );
    };

    return (
        <Document>
            {paginatedData.map((pageData, pageIndex) => 
                renderPageContent(pageData, pageIndex)
            )}
        </Document>
    );
}