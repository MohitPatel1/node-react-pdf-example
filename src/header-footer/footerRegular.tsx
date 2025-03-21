import React from 'react';
import { View, Text, Link } from "@react-pdf/renderer";

const FooterRegular = ({ styles, printedBy, printContinue = true, border, ...props }: any) => {
	return (
		<View style={{ ...styles.footer, borderTopWidth: border ? 1 : 0, flexDirection: "row" }} {...props} break>
			<View>
				<Text>Printed by: {printedBy}</Text>
				<Text>{new Date().toLocaleString()}</Text>
			</View>
			<View>
				<Text
					style={{ ...styles.pageNumber, alignItems: "center" }}
					render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
					fixed
				/>
				{printContinue && <Text render={({ pageNumber, totalPages }) => (pageNumber !== totalPages ? "Continued..." : null)} />}
			</View>
			<View>
				<Text style={{ alignItems: "flex-start" }}>
					{" "}
					Powered by
					<Link src="https://smartagent.one">
						<Text> Smart Agent</Text>
					</Link>
				</Text>
			</View>
		</View>
	);
};

export default FooterRegular;