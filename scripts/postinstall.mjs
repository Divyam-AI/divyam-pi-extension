// Adds the Divyam models to Pi's enabledModels when Pi installs or updates this package. A
// non-empty enabledModels makes /model open on that list and limits Ctrl+P cycling to it,
// which would hide the Divyam models. `pi install` clones the package and runs
// `npm install` in it, `pi update` pulls a new commit and runs it again, and npm runs this
// script each time. Pi reads settings at startup, so it starts with the models in its list.
//
// Each model is added once. The ids already offered are kept in OFFERED_FILE, so an update
// adds only the models that are new to the package, and a model the user removed from
// enabledModels stays removed.
//
// The key usually isn't set yet at this point. Until it is, Pi warns at startup that the
// Divyam entries match no models.
//
// It never fails the install: every path exits 0.
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Mirrors Pi's getAgentDir(): PI_CODING_AGENT_DIR with ~ expanded, else ~/.pi/agent.
function agentDir() {
	const dir = process.env.PI_CODING_AGENT_DIR;
	if (!dir) return join(homedir(), ".pi", "agent");
	if (dir === "~") return homedir();
	if (dir.startsWith("~/")) return join(homedir(), dir.slice(2));
	return dir;
}

function isInside(parent, child) {
	const path = relative(parent, child);
	return path !== "" && !path.startsWith("..") && !isAbsolute(path);
}

// Only a user-scope install: Pi puts those under <agentDir>/git or <agentDir>/npm. This
// skips project installs (which use the project's own settings), `pi -e` trial runs, and
// `npm install` run by hand in a checkout.
function installedForUser(dir, packageDir) {
	return ["git", "npm"].some((root) => isInside(join(dir, root), packageDir));
}

const OFFERED_FILE = "divyam-models-offered.json";

// What versions before OFFERED_FILE added. An install that predates it and lists any
// divyam/ model has been offered these.
const FIRST_MODELS = ["divyam-as/gpt-5.6-sol", "divyam-as/gpt-6-sol"];

function readOffered(path) {
	if (!existsSync(path)) return null;
	const offered = JSON.parse(readFileSync(path, "utf8"));
	return Array.isArray(offered) ? offered.filter((id) => typeof id === "string") : [];
}

// Returns the models it added to enabledModels.
async function addToEnabledModels(dir) {
	const settingsPath = join(dir, "settings.json");
	const offeredPath = join(dir, OFFERED_FILE);
	const { MODELS, PROVIDER } = await import("../lib/divyam.mjs");
	const ids = MODELS.map(({ id }) => id);

	const settings = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, "utf8")) : {};
	const enabledModels = settings?.enabledModels;
	const restricted = Array.isArray(enabledModels) && enabledModels.length > 0;
	const patterns = restricted
		? enabledModels.filter((pattern) => typeof pattern === "string").map((pattern) => pattern.toLowerCase())
		: [];

	let offered = readOffered(offeredPath);
	if (offered === null) {
		const listed = patterns.some((pattern) => pattern.startsWith(`${PROVIDER}/`));
		offered = listed ? FIRST_MODELS : [];
	}

	// Empty or unset means every model is already listed, so there is nothing to add; the
	// models still count as offered.
	const added = restricted
		? ids
				.filter((id) => !offered.includes(id))
				.map((id) => `${PROVIDER}/${id}`)
				.filter((model) => !patterns.includes(model.toLowerCase()))
		: [];

	if (added.length > 0) {
		settings.enabledModels = [...enabledModels, ...added];
		// Pi writes settings.json the same way: two-space indent, no trailing newline.
		writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
	}
	writeFileSync(offeredPath, JSON.stringify([...new Set([...offered, ...ids])], null, 2), "utf8");
	return added;
}

try {
	const dir = realpathSync(agentDir());
	const packageDir = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
	if (installedForUser(dir, packageDir)) {
		const added = await addToEnabledModels(dir);
		if (added.length > 0) {
			console.log(`divyam-pi-extension: added ${added.join(", ")} to enabledModels in ${join(dir, "settings.json")}`);
		}
	}
} catch {
	// Leave settings alone; the models are still available through Tab in /model.
}
