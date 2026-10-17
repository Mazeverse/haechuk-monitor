import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { LEAGUES, isLeagueId } from "../../../lib/leagues";

export const runtime = "nodejs";
const parser = new Parser({ timeout: 9000, headers: { "User-Agent": "HaechukMonitor/0.1 (RSS reader)" } });

type News = { id: string; title: string; link: string; source: string; published: string; snippet: string };
function clean(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
function googleRss(query: string) {
  const q = `${query} when:7d`;
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`;
}
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("league") || "all";
  if (!isLeagueId(key)) return NextResponse.json({ error: "지원하지 않는 리그입니다." }, { status: 400 });
  const league = LEAGUES.find(x => x.id === key)!;
  try {
    // fetch cache is scoped per league; Vercel/Next revalidates the cached XML after 30 minutes.
    // We parse the cached response ourselves so RSS items are never manually inserted.
    const response = await fetch(googleRss(league.query), {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HaechukMonitor/0.1)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`원본 뉴스 피드 응답: ${response.status}`);
    const xml = await response.text();
    const rss = await parser.parseString(xml);
    const seen = new Set<string>();
    const articles: News[] = (rss.items || []).map((item, i) => {
      const title = clean(item.title || "");
      const source = clean((item as typeof item & { source?: string }).source || title.split(" - ").at(-1) || "뉴스 출처");
      const cleanTitle = title.endsWith(` - ${source}`) ? title.slice(0, -(source.length + 3)) : title;
      return {
        id: item.guid || item.link || String(i), title: cleanTitle, link: item.link || "",
        source, published: item.isoDate || item.pubDate || "", snippet: clean(item.contentSnippet || "").slice(0, 160),
      };
    }).filter(item => {
      if (!item.title || !item.link) return false;
      const normalized = item.title.replace(/\s+/g, "").toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).sort((a,b) => (Date.parse(b.published) || 0) - (Date.parse(a.published) || 0)).slice(0, 40);
    return NextResponse.json({ league: key, articles, fetchedAt: new Date().toISOString(), source: "Google News RSS (기사 원문은 각 매체)" }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch (error) {
    console.error("news feed", key, error);
    return NextResponse.json({ league: key, articles: [], error: "뉴스를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요." }, { status: 503 });
  }
}
