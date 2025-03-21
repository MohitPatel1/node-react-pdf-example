export interface SaGeneralsetting {
	/** auto increment id */
	id: number;
	/** name of the setting, like order, invoice, anything */
	setting_name: string;
	/** array of name of the role, like admin, user, on which role will be applied, one more possible value is all */
	role_name: string[];
	/** json object to store the setting */
	setting_object: JSON;
	/** type of table */
	type: string;
}
