# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WeekToDo — a minimalist, privacy-focused weekly planner. One Vue 3 codebase ships as both a web app (Netlify, app.weektodo.me) and an Electron desktop app (Windows/macOS/Linux). All user data is stored locally; there is no backend.

## Commands

Uses Yarn and Node 16 (pinned in CI and the Dockerfile; the toolchain is Vue CLI 4 / webpack 4).

```bash
yarn install
yarn serve             # web dev server (localhost:8080)
yarn electron:serve    # desktop app in dev mode
yarn build             # web production build -> dist/
yarn electron:build    # package desktop installers (targets in vue.config.js)
yarn lint              # ESLint (plugin:vue/vue3-essential + eslint:recommended)
docker-compose up      # web dev server in Docker
```

There is no test suite — `yarn test` just echoes "success".

Releases: pushing to the `deploy` branch triggers `.github/workflows/release.yml`, which builds and publishes Electron installers to GitHub Releases.

## Architecture

**Two runtimes, one renderer.** `src/background.js` is the Electron main process (window, tray, auto-launch, IPC handlers registered via `ipcMain.on(...)`). Everything else in `src/` is the renderer and must also run in a plain browser. Electron-only code is guarded with `isElectron()` (from `is-electron`) and accesses IPC via `require("electron").ipcRenderer` — mostly in `App.vue`. `nodeIntegration: true` is enabled in `vue.config.js`.

**Persistence is split across two stores, accessed via `src/repositories/`:**
- `localStorage` (`storageRepository`) — app `config` (`configRepository`) and custom list metadata (`customToDoListIdsRepository`).
- IndexedDB database `weekToDo` (`dbRepository`, version 4) — object stores `todo_lists`, `repeating_events`, `repeating_events_by_date`. Adding a store requires bumping the version in `dbRepository.open()` and handling it in `onupgradeneeded`.

**Vuex store (`src/store/`) is in-memory only; mutations do not persist.** Components/helpers commit a mutation and then separately call the repository (e.g. `toDoListRepository.update(listId, list)`) to save. When changing task data, do both. Store modules are non-namespaced, so getters/mutations are global names.

**To-do list IDs:** day lists are keyed by date string `moment().format("YYYYMMDD")`; custom lists use generated IDs stored in `cTodoListIds`. Both live in the same `todo_lists` IndexedDB store and the same `state.todoLists` map.

**Recurring tasks:** rules (`rrule`) live in `repeating_events`; generated instances per date are cached in `repeating_events_by_date` and the `repeatingEventDateCache` store module. Logic is in `src/helpers/repeatingEvents.js`.

**Startup / migrations:** `App.vue` `beforeCreate` compares `public/version.json` with `config.version`; on mismatch it runs `src/migrations/migrations.js`, where each function adds missing config keys with defaults. When adding a new config key, add it both to the default config in `configRepository.load()` and as a migration (for existing users). Bump the version in both `package.json` and `public/version.json`.

**i18n:** `vue-i18n` with locale JSON files in `src/assets/languages/`. `en.json` is the source of truth (synced via Crowdin, see `crowdin.yml`); new locales must also be registered in `languages.js`. Add new UI strings to `en.json`.

**UI:** Bootstrap 5 + bootstrap-icons; global SCSS in `src/assets/style/`. Modals in `src/views/` are Bootstrap modals controlled from `App.vue`. Error reporting uses Sentry with DSN from `VUE_APP_SENTRY_DNS`.

## Contribution notes (from CONTRIBUTING.md)

Maintainers are very wary of adding new preferences/options for niche behaviors, and prioritize a lightweight, fast UX consistent with the existing design.
