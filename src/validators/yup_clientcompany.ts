import * as yup from "yup";
import { appLevelOptions } from "../config";
import { address_schema } from "./yup_address";
import { bankdetail_schema } from "./yup_bankdetail";
import { contact_schema } from "./yup_contact";
import { product_schema } from "./yup_product";
import {
	yupNumberOptionalMinMax,
	yupStringOptional,
	yupStringOptionalMaxLength,
	yupStringOptionalOneof,
	yupStringRequired,
} from "./yup_utils";

export const client_products_jt_schema = {
	...product_schema,
	brand_name: yupStringOptional,
	client_company_id: yupNumberOptionalMinMax(1).typeError("Client company id should be present in product"),
	id: yupNumberOptionalMinMax(1).typeError("Product id should be greater than 1"), // auto-generated serial-number
	product_id: product_schema.id,
	product_name: yupStringOptional,
};

export interface SaClientproductJt {
	/** client company id reference */
	clientcompany_id: number;
	/** product id reference from product master */
	product_id: number;
	/** description of product from client */
	product_description: string | null;
	product_variations: string[] | null;
	/** client images urls of direct azure of the product */
	image_urls: string[] | null;
	/** auto increment id */
	id: number;
	/** brand names for the product */
	brand_name: string;
	/** unit of measurement for the product */
	product_actual_uom: string;
	product_billed_uom: string;
	/** Minimum price for the product */
	product_minprice: number | null;
	/** max price for the product */
	product_maxprice: number | null;
	/** type of table */
	type: string;
}

export const client_companies_schema = {
	// address details
	// CASCADE - DELETE
	addresses: yup.array().optional().nullable().of(yup.object().shape(address_schema).noUnknown()),
	envelope_print: yup.number().required().min(0).default(0).typeError("Envelop Print must be selected"),
	// bank details
	bank_details: yup.array().of(yup.object().shape(bankdetail_schema).noUnknown()).required(),
	// company details
	client_category: yupStringRequired
		.oneOf(appLevelOptions.clientCompanyCategories)
		.defined()
		.typeError("Client Should be one of CUSTOMER, SUPPLIER, PAIR - CUSTOMER & SUPPLIER"),
	client_group_name: yupStringOptional,
	// CASCADE - DELETE
	contacts: yup.array().nullable().optional().of(yup.object().shape(contact_schema).noUnknown()),
	gst_number: yupStringOptionalMaxLength(15).matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/, "Invalid GST Number"),
	ledger_name: yupStringRequired.typeError("ledger name is required"),
	mailing_name: yupStringRequired.typeError("mailing name is required"),
	pan_number: yupStringOptionalMaxLength(10).typeError("Pan Number Must be of 10 digits"),
	// MSME
	activities: yupStringOptionalOneof(appLevelOptions.clientCompanyActivities).typeError(
		"Activities Should be one of MANUFACTURING, TRADERS, DISTRIBUTION, RETAILERS, RESELLERS",
	),
	enterprise_type: yupStringOptionalOneof(appLevelOptions.clientEnterpriseTypes).typeError(
		"Enterprise Should be one of MICRO, SMALL, MEDIUM",
	),
	udyam_number: yupStringOptionalMaxLength(19).typeError("Udyam Number Must be of 19 digits"),
	// general fields
	before_draft_active_entry: yup.object().nullable().optional(),
	id: yupNumberOptionalMinMax(1).typeError("Id is missing in the document"), // auto-generated serial-number
	image_urls: yup.array().optional().nullable(),
	old_doc_id: yupStringOptional,
	status: yupStringRequired.oneOf(["Active", "Draft"]).default("Draft").typeError("Status of the client should be Active or Draft"),
	type: yupStringRequired.oneOf(["clientcompany"]).default("clientcompany").typeError("Type should be Client company of the document"),
	// other details
	commission_calculate_on_option: yupStringOptionalOneof(appLevelOptions.calculateCommissionOnOptions).typeError(
		"Type should one of GROSS AMOUNT BEFORE TAX, PRODUCTS LEVEL TOTAL, TOTAL INVOICE AMOUNT",
	),
	commission_multiple: yupNumberOptionalMinMax(0),
	credit_limit: yupNumberOptionalMinMax(0),
	extra_image_urls: yup.array().optional().nullable(),
	notes: yupStringOptional,
	override_customer_due_days: yup.boolean().optional().nullable(),
	payment_terms_in_days: yupNumberOptionalMinMax(1),
	salesman_id: yupNumberOptionalMinMax(1),
	salesman_incentive: yupNumberOptionalMinMax(0),
	salesman_name: yupStringOptional,
	subbroker_id: yup.number().required().min(1).typeError("Subbroker is required"),
	subbroker_incentive: yupNumberOptionalMinMax(0),
	subbroker_name: yupStringRequired.default("DIRECT").typeError("Please select Default Subbroker"),
	weekly_order_limit: yupNumberOptionalMinMax(0),
	// products details
	// CASCADE - DELETE
	products: yup.array().of(yup.object().shape(client_products_jt_schema).noUnknown()).nullable().optional(),
	// transport details
	transport_booking_branch: yupStringOptional,
	transport_id: yupNumberOptionalMinMax(1),
	transport_payment_terms: yupStringOptionalOneof(appLevelOptions.transportPaymentModes).typeError(
		"Transport Payment should be one of PAID, TO-PAY",
	),
	transport_name: yupStringOptional,
};

export const clientCompanyValidator = yup.object().shape(client_companies_schema).noUnknown();
export interface SaClientcompany extends Omit<yup.InferType<typeof clientCompanyValidator>, "id"> {
	id: number;
	updated_date: string;
}
