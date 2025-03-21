import * as yup from "yup";
import { yupNumberOptionalMinMax, yupStringOptional } from "./yup_utils";

export const rolespermissions_schema = {
	id: yupNumberOptionalMinMax(1), // auto-generated serial-number
	type: yup.string().required().default("roles").oneOf(["roles"]),
	role_name: yup.string().required(),
	role_description: yupStringOptional,
	view: yup.array().required().of(yup.string()),
	clientcompany_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	clientcompany_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	clientcompany_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	commbill_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	commbill_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	commbill_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	commpayment_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	commpayment_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	commpayment_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	invoice_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	invoice_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	invoice_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	ownercompany_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	ownercompany_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	ownercompany_edit: yup.string().required().oneOf(["dont allow", "allowed"]).default("dont allow"),
	order_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	order_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	order_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	payment_create: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	payment_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	payment_edit: yup.string().required().oneOf(["7 days", "dont allow", "allowed", "need approval"]).default("7 days"),
	teammember_delete: yup.string().required().oneOf(["dont allow", "allowed", "need approval"]).default("dont allow"),
	teammember_edit: yup.string().required().oneOf(["dont allow", "allowed"]).default("dont allow"),
};
export interface SaRoles {
	/** auto increment id */
	id: number;
	/** roles name like salesman, owner, admin, etc */
	role_name: string;
	/** descirption of role what that does */
	role_description: string | null;
	/** team member id whoes'data this role can view or all */
	view: string[];
	/** possible value are allowed and dont allow and need approval */
	clientcompany_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	clientcompany_edit: string | null;
	/** possible value are allowed and dont allow */
	clientcompany_delete: string | null;
	/** possible value are allowed and dont allow and need approval */
	order_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	order_edit: string | null;
	/** possible value are allowed and dont allow */
	order_delete: string | null;
	/** possible value are allowed and dont allow and need approval */
	invoice_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	invoice_edit: string | null;
	/** possible value are allowed and dont allow */
	invoice_delete: string | null;
	/** possible value are allowed and dont allow and need approval */
	payment_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	payment_edit: string | null;
	/** possible value are allowed and dont allow */
	payment_delete: string | null;
	/** possible value are allowed and dont allow and need approval */
	commbill_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	commbill_edit: string | null;
	/** possible value are allowed and dont allow */
	commbill_delete: string | null;
	/** possible value are allowed and dont allow and need approval */
	commpayment_create: string | null;
	/** possible value are allowed, 7 days, dont allow and need approval */
	commpayment_edit: string | null;
	/** possible value are allowed and dont allow */
	commpayment_delete: string | null;
	/** possible value are allowed and dont allow */
	ownercompany_create: string | null;
	/** possible value are allowed dont allow  */
	ownercompany_edit: string | null;
	ownercompany_delete: string | null;
	teammember_edit: string | null;
	/** possible value are allowed and dont allow */
	teammember_delete: string | null;
	/** roles */
	type: string;
}
