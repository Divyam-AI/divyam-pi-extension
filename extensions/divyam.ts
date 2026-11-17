import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { MODELS, PROVIDER } from "../lib/divyam.mjs";

// Divyam serves the OpenAI Chat Completions API for every model class, the Claude ones
// included, so Pi's built-in openai-completions implementation handles requests,
// streaming, tools and usage.
//
// The key comes from auth.json, where /login stores it, or from DIVYAM_API_KEY.
// DIVYAM_BASE_URL points Pi at another Divyam deployment; the default is the preview
// environment.
const DEFAULT_BASE_URL = "https://api.preview.divyam.ai/v1";

export default function divyamProvider(pi: ExtensionAPI) {
	pi.registerProvider(PROVIDER, {
		name: "Divyam",
		baseUrl: process.env.DIVYAM_BASE_URL?.trim() || DEFAULT_BASE_URL,
		api: "openai-completions",
		apiKey: "$DIVYAM_API_KEY",
		models: MODELS.map(({ id, name, contextWindow, cost }) => ({
			id,
			name,
			reasoning: false,
			input: ["text", "image"],
			contextWindow,
			maxTokens: 128_000,
			cost,
		})),
	});

	pi.on("session_start", (_event, ctx) => {
		if (!ctx.hasUI) return;
		if (!ctx.modelRegistry.getAvailable().some((model) => model.provider === PROVIDER)) {
			ctx.ui.notify(
				"Divyam has no API key. Run /login, choose Sign in with an API key, then Divyam. Or set DIVYAM_API_KEY.",
				"warning",
			);
		}
	});
}
