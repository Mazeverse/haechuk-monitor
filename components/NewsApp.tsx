"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bookmark, Clock3, Globe2, LoaderCircle, RefreshCw, Search, ShieldCheck, Trophy } from "lucide-react";
import { LEAGUES, type LeagueId } from "../lib/leagues";

type News = { id: string; title: string; link: string; source: string; published: string; snippet: string };
function timeAgo(value: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "날짜 미상";
  const elapsed = Math.max(0, Date.now() - Date.parse(value));
  if (elapsed < 3600000) return `${Math.max(1, Math.floor(elapsed / 60000))}분 전`;
  if (elapsed < 86400000) return `${Math.floor(elapsed / 3600000)}시간 전`;
  return `${Math.floor(elapsed / 86400000)}일 전`;
}
function allowedUrl(input: string) {
  try { const u = new URL(input); return u.protocol === "https:" ? u.toString() : undefined; } catch { return undefined; }
}
export default function NewsApp() {
  const [league, setLeague] = useState<LeagueId>("all");
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState("");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem("hm-saved") || "[]")); } catch { /* ignore */ } }, []);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError("");
      try {
        const r = await fetch(`/api/news?league=${league}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "뉴스를 불러오지 못했습니다.");
        if (!cancelled) { setNews(data.articles || []); setLastChecked(new Date().toISOString()); }
      } catch (e) { if (!cancelled) { setNews([]); setError(e instanceof Error ? e.message : "연결 오류"); } }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    // Periodically refresh the screen; the RSS cache refreshes every 30 minutes.
    const timer = setInterval(load, 30 * 60 * 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [league]);
  const visible = news.filter(n => (!onlySaved || saved.includes(n.id)) &&
    `${n.title} ${n.source}`.toLowerCase().includes(search.toLowerCase()));
  function toggleSave(id: string) {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(next); localStorage.setItem("hm-saved", JSON.stringify(next));
  }
  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL;
  return <div className="site">
    <header className="header"><div className="shell headerContent">
      <div className="brand"><div className="mark"><Trophy size={23}/></div><div><div className="brandName">해축<span>모니터</span><span className="liveDot"/></div><div className="brandSub">HAECHUK MONITOR</div></div></div>
      <div className="headerRight"><span className="headerPill"><ShieldCheck size={15}/> 매일 업데이트</span></div>
    </div></header>
    <main className="shell">
      <section className="hero"><div className="kicker"><span className="pulse"/> THE WORLD OF FOOTBALL</div>
        <h1>축구 소식은<br/><span>빠르고, 간결하게.</span></h1>
        <p>유럽 주요 리그부터 K리그까지. 보고 싶은 축구 뉴스를 한곳에서 모니터링하세요.</p>
        <div className="heroStats"><span><Globe2 size={15}/> 7개 뉴스 채널</span><span><Clock3 size={15}/> 약 30분 주기로 새 소식 확인</span></div>
      </section>
      <section className="newsSection">
        <div className="sectionTop"><div><div className="sectionEyebrow">LATEST STORIES</div><h2>최신 축구 뉴스</h2></div><div className="update">{lastChecked ? `마지막 확인 ${timeAgo(lastChecked)}` : "뉴스 연결 중"}</div></div>
        <nav aria-label="리그 선택" className="tabs">{LEAGUES.map(l => <button key={l.id} type="button" className={league === l.id ? "tab active" : "tab"} onClick={() => { setLeague(l.id); setOnlySaved(false); }}>{l.label}</button>)}</nav>
        <div className="toolbar"><label className="searchbox"><Search size={17}/><input placeholder="선수, 구단, 키워드 검색" value={search} onChange={e=>setSearch(e.target.value)}/></label><button className={onlySaved ? "saveFilter selected" : "saveFilter"} onClick={()=>setOnlySaved(!onlySaved)}><Bookmark size={16} fill={onlySaved ? "currentColor" : "none"}/> 저장한 뉴스</button></div>
        <div className="feedHead"><span>NEWS FEED <i/> {LEAGUES.find(l=>l.id === league)?.label}</span><span>최신순</span></div>
        <div className="feed" aria-live="polite">
          {loading ? <div className="state"><LoaderCircle className="spin" size={29}/><p>최신 뉴스를 모으고 있어요.</p></div> :
          error ? <div className="state"><RefreshCw size={27}/><p>{error}</p><button onClick={()=>window.location.reload()}>다시 시도</button></div> :
          visible.length === 0 ? <div className="state"><Bookmark size={27}/><p>{onlySaved ? "이 리그에서 저장한 뉴스가 없어요." : "검색 결과가 없습니다."}</p></div> :
          visible.map((item, idx) => <article key={item.id} className="story">
            <div className="storyIndex">{String(idx + 1).padStart(2,"0")}</div>
            <div className="storyBody"><div className="storyMeta"><span className="source">{item.source}</span><span>{timeAgo(item.published)}</span></div>
              <a href={allowedUrl(item.link)} target="_blank" rel="noopener noreferrer" className="headline">{item.title}<ArrowUpRight size={16} aria-hidden/></a>
              {item.snippet && <p className="snippet">{item.snippet}</p>}
              <div className="storyFoot"><span>기사 원문 보기 ↗</span></div>
            </div><button className="bookmarkBtn" title={saved.includes(item.id)?"저장 해제":"뉴스 저장"} aria-label={saved.includes(item.id)?"저장 해제":"뉴스 저장"} onClick={()=>toggleSave(item.id)}><Bookmark size={19} fill={saved.includes(item.id)?"currentColor":"none"}/></button>
          </article>)}
        </div>
        {!loading && !error && <p className="feedNotice">기사 제목과 미리보기는 제공처의 뉴스 피드를 통해 표시됩니다. 자세한 내용은 원문 링크에서 확인하세요.</p>}
        <div className="adSlot">
          <div className="adLabel">PARTNER · 제휴 안내</div>
          <div className="adBody"><div className="adIcon">✈</div><div className="adText"><strong>축구 직관 여행을 계획하고 있나요?</strong><span>경기 입장권과 여행 상품을 살펴보세요.</span></div>
            {affiliateUrl ? <a href={affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="adButton">상품 보기 <ArrowUpRight size={15}/></a> : <span className="adPending">제휴 링크 준비 중</span>}
          </div>
        </div>
      </section>
    </main>
    <footer className="footer"><div className="shell footContent"><span>© {new Date().getFullYear()} HAECHUK MONITOR</span><span>축구를 더 가깝게.</span></div></footer>
  </div>;
}
