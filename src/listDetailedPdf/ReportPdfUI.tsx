import React from 'react';
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';
import GenListPdfDetailTableTitles from "./GenListPdfDetailTableTitles.js";
import GenListPdfDetailHeader from "./GenListPdfDetailHeader.js";
import { GenListPdfDetailChildRow1 } from "./DetailChildRows.js";
import { HeaderRegular } from "./HeaderWithoutLocalCache.js";
import FooterRegular from "../header-footer/footerRegular.js";
import { pdfStyles } from './pdfStyles.js';
import path from 'path';

// Register fonts with correct paths
const fontPath = process.env.FONT_PATH || `${process.cwd()}/src/fonts`;

Font.register({
	family: "Roboto",
	fonts: [
		{ src: path.join(fontPath, "Roboto-Regular.ttf") },
		{ src: path.join(fontPath, "Roboto-Bold.ttf") }
	],
});
Font.register({
	family: "Roboto-bold",
	fonts: [{ src: path.join(fontPath, "Roboto-Bold.ttf") }],
});

Font.register({
	family: "Roboto-Italic",
	fonts: [{ src: path.join(fontPath, "Roboto-Italic.ttf") }],
});

Font.register({
	family: "Roboto-MediumItalic",
	fonts: [{ src: path.join(fontPath, "Roboto-MediumItalic.ttf") }],
});

Font.register({
	family: "Roboto-medium",
	fonts: [{ src: path.join(fontPath, "Roboto-Medium.ttf") }],
});

export function ReportPdfUI({data}: any) {
		// data contains all the info we need to create pdf.
		console.log("list detailed pdf data recieved");
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
	
	let groupTotals: any = {};
	const columnDefMap = columnDef.reduce((acc: any, col: any) => {
		acc[col.id] = col;
		return acc;
	}, {});
	// console.log("columnDefMap", columnDefMap);
	// console.log("nonGroupColumns", nonGroupColumns);
	// console.log("Generating paginated PDF...");
	// nonGroupColumns.forEach((colId: any) => {
	// 	console.log("columnDefMap[colId]", columnDefMap[colId]);
	// });
	// Define the number of rows per page
	const rowsPerPage = 50; // Adjust this number based on your needs
	const totalPages = Math.ceil(filteredData.length / rowsPerPage);
	if(process.env.LOG_PDF_PROGRESS) console.log("total pages", totalPages);

    console.log(`Total Rows: ${filteredData.length}, Pages: ${totalPages}`);


	return (
		<Document>
			<Page size="A4" orientation={pdfSettings?.pageOrientation} style={pdfStyles.page}>
				<HeaderRegular
					fixed={pdfSettings.pageHeader}
					godName={godName || "** !! Shree Ganeshay Namah !! **"}
					headerRightStrings={headerRightStrings || []}
					company={sessionOgCompany}
					styles={pdfStyles}
				/>
				<View style={{ ...pdfStyles.allSideBorder, fontSize: 10 }}>
					<View style={{ textAlign: "center", fontSize: 13, fontWeight: 500 }}>
						<Text style={{ textTransform: "uppercase", fontFamily: "Roboto-bold" }}>{type}</Text>
					</View>
					<View style={{ flexDirection: "column" }}>
						{grouping?.length === 0 && (
							<GenListPdfDetailTableTitles
								extraWidthExpandablePerColumn={extraWidthExpandablePerColumn}
								nonGroupedExpandableColumns={pdfSettings.nonGroupedExpandableColumns}
								nonGroupColumns={nonGroupColumns}
								columnDefMap={columnDefMap}
							/>
						)}
						{filteredData.map((row: any, index: number) => {
							const showTotals = index === filteredData.length - 1 || row.depth > filteredData[index + 1]?.depth;
							if (row.depth < filteredData[index - 1]?.depth) groupTotals = {};
							if (row.depth === grouping.length) {
								nonGroupColumns.forEach((colId: any) => {
									groupTotals[colId] = Number(groupTotals[colId] || 0) + Number(row._valuesCache[colId]);
								});
							}
							if (row.groupingColumnId !== undefined) {
								const sumColumns = nonGroupColumns.filter((colId: any) => columnDefMap[colId].aggregationFn === "sum");
								return (
									<View
										key={row.id}
										wrap={false}
										break={columnDefMap[row.groupingColumnId].header === pdfSettings.newPageforEvery}
									>
										{/* below component is responsible for header above rows */}
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
													nonGroupedExpandableColumns={pdfSettings.nonGroupedExpandableColumns}
													columnDef={columnDef}
													columnDefMap={columnDefMap}
												/>
											)
										}
									</View>
								);
							}
							return (
								<GenListPdfDetailChildRow1
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
}