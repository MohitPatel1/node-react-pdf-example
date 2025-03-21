import * as yup from "yup";
import { SaClientcompany } from "./yup_clientcompany";
import { SaOwnercompany } from "./yup_ownercompany";
import { SaSubbroker } from "./yup_subbroker";
import {
	yupDateRequired,
	yupFinancialYearBound,
	yupIdOptional,
	yupIdRequired,
	yupNumberOptional,
	yupNumberOptionalMinMax,
	yupStringOptional,
	yupStringRequired,
} from "./yup_utils";

export const commbill_rowitem_schema = {
	// Invoice details are optional because commission might be calculated on on-account payments too.
	// Payment details are optional because commissiong might be calculated only for invoices.
	// Also manual entry would lead to these fields missing.
	cheque_date_or_range: yupStringOptional,
	cheque_mode: yupStringOptional,
	invoice_date_or_range: yupStringOptional,
	cheque_number_or_quantity: yupStringOptional,
	commbill_id: yup.string(),
	commission_amount_on_amount: yupNumberOptionalMinMax(0),
	commission_calculate_on_amount: yupNumberOptionalMinMax(0),
	commission_percentage_on_amount: yupNumberOptionalMinMax(0),
	grandtotal_cheque_amount: yupNumberOptionalMinMax(0),
	id: yupNumberOptionalMinMax(1),
	payment_id: yupIdOptional,
	payment_serial_number: yupStringOptional,
	payment_voucher_date: yupStringOptional,
	payto_salesman_id: yupNumberOptionalMinMax(1),
	payto_salesman_incentive_multiple: yupNumberOptionalMinMax(0.01),
	payto_salesman_incentive_amount: yup.number().required().min(0).default(0),
	payto_salesman_name: yupStringOptional,
	payto_subbroker_id: yup.number().min(1),
	payto_subbroker_incentive_multiple: yupNumberOptionalMinMax(0.01),
	payto_subbroker_incentive_amount: yup.number().required().min(0).default(0),
	payto_subbroker_name: yupStringRequired,
	related_party_name: yupStringOptional,
	row_index: yup.number().required().min(0),
	supplier_invoice_numbers: yupStringOptional,
	grandtotal_invoice_amount_in_payment: yupNumberOptionalMinMax(0),
	grandtotal_payment_amount: yupNumberOptionalMinMax(0),
	creation_date: yupStringOptional,
	updated_date: yupStringOptional,
};

const commBillRowValidator = yup.object().shape(commbill_rowitem_schema).noUnknown();
export type CommBillRowItem = yup.InferType<typeof commBillRowValidator>;

export const commbill_schema = {
	id: yupIdRequired,
	bill_to_type: yup.string().oneOf(["clientcompany", "subbroker"]),
	bill_to_clientcompany_id: yup
		.number()
		.when("bill_to_subbroker_id", ([val]) =>
			!val
				? yup.number().min(1).required("Either 'bill_to_clientcompany_id' or 'bill_to_subbroker_id' is required.")
				: yup.number().nullable().optional().max(0),
		),
	bill_to_clientcompany_name: yup.string().optional(),
	// tried defining when here also but it was giving error of Cyclic dependency
	bill_to_subbroker_id: yupNumberOptionalMinMax(1),
	bill_to_subbroker_name: yupStringOptional,
	comm_payment_ids: yup.array().of(yup.string().min(1)),
	discount_percent: yupNumberOptional,
	discount_description: yupStringOptional,
	discount_amount: yupNumberOptional,
	financial_year: yupFinancialYearBound(),
	grandtotal_commbill_amount: yup.number().required().min(0).max(9999999999),
	grandtotal_commission_amount: yup.number().required().min(0),
	grandtotal_discount_amount: yupNumberOptional,
	grandtotal_tax_amount: yupNumberOptionalMinMax(0),
	grandtotal_taxable_amount: yup.number().required().min(0),
	gst_cgst_amount: yupNumberOptionalMinMax(0),
	gst_cgst_percent: yupNumberOptionalMinMax(0),
	gst_hsn_code: yupStringOptional,
	gst_igst_amount: yupNumberOptionalMinMax(0),
	gst_igst_percent: yupNumberOptionalMinMax(0),
	gst_sgst_amount: yupNumberOptionalMinMax(0),
	gst_sgst_percent: yupNumberOptionalMinMax(0),
	cheque_mode: yupStringOptional,
	last_payment_date: yupStringOptional,
	notes: yupStringOptional,
	// values can be zero when the bill is cancelled.
	outstanding_amount: yup.number().required().default(0),
	ownercompany_id: yup.number().min(1),
	ownercompany_name: yupStringRequired,
	payment_received_amount: yup.number().required().default(0),
	row_item_details: yup.array().required().min(1).of(yup.object().shape(commbill_rowitem_schema).noUnknown()),
	serial_number: yup.number().required().min(1),
	status: yup.string().oneOf(["Cancelled", "Draft", "Paid", "Part", "Un-Paid"]),
	tds_percent: yupNumberOptionalMinMax(0),
	tds_amount: yupNumberOptionalMinMax(0),
	type: yup.string().oneOf(["commbill"]).default("commbill"),
	voucher_date: yupDateRequired,
	payment_due_days: yup.number().required().default(0),
	payment_due_date: yupStringOptional,
	salesman_name: yupStringOptional,
	subbroker_name: yupStringOptional,
	created_by: yupStringOptional,
	creation_date: yupStringOptional,
	updated_date: yupStringOptional,
};

export const commbillValidator = yup.object().shape(commbill_schema).noUnknown();

export type Commbill = yup.InferType<typeof commbillValidator>;
export interface CommbillForm extends Omit<Commbill, "creation_date" | "updated_date"> {
	afterSubmit: any;
	bill_to: SaClientcompany | SaSubbroker;
	creation_date?: string;
	default_commission_percentage_on_amount: number;
	default_salesman_incentive_multiple: number;
	default_subbroker_incentive_multiple: number;
	ownercompany: SaOwnercompany;
	row_item_details: CommBillRowItem[];
	updated_date?: string;
}
