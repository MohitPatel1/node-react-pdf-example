import React from 'react';
import { Fragment } from "react";
import { Text, View } from "@react-pdf/renderer";
import { PdfClientAddress } from "../header-footer/clientAddress";

// 6

export type pdfSettings = {
	columnsToPrint: string[];
	newPageforEvery: string | null;
	pageOrientation: "portrait" | "landscape";
	printCustomerAddress: boolean;
	printCustomerSubbrokerAddress: boolean;
	printPercentages: boolean;
	printSupplierAddress: boolean;
	printSupplierSubbrokerAddress: boolean;
	totalColWidth: number;
	selectedOnly: boolean;
	fromDate?: string;
	toDate?: string;
	colorAboveDays: Record<string, number>;
};

type inputProps = {
	columnDefMap: any;
	grouping: string[];
	pdfSettings: pdfSettings;
	row: any;
	lists: any;
	sumColumns: string[];
	groupTotals: any;
	type: string;
};
// 6
function GenListPdfDetailHeader({ groupTotals, lists, pdfSettings, columnDefMap, row, sumColumns, grouping, type }: inputProps) {
	const colorAboveDays = pdfSettings?.colorAboveDays;

	return (
		<View style={row.depth === 0 ? { borderTop: 2 } : { borderTop: 1, borderBottom: 1 }}>
			{row.depth === 0 && (
				<Fragment>
					<View
						style={{
							fontSize: 11,
							alignItems: row.depth === 0 ? "center" : "flex-start",
							fontFamily: "Roboto-bold",
							padding: 1,
							textTransform: "uppercase",
						}}
					>
						<Text>{row.groupingValue}</Text>
					</View>
					<AddressComponent
						pdfSettings={pdfSettings}
						groupingColumnId={row.groupingColumnId}
						groupingValue={row.groupingValue}
						lists={lists}
					/>
				</Fragment>
			)}
			<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "column", justifyContent: row.depth > 0 ? "space-between" : "flex-end" }}>
					{row.depth > 0 && row.groupingColumnId && (
						<View
							style={{
								fontSize: 11,
								alignItems: row.depth === 0 ? "center" : "flex-start",
								maxWidth: "70%",
								padding: 1,
								position: "relative",
							}}
						>
							<Text style={{ textTransform: "capitalize" }}>
								{columnDefMap[row.groupingColumnId].header + ": "}
								<Text style={{ fontFamily: "Roboto-bold", textTransform: "uppercase" }}>{row.groupingValue}</Text>
							</Text>
							<AddressComponent
								pdfSettings={pdfSettings}
								lists={lists}
								groupingColumnId={row.groupingColumnId}
								groupingValue={row.groupingValue}
							/>
						</View>
					)}
					{grouping.length != row.depth + 1 && (
						<View style={{ flexDirection: "row", fontSize: 11, paddingHorizontal: 2, gap: 5, position: "relative" }}>
							{sumColumns.map((colId) => (
								<Text key={row.groupingColumnId + colId} style={{ textTransform: "capitalize" }}>
									{columnDefMap[colId].header + " : "}
									<Text style={{ fontFamily: "Roboto-bold", textTransform: "uppercase" }}>
										{JSON.stringify(row._groupingValuesCache) != "{}"
											? (row._groupingValuesCache[colId])?.toLocaleString("en-IN", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})
											: (groupTotals[colId])?.toLocaleString("en-IN", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
									</Text>
								</Text>
							))}
						</View>
					)}
				</View>
				{type === "outstanding" && JSON.stringify(colorAboveDays) !== '{}' && (
					<View style={{ flexDirection: "column" }}>
						{Object.keys(row._valuesCache.colorSum).map((key, index) => {
							const textColor = { color: key };
							return (
								<View
									key={index}
									style={{
										...textColor,
										flexDirection: "row",
										alignItems: "flex-end",
										textAlign: "right",
										justifyContent: "space-between",
									}}
								>
									<Text>{`> ${colorAboveDays[key]} days`}</Text>
									<Text>{" : "}</Text>
									<Text>{(row._valuesCache.colorSum[key])?.toLocaleString("en-IN", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}</Text>
								</View>
							);
						})}
					</View>
				)}
			</View>
		</View>
	);
}

export default GenListPdfDetailHeader;

type addressProps = {
	pdfSettings: pdfSettings;
	groupingColumnId: any;
	groupingValue: any;
	lists: any;
	pdfType?: "Detailed" | "Summary" | "Ledger"
};

// 6
export const AddressComponent = ({ pdfSettings, groupingColumnId, groupingValue, lists, pdfType }: addressProps) => {
	let clientData: any, subBrokerData;

	if (
		(pdfSettings.printCustomerAddress || pdfSettings.printCustomerSubbrokerAddress) &&
		(groupingColumnId === "customer_name" || groupingColumnId === "customer_group_name")
	) {
		clientData = lists.customerList?.find((client: any) =>
			groupingColumnId === "customer_name"
				? client.ledger_name === groupingValue
				: client.client_group_name === groupingValue || client.ledger_name === groupingValue,
		);
		if (pdfSettings.printCustomerSubbrokerAddress && clientData?.subbroker_name !== "DIRECT") {
			subBrokerData = lists.subBrokerList.find((subbroker: any) => clientData?.subbroker_id === subbroker.id);
		}
	} else if (
		(pdfSettings.printSupplierAddress || pdfSettings.printSupplierSubbrokerAddress) &&
		(groupingColumnId === "supplier_name" || groupingColumnId === "supplier_group_name")
	) {
		clientData = lists.supplierList?.find((client: any) =>
			groupingColumnId === "supplier_name"
				? client.ledger_name === groupingValue
				: client.client_group_name === groupingValue || client.ledger_name === groupingValue,
		);
		if (pdfSettings.printSupplierSubbrokerAddress && clientData?.subbroker_name !== "DIRECT") {
			subBrokerData = lists.subBrokerList.find((subbroker: any) => clientData?.subbroker_id === subbroker.id);
		}
	} else if (pdfSettings.printCustomerSubbrokerAddress && groupingColumnId === "customer_subbroker_name" && groupingValue !== "DIRECT") {
		clientData = lists.subBrokerList.find((subbroker: any) => groupingValue === subbroker.ledger_name);
	} else if (pdfSettings.printSupplierSubbrokerAddress && groupingColumnId === "supplier_subbroker_name" && groupingValue !== "DIRECT") {
		clientData = lists.subBrokerList.find((subbroker: any) => groupingValue === subbroker.ledger_name);
	}

	return (
		clientData ? <PdfClientAddress company={clientData} pdfType={pdfType || "Detailed"}/> : <></>
	);
};
