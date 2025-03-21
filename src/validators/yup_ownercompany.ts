import * as yup from "yup";
import { appLevelOptions } from "../config";
import { address_schema } from "./yup_address";
import { bankdetail_schema } from "./yup_bankdetail";
import { contact_schema } from "./yup_contact";
import { yupNumberOptionalMinMax, yupStringOptional, yupStringOptionalMaxLength, yupStringRequired } from "./yup_utils";

export const ownercompany_schema = {
	id: yupNumberOptionalMinMax(1),
	image_url: yupStringOptional,
	qrcode_url: yupStringOptional,
	signature_url: yupStringOptional,
	header: yupStringOptional,
	footer: yupStringOptional,
	ledger_name: yupStringRequired,
	mailing_name: yupStringRequired,
	module: yup.string().required().oneOf(appLevelOptions.moduleOptions),
	prefix: yupStringOptionalMaxLength(6),
	suffix: yupStringOptionalMaxLength(6),
	commbill_prefix: yupStringOptionalMaxLength(6),
	commbill_suffix: yupStringOptionalMaxLength(6),
	type: yup.string().oneOf(["ownercompany"]).default("ownercompany"),
	contacts: yup.array().nullable().optional().of(yup.object().shape(contact_schema).noUnknown()),
	gst_number: yupStringOptionalMaxLength(15).matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/, "Invalid GST Number"),
	pan_number: yupStringOptional,
	addresses: yup.array().optional().nullable().of(yup.object().shape(address_schema).noUnknown()),
	website: yupStringOptional,
	bank_details: yup.array().nullable().optional().of(yup.object().shape(bankdetail_schema).noUnknown()),
};

export const ownercompany_validator = yup.object().shape(ownercompany_schema).noUnknown();

// Table sa_ownercompany
export type SaOwnercompany = yup.InferType<typeof ownercompany_validator>;

export interface SaSessionOgCompany extends SaOwnercompany {
	financial_year: number;
}
