'use client';
import React from 'react';
import './Ranking.css';

const API_BASE = 'https://a786a8181b55.ngrok-free.app';
const API_URL = `${API_BASE}/api/leaderboard`;
const REFRESH_MS = 2000;

function fmtScore(v) { return v == null ? '—' : Number(v || 0).toLocaleString(); }
function getTopN(arr, n) { return Array.from({ length: n }, (_, i) => arr[i] ?? null); }
function rankBadgeClass(rank) { return rank === 1 ? 'rk-badge--gold' : rank === 2 ? 'rk-badge--silver' : rank === 3 ? 'rk-badge--bronze' : ''; }

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          <td className="rk-rank"><div className="rk-skel rk-skel--sm" /></td>
          <td className="rk-user"><div className="rk-userText"><div className="rk-skel rk-skel--md" /></div></td>
          <td className="rk-score"><div className="rk-skel rk-skel--sm" /></td>
        </tr>
      ))}
    </>
  );
}

function PodiumCol({ place, color, user }) {
  const name = user?.username ?? 'TBD';
  const pts = fmtScore(user?.score);
  return (
    <div className={`rk-pcol rk-pcol--${place === 1 ? 'first' : place === 2 ? 'second' : 'third'}`}>
      <div className={`rk-pplace rk-pplace--${color}`}>{place}</div>
      <div className={`rk-pstep rk-pstep--${place === 1 ? 'first' : place === 2 ? 'second' : 'third'}`}>
        <div className="rk-pname">{name}</div>
        <div className="rk-ppoints">{pts}</div>
      </div>
    </div>
  );
}

export default function Ranking() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [lastUpdate, setLast] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const prevMapRef = React.useRef(new Map());
  const stickyTrendRef = React.useRef(new Map());
  const controllerRef = React.useRef(null);

  async function fetchLeaderboard(signal) {
    setError('');
    try {
      const res = await fetch(API_URL, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' }, signal });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data; try { data = JSON.parse(text); } catch { throw new Error('Invalid JSON'); }
      if (!Array.isArray(data)) throw new Error('Unexpected API shape');

      const sorted = data
        .map(r => ({ userId: String(r.userId ?? r.username ?? ''), username: String(r.username ?? 'Unknown'), score: Number(r.score || 0) }))
        .sort((a, b) => (b.score - a.score) || a.username.localeCompare(b.username))
        .map((r, i) => ({ ...r, rank: i + 1 }));

      const prev = prevMapRef.current;
      const nextPrev = new Map();

      const withTrend = sorted.map(r => {
        const prevRank = prev.get(r.userId)?.rank;
        const rawDelta = typeof prevRank === 'number' ? prevRank - r.rank : 0;
        let trend = 'same';
        let amount = 0;
        if (rawDelta !== 0) {
          trend = rawDelta > 0 ? 'up' : 'down';
          amount = Math.abs(rawDelta);
          stickyTrendRef.current.set(r.userId, { trend, amount });
        } else {
          const cached = stickyTrendRef.current.get(r.userId);
          if (cached) { trend = cached.trend; amount = cached.amount; }
        }
        nextPrev.set(r.userId, { rank: r.rank });
        return { ...r, _posDelta: rawDelta, _trend: trend, _trendAmt: amount };
      });

      prevMapRef.current = nextPrev;
      setRows(withTrend);
      setLast(new Date());
      setLoading(false);
    } catch (e) {
      if (signal?.aborted) return;
      setError(e?.message || 'Erreur');
      setLoading(false);
    }
  }

  const refresh = React.useCallback(() => {
    controllerRef.current?.abort?.();
    const ac = new AbortController();
    controllerRef.current = ac;
    fetchLeaderboard(ac.signal);
  }, []);

  React.useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    return () => { clearInterval(id); controllerRef.current?.abort?.(); };
  }, [refresh]);

  const viewRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.username.toLowerCase().includes(q));
  }, [rows, search]);

  const top3 = React.useMemo(() => getTopN(rows, 3), [rows]);

  return (
    <div className="rk-page">
      <div className="rk-card">
        <div className="rk-header">
          <h1 className="rk-title">Leaderboard</h1>
          <div className="rk-actions">
            <div className="rk-search">
              <input className="rk-input" placeholder="Rechercher un pseudo…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="rk-searchIcon">🔎</span>
            </div>
            <button className="rk-btn" onClick={refresh}>Rafraîchir</button>
            <span className="rk-ts">{lastUpdate ? `MAJ: ${lastUpdate.toLocaleTimeString()}` : loading ? 'Chargement…' : ''}</span>
          </div>
        </div>

        {error && <div className="rk-error">Erreur API : {error}</div>}

        <div className="rk-tableWrap">
          <table className="rk-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Joueur</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : viewRows.length === 0 ? (
                <tr><td colSpan={3} className="rk-empty">Aucun résultat.</td></tr>
              ) : (
                viewRows.map((r, i) => {
                  const rank = i + 1;
                  const clsTop = rank === 1 ? 'rk-row--1' : rank === 2 ? 'rk-row--2' : rank === 3 ? 'rk-row--3' : '';
                  const bounce = r._posDelta > 0 ? 'rk-bounce-up' : r._posDelta < 0 ? 'rk-bounce-down' : '';
                  const arrow = r._trend === 'up' ? '▲' : r._trend === 'down' ? '▼' : '–';
                  const trendCls = r._trend === 'up' ? 'rk-up' : r._trend === 'down' ? 'rk-down' : 'rk-same';
                  const amt = Math.abs(r._trendAmt || 0);
                  return (
                    <tr key={r.userId} className={[clsTop, bounce].join(' ').trim()}>
                      <td className="rk-rank"><span className={`rk-badge ${rankBadgeClass(rank)}`}>{rank}</span></td>
                      <td className="rk-user">
                        <div className="rk-userText">
                          <span className="rk-username">{r.username}</span>
                          <span className="rk-userid">({r.userId})</span>
                        </div>
                      </td>
                      <td className="rk-score">
                        {fmtScore(r.score)}
                        <span className={`rk-delta ${trendCls}`} title="Variation de place">
                          {arrow} {amt}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <h2 className="rk-subtitle">Podium</h2>
        <div className="rk-podium">
          <PodiumCol place={2} color="silver" user={top3[1]} />
          <PodiumCol place={1} color="gold" user={top3[0]} />
          <PodiumCol place={3} color="bronze" user={top3[2]} />
        </div>

      </div>
    </div>
  );
}
