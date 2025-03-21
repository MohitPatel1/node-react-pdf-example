import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { SaClientcompany } from "../validators/yup_clientcompany";

export const PdfClientAddress = ({ company, pdfType }: { company: SaClientcompany, pdfType:"Detailed" | "Summary" | "Ledger" }) => (
	<View style={{ marginLeft: 14, alignItems: "flex-start", flexDirection: "column", marginBottom: pdfType==="Ledger" ? 10 : 2 }}>
		{(pdfType==="Ledger") && <Text style={{ fontFamily: "Roboto-medium", fontSize: 12, marginVertical: 1 }}>{company.ledger_name}</Text>}
		<Text style={{ maxLines: 2, maxWidth: 250, overflow: "hidden", fontSize: 8 }}>
			{(company.addresses && company.addresses[0]?.street_detail) || ""}
		</Text>
		<Text style={{ fontSize: 8 }}>
			{(company.addresses && company.addresses[0]?.city) || ""} - {(company.addresses && company.addresses[0]?.pincode) || ""}
		</Text>
		{company.contacts && <Text style={{ fontSize: 8 }}>ph:+91-{`${company.contacts[0]?.phone_number || "xxxxx xxxxx"}`}</Text>}
		{company.contacts && company.contacts[0]?.email && <Text style={{ fontSize: 8 }}>{`Email: ${company.contacts[0]?.email || ""}`}</Text>}
		<Text style={{ fontSize: 8 }}>{company.gst_number ? `GSTIN: ${company.gst_number}` : ""}</Text>
	</View>
);
