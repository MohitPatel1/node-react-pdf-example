import * as yup from "yup";
import {
	yupDateRequired,
	yupFinancialYearBound,
	yupIdOptional,
	yupIdRequired,
	yupNumberOptional,
	yupNumberOptionalMinMax,
	yupStringOptional,
	yupStringOptionalOneof,
	yupStringRequired,
} from "./yup_utils";
import { appLevelOptions } from "../config";
import { SaOtherCharge, othercharge_schema } from "./yup_othercharge";
import { payment_drcrnote } from "./yup_payment";
import { deliverydetail_schema } from "./yup_deliverydetail";
import { payment_againstinvoice_jt_schema } from "./yup_payment";

const debitNote_payment_againstinvoice_jt_schema = yup.object({
	...payment_againstinvoice_jt_schema,
	payment_id: yupIdOptional,
	debitNote_id: yupIdRequired,
});

export const debitNote_schema = {
	//against invoice details
	// cascade - delete
	againstinvoices: yup.array().required().min(1).of(debitNote_payment_againstinvoice_jt_schema.noUnknown()),
	// customer details
	// FK
	customer_id: yup.number().required().min(1),
	customer_name: yupStringRequired,
	customer_branch: yupStringOptional,
	customer_subbroker_id: yup.number().min(1),
	customer_subbroker_name: yupStringRequired,
	customer_subbroker_incentive: yupNumberOptionalMinMax(0),
	// debit note details
	drcrnotes: yup.array().optional().nullable().of(yup.object().shape(payment_drcrnote).noUnknown()),
	// GR delivery details
	// CASCADE DELETE
	grdeliverydetails: yup.array().nullable().optional().of(yup.object().shape(deliverydetail_schema).noUnknown()),
	// ownercompany details
	// FK
	ownercompany_id: yup.number().required().min(1),
	ownercompany_name: yup.string().required(),
	// salesman details
	// FK
	salesman_id: yup.number().required().min(1).typeError("Salesman is required"),
	salesman_name: yup.string().required(),
	salesman_incentive: yupNumberOptionalMinMax(0),
	// supplier details
	// FK
	supplier_id: yup.number().required().min(1),
	supplier_name: yupStringRequired,
	supplier_branch: yupStringOptional,
	supplier_subbroker_id: yup.number().required().min(1),
	supplier_subbroker_name: yupStringRequired,
	supplier_subbroker_incentive: yupNumberOptionalMinMax(0),
	// voucher details
	creation_date: yupStringOptional,
	extra_image_urls: yup.array().optional().nullable(),
	financial_year: yupFinancialYearBound(),
	grandtotal_drcr_amount: yupNumberOptional, // othercharges_amount - tds_amount - commission_amount
	grandtotal_invoice_amount_in_payment: yup.number().min(0),
	grandtotal_net_adjustment_amount: yup.number().required(), //cheque_amount + othercharges_amount
	grandtotal_othercharges_amount: yupNumberOptional,
	grandtotal_payment_amount: yupNumberOptionalMinMax(0), // cheque_amount + tds_amount + commission_amount
	grandtotal_tds_amount: yupNumberOptionalMinMax(0),
	// PK
	id: yupIdRequired,
	notes: yupStringOptional,
	old_doc_id: yupStringOptional,
	serial_number: yup.number().required().min(1),
	status: yupStringRequired.oneOf(["Draft", "Active"]).default("Draft"),
	supplier_invoice_numbers: yup.array().required().of(yup.string().required()),
	invoice_ids: yup.array().required().of(yup.string().required()),
	type: yupStringRequired.default("debitNote").oneOf(["debitNote"]),
	updated_date: yupStringOptional,
	voucher_date: yupDateRequired,
};

export const debitNoteValidator = yup.object().shape(debitNote_schema).noUnknown();
