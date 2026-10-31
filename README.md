# Pokemon Finder

A Next.js app that lets you search for any Pokemon by name or Pokédex number using the free [PokéAPI](https://pokeapi.co).

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser on your machine, locally hosted.

## How to Use

Type a Pokemon name (e.g. `pikachu`, `charizard`) or a Pokédex number (e.g. `25`, `6`) into the search box and press Enter or click Search.

The card will show the Pokemon's official artwork, type badges, height, weight, and base stats.

Names work however you type them - "Mr. Mime", "Farfetch'd" and "ho oh" all find the right Pokemon. If nothing matches, it suggests the closest names (search "charizrd" and it offers Charizard) - click one to see it.

## Putting it online

The easiest free host for a Next.js app is [Vercel](https://vercel.com) (made by the people behind Next.js):

1. Sign in at vercel.com with your GitHub account.
2. **Add New → Project**, pick this repository and click **Deploy** - no settings to change.
3. Every push to `main` updates the live site automatically.

## Tech Stack

Next.js 16, React 19, Tailwind CSS 4, PokéAPI
