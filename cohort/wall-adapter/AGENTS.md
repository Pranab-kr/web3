<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# wall-adapter — Agent Guide

## Project Overview

`wall-adapter` is a Next.js 16 (App Router) application that demonstrates Solana wallet integration using the `@solana/wallet-adapter-*` libraries. It allows users to connect a Solana wallet (e.g. Phantom, Backpack) and view their SOL balance and network information.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| UI components | shadcn/ui (via `shadcn` package) + `@base-ui/react` |
| Blockchain | Solana — `@solana/web3.js` v1 |
| Wallet | `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets` |
| Package manager | Bun (lockfile: `bun.lock`) |
| Theme | `next-themes` (system/light/dark) |

## Project Structure

```
cohort/wall-adapter/
├── app/
│   ├── globals.css        # Tailwind v4 + design-token CSS vars
│   ├── layout.tsx         # Root layout — fonts, ThemeProvider
│   └── page.tsx           # Root page — wallet providers, renders <WallConnect />
├── components/
│   ├── WallConnect.tsx    # Main wallet UI: connect button, balance, network badge
│   ├── theme-provider.tsx # next-themes wrapper
│   └── ui/                # shadcn/ui component primitives (do not edit by hand)
├── hooks/
│   └── use-mobile.ts      # Responsive breakpoint hook
├── lib/
│   └── utils.ts           # `cn()` helper (clsx + tailwind-merge)
├── next.config.ts
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## Key Conventions

### Wallet provider hierarchy (required order)
`page.tsx` wraps the app in exactly this order — do not restructure it:
```
<ConnectionProvider endpoint={...}>
  <WalletProvider wallets={[]} autoConnect>
    <WalletModalProvider>
      ...
    </WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```
`ConnectionProvider` and `WalletProvider` come from `@solana/wallet-adapter-react`;  
`WalletModalProvider` comes from `@solana/wallet-adapter-react-ui`.

### RPC endpoint
The endpoint is read from `process.env.HELIUS_RPC_URL` and falls back to `https://api.devnet.solana.com`. Keep this pattern when adding features that need a connection.

### "use client" boundary
`page.tsx` and `WallConnect.tsx` are both client components (`"use client"`). The root `layout.tsx` is a server component. Do not add `"use client"` to `layout.tsx`.

### Styling
- Tailwind v4 — utility classes are used directly; there is no `tailwind.config.*` file.
- Design tokens are CSS custom properties defined in `globals.css` under `:root` and `.dark`.
- Use the `cn()` helper from `@/lib/utils` to merge conditional class names.
- Do not use inline `style` props for colors or spacing — prefer Tailwind utility classes.

### UI components
- All shadcn/ui primitives live in `components/ui/`. Import them with the `@/components/ui/<name>` alias.
- Do not edit `components/ui/` files directly; use the shadcn CLI (`bunx shadcn add <component>`) to add or update components.

### Image handling
Use `next/image` (`<Image />`) for all wallet icon rendering, as seen in `WallConnect.tsx`. Do not use raw `<img>` tags.

## Development Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (http://localhost:3000)
bun run build        # Production build
bun run lint         # ESLint
```

## Next.js 16 Breaking Changes to Be Aware Of

- The App Router is the default and only supported router in this project. Do not use `pages/`.
- `next/font` is used for font optimization (see `layout.tsx`). Import fonts at the layout level.
- Server and Client Components are strictly separated. Any component using browser APIs, React state/effects, or wallet hooks must have `"use client"` at the top.
- The `Metadata` API in `layout.tsx` is for server-side SEO metadata only.

## Solana / Wallet Adapter Notes

- `useWallet()` — exposes `publicKey`, `wallet`, `connect`, `disconnect`, etc.
- `useConnection()` — exposes the `Connection` object bound to the configured RPC endpoint.
- Balance is returned in **lamports** (1 SOL = 1 × 10⁹ lamports). Always divide by `1e9` before displaying.
- The wallet list passed to `<WalletProvider wallets={[]} />` is empty by default — the modal auto-detects installed browser-extension wallets.
- Always import wallet-adapter CSS in the component that renders `WalletMultiButton` or `WalletDisconnectButton`:
  ```ts
  import "@solana/wallet-adapter-react-ui/styles.css";
  ```
