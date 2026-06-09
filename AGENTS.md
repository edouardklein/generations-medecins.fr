# Agent Guidelines

## Page Size Budget

**Keep the final HTML page under 15kB when compressed.**

This ensures the entire page fits in a single TCP burst (typically ~14.6KB), avoiding an extra round-trip and improving first paint speed. See: https://endtimes.dev/why-your-website-should-be-under-14kb-in-size/

- Inline CSS instead of linking external files.
- Minimize markup. Avoid unnecessary wrappers, comments, or whitespace.
- Use efficient selectors. Prefer short, single-class rules.
- Track size. After changes, check `wc -c public/index.html` and test with `gzip -c public/index.html | wc -c`.

## Self-Contained Layout

All information needed to render the page layout must be present in the initial HTML. The browser must be able to compute layout without waiting for any external resource.

- **Inline CSS** in a `<style>` block in the `<head>`. Never use `<link rel="stylesheet">`.
- **Specify image dimensions** on every `<img>` tag with `width` and `height` attributes (or CSS `aspect-ratio`). Even if the image file is external, the browser must know the box size immediately to avoid layout shifts.
- **No external fonts.** The browser must not need to fetch any font file to render text.
## No JavaScript

**The page must contain absolutely no JavaScript.**

- No `<script>` tags.
- No inline event handlers (`onclick`, `onload`, etc.).
- No `javascript:` URLs.
- No framework or library imports.

There are currently **zero** explicit exceptions to this rule. If a future change genuinely requires JavaScript, the exception must be documented in this file with a clear justification. Until then, JavaScript is forbidden.

## Hugo Template Lookup & Inheritance

### How Hugo picks a template

Hugo uses a **lookup order** based on the page's `type`, `layout`, and `kind` (page, section, home). It searches templates in this priority:

1. **Exact match** — `layouts/<TYPE>/<LAYOUT>.html`
2. **Default for type** — `layouts/<TYPE>/single.html` (or `list.html` for sections)
3. **Fallback to `_default`** — `layouts/_default/<LAYOUT>.html`, then `layouts/_default/single.html`

The `type` defaults to the page's section name. The `layout` defaults to the page's kind (`single` for pages, `list` for sections, `index` for home). Both can be overridden in front matter.

### Block inheritance (`baseof.html`)

The base template at `layouts/_default/baseof.html` defines two named blocks:

- **`styles`** — injected into `<head>` after the site-wide CSS. Use this for per-page CSS.
- **`main`** — injected into `<main>`. Use this for the page body and any MD→HTML transformation.

A child template (e.g., `layouts/plaidoyer/single.html`) **defines** these blocks. Whatever it defines overrides the base. If a child doesn't define a block, the base's default (empty) is used.

### Where to put page-specific code

| What you want | Where to put it |
|---------------|-----------------|
| CSS for **all pages** | `layouts/partials/styles.html` |
| CSS for **homepage only** | `layouts/partials/home-styles.html` (injected by `layouts/index.html`) |
| CSS for **one specific page** | That page's template → `{{ define "styles" }}` block |
| MD→HTML transformation for **all pages** | `layouts/_default/single.html` |
| MD→HTML transformation for **homepage only** | `layouts/index.html` |
| MD→HTML transformation for **one specific page** | That page's template → `{{ define "main" }}` block |

### Conventions used in this site

**Root-level pages** (e.g., `/decrypteurs/`, `/plaidoyer/`):
- Front matter: `type: <slug>` (e.g., `type: plaidoyer`)
- Template: `layouts/<slug>/single.html` (e.g., `layouts/plaidoyer/single.html`)

**Section subpages** (e.g., `/outils/simulateurs/`):
- Front matter: `layout: <slug>` (e.g., `layout: simulateurs`)
- Template: `layouts/<section>/<slug>.html` (e.g., `layouts/outils/simulateurs.html`)
- The `type` stays the default (section name), so the template lives under the section directory.

**Section index pages** (e.g., `/outils/`):
- No front matter override needed.
- Template: `layouts/<section>/list.html` (e.g., `layouts/outils/list.html`)

