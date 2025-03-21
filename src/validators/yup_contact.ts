import * as yup from "yup";
import { yupNumberOptionalMinMax, yupStringOptional } from "./yup_utils";

export const contact_schema = {
	contact_type: yupStringOptional,
	person_name: yupStringOptional,
	std_code: yupStringOptional,
	phone_number: yupNumberOptionalMinMax(1, 9999999999).typeError("Invalid Phone Number"),
	email: yupStringOptional.email().typeError("Invalid Email"),
};

export interface SaContact {
	contact_type: string | null;
	person_name: string | null;
	std_code: string | null;
	phone_number: number | null;
	email: string | null;
}
