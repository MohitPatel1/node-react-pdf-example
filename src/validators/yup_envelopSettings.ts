import * as yup from "yup";
import { yupArrayOptional, yupNumberOptionalMinMax, yupStringRequired } from "./yup_utils";

const selected_envelop_setting_schema = yup.object().shape({
	template_setting: yup.object().shape({
		envelop_options: yup.array().required(),
		choosen_template: yup.number().required(),
	}),
});

const envelopSettingSchema = {
	id: yupNumberOptionalMinMax(1),
	type: yup.string().required().oneOf(["generalsetting"]),
	setting_name: yup.string().required().oneOf(["selected_envelop_template"]),
	setting_type: yup.string().required().oneOf(["envelop_setting"]),
	role_name: yup
		.array()
		.min(1)
		.of(yup.string().oneOf(["all"])),
	setting_object: selected_envelop_setting_schema.required(),
};

export const envelopSettingResolver = yup.object().shape(envelopSettingSchema).noUnknown();

export type envelopSettingType = yup.InferType<typeof envelopSettingResolver>;
