import { yupNumberOptional, yupNumberOptionalMinMax, yupStringOptional } from "./yup_utils";

export const variationbreakdown_schema = {
	variation_name: yupStringOptional,
	variation_quantity: yupNumberOptionalMinMax(0.01),
	variation_price: yupNumberOptionalMinMax(0.01),
};

export interface SaVariationBreakdown {
	/** variation name */
	variation_name: string | null;
	/** variation quantity */
	variation_quantity: number | null;
	/** variation price */
	variation_price: number | null;
}

// product_variations

// product_variations_breakdown
