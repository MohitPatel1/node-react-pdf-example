import * as yup from "yup";
import { address_schema } from "./yup_address";
import { bankdetail_schema } from "./yup_bankdetail";
import { contact_schema } from "./yup_contact";
import { yupNumberOptionalMinMax, yupStringOptional, yupStringOptionalMaxLength, yupStringRequired } from "./yup_utils";

export const subbroker_schema = {
	addresses: yup.array().optional().nullable().of(yup.object().shape(address_schema).noUnknown()),
	bank_details: yup
		.array()
		.nullable()
		.optional()
		.of(yup.array().of(yup.object().shape(bankdetail_schema).noUnknown())),
	image_urls: yup.array().of(yup.string()).optional().nullable(),
	contacts: yup.array().nullable().optional().of(yup.object().shape(contact_schema).noUnknown()),
	envelope_print: yup.number().required().min(0).default(0).typeError("Envelop Print must be selected"),
	gst_number: yupStringOptionalMaxLength(15).matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/, "Invalid GST Number"),
	id: yupNumberOptionalMinMax(0).typeError("Id should be greater than 0"),
	ledger_name: yupStringRequired.typeError("ledger name is required"),
	mailing_name: yupStringRequired.typeError("mailing name is required"),
	notes: yupStringOptional,
	pan_number: yupStringOptionalMaxLength(10).typeError("Pan Number Must be of 10 digits"),
	status: yupStringRequired.oneOf(["Active", "Draft"]).default("Draft").typeError("Status of the client should be Active or Draft"),
	type: yup.string().required().oneOf(["subbroker"]).default("subbroker").typeError("Type should be Subbroker of the document"),
};

export const subbrokerValidator = yup.object().shape(subbroker_schema).noUnknown();
export interface SaSubbroker extends Omit<yup.InferType<typeof subbrokerValidator>, "id"> {
	id: number;
}
