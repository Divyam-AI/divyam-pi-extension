// The model list, shared by the extension and the install script. Plain JavaScript so the
// install script can import it with node directly.
export const PROVIDER = "divyam";

// The /v1/models endpoint lists ids only, so limits and prices live in the extension.
// Prices are USD per million tokens and only feed Pi's cost estimate: what an org is
// actually charged depends on its plan. Every class takes images: a request carrying
// one is served by the class's vision class.
//
// The Claude classes come first because preview's default plan offers only them; orgs on
// older plans have the GPT classes.
export const MODELS = [
	{
		id: "divyam-as/claude-sonnet-5-5",
		name: "Divyam Claude Sonnet 5.5",
		contextWindow: 1_000_000,
		cost: { input: 1, output: 5, cacheRead: 0.05, cacheWrite: 1.25 },
	},
	{
		id: "divyam-as/claude-opus-5-5",
		name: "Divyam Claude Opus 5.5",
		contextWindow: 1_000_000,
		cost: { input: 2, output: 10, cacheRead: 0.1, cacheWrite: 2.5 },
	},
	{
		id: "divyam-as/gpt-5.6-sol",
		name: "Divyam GPT 5.6 Sol",
		contextWindow: 1_050_000,
		cost: { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
	},
	{
		id: "divyam-as/gpt-6-sol",
		name: "Divyam GPT 6 Sol",
		contextWindow: 1_050_000,
		cost: { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
	},
];
