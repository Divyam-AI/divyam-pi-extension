# divyam-pi-extension

A [Pi](https://pi.dev) package that adds Divyam Router as the `divyam` model provider.

## Install

```bash
pi install git:github.com/divyam-ai/divyam-pi-extension
```

Then add your API key: run `/login` in Pi, choose **Sign in with an API key**, then **Divyam**. Pi saves it in `~/.pi/agent/auth.json`. Until a key is set, Pi shows a reminder at startup. You can set `DIVYAM_API_KEY` before starting Pi instead.

`DIVYAM_BASE_URL` points Pi at another router deployment. The default is `https://api.preview.divyam.ai/v1`.

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
| `divyam/divyam-as/gpt-5.6-sol` | 400K | 128K |
| `divyam/divyam-as/gpt-6-sol` | 400K | 128K |

This package replaces any `divyam` provider defined in `~/.pi/agent/models.json`.
