// "Did you mean…?" for a search that found nothing: the closest names in
// PokéAPI's full list. The list is fetched the first time it's needed, then
// kept for the rest of the visit.

let allNames: Promise<string[]> | null = null;

function loadAllNames(): Promise<string[]> {
  if (!allNames) {
    allNames = fetch("https://pokeapi.co/api/v2/pokemon?limit=100000")
      .then((res) => {
        if (!res.ok) throw new Error(`PokéAPI returned ${res.status}`);
        return res.json();
      })
      .then((data: { results: { name: string }[] }) => data.results.map((p) => p.name))
      .catch((err) => {
        allNames = null; // try again next time rather than remembering the failure
        throw err;
      });
  }
  return allNames;
}

// How many single-letter edits (add, remove or change a letter) turn a into b.
function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = above;
    }
  }
  return previous[b.length];
}

// Up to `limit` names close to what was typed. Names that start with it
// come first ("pika" -> pikachu), then the fewest typos. Anything too
// different to be a likely typo is left out, so a nonsense search gets no
// suggestions rather than random ones.
export async function suggestNames(query: string, limit = 3): Promise<string[]> {
  if (!query || /^\d+$/.test(query)) return [];
  const names = await loadAllNames();
  const maxDistance = Math.max(2, Math.floor(query.length / 3));
  return names
    .map((name) => ({
      name,
      startsWith: name.startsWith(query),
      // Compare against the base name too, so "charizrd" finds charizard
      // rather than only charizard-mega-x.
      distance: Math.min(editDistance(query, name), editDistance(query, name.split("-")[0])),
    }))
    .filter((c) => c.startsWith || c.distance <= maxDistance)
    .sort((a, b) =>
      Number(b.startsWith) - Number(a.startsWith) ||
      a.distance - b.distance ||
      a.name.length - b.name.length
    )
    // One per Pokemon: pikachu rather than pikachu, pikachu-phd and
    // pikachu-gmax. The plain name sorts first, so it's the one kept.
    .filter((c, i, all) => all.findIndex((o) => o.name.split("-")[0] === c.name.split("-")[0]) === i)
    .slice(0, limit)
    .map((c) => c.name);
}

// What PokéAPI expects: lowercase, hyphens for spaces, no dots or
// apostrophes - so "Mr. Mime" and "Farfetch'd" work as typed.
export function toApiName(query: string): string {
  return query.trim().toLowerCase().replace(/[.'’]/g, "").replace(/\s+/g, "-");
}
