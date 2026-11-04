window.__ModuleLoader__.load({
	id: "dsh-browser-bookmarks",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const STORAGE_KEY = "dsh:browser:bookmarks";
		const BTN_ATTR = "data-dsh-bookmark-btn";
		const POPOVER_ID = "dsh-browser-bookmarks-popover";

		// Default initial bookmarks if storage is empty
		const DEFAULT_BOOKMARKS = [
			{
				id: "bm-dsh-default-1",
				title: "DeepSeek",
				url: "https://chat.deepseek.com",
				createdAt: Date.now() - 2000
			},
			{
				id: "bm-dsh-default-2",
				title: "GitHub",
				url: "https://github.com",
				createdAt: Date.now() - 1000
			}
		];

		function loadBookmarks() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (!raw) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKMARKS));
					return DEFAULT_BOOKMARKS.slice();
				}
				const parsed = JSON.parse(raw);
				return Array.isArray(parsed) ? parsed : [];
			} catch (e) {
				console.error("[dsh-browser-bookmarks] Failed to parse bookmarks:", e);
				return [];
			}
		}

		function saveBookmarks(list) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
			} catch (e) {
				console.error("[dsh-browser-bookmarks] Failed to save bookmarks:", e);
			}
		}

		function generateId() {
			return "bm-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
		}

		// Inject scoped CSS
		const CSS_TAG = "dsh-browser-bookmarks/styles.css";
		if (typeof document !== "undefined" && !document.querySelector(`style[data-plugin-css="${CSS_TAG}"]`)) {
			const style = document.createElement("style");
			style.dataset.plugin = "dsh-browser-bookmarks";
			style.dataset.pluginCss = CSS_TAG;
			style.textContent = `
				.dsh-bm-tool {
					box-sizing: border-box;
					width: 28px;
					height: 28px;
					color: var(--dsw-alias-label-secondary, #94a3b8);
					cursor: pointer;
					border-radius: 6px;
					justify-content: center;
					align-items: center;
					display: flex;
					background: transparent;
					border: none;
					padding: 0;
					flex-shrink: 0;
					transition: color 0.15s ease, background-color 0.15s ease;
				}
				.dsh-bm-tool:hover {
					color: var(--dsw-alias-label-primary, #f1f5f9);
					background: var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.08));
				}
				.dsh-bm-tool.active {
					color: #eab308;
				}
				.dsh-bm-popover {
					position: absolute;
					z-index: 9999;
					width: 320px;
					max-height: 480px;
					display: flex;
					flex-direction: column;
					background: var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base, #1e1e24));
					color: var(--dsw-alias-label-primary, #e2e8f0);
					border: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.12));
					border-radius: 8px;
					box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
					font-family: inherit;
					font-size: 13px;
					line-height: 1.4;
					overflow: hidden;
					animation: dsh-bm-fadein 0.15s ease-out;
				}
				@keyframes dsh-bm-fadein {
					from { opacity: 0; transform: translateY(-4px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.dsh-bm-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 8px 12px;
					border-bottom: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.08));
					background: var(--dsw-alias-bg-secondary, rgba(255, 255, 255, 0.03));
					font-weight: 600;
					font-size: 13px;
				}
				.dsh-bm-actions-bar {
					display: flex;
					gap: 6px;
					padding: 8px 12px;
					border-bottom: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.08));
				}
				.dsh-bm-btn {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					padding: 5px 10px;
					font-size: 12px;
					font-weight: 500;
					border-radius: 5px;
					border: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.15));
					background: var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.06));
					color: var(--dsw-alias-label-primary, inherit);
					cursor: pointer;
					transition: all 0.15s ease;
				}
				.dsh-bm-btn:hover {
					background: var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.12));
					border-color: var(--dsw-alias-border-hover, rgba(255, 255, 255, 0.25));
				}
				.dsh-bm-btn-primary {
					background: #2563eb;
					border-color: #3b82f6;
					color: #ffffff;
				}
				.dsh-bm-btn-primary:hover {
					background: #1d4ed8;
				}
				.dsh-bm-list {
					flex: 1;
					overflow-y: auto;
					max-height: 320px;
					padding: 4px 0;
					margin: 0;
					list-style: none;
				}
				.dsh-bm-item {
					display: flex;
					align-items: center;
					padding: 6px 12px;
					gap: 8px;
					cursor: pointer;
					border-bottom: 1px solid rgba(255, 255, 255, 0.03);
					transition: background-color 0.12s ease;
				}
				.dsh-bm-item:hover {
					background: var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.07));
				}
				.dsh-bm-item-info {
					flex: 1;
					min-width: 0;
					display: flex;
					flex-direction: column;
				}
				.dsh-bm-item-title {
					font-size: 13px;
					font-weight: 500;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: var(--dsw-alias-label-primary, #f1f5f9);
				}
				.dsh-bm-item-url {
					font-size: 11px;
					color: var(--dsw-alias-label-secondary, #94a3b8);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.dsh-bm-item-tools {
					display: none;
					align-items: center;
					gap: 2px;
					margin-left: 4px;
				}
				.dsh-bm-item:hover .dsh-bm-item-tools {
					display: flex;
				}
				.dsh-bm-icon-btn {
					background: transparent;
					border: none;
					color: var(--dsw-alias-label-secondary, #94a3b8);
					padding: 3px;
					border-radius: 4px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 1;
				}
				.dsh-bm-icon-btn:hover {
					color: var(--dsw-alias-label-primary, #ffffff);
					background: rgba(255, 255, 255, 0.12);
				}
				.dsh-bm-icon-btn.danger:hover {
					color: #f87171;
					background: rgba(239, 68, 68, 0.15);
				}
				.dsh-bm-empty {
					padding: 24px 16px;
					text-align: center;
					color: var(--dsw-alias-label-secondary, #94a3b8);
					font-size: 12px;
				}
				.dsh-bm-form {
					padding: 10px 12px;
					background: var(--dsw-alias-bg-secondary, rgba(255, 255, 255, 0.03));
					border-top: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.08));
					display: flex;
					flex-direction: column;
					gap: 6px;
				}
				.dsh-bm-input {
					width: 100%;
					box-sizing: border-box;
					padding: 5px 8px;
					font-size: 12px;
					border-radius: 4px;
					border: 1px solid var(--dsw-alias-border-subtle, rgba(255, 255, 255, 0.15));
					background: var(--dsw-alias-bg-base, rgba(0, 0, 0, 0.2));
					color: var(--dsw-alias-label-primary, inherit);
					outline: none;
				}
				.dsh-bm-input:focus {
					border-color: #3b82f6;
				}
				.dsh-bm-form-row {
					display: flex;
					gap: 6px;
					justify-content: flex-end;
				}
			`;
			document.head.appendChild(style);
		}

		// SVGs
		const STAR_OUTLINE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
		const STAR_FILLED_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
		const UP_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
		const DOWN_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
		const EDIT_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
		const TRASH_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
		const PLUS_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

		let activePopover = null;

		function closePopover() {
			if (activePopover) {
				activePopover.remove();
				activePopover = null;
			}
		}

		function navigateToUrl(toolbar, url) {
			const input = toolbar.querySelector("input");
			if (!input) return;

			// Set native value and dispatch events so React captures it
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(input, url);
			} else {
				input.value = url;
			}
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));

			// Request form submit
			const form = toolbar.closest("form") || toolbar;
			if (form && typeof form.requestSubmit === "function") {
				form.requestSubmit();
			} else {
				const submitBtn = toolbar.querySelector("button[type='submit']");
				if (submitBtn) submitBtn.click();
			}
			closePopover();
		}

		function openBookmarksDropdown(btn, toolbar) {
			if (activePopover) {
				closePopover();
				return;
			}

			const bookmarks = loadBookmarks();
			const input = toolbar.querySelector("input");
			const currentUrl = input ? input.value.trim() : "";
			const isCurrentBookmarked = bookmarks.some((b) => b.url.toLowerCase() === currentUrl.toLowerCase() && currentUrl !== "");

			const popover = document.createElement("div");
			popover.id = POPOVER_ID;
			popover.className = "dsh-bm-popover";

			// Position popover directly below the bookmark button
			const btnRect = btn.getBoundingClientRect();
			popover.style.top = `${btnRect.bottom + 6}px`;
			popover.style.left = `${Math.max(10, Math.min(btnRect.left - 10, window.innerWidth - 330))}px`;

			let editingId = null;
			let showAddForm = false;

			function render() {
				const currentList = loadBookmarks();
				const curUrl = (input ? input.value.trim() : "");
				const curBookmarked = currentList.some((b) => b.url.toLowerCase() === curUrl.toLowerCase() && curUrl !== "");

				// Update star icon in button
				btn.innerHTML = curBookmarked ? STAR_FILLED_SVG : STAR_OUTLINE_SVG;
				btn.classList.toggle("active", curBookmarked);

				popover.innerHTML = "";

				// Header
				const header = document.createElement("div");
				header.className = "dsh-bm-header";
				header.innerHTML = `<span>Bookmarks</span>`;

				const addBtn = document.createElement("button");
				addBtn.className = "dsh-bm-icon-btn";
				addBtn.title = "Add custom bookmark";
				addBtn.innerHTML = PLUS_SVG;
				addBtn.onclick = (e) => {
					e.stopPropagation();
					showAddForm = !showAddForm;
					editingId = null;
					render();
				};
				header.appendChild(addBtn);
				popover.appendChild(header);

				// Actions Bar
				const actionsBar = document.createElement("div");
				actionsBar.className = "dsh-bm-actions-bar";

				const quickAddBtn = document.createElement("button");
				quickAddBtn.className = "dsh-bm-btn" + (curBookmarked ? "" : " dsh-bm-btn-primary");
				quickAddBtn.innerHTML = curBookmarked 
					? `⭐ Remove Bookmark` 
					: `⭐ Bookmark This Page`;
				quickAddBtn.onclick = (e) => {
					e.stopPropagation();
					if (!curUrl) return;
					let updated = loadBookmarks();
					if (curBookmarked) {
						updated = updated.filter((b) => b.url.toLowerCase() !== curUrl.toLowerCase());
					} else {
						let pageTitle = curUrl;
						try {
							const u = new URL(curUrl);
							pageTitle = u.hostname;
						} catch (_) {}
						updated.unshift({
							id: generateId(),
							title: pageTitle,
							url: curUrl,
							createdAt: Date.now()
						});
					}
					saveBookmarks(updated);
					render();
				};
				actionsBar.appendChild(quickAddBtn);
				popover.appendChild(actionsBar);

				// Add form if active
				if (showAddForm) {
					const form = document.createElement("div");
					form.className = "dsh-bm-form";
					form.innerHTML = `
						<input class="dsh-bm-input" id="dsh-bm-new-title" placeholder="Title" value="${curUrl ? (new URL(curUrl, 'https://example.com').hostname || '') : ''}">
						<input class="dsh-bm-input" id="dsh-bm-new-url" placeholder="URL (https://...)" value="${curUrl || 'https://'}">
						<div class="dsh-bm-form-row">
							<button class="dsh-bm-btn" id="dsh-bm-cancel-add">Cancel</button>
							<button class="dsh-bm-btn dsh-bm-btn-primary" id="dsh-bm-save-add">Save</button>
						</div>
					`;
					form.querySelector("#dsh-bm-cancel-add").onclick = (e) => {
						e.stopPropagation();
						showAddForm = false;
						render();
					};
					form.querySelector("#dsh-bm-save-add").onclick = (e) => {
						e.stopPropagation();
						const titleInput = form.querySelector("#dsh-bm-new-title");
						const urlInput = form.querySelector("#dsh-bm-new-url");
						const title = titleInput.value.trim() || urlInput.value.trim();
						let url = urlInput.value.trim();
						if (!url) return;
						if (!/^https?:\/\//i.test(url)) url = "https://" + url;

						const updated = loadBookmarks();
						updated.unshift({
							id: generateId(),
							title,
							url,
							createdAt: Date.now()
						});
						saveBookmarks(updated);
						showAddForm = false;
						render();
					};
					popover.appendChild(form);
				}

				// List
				const list = document.createElement("ul");
				list.className = "dsh-bm-list";

				if (currentList.length === 0) {
					const empty = document.createElement("div");
					empty.className = "dsh-bm-empty";
					empty.textContent = "No bookmarks yet.";
					list.appendChild(empty);
				} else {
					currentList.forEach((bm, idx) => {
						if (editingId === bm.id) {
							// Edit form
							const editForm = document.createElement("li");
							editForm.className = "dsh-bm-form";
							editForm.innerHTML = `
								<input class="dsh-bm-input" id="dsh-bm-edit-title" placeholder="Title" value="${bm.title.replace(/"/g, '&quot;')}">
								<input class="dsh-bm-input" id="dsh-bm-edit-url" placeholder="URL" value="${bm.url.replace(/"/g, '&quot;')}">
								<div class="dsh-bm-form-row">
									<button class="dsh-bm-btn" id="dsh-bm-cancel-edit">Cancel</button>
									<button class="dsh-bm-btn dsh-bm-btn-primary" id="dsh-bm-save-edit">Save</button>
								</div>
							`;
							editForm.querySelector("#dsh-bm-cancel-edit").onclick = (e) => {
								e.stopPropagation();
								editingId = null;
								render();
							};
							editForm.querySelector("#dsh-bm-save-edit").onclick = (e) => {
								e.stopPropagation();
								const title = editForm.querySelector("#dsh-bm-edit-title").value.trim();
								const url = editForm.querySelector("#dsh-bm-edit-url").value.trim();
								if (!url) return;
								const updated = loadBookmarks().map((b) => b.id === bm.id ? { ...b, title: title || url, url } : b);
								saveBookmarks(updated);
								editingId = null;
								render();
							};
							list.appendChild(editForm);
						} else {
							const li = document.createElement("li");
							li.className = "dsh-bm-item";

							// Click to navigate
							li.onclick = () => {
								navigateToUrl(toolbar, bm.url);
							};

							const info = document.createElement("div");
							info.className = "dsh-bm-item-info";
							info.innerHTML = `
								<span class="dsh-bm-item-title">${bm.title || bm.url}</span>
								<span class="dsh-bm-item-url">${bm.url}</span>
							`;
							li.appendChild(info);

							const tools = document.createElement("div");
							tools.className = "dsh-bm-item-tools";

							// Move up
							const upBtn = document.createElement("button");
							upBtn.className = "dsh-bm-icon-btn";
							upBtn.title = "Move up";
							upBtn.innerHTML = UP_SVG;
							upBtn.disabled = idx === 0;
							if (idx === 0) upBtn.style.opacity = "0.3";
							upBtn.onclick = (e) => {
								e.stopPropagation();
								if (idx > 0) {
									const updated = loadBookmarks();
									const temp = updated[idx];
									updated[idx] = updated[idx - 1];
									updated[idx - 1] = temp;
									saveBookmarks(updated);
									render();
								}
							};
							tools.appendChild(upBtn);

							// Move down
							const downBtn = document.createElement("button");
							downBtn.className = "dsh-bm-icon-btn";
							downBtn.title = "Move down";
							downBtn.innerHTML = DOWN_SVG;
							downBtn.disabled = idx === currentList.length - 1;
							if (idx === currentList.length - 1) downBtn.style.opacity = "0.3";
							downBtn.onclick = (e) => {
								e.stopPropagation();
								if (idx < currentList.length - 1) {
									const updated = loadBookmarks();
									const temp = updated[idx];
									updated[idx] = updated[idx + 1];
									updated[idx + 1] = temp;
									saveBookmarks(updated);
									render();
								}
							};
							tools.appendChild(downBtn);

							// Edit
							const editBtn = document.createElement("button");
							editBtn.className = "dsh-bm-icon-btn";
							editBtn.title = "Edit bookmark";
							editBtn.innerHTML = EDIT_SVG;
							editBtn.onclick = (e) => {
								e.stopPropagation();
								editingId = bm.id;
								showAddForm = false;
								render();
							};
							tools.appendChild(editBtn);

							// Delete
							const delBtn = document.createElement("button");
							delBtn.className = "dsh-bm-icon-btn danger";
							delBtn.title = "Delete bookmark";
							delBtn.innerHTML = TRASH_SVG;
							delBtn.onclick = (e) => {
								e.stopPropagation();
								const updated = loadBookmarks().filter((b) => b.id !== bm.id);
								saveBookmarks(updated);
								render();
							};
							tools.appendChild(delBtn);

							li.appendChild(tools);
							list.appendChild(li);
						}
					});
				}
				popover.appendChild(list);
			}

			render();
			document.body.appendChild(popover);
			activePopover = popover;
		}

		// Close popover when clicking outside or pressing Escape
		if (typeof document !== "undefined") {
			document.addEventListener("mousedown", (e) => {
				if (!activePopover) return;
				if (!activePopover.contains(e.target) && !e.target.closest(`[${BTN_ATTR}]`)) {
					closePopover();
				}
			});

			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape") closePopover();
			});
		}

		function setupToolbar(toolbar) {
			if (toolbar.querySelector(`[${BTN_ATTR}]`)) return;

			// Look for address container: div with class containing addressBox or an input
			const addressBox = toolbar.querySelector("div[class*='addressBox']") || toolbar.querySelector("input")?.parentElement;
			if (!addressBox) return;

			const btn = document.createElement("button");
			btn.type = "button";
			btn.setAttribute(BTN_ATTR, "true");
			btn.className = "dsh-bm-tool";
			btn.title = "Bookmarks";
			btn.setAttribute("aria-label", "Bookmarks");

			// Check if current URL is bookmarked
			const input = toolbar.querySelector("input");
			const curUrl = input ? input.value.trim() : "";
			const bookmarks = loadBookmarks();
			const isCurBookmarked = bookmarks.some((b) => b.url.toLowerCase() === curUrl.toLowerCase() && curUrl !== "");
			btn.innerHTML = isCurBookmarked ? STAR_FILLED_SVG : STAR_OUTLINE_SVG;
			if (isCurBookmarked) btn.classList.add("active");

			// Periodic or input update of star state
			if (input) {
				input.addEventListener("input", () => {
					const val = input.value.trim();
					const bms = loadBookmarks();
					const active = bms.some((b) => b.url.toLowerCase() === val.toLowerCase() && val !== "");
					btn.innerHTML = active ? STAR_FILLED_SVG : STAR_OUTLINE_SVG;
					btn.classList.toggle("active", active);
				});
			}

			btn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				openBookmarksDropdown(btn, toolbar);
			};

			// Insert right before addressBox (between reload button and address box)
			addressBox.parentNode.insertBefore(btn, addressBox);
		}

		function scanAndAttach() {
			if (typeof document === "undefined") return;
			// Find browser toolbars
			const toolbars = document.querySelectorAll("form[class*='toolbar'], div[class*='toolbar']");
			toolbars.forEach((tb) => {
				if (tb.querySelector("input") && !tb.querySelector(`[${BTN_ATTR}]`)) {
					setupToolbar(tb);
				}
			});
		}

		// Cordis apply entry
		function apply(ctx) {
			if (typeof document === "undefined") return;

			// Initial scan
			scanAndAttach();

			// MutationObserver to detect when right sidebar browser tab mounts
			const observer = new MutationObserver(() => {
				scanAndAttach();
			});
			observer.observe(document.body, { childList: true, subtree: true });

			if (ctx && typeof ctx.on === "function") {
				ctx.on("dispose", () => {
					observer.disconnect();
					closePopover();
					document.querySelectorAll(`[${BTN_ATTR}]`).forEach((el) => el.remove());
				});
			}
		}

		exports.apply = apply;
		return module.exports;
	}
});
