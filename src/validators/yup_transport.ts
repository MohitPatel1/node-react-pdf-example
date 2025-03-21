import * as yup from "yup";
import { yupNumberOptionalMinMax, yupStringOptionalMaxLength, yupStringRequired } from "./yup_utils";
import { SaAddress, address_schema } from "./yup_address";
import { SaContact, contact_schema } from "./yup_contact";

export const transport_schema = {
	addresses: yup.array().optional().nullable().of(yup.object().shape(address_schema).noUnknown()),
	image_urls: yup.array().optional().nullable(),
	contacts: yup.array().nullable().optional().of(yup.object().shape(contact_schema).noUnknown()),
	envelope_print: yup.number().required().min(0).default(0).typeError("Please Select Envelop to Print"),
	gst_number: yupStringOptionalMaxLength(15).matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/, "Invalid GST Number"),
	id: yupNumberOptionalMinMax(0).typeError("Id not present in document"),
	ledger_name: yup.string().defined().required().typeError("ledger name is required"),
	mailing_name: yup.string().defined().required().typeError("mailing name is required"),
	pan_number: yupStringOptionalMaxLength(10).typeError("Pan Number Must be of 10 digits"),
	status: yupStringRequired.oneOf(["Active", "Draft"]).default("Draft").typeError("Status of the client should be Active or Draft"),
	transport_comm_per_bale: yupNumberOptionalMinMax(0).typeError("Comm Per Bale should be more than 0"),
	type: yup.string().oneOf(["transport"]).typeError("Type should be transport of the document"),
};

export interface SaTransport {
	/** auto increment id */
	id: number;
	/** ledger name of transport which will be unique */
	ledger_name: string;
	/** name of transport for display purpose which will not be unique */
	mailing_name: string;
	/** type = transport */
	type: string;
	/** GST number of transport */
	gst_number: string | null;
	/** PAN number of transport */
	pan_number: string | null;
	/** status of the client from Active,Draft */
	status: string;
	/** array of object will be contact_type, person_name:, std_code, phone_number,email  */
	contacts: SaContact[] | null;
	/** auto increment id */
	deliverydetail_id: number | null;

	addresses: SaAddress[] | null;
}

export const transportValidator = yup.object().shape(transport_schema).noUnknown();
