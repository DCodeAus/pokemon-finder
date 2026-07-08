"use client";

import { useState } from "react";
import { PokemonCard, type PokemonData } from "@/components/pokemon-card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const name = query.trim().toLowerCase();
    if (!name) return;

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) {
        setError(`No Pokemon found for "${query}"`);
        return;
      }
      const data: PokemonData = await res.json();
      setPokemon(data);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4 gap-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Pokemon Finder</h1>
        <p className="text-muted-foreground">
          Search by name or Pokedex number
        </p>
      </div>

      <form onSubmit={search} className="flex gap-2 w-full max-w-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. pikachu or 25"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {pokemon && <PokemonCard pokemon={pokemon} />}
    </main>
  );
}
