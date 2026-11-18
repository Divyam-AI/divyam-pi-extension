# divyam-pi-extension

A [Pi](https://pi.dev) package that adds Divyam as the `divyam` model provider.

## Install

```bash
pi install git:github.com/divyam-ai/divyam-pi-extension
```

Then add your API key: run `/login` in Pi, choose **Sign in with an API key**, then **Divyam**. Pi saves it in `~/.pi/agent/auth.json`. Until a key is set, Pi shows a reminder at startup. You can also set `DIVYAM_API_KEY` before starting Pi. If you have logged in with `/login`, Pi uses that key and ignores `DIVYAM_API_KEY`. To switch to `DIVYAM_API_KEY`, run `/logout` and choose Divyam.

Requests go to Divyam's preview environment, `https://api.preview.divyam.ai/v1`. To use another environment, set `DIVYAM_BASE_URL` to its address without `/v1` before starting Pi, for example `DIVYAM_BASE_URL=http://localhost:9100`; the package adds `/v1` itself.

## Uninstall

```bash
pi remove git:github.com/divyam-ai/divyam-pi-extension
```

Pi doesn't run any package code on removal, so these stay behind:

- The key in `auth.json`. Remove it with `/logout` before uninstalling.
- The `divyam/...` entries the install added to `enabledModels` in `~/.pi/agent/settings.json`.

## Models

| Model | Context | Max output |
|---|---|---|
| `divyam/divyam-as/claude-sonnet-5-5` | 1M | 128K |
| `divyam/divyam-as/claude-opus-5-5` | 1M | 128K |
| `divyam/divyam-as/gpt-5.6-sol` | 1.05M | 128K |
| `divyam/divyam-as/gpt-6-sol` | 1.05M | 128K |

Every model takes text and images, and Pi's thinking level is sent as `reasoning_effort`. Switching to a Divyam model from another provider sets the level to `medium`; change it as usual, and `off` leaves the effort to the model. Which ones you can use depends on your plan: new preview accounts get the Claude models, older ones the GPT models. Pi's cost figures are an estimate; your plan sets what you're charged.

This package replaces any `divyam` provider defined in `~/.pi/agent/models.json`.
