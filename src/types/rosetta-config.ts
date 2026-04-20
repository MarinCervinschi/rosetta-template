export interface RosettaConfig {
	name: string;
	tagline: string;
	repoUrl: string | null;
	logo: string | { light: string; dark: string } | null;
	showTemplateCredit: boolean;
	personalized: boolean;
	personalizedAt: string | null;
}
