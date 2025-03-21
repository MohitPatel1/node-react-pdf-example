import * as yup from "yup";
// import { getSessionFinYr } from "../config";

export const yupNumberOptional = yup
	.number()
	.transform((v, o) => (o === "" || o === undefined ? null : v))
	.optional()
	.nullable();

export const yupNumberOptionalMinMax = (min?: any, max?: any) =>
	yupNumberOptional.test(
		"number validation",
		`${min || min === 0 ? `number min should be ${min}` : ""}` + `${max || max === 0 ? `number max should be ${max}` : ""}`,
		(value) => {
			// console.log({value});
			return (
				value === null ||
				value === undefined ||
				(min || min === 0 ? Number(value) >= min : true && (min || min === 0) ? Number(value) <= max : true)
			);
		},
	);

export const yupObjectOptional = yup.object().optional().nullable();

export const yupStringOptional = yup
	.string()
	.transform((v, o) => (o === undefined || o === "" ? null : v ? v.trim() : v))
	.nullable()
	.optional();

export const yupStringOptionalMaxLength = (input: number) =>
	yupStringOptional
		.test(
			"string length",
			`string max length can be ${input}`,
			(value) => !value || value === null || value === undefined || value.trim().length <= input,
		)
		.trim();

export const yupStringOptionalOneof = (inputArray: string[]) =>
	yupStringOptional.test(
		"array oneof",
		`not on given options`,
		(value) => !value || value === null || value === undefined || inputArray.includes(value.trim()),
	);

export const yupStringRequired = yup
	.string()
	.transform((v, o) => (o === undefined || o === "" ? null : v ? v.trim() : v))
	.required()
	.trim();

export const yupArrayOptional = yup.array().optional().nullable();
export const yupArrayOptionalOfStringSubsetOf = (inputArray: string[]) =>
	yup
		.array()
		.optional()
		.nullable()
		.of(yupStringOptional)
		.test(
			"array oneof",
			`not on given options`,
			(value: any) => !value || value === null || value === undefined || value.every((el: string) => inputArray.includes(el.trim())),
		);

export const yupIdOptional = yup.string().optional().nullable();
export const yupIdRequired = yup.string().required(); // <ownercompany_id><serial_number.padStart(6,"0")>

export const yupDateRequired = yupStringRequired.matches(/^(\d{4,5}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))$/gm);
export const yupDateOptional = yupStringOptional.matches(/^(\d{4,5}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))$/gm);

export const yupFinancialYearBound = () =>
	yup.number().required()
		// .min(getSessionFinYr()).max(getSessionFinYr())
		.typeError("Invalid Financial year");

// need to check & build completely
// export const yupContactArray = yup.array().nullable().optional().test(
//     'contact_array_test',
//     (d) => console.log({d}),
//     (value: any) => value === '' || (
//         (value[2] === null || Boolean(Number(value[2])))
//         && (value[3] === null || Boolean(Number(value[3])))
//         && (value[4] === null || value[4].isEmail) // check logic
//     )
// )
