import * as yup from "yup";
import { appLevelOptions } from "../config";
import { yupNumberOptionalMinMax, yupStringOptional } from "./yup_utils";

export const product_schema = {
	id: yupNumberOptionalMinMax(1).typeError("Id should be greater than 1"),
	image_urls: yup.array().nullable().optional(),
	product_minprice: yupNumberOptionalMinMax(0.01).typeError("Min price should be 0.01"),
	product_maxprice: yupNumberOptionalMinMax(0.01).typeError("Max price should be 0.01"),
	product_description: yupStringOptional,
	product_name: yup.string().defined().required().typeError("Product Name is required"),
	product_variations: yup.array().of(yup.string()).nullable().optional(),
	product_actual_uom: yup.string().oneOf(appLevelOptions.uomOptions).required().typeError("Actual UOM should be of PCS, KGS, MTR"),
	product_billed_uom: yup.string().oneOf(appLevelOptions.uomOptions).required().typeError("Billed UOM should be of PCS, KGS, MTR"),
	product_range_chekbox: yup.boolean().defined().required().default(false).typeError("Price Range Checkbox filed is required filed"),
	variation_type: yup.string().default("Size").typeError("Variation type should be entered")
};

export interface SaProduct {
	/** auto increment id */
	id: number;
	/** product name given by supplier */
	product_name: string;
	/** min price of product */
	product_minprice: number | null;
	/** max price of product */
	product_maxprice: number | null;
	/** Array of product variations like sizes ml,xl, sizes */
	product_variations: string[] | null;
	product_actual_uom: string;
	product_billed_uom: string;
	product_description: string | null;
	/** urls of images maintained here */
	image_urls: string[] | null;
	/** type of product */
	type: string;
	/**Type of variation */
	variation_type:string;
}

export const productValidator = yup
	.object()
	.shape({
		...product_schema,
		type: yup.string().defined().required().default("product"),
	})
	.noUnknown();
