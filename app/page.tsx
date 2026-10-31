"use client";

import { useState } from "react";
import { PokemonCard, type PokemonData } from "@/components/pokemon-card";
import { suggestNames, toApiName } from "@/lib/suggest";

export default function Home() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function lookUp(typed: string) {
    const name = toApiName(typed);
    if (!name) return;

    setLoading(true);
    setError(null);
    setSuggestions([]);
    setPokemon(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
      if (!res.ok) {
        setError(`No Pokemon found for "${typed.trim()}"`);
        // Not found - offer the closest names instead. If the list can't
        // be fetched, the plain "not found" message is enough.
        setSuggestions(await suggestNames(name).catch(() => []));
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

  function search(e: React.FormEvent) {
    e.preventDefault();
    lookUp(query);
  }

  function pickSuggestion(name: string) {
    setQuery(name);
    lookUp(name);
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
        <div className="text-center space-y-3">
          <p className="text-destructive text-sm">{error}</p>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Did you mean</span>
              {suggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => pickSuggestion(name)}
                  className="rounded-full border border-border px-3 py-1 capitalize hover:bg-muted transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {pokemon && <PokemonCard pokemon={pokemon} />}
    </main>
  );
}
