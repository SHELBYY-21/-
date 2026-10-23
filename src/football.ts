export type FootballPlayer = {
  id: string;
  name: string;
  position: string;
  number: string;
  image?: string;
};

export type FootballTeam = {
  id: string;
  name: string;
  abbreviation: string;
  badge?: string;
};

export const ARSENAL: FootballTeam = {
  id: "arsenal",
  name: "Arsenal",
  abbreviation: "ARS",
  badge: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
};

export const CHELSEA: FootballTeam = {
  id: "chelsea",
  name: "Chelsea",
  abbreviation: "CHE",
  badge: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
};

export const FALLBACK_PLAYERS: FootballPlayer[] = [
  ["david-raya", "David Raya", "GK", "22"],
  ["jurrien-timber", "Jurrien Timber", "DF", "12"],
  ["william-saliba", "William Saliba", "DF", "2"],
  ["gabriel", "Gabriel Magalhães", "DF", "6"],
  ["riccardo-calafiori", "Riccardo Calafiori", "DF", "33"],
  ["martin-zubimendi", "Martín Zubimendi", "MF", "36"],
  ["declan-rice", "Declan Rice", "MF", "41"],
  ["martin-odegaard", "Martin Ødegaard", "MF", "8"],
  ["bukayo-saka", "Bukayo Saka", "FW", "7"],
  ["viktor-gyokeres", "Viktor Gyökeres", "FW", "14"],
  ["gabriel-martinelli", "Gabriel Martinelli", "FW", "11"],
].map(([id, name, position, number]) => ({ id, name, position, number }));

const API =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/arsenal/roster";

export async function loadArsenalSquad(signal?: AbortSignal) {
  const response = await fetch(API, { signal });
  if (!response.ok) throw new Error(`Football API ${response.status}`);
  const payload = await response.json();
  const groups = Array.isArray(payload.athletes) ? payload.athletes : [];
  const rawPlayers = groups.flatMap((group: any) =>
    Array.isArray(group.items) ? group.items : [group],
  );
  const players = rawPlayers
    .filter((player: any) => player?.displayName || player?.fullName)
    .map((player: any): FootballPlayer => ({
      id: String(player.id),
      name: player.displayName || player.fullName,
      position:
        player.position?.abbreviation || player.position?.name || "—",
      number: String(player.jersey || "—"),
      image: player.headshot?.href,
    }));
  if (!players.length) throw new Error("Football API returned no players");
  return players;
}
