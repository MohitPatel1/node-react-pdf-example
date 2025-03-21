import * as yup from "yup";
import { appLevelOptions } from "../config";
import { yupNumberOptional, yupNumberOptionalMinMax, yupStringOptional } from "./yup_utils";

export const othercharge_schema = {
	charge_amount: yupNumberOptional,
	charge_type: yup.string().required().oneOf(appLevelOptions.otherChargeTypes),
	crdr_type: yup.string().required().oneOf(["negativeOutputCr", "dr"]),
	due_period_in_days: yupNumberOptionalMinMax(1),
	id: yupNumberOptionalMinMax(1),
	charge_name: yupStringOptional,
	charge_percent: yupNumberOptional,
	type: yup.string().oneOf(["othercharge"]).default("othercharge"),
};

export const otherchargeValidator = yup.object().shape(othercharge_schema).noUnknown();
export type SaOtherCharge = yup.InferType<typeof otherchargeValidator>;
