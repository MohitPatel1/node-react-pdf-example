import React from 'react';
import { View, Text, Image, Font } from "@react-pdf/renderer";

// ----------------------------------------------------------------------
Font.register({
	family: "Times-New-Roman",
	fonts: [{ src: "/fonts/Times-New-Roman-Italic-Bold.ttf" }],
});
export const HeaderRegular = ({ fixed, godName, headerRightStrings, styles, company, ...props }: any) => {
	const logoImageLink = company?.image_url;
	return (
		<View fixed={fixed}>
			{godName && <Text style={{ textAlign: "center", color: "red", marginTop: 3 }}>{godName}</Text>}
			<View style={[styles.gridContainer, styles.header]} {...props}>
				<View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "center" }}>
					{logoImageLink && <Image style={{ width: 100 }} src={logoImageLink} />}
					<View style={{ marginLeft: 14, alignItems: "flex-start", flexDirection: "column", marginBottom: 10 }}>
						<Text style={styles.ogName}>{company?.ledger_name}</Text>
						<Text style={{ maxLines: 2, maxWidth: 250, overflow: "hidden", fontSize: 10 }}>
							{(company?.addresses && company?.addresses[0]?.street_detail) || ""}
						</Text>
						<Text style={{ fontSize: 10 }}>
							{(company?.addresses && company?.addresses[0]?.city) || ""} - {(company?.addresses && company?.addresses[0]?.pincode) || ""}
						</Text>
						{company?.contacts &&
							company.contacts.map((el: any, index: number) => {
								return (
									<Text key={index} style={{ fontSize: 8 }}>
										ph:+91-{`${el.phone_number || "xxxxx xxxxx"}`}
									</Text>
								);
							})}
						{company?.contacts?.[0]?.email && (
							<Text style={{ textTransform: "none", fontSize: 10 }}>{`Email: ${company?.contacts?.[0]?.email || ""}`}</Text>
						)}
						{company?.website && <Text style={{ textTransform: "none", fontSize: 10 }}>{`Website: ${company?.website || ""}`}</Text>}

						<Text style={{ textTransform: "none", fontSize: 10 }}>{company?.gst_number ? `GSTIN: ${company.gst_number}` : (company?.pan_number) && `PAN No: ${company.pan_number}`}</Text>
					</View>
				</View>
				<View
					style={{
						alignItems: "flex-end",
						flexDirection: "column",
						height: "100",
						justifyContent: "flex-end",
						marginBottom: 1,
						marginRight: 2,
					}}
				>
					{headerRightStrings && headerRightStrings.map((itemString: string, i: number) => <Text key={i}>{itemString}</Text>)}
				</View>
			</View>
		</View>
	);
};

export const BoldItalicTimesNewRomanHeader = ({
	headerRightStrings,
	styles,
	godNameEnable = true,
	godName,
	company,
	fixed,
	...props
}: any) => {
	const logoImageLink = company?.image_url;
	// const logoImageLink = { data: ogData?._attachments && ogData?._attachments[imageFieldName]?.data && ogData?._attachments[imageFieldName]?.data, format: 'jpeg'  }
	// console.log(logoImageLink)
	return (
		<View style={{ ...styles.bottomBorder }} fixed>
			{Boolean(godNameEnable) && <Text style={{ textAlign: "center", color: "red", marginTop: 3 }}>{godName}</Text>}
			<View style={[styles.gridContainer, styles.header]} {...props}>
				<View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "center" }}>
					{logoImageLink && <Image style={{ width: 100 }} src={logoImageLink} />}
					<View style={{ marginLeft: 14, alignItems: "flex-start", flexDirection: "column", marginBottom: 10 }}>
						<Text style={{ ...styles.ogName, textTransform: "uppercase", textAlign: "left", fontFamily: "Times-New-Roman" }}>
							{company?.ledger_name}
						</Text>
						<Text style={{ maxLines: 2, maxWidth: 250, overflow: "hidden", fontSize: 10 }}>
							{(company?.addresses && company?.addresses[0]?.street_detail) || ""}
						</Text>
						<Text style={{ fontSize: 10 }}>
							{(company?.addresses && company?.addresses[0]?.city) || ""} - {(company?.addresses && company?.addresses[0]?.pincode) || ""}
						</Text>
						{company?.contacts &&
							company.contacts.map((el: any) => {
								return <Text style={{ fontSize: 8 }}>ph:+91-{`${el.phone_number || "xxxxx xxxxx"}`}</Text>;
							})}
						{/* @ts-ignore */}
						{company?.contacts[0]?.email && (
							// @ts-ignore
							<Text style={{ textTransform: "none", fontSize: 10 }}>{`Email: ${company?.contacts[0]?.email || ""}`}</Text>
						)}
						{/* @ts-ignore */}
						{company?.website && <Text style={{ textTransform: "none", fontSize: 10 }}>{`Website: ${company?.website || ""}`}</Text>}
						{/* @ts-ignore */}

						<Text style={{ textTransform: "none", fontSize: 10 }}>{company?.gst_number ? `GSTIN: ${company?.gst_number}` : ""}</Text>
					</View>
				</View>
				<View
					style={{
						alignItems: "flex-end",
						flexDirection: "column",
						height: "100",
						justifyContent: "flex-end",
						marginBottom: 1,
						marginRight: 2,
					}}
				>
					{headerRightStrings && headerRightStrings.map((itemString: string, i: number) => <Text key={i}>{itemString}</Text>)}
				</View>
			</View>
		</View>
	);
};
