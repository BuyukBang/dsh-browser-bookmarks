# dsh-browser-bookmarks

A DeepSeek Harness client plugin that adds an integrated bookmark manager to the right sidebar Browser panel.

## Overview

In DeepSeek Harness, the sidebar Browser lets you preview websites and test web interfaces alongside your chat conversations. `dsh-browser-bookmarks` enriches this browser view by adding a star button directly into the toolbar between the Reload button and the address bar.

Clicking the star opens a dropdown popover to save, organize, and navigate your favorite URLs with ease.

## Key Features

- **Native Toolbar Integration:** Placed seamlessly between the Reload button and URL bar, respecting the exact 28x28px tool styling and DSH theme variables (`--dsw-*`).
- **Dynamic Star Indicator:** Turns active golden (`#eab308`) when the currently opened page is bookmarked; stays outline when it is not.
- **One-Click Page Bookmarking:** Quickly bookmark or remove the current page with a single click.
- **Custom Bookmarks:** Add bookmarks manually with custom titles and arbitrary URLs.
- **Instant Navigation:** Click any bookmark in the list to immediately navigate to that address.
- **Full Management:**
  - **Reorder:** Move bookmarks up or down (▲ / ▼).
  - **Inline Editing:** Edit bookmark title and URL in place (✏️).
  - **Delete:** Remove unwanted bookmarks (🗑️).
- **Persistent Storage:** Stored locally in `localStorage` under `dsh:browser:bookmarks`.
- **Keyboard & Click-Outside Friendly:** Closes automatically on `Escape` or clicking outside the popover.

## Installation

### Via DSH Plugin Manager / Market

```bash
dsh plugin --profile desktop add dsh-browser-bookmarks
```

### Manual Installation (Development)

Clone or copy the repository into your profile's `node_modules` or `plugins` directory:

```bash
git clone https://github.com/BuyukBang/dsh-browser-bookmarks.git ~/.dsh/plugins/dsh-browser-bookmarks
```

Register it in `~/.dsh/profiles/desktop/package.json`:

```json
{
  "dependencies": {
    "dsh-browser-bookmarks": "link:../../plugins/dsh-browser-bookmarks"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-browser-bookmarks"
      ]
    }
  }
}
```

Then reload or restart DeepSeek Harness.

## License

MIT License. See [LICENSE](LICENSE) for details.
