import Image from "next/image";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400 text-black",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  fairy: "bg-pink-300 text-black",
  normal: "bg-gray-400 text-black",
  fighting: "bg-red-700",
  flying: "bg-sky-400 text-black",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  rock: "bg-amber-700",
  bug: "bg-lime-600",
  ghost: "bg-violet-700",
  steel: "bg-slate-400 text-black",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

interface PokemonType {
  type: { name: string };
}

export interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      "official-artwork": { front_default: string };
    };
    front_default: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
}

export function PokemonCard({ pokemon }: { pokemon: PokemonData }) {
  const sprite =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-lg w-full max-w-sm mx-auto overflow-hidden">
      <div className="bg-muted flex items-center justify-center p-6">
        {sprite && (
          <Image
            src={sprite}
            alt={pokemon.name}
            width={180}
            height={180}
            priority
          />
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
          <span className="text-muted-foreground text-sm font-mono">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-white",
                TYPE_COLORS[type.name] ?? "bg-gray-500"
              )}
            >
              {type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            Height: <span className="text-foreground font-medium">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div>
            Weight: <span className="text-foreground font-medium">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Base Stats
          </h3>
          {pokemon.stats.map(({ stat, base_stat }) => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-16 shrink-0">
                {STAT_LABELS[stat.name] ?? stat.name.toUpperCase()}
              </span>
              <span className="text-xs font-bold w-6 text-right shrink-0">
                {base_stat}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((base_stat / 255) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
