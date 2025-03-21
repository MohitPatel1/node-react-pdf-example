import React from 'react';
import { pdfStyles } from "./pdfStyles";
import { Style } from "@react-pdf/types";
import { Text, View } from "@react-pdf/renderer";

export default function GenListPdfDetailTableTitles({
	extraWidthExpandablePerColumn,
	nonGroupColumns,
	columnDefMap,
	printPercentages,
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
				const columnWidth: any =
					(columnDefMap[headerId].pdfStyle.style.width || 0) + (extraWidthExpandablePerColumn > 0 ? extraWidthExpandablePerColumn : 0);

				return (
					<HeaderText
						header={columnDefMap[headerId].header}
						key={headerId + idx}
						printPercentages={printPercentages}
						i={idx}
						style={{ width: columnWidth, fontSize: 10 }}
					/>
				);
			})}
		</View>
	);
}

export const HeaderText = ({
	header,
	i,
	style,
	printPercentages,
	key,
}: {
	header: string;
	i: number;
	style: Style;
	printPercentages: any;
	key: string;
}) => {
	const { maxWidth, minWidth, width: colWidth, ...cellStyle } = style;
	const width = typeof colWidth === "number" && printPercentages ? colWidth + 35 : colWidth;
	return (
		<View
			key={key}
			style={{
				maxWidth,
				minWidth,
				width,
				...(i === 0 ? {} : pdfStyles.leftLightBorder),
			}}
		>
			<Text>{header}</Text>
		</View>
	);
};
