import { SaOwnercompany } from "./yup_ownercompany";

// Table sa_users
export interface SaUsers {
	/** auto increment id */
	id: number;
	/** type = users */
	type: string;
	user_name: string;
	user_email: string;
	og_id: string;
	user_pass: string;
	user_role: string;
	contact_number0: string;
	contact_number1: string | null;
	user_status: string;
}

export interface userWithSessionOgCompany extends SaUsers {
	sessionOgCompany: SaOwnercompany;
}
