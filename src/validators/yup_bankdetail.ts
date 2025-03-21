import * as yup from "yup";
import { yupStringOptional } from "./yup_utils";

export const bankdetail_schema = {
	name_as_per_bank: yupStringOptional,
	ifsc_code: yupStringOptional,
	bank_name: yupStringOptional,
	branch_name: yupStringOptional,
	account_number: yupStringOptional,
	bank_upi_code: yupStringOptional,
};

export interface SaBankdetail {
	name_as_per_bank: string | null;
	ifsc_code: string | null;
	bank_name: string | null;
	branch_name: string | null;
	account_number: string | null;
	bank_upi_code: string | null;
}
