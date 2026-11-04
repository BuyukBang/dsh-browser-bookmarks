# dsh-browser-bookmarks

DeepSeek Harness plugin adding a bookmark manager directly into the sidebar Browser toolbar.

## Features

- **Toolbar Star Button:** Injected neatly between the Reload button and the URL address bar.
- **Active State:** Star turns active/golden when the current page is bookmarked.
- **Dropdown Manager:**
  - One-click "Add current page" bookmarking.
  - Manual new bookmark addition with custom title and URL.
  - One-click navigation to any saved bookmark.
  - Inline editing of bookmark titles and URLs.
  - Reordering (Move Up / Move Down).
  - Deletion with confirmation.
- **Persistence:** LocalStorage-backed per profile (`dsh:browser:bookmarks`).
- **Theme-aware:** Integrates with DSH light and dark themes using `--dsw-*` tokens.

## License

MIT
