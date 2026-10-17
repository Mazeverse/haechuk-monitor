export const LEAGUES = [
  { id: "all", label: "전체", query: "(유럽축구 OR 프리미어리그 OR 라리가 OR 세리에A OR 분데스리가 OR K리그)" },
  { id: "epl", label: "EPL", query: "(프리미어리그 OR EPL OR 맨시티 OR 리버풀 OR 아스널) 축구" },
  { id: "laliga", label: "라리가", query: "(라리가 OR 레알마드리드 OR 바르셀로나 OR 아틀레티코) 축구" },
  { id: "seriea", label: "세리에A", query: "(세리에A OR 인터밀란 OR AC밀란 OR 유벤투스) 축구" },
  { id: "bundesliga", label: "분데스", query: "(분데스리가 OR 바이에른뮌헨 OR 도르트문트) 축구" },
  { id: "ligue1", label: "리그1", query: "(리그앙 OR 프랑스리그1 OR PSG OR 파리생제르맹) 축구" },
  { id: "kleague", label: "K리그", query: "(K리그1 OR K리그2 OR 케이리그 OR 대구FC) 축구" },
] as const;
export type LeagueId = (typeof LEAGUES)[number]["id"];
export const isLeagueId = (v: string): v is LeagueId => LEAGUES.some(x => x.id === v);
