import * as yup from "yup";
import { yupArrayOptional, yupNumberOptionalMinMax } from "./yup_utils";

const order_whatsapp_alert_schema = {
	calculate_from: yup.string().required().oneOf(["Delivery Due Date", "Order Date"]),
	// days_to_add: yup.number().required().default(0),
	days_to_add: yup
		.number()
		.when("calculate_from", ([calculate_from]: string[]) =>
			calculate_from === "Delivery Due Date" ? yup.number().required() : yupNumberOptionalMinMax(0).required(),
		),
	notify_salesman: yup.boolean().optional().nullable().default(false),
	notify_users: yup
		.array()
		.when("notify_salesman", ([notify_salesman]: boolean[]) =>
			!notify_salesman ? yup.array().min(1).of(yup.string().required()).required() : yupArrayOptional.of(yup.string().optional()),
		),
};

const orderAlertsSchema = {
	id: yupNumberOptionalMinMax(1),
	type: yup.string().required().oneOf(["generalsetting"]),
	setting_name: yup.string().required().oneOf(["whatsapp_order_alerts"]),
	setting_type: yup.string().required().oneOf(["whatsapp_alert"]),
	role_name: yup
		.array()
		.min(1)
		.of(yup.string().oneOf(["all"])),
	setting_object: yupArrayOptional.of(yup.object().optional().shape(order_whatsapp_alert_schema).noUnknown()),
};

export const orderAlertsResolver = yup.object().shape(orderAlertsSchema).noUnknown();

export type orderAlertsType = yup.InferType<typeof orderAlertsResolver>;