**Homepage** (`/`):
- No front matter override needed.
- Template: `layouts/index.html` (Hugo's special home template)

### Rule: every page has its own template

Every `.md` content file in this repo has a dedicated template file. If you need to add custom elements, CSS, or MD→HTML transformations for a specific page, edit that page's template. Do not add page-specific logic to the shared `layouts/_default/single.html` or `layouts/_default/list.html` — those are fallbacks only.

## CSS Color Rules

Use only the colors defined in the global `:root` custom properties. Never introduce a hard-coded hex, rgb, or named color.

The color palette follows a systematic scale with 4-6 steps per hue (darkest → darker → dark → base → light → lighter → lightest), designed for building clear visual hierarchy. See https://refactoringui.com/previews/building-your-color-palette for the methodology.

The current palette is:

```css
:root {
  --neutral-darkest: #060606;
  --neutral-darker: #161616;
  --neutral-dark: #2E2E2E;
  --neutral: #555555;
  --neutral-light: #868686;
  --neutral-lighter: #BEBEBE;
  --neutral-lightest: #EEEEEE;

  --primary-darkest: #152D40;
  --primary-darker: #1D486B;
  --primary-dark: #236598;
  --primary: #2884C8;
  --primary-light: #64A0D3;
  --primary-lighter: #95BCDE;
  --primary-lightest: #C5D7E7;

  --accent-darkest: #2C4332;
  --accent-darker: #3B5D45;
  --accent-dark: #4C7958;
  --accent: #5C956C;
  --accent-light: #6DB381;
  --accent-lighter: #7FD297;
  --accent-lightest: #D7E8DB;

  --success-darkest: #314B36;
  --success-darker: #4E7E58;
  --success-dark: #6EB67D;
  --success: #8FF0A4;
  --success-light: #ABF0B8;
  --success-lighter: #C4F0CB;
  --success-lightest: #DBEFDE;

  --warning-darkest: #4E4B28;
  --warning-darker: #837E3E;
  --warning-dark: #BCB654;
  --warning: #F9F06B;
  --warning-light: #F6F095;
  --warning-lighter: #F3F0B7;
  --warning-lightest: #F0EFD6;

  --failure-darkest: #4E241E;
  --failure-darker: #83382F;
  --failure-dark: #BB4C40;
  --failure: #F66151;
  --failure-light: #F98A7B;
  --failure-lighter: #F9AFA3;
  --failure-lightest: #F5D1CC;
}
```

- Every color value in the stylesheet must reference one of these variables.
- If you need a new color, add it to `:root` with a semantic name, then use it.
- For translucent effects, use `color-mix()` with a variable and `transparent` — never use raw `rgba()` with hardcoded hex values.
- Never write `color: #ff0000`, `background: rgb(0,0,0)`, `border-color: teal`, `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`, etc.
- The palette intentionally does not include pure white (`#ffffff`). Use `--neutral-lightest` for the lightest background value. If a situation genuinely requires pure white, flag it as a palette gap rather than adding a hardcoded value.

## CSS-only dropdowns: hover bridge

When a dropdown menu is positioned below its trigger with a gap (e.g., `top: calc(100% + 4px)`), a **hover bridge** pseudo-element must connect the trigger to the dropdown. Without it, the mouse crossing the gap loses hover and the dropdown disappears.

```css
.submenu::before {
  content: "";
  position: absolute;
  top: -4px;   /* negative of the gap */
  left: 0;
  right: 0;
  height: 4px; /* matches the gap */
}
```

The `::before` is part of the `.submenu`, so hovering over it keeps the parent `<li>`'s `:hover` active.

## Navigation rules

### No hidden navigation (hamburger menus are an anti-pattern)

Every navigation link must be **visible on the page without interaction**. Hamburger menus, off-canvas drawers, hidden collapsible navbars, and any pattern that requires a click or tap to reveal navigation links are **anti-patterns** and must not be used.

- Navigation must be present in the HTML as a visible `<nav>` with visible links.
- If a link doesn't fit, the nav must wrap (not hide behind a toggle).
- The mobile breakpoint adjusts the nav to wrap, stack, or shrink — it never collapses to a hidden menu.

### No hover-dependent navigation on touch devices

Hover-based dropdowns are **unusable on touch devices**. On devices that cannot hover (`@media (hover: none)`), the dropdown must be completely removed:

```css
@media (hover: none) {
  .nav li.has-submenu > .submenu {
    display: none !important;
  }
  .nav li.has-submenu > a::after {
    content: none; /* remove the dropdown arrow */
  }
}
```

- The parent link (e.g., "Outils") must navigate to the section index page (e.g., `/outils/`).
- The section index page must list all subpages (e.g., `/outils/` lists Simulateurs, Bibliothèque, SOS, etc.).
- This is CSS-only: `@media (hover: none)` matches all touch devices without JavaScript.

## Font Rules

**Loading a font to see the page is VERBOTEN.**

Rely exclusively on fonts already present on the user's system.

- Never use `@font-face`, Google Fonts, or any other external font service.
- Use a system font stack that gracefully degrades through web-safe fonts.
- The current stack is:
  ```css
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  ```
- Never introduce a custom font name that would require downloading a file.
