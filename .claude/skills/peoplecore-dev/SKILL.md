---
name: peoplecore-dev
description: Build/run/test commands and frontend conventions (design tokens, typography, nav theming, CSS/component patterns) for the PeopleCore landing page. Use when developing, styling, or testing this Blazor/MudBlazor site.
---

# PeopleCore Landing Page — Dev Guide

Blazor Web App, **.NET 9**, **MudBlazor 9.5**, global **InteractiveServer** render mode.
Marketing site — UI only, no backend/data layer. The contact form submit is simulated.

## Commands

```bash
dotnet build                       # compile (run after each change)
dotnet run                         # serve locally (https)
dotnet test                        # run the bUnit/xUnit smoke tests
```

`PeopleCoreLandingPage.slnx` ties the web project and `PeopleCoreLandingPage.Tests`
(`dotnet build`/`dotnet test` with no args auto-detect it).
CSS in `wwwroot/app.css` and scoped `*.razor.css` are static assets — **`dotnet build`
will NOT catch CSS errors**; verify styling by running the app.

## Project layout

- `Components/Pages/` — routed pages (`@page`). Services live under `Pages/Services/Sections/`.
- `Components/Sections/` — home-page sections (`Hero`, `CoreFunctions`, `CtaSection`, …).
- `Components/Sections/Animations/` — the 4 device-card animations.
- `Components/Shared/` — cross-cutting components (`ContactForm`, `ContactDialog`).
- `Components/Layout/` — `MainLayout` (nav+footer), `PlainLayout` (bare), `NavBar`, `Footer`.
- `Models/` — shared models (`ContactFormModel`). `Services/` — helpers (`DialogServiceExtensions`).
- `wwwroot/app.css` — global styles. `wwwroot/js/animations.js` — scroll/nav JS.

## Design system

- **Fonts**: display = `Gilroy`; UI/body = `Figtree` (loaded in `App.razor`).
- **Color tokens**: navy `#122656`, blue `#1E9FE0`, green `#10B981`, amber `#FFB400`,
  ink `#111827`/`#0f172a`, muted `#475569`/`#94a3b8`.
- **Fluid type**: size headings with `clamp(min, vw, max)` so they scale on mobile/tablet
  (see `Saas.razor`). The Services + Contact areas get fluid sizing via scoped overrides in
  `app.css` (`.services-page`/`.contact-page-container .mud-typography-*`) — max = desktop size.

## Navigation (`NavBar.razor` + `app.css`)

- Floating glass pill, `position: fixed`. **One 960px breakpoint** controls desktop links
  vs the mobile hamburger — set via custom classes (`.nav-desktop-links`, `.nav-hamburger`,
  `.nav-mobile-menu`), NOT Bootstrap/Mud `d-md-*` (their md = 768 vs 960 conflicts).
- **Per-page theming** uses `:has()`: `.mud-layout:has(.saas-page) .nav-link-item { color:#fff }`
  turns the nav/logo light on the dark `/saas` page only.
- Mobile menu locks background scroll while open via `html:has(.nav-mobile-menu.open)`.

## CSS conventions (the standard going forward)

1. **Prefer co-located scoped `Component.razor.css`** for a component's own styling
   (CSS isolation; bundled via `PeopleCoreLandingPage.styles.css`, already linked).
2. **`::deep`** to reach MudBlazor-rendered internals or child-component DOM, e.g.
   `.contact-form-flat-container ::deep .mud-input-control { … }`. `ContactForm.razor.css`
   is the worked example to copy.
3. **Global `app.css`** only for genuinely cross-cutting styles or DOM rendered *outside*
   a component's subtree — e.g. `.mud-overlay` (dialog backdrop), the floating `.custom-nav`,
   `:has()` page-theming. Scoped CSS cannot reach those even with `::deep`.
4. Inline `style=` is still common across the site; migrate to scoped CSS opportunistically
   when touching a component (not in bulk).

## Reusable patterns — don't duplicate

- **Contact form**: one component, `Components/Shared/ContactForm.razor`, used by the
  `/contact` page and `ContactDialog`. The only difference is the `OnClose` parameter
  (set → close dialog; unset → link home). `ContactFormModel` lives in `Models/`.
- **Open the contact dialog**: `DialogService.ShowContactDialogAsync()`
  (`Services/DialogServiceExtensions.cs`) — do not re-declare `DialogOptions` at call sites.
- **Scroll-reveal**: add class `fade-in-up` / `framer-animate` (+ `delay-100..400`);
  `animations.js` auto-observes them (incl. dynamically added nodes).

## Animations

Four bespoke device-card visualizations in `Components/Sections/Animations/`, each with its
own `<style>` and a **namespaced prefix** (`ats-`, `hrm-`, `ess-`, `mgr-`). Shared shell
classes (`*-container/-canvas/-glow/-header`, `grid-bg`) are intentionally duplicated per
component for now — keep the namespacing if adding more.

## Gotchas

- MudBlazor CSS loads **after** `app.css`; to beat `.mud-*` rules use higher specificity
  (e.g. scope to `.custom-nav`) and/or `Color="Color.Inherit"` on MudLink/MudIcon.
- bUnit + MudBlazor: register `Services.AddMudServices()` and set
  `JSInterop.Mode = JSRuntimeMode.Loose`; only smoke-test components that don't need
  MudBlazor's popover/JS providers.
- `@media`/`@keyframes` inside a Razor `<style>` block must be escaped as `@@media`/`@@keyframes`.
