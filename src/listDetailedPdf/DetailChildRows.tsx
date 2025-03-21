import React from "react";
import { Style } from "@react-pdf/types";
import { Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

// 6
type inputProps = {
	extraWidthExpandablePerColumn: number;
	nonGroupColumns: string[];
	columnDefMap: any;
	index: number;
	rowValueCache: any;
	groupTotals: any;
	showTotals: boolean;
};

export const GenListPdfDetailChildRow1 = ({
	extraWidthExpandablePerColumn,
	nonGroupColumns,
	columnDefMap,
	index,
	groupTotals,
	rowValueCache,
	showTotals,
}: inputProps) => {

	return (
		<View
			key={index}
			wrap={false}
			style={{
				flexDirection: "row",
				paddingHorizontal: 2,
				justifyContent: "flex-end",
				backgroundColor: index % 2 !== 0 ? "#f2f4f7" : "",
				color: rowValueCache.color,
			}}
		>
			{nonGroupColumns.map((columnId, idx) => {
				const cellValue = rowValueCache[columnId];
				const columnWidth: any = columnDefMap[columnId].pdfStyle.style.width + extraWidthExpandablePerColumn;
				const isSum = columnDefMap[columnId].aggregationFn === "sum";

				return (
					<RowCell
						isSum={isSum}
						key={columnId + idx}
						cellValue={cellValue}
						columnId={columnId}
						idx={idx}
						groupTotals={groupTotals}
						showTotals={showTotals}
						style={{ ...columnDefMap[columnId].pdfStyle.style,width: columnWidth, fontSize: 10 }}
					/>
				);
			})}
		</View>
	);
};

type cellProps = {
	cellValue: any;
	columnId: string;
	idx: number;
	isSum: boolean;
	groupTotals: any;
	showTotals: boolean;
	style: Style | undefined;
	key: string;
};

const RowCell = ({
	isSum,
	cellValue,
	columnId,
	idx,
	groupTotals,
	showTotals,
	style = {},
	key,
}: cellProps) => {
	const { maxWidth, minWidth, width, ...cellStyle } = style;
	return (
		<View
			key={key}
			style={{
				flexDirection: "column",
				maxWidth: maxWidth,
				minWidth: minWidth,
				width: width,
				...(idx === 0 ? {} : pdfStyles.leftLightBorder),
			}}
		>
			<Text
				style={{
					alignSelf: "center",
					...cellStyle,
				}}
			>
				{typeof(cellValue) === "number" ? cellValue.toLocaleString('en-IN') : cellValue || "-"}
				</Text>
			{showTotals && isSum && (
				<Text
					style={{
						alignSelf: isSum ? "flex-end" : "center",
						...cellStyle,
						...pdfStyles.topBorder,
						fontFamily: "Roboto-bold",
						color: "black",
					}}
				>
					{groupTotals[columnId].toLocaleString('en-IN')}
				</Text>
			)}
		</View>
	);
};