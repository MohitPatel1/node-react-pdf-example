import React from 'react';
import { pdfStyles } from "./pdfStyles";
import { Style } from "@react-pdf/types";
import { Text, View } from "@react-pdf/renderer";

export default function GenListPdfDetailTableTitles({
	extraWidthExpandablePerColumn,
	nonGroupColumns,
	columnDefMap,
}: any) {
	// 6
	return (
		<View
			wrap={false}
			style={{
				...pdfStyles.topBorder,
				alignItems: "center",
				backgroundColor: "#f2f4f7",
				flexDirection: "row",
				fontSize: 12,
				justifyContent: "flex-end",
				textAlign: "center",
			}}
		>
			{nonGroupColumns.map((headerId: string, idx: number) => {
				// const columnWidth: number = Number(columnDefMap[headerId].pdfStyle.style.width || 0) + nonGroupedExpandableColumns.includes(headerId) ? (extraWidthExpandablePerColumn > 0 ? extraWidthExpandablePerColumn : 0) : 0;
				const columnWidth: number = Number(columnDefMap[headerId].pdfStyle.style.width || 0) + Number(extraWidthExpandablePerColumn || 0) + 35;
				return (
					<HeaderText
						key={headerId}
						headerKey={headerId}
						header={columnDefMap[headerId].header}
						i={idx}
						style={{ width: columnWidth, fontSize: 10, fontFamily: "Roboto-bold" }}
					/>
				);
			})}
		</View>
	);
}

const HeaderText = ({
	header,
	i,
	style,
	headerKey,
}: {
	header: string;
	i: number;
	style: Style;
	headerKey: string;
}) => {
	return (
		<View
			key={headerKey}
			style={{
				...style,
				...(i === 0 ? {} : pdfStyles.leftLightBorder),
			}}
		>
			<Text>{header}</Text>
		</View>
	);
};
