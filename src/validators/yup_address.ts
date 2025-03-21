import * as yup from "yup";
import { yupNumberOptionalMinMax, yupStringOptional, yupStringRequired } from "./yup_utils";

export const address_schema = {
	id: yupNumberOptionalMinMax(1).typeError("Address id not present"), // auto-generated serial-number
	type: yup.string().oneOf(["address"]).default("address").typeError("Type of Address not is missing"),
	address_type: yupStringRequired
		.oneOf(["clientcompany", "ownercompany", "subbroker", "transport"])
		.typeError("Address type should be one of clientcompany, ownercompany, subbroker, transport"),
	address_type_id: yupNumberOptionalMinMax(1).typeError("Address id not present"),
	branch_name: yupStringOptional,
	city: yupStringOptional,
	street_detail: yupStringOptional,
	phone_number: yupStringOptional,
	pincode: yupNumberOptionalMinMax(0, 999999).typeError("Invalid Pin code"), //sometimes pincode can be like '24' like in Indore - 24.
	state: yupStringOptional,
};

export interface SaAddress {
	/** auto increment id */
	id: number;
	/** address type like clientcompany, ownercompany, subbroker, transport */
	address_type: string;
	/** branch name of the company */
	branch_name: string | null;
	/** city of the company */
	city: string | null;
	/** street detail of the company */
	street_detail: string | null;
	/** phone number of the company which can be anything */
	phone_number: string | null;
	/** pincode of the company */
	pincode: number | null;
	/** state of the company */
	state: string | null;
	/** type of table */
	type: string;
	/** auto increment id */
	owner_company_id: number | null;
	/** auto increment id */
	clientcompany_id: number | null;
	/** auto increment id */
	subbroker_id: number | null;
	/** auto increment id */
	transport_id: number | null;
}
