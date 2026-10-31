const API = "https://ps99.biggamesapi.io";

const page = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#08090d">
  <meta name="description" content="Search current Pet Simulator 99 Huge, Titanic, and Gargantuan odds across egg pools, gift bags, chests, and enchant modifiers.">
  <title>PS99 Odds Atlas</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #101847;
      --panel: rgba(29, 48, 112, .94);
      --panel-2: #253d87;
      --line: rgba(137, 184, 255, .3);
      --muted: #b6c9f1;
      --text: #fff;
      --cyan: #8df2ff;
      --blue: #91bdff;
      --gold: #ffe27b;
      --pink: #f3b5ff;
      --green: #8cf6c6;
      font-family: "Trebuchet MS", "Arial Rounded MT Bold", ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html { min-height: 100%; scroll-behavior: smooth; }
    body {
      min-height: 100vh;
      margin: 0;
      color: var(--text);
      background:
        radial-gradient(ellipse at 80% 0%, rgba(53, 119, 255, .4), transparent 34rem),
        radial-gradient(ellipse at 8% 20%, rgba(24, 218, 229, .2), transparent 31rem),
        radial-gradient(ellipse at 55% 60%, rgba(121, 78, 243, .13), transparent 42rem),
        linear-gradient(180deg, #18245b 0%, #111a49 48%, #0d153c 100%);
      -webkit-font-smoothing: antialiased;
    }
    body::before {
      position: fixed; inset: 0; pointer-events: none; content: ""; opacity: .12;
      opacity: .16; background-image: radial-gradient(rgba(220, 238, 255, .65) .8px, transparent .8px);
      background-size: 26px 26px; mask-image: linear-gradient(to bottom, black, transparent 78%);
    }
    button, input { font: inherit; }
    button { color: inherit; }
    .shell { width: min(1220px, calc(100% - 36px)); margin: 0 auto; position: relative; }
    .topbar { height: 76px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
    .brand { display: flex; align-items: center; gap: 12px; color: var(--text); text-decoration: none; font-weight: 800; letter-spacing: .08em; font-size: 13px; }
    .brand-mark { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; color: #071318; background: linear-gradient(135deg, #91fff0, #73b8ff 72%); box-shadow: 0 0 28px rgba(92, 228, 223, .2); font-size: 13px; letter-spacing: -.06em; }
    .brand small { display: block; color: var(--muted); font-weight: 600; letter-spacing: .14em; font-size: 9px; margin-top: 3px; }
    .top-meta { display: flex; align-items: center; gap: 14px; color: var(--muted); font-size: 12px; }
    .live-pill { display: inline-flex; align-items: center; gap: 7px; padding: 7px 10px; border: 1px solid rgba(154, 240, 197, .2); border-radius: 999px; color: #b5f7d5; background: rgba(80, 196, 139, .07); font-size: 10px; letter-spacing: .12em; font-weight: 800; text-transform: uppercase; }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #6ef0aa; box-shadow: 0 0 10px #6ef0aa; }
    .hero { padding: 60px 0 32px; display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: 30px; align-items: end; }
    .eyebrow { display: flex; align-items: center; gap: 9px; color: var(--cyan); letter-spacing: .17em; text-transform: uppercase; font-size: 10px; font-weight: 800; }
    .eyebrow::before { width: 22px; height: 1px; background: var(--cyan); content: ""; }
    h1 { margin: 17px 0 14px; font-size: clamp(36px, 5.5vw, 64px); line-height: .99; letter-spacing: -.055em; font-weight: 800; max-width: 720px; }
    h1 span { color: var(--cyan); }
    .hero-copy { max-width: 650px; margin: 0; color: #aab7d1; font-size: 15px; line-height: 1.7; }
    .hero-side { padding: 16px 17px; border: 1px solid var(--line); border-radius: 15px; background: rgba(18, 28, 51, .76); }
    .side-label { color: var(--muted); font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .release-line { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; gap: 10px; }
    .release-number { font-size: 17px; font-weight: 750; letter-spacing: -.02em; }
    .release-state { color: var(--green); font-size: 11px; }
    .release-time { margin-top: 6px; color: var(--muted); font-size: 11px; }
    .toolbar { display: flex; gap: 12px; align-items: center; margin: 7px 0 18px; }
    .searchbox { min-width: 0; flex: 1; position: relative; }
    .searchbox svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; stroke: #8fa0c4; }
    .searchbox input { width: 100%; height: 50px; padding: 0 48px; border-radius: 13px; color: var(--text); background: rgba(17, 25, 46, .92); border: 1px solid var(--line); outline: none; transition: border-color .18s, box-shadow .18s; }
    .searchbox input::placeholder { color: #7584a4; }
    .searchbox input:focus { border-color: rgba(92, 228, 223, .55); box-shadow: 0 0 0 3px rgba(92, 228, 223, .09); }
    .search-hint { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); color: #73809f; border: 1px solid rgba(178, 198, 237, .14); border-radius: 6px; padding: 3px 6px; font-size: 10px; }
    .refresh-btn { height: 50px; min-width: 116px; display: inline-flex; justify-content: center; align-items: center; gap: 9px; padding: 0 16px; border: 1px solid rgba(92, 228, 223, .25); border-radius: 13px; color: var(--cyan); background: rgba(92, 228, 223, .07); cursor: pointer; font-size: 12px; font-weight: 750; transition: background .18s, transform .18s; }
    .refresh-btn:hover { background: rgba(92, 228, 223, .13); transform: translateY(-1px); }
    .refresh-btn svg { width: 15px; height: 15px; stroke: currentColor; }
    .refresh-btn.spinning svg { animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 11px; margin: 0 0 26px; }
    .stat { min-height: 77px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: linear-gradient(135deg, rgba(22, 32, 58, .82), rgba(15, 23, 42, .64)); }
    .stat-label { color: var(--muted); font-size: 10px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
    .stat-value { margin-top: 7px; font-size: 22px; line-height: 1; letter-spacing: -.04em; font-weight: 800; }
    .stat-value.cyan { color: var(--cyan); }
    .stat-value.gold { color: var(--gold); }
    .coverage-note { display: flex; gap: 12px; padding: 14px 16px; margin-bottom: 25px; border: 1px solid rgba(255, 217, 130, .17); border-radius: 13px; background: rgba(125, 92, 33, .09); color: #d8c89e; font-size: 12px; line-height: 1.6; }
    .coverage-note strong { color: #ffe5a6; }
    .coverage-icon { flex: 0 0 22px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 7px; color: var(--gold); background: rgba(255, 217, 130, .12); font-weight: 900; }
    .section-head { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin: 29px 0 15px; }
    .section-title { margin: 0; font-size: 21px; letter-spacing: -.035em; }
    .section-subtitle { margin: 5px 0 0; color: var(--muted); font-size: 12px; }
    .result-count { color: var(--muted); font-size: 11px; }
    .filter-groups { display: grid; gap: 11px; padding: 13px 15px; margin: 8px 0 16px; border: 1px solid var(--line); border-radius: 15px; background: rgba(17, 25, 46, .68); }
    .filter-group { display: grid; grid-template-columns: 72px minmax(0, 1fr); align-items: center; gap: 10px; }
    .filter-label { color: #8594b2; font-size: 9px; font-weight: 850; letter-spacing: .14em; }
    .filters { display: flex; gap: 7px; overflow-x: auto; padding: 1px 0; scrollbar-width: none; }
    .filters::-webkit-scrollbar { display: none; }
    .filter-btn { flex: 0 0 auto; border: 1px solid rgba(178, 198, 237, .15); background: rgba(31, 43, 69, .68); color: #a8b4ce; padding: 8px 11px; border-radius: 8px; cursor: pointer; font-size: 10px; font-weight: 750; transition: all .16s; }
    .filter-btn:hover { color: var(--text); border-color: rgba(92, 228, 223, .28); }
    .filter-btn.active { color: #09251f; background: linear-gradient(180deg, #b2ffe0, #6be6b8); border-color: #a4f8d6; box-shadow: 0 2px 0 rgba(255,255,255,.16) inset, 0 3px 12px rgba(64, 220, 163, .13); }
    [data-kind="titanic"].active { color: #332409; background: linear-gradient(180deg, #fff0ae, #f1bd53); border-color: #ffe6a0; box-shadow: 0 2px 0 rgba(255,255,255,.2) inset, 0 3px 12px rgba(243, 184, 70, .16); }
    [data-kind="gargantuan"].active { color: #231139; background: linear-gradient(180deg, #f3c8ff, #bc82f4); border-color: #e2b4ff; box-shadow: 0 2px 0 rgba(255,255,255,.2) inset, 0 3px 12px rgba(181, 110, 255, .2); }
    .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; }
    .pet-card { position: relative; padding: 15px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(160deg, rgba(23, 34, 61, .93), rgba(15, 23, 42, .96)); min-width: 0; transition: transform .18s, border-color .18s, box-shadow .18s; }
    .pet-card:hover { transform: translateY(-3px); border-color: rgba(92, 228, 223, .3); box-shadow: 0 14px 40px rgba(0, 0, 0, .18); }
    .pet-top { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .pet-open { display: block; width: 64px; height: 64px; flex: 0 0 64px; padding: 0; border: 0; border-radius: 0; overflow: hidden; background: radial-gradient(circle at 36% 26%, #254766, #12253c 75%); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(163, 228, 246, .14); }
    .pet-open img { width: 100%; height: 100%; object-fit: contain; transition: transform .2s; }
    .pet-open:hover img { transform: scale(1.1); }
    .pet-placeholder { width: 100%; height: 100%; display: grid; place-items: center; color: var(--cyan); font-size: 24px; font-weight: 800; }
    .pet-title-wrap { min-width: 0; flex: 1; }
    .pet-name { margin: 0; font-size: 14px; line-height: 1.3; letter-spacing: -.015em; overflow-wrap: anywhere; }
    .pet-kind { display: inline-flex; margin-top: 7px; padding: 4px 7px; border-radius: 999px; font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
    .pet-kind.huge { color: #a4f6dc; background: rgba(81, 209, 158, .11); border: 1px solid rgba(81, 209, 158, .16); }
    .pet-kind.titanic { color: #ffe39f; background: rgba(255, 217, 130, .11); border: 1px solid rgba(255, 217, 130, .17); }
    .pet-kind.gargantuan { color: #edc8ff; background: rgba(184, 112, 244, .15); border: 1px solid rgba(210, 162, 255, .25); }
    .pet-kind.egg { color: #a6efff; background: rgba(88, 185, 218, .12); border: 1px solid rgba(88, 185, 218, .2); }
    .pet-kind.gift { color: #ffe2a3; background: rgba(225, 169, 70, .13); border: 1px solid rgba(225, 169, 70, .2); }
    .pet-kind.chest { color: #d6c0ff; background: rgba(150, 106, 218, .13); border: 1px solid rgba(150, 106, 218, .2); }
    .pet-kind.other { color: #cad7ef; background: rgba(130, 153, 196, .12); border: 1px solid rgba(130, 153, 196, .18); }
    .pet-name.huge { color: #b8ffe4; }
    .pet-name.titanic { color: #ffe5a0; text-shadow: 0 0 14px rgba(255, 218, 122, .15); }
    .pet-name.gargantuan { color: #eccaff; text-shadow: 0 0 14px rgba(192, 118, 255, .2); }
    .pool-count { margin-left: auto; align-self: flex-start; white-space: nowrap; color: #8d9bb8; font-size: 10px; }
    .card-divider { height: 1px; margin: 14px 0 10px; background: var(--line); }
    .source-list { display: grid; gap: 7px; }
    .source-row { width: 100%; display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: center; gap: 9px; padding: 5px; margin: 0; text-align: left; border: 1px solid transparent; border-radius: 10px; background: transparent; cursor: pointer; transition: background .15s, border-color .15s; }
    .source-row:hover, .source-row:focus-visible { outline: none; background: rgba(100, 143, 196, .1); border-color: rgba(132, 170, 217, .16); }
    .source-thumb { position: relative; width: 34px; height: 34px; display: grid; place-items: center; overflow: visible; border-radius: 10px; background: linear-gradient(145deg, rgba(98, 127, 189, .22), rgba(48, 66, 107, .22)); }
    .source-thumb img { width: 100%; height: 100%; object-fit: contain; border-radius: 9px; }
    .source-fallback { color: #a8d6ed; font-size: 15px; }
    .source-thumb { border: 1px solid rgba(178, 198, 237, .17); cursor: help; }
    .source-meta { min-width: 0; }
    .source-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #d8e1f2; font-size: 11px; font-weight: 700; }
    .source-status { display: block; margin-top: 4px; color: #8392af; font-size: 9px; }
    .source-odds { color: var(--cyan); white-space: nowrap; text-align: right; font-size: 11px; font-weight: 800; }
    .source-odds small { display: block; margin-top: 3px; color: #8a9aba; font-size: 9px; font-weight: 600; }
    .more-sources { margin: 4px 0 0 5px; color: #7e8daa; font-size: 10px; }
    .empty { grid-column: 1 / -1; padding: 40px 20px; border: 1px dashed rgba(178, 198, 237, .2); border-radius: 16px; color: var(--muted); text-align: center; background: rgba(18, 28, 51, .35); }
    .empty strong { display: block; color: #e8eefb; font-size: 14px; margin-bottom: 7px; }
    .no-odds { padding: 10px 11px; border: 1px dashed rgba(178, 198, 237, .16); border-radius: 10px; color: #9ba9c4; background: rgba(8, 14, 27, .26); font-size: 10px; line-height: 1.5; }
    .load-more { display: block; margin: 18px auto 0; padding: 11px 16px; border: 1px solid rgba(92, 228, 223, .25); border-radius: 10px; color: var(--cyan); background: rgba(92, 228, 223, .07); cursor: pointer; font-size: 11px; font-weight: 800; }
    .load-more:hover { background: rgba(92, 228, 223, .13); }
    .source-panel { display: none; }
    .source-panel.visible { display: block; }
    .panel-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; }
    .modifier-card { min-height: 180px; display: flex; flex-direction: column; padding: 16px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(155deg, rgba(23, 34, 61, .9), rgba(15, 23, 42, .96)); cursor: pointer; transition: transform .18s, border-color .18s; }
    .modifier-card:hover { transform: translateY(-3px); border-color: rgba(238, 165, 255, .34); }
    .modifier-top { display: flex; align-items: center; gap: 11px; }
    .modifier-icon { width: 48px; height: 48px; display: grid; place-items: center; flex: 0 0 48px; border-radius: 14px; background: rgba(191, 126, 229, .11); overflow: hidden; }
    .modifier-icon img { width: 100%; height: 100%; object-fit: contain; }
    .modifier-icon span { font-size: 21px; color: var(--pink); }
    .modifier-name { margin: 0; font-size: 13px; line-height: 1.3; }
    .modifier-class { margin-top: 5px; color: #c6a7df; font-size: 9px; text-transform: uppercase; font-weight: 800; letter-spacing: .11em; }
    .modifier-copy { margin: 14px 0 12px; color: #aab7d1; font-size: 11px; line-height: 1.55; }
    .modifier-value { margin-top: auto; color: var(--pink); font-size: 11px; font-weight: 800; }
    .unavailable-card { padding: 21px; display: flex; gap: 14px; border-radius: 16px; border: 1px solid rgba(255, 217, 130, .16); background: rgba(125, 92, 33, .08); }
    .unavailable-icon { width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center; border-radius: 13px; color: var(--gold); background: rgba(255, 217, 130, .1); font-size: 20px; }
    .unavailable-card h3 { margin: 1px 0 7px; font-size: 14px; }
    .unavailable-card p { max-width: 760px; margin: 0; color: #b8aa89; font-size: 11px; line-height: 1.6; }
    .unavailable-card strong { color: #f3dda9; }
    .section-foot { margin: 13px 0 0; color: #7887a4; font-size: 10px; line-height: 1.6; }
    .footer { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 46px; padding: 19px 0 26px; border-top: 1px solid var(--line); color: #7786a4; font-size: 10px; }
    .footer a { color: #8fd7dc; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .loading { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }
    .skeleton { height: 154px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(100deg, rgba(21, 31, 56, .6) 25%, rgba(42, 56, 89, .45) 38%, rgba(21, 31, 56, .6) 62%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; }
    @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
    dialog { width: min(590px, calc(100% - 28px)); max-height: min(82vh, 760px); padding: 0; color: var(--text); border: 1px solid rgba(178, 198, 237, .2); border-radius: 19px; background: #111a30; box-shadow: 0 28px 100px rgba(0, 0, 0, .65); }
    dialog::backdrop { background: rgba(2, 5, 12, .73); backdrop-filter: blur(7px); }
    .modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; padding: 19px 20px 14px; border-bottom: 1px solid var(--line); }
    .modal-kicker { color: var(--cyan); font-size: 9px; font-weight: 850; letter-spacing: .15em; text-transform: uppercase; }
    .modal-title { margin: 7px 0 0; font-size: 20px; letter-spacing: -.035em; }
    .modal-close { width: 31px; height: 31px; flex: 0 0 31px; border: 1px solid var(--line); border-radius: 9px; color: #aab7d1; background: rgba(108, 126, 162, .1); cursor: pointer; font-size: 17px; }
    .modal-content { padding: 17px 20px 22px; overflow: auto; }
    .modal-hero { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
    .modal-image { width: 78px; height: 78px; flex: 0 0 78px; display: grid; place-items: center; overflow: hidden; border-radius: 0; background: radial-gradient(circle at 35% 30%, #254766, #12253c 75%); }
    .modal-image img { width: 100%; height: 100%; object-fit: contain; }
    .modal-desc { color: #aab7d1; font-size: 12px; line-height: 1.6; }
    .modal-label { margin: 17px 0 8px; color: #8796b4; font-size: 9px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .modal-source { display: grid; grid-template-columns: 38px 1fr auto; gap: 10px; align-items: center; padding: 8px; border-bottom: 1px solid rgba(178, 198, 237, .08); }
    .modal-source img { width: 38px; height: 38px; object-fit: contain; border-radius: 10px; background: rgba(91, 117, 169, .12); }
    .modal-source-name { font-size: 11px; font-weight: 750; }
    .modal-source-sub { margin-top: 4px; color: #8090ad; font-size: 9px; }
    .modal-odds { color: var(--cyan); text-align: right; font-size: 11px; font-weight: 850; white-space: nowrap; }
    .game-tip[hidden] { display: none; }
    .game-tip { position: fixed; z-index: 1000; width: min(318px, calc(100vw - 24px)); padding: 0; overflow: hidden; border: 2px solid #b5becd; border-radius: 9px; color: #f6f7fb; background: linear-gradient(145deg, #24324a, #131c2d 72%); box-shadow: 0 10px 30px rgba(0, 0, 0, .62), 0 0 0 2px rgba(12, 17, 28, .9); pointer-events: none; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    .game-tip.kind-huge { border-color: #9be8c8; }
    .game-tip.kind-titanic { border-color: #f3cf77; }
    .game-tip.kind-gargantuan { border-color: #d19aff; }
    .game-tip.kind-enchant { border-color: #d19aff; }
    .game-tip.kind-huge .game-tip-image, .game-tip.kind-titanic .game-tip-image, .game-tip.kind-gargantuan .game-tip-image { border-radius: 0; }
    .game-tip-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 10px; border-bottom: 1px solid rgba(255,255,255,.16); background: linear-gradient(90deg, rgba(61, 82, 115, .94), rgba(34, 47, 70, .96)); }
    .game-tip.kind-huge .game-tip-head { background: linear-gradient(90deg, #217b64, #245846); }
    .game-tip.kind-titanic .game-tip-head { background: linear-gradient(90deg, #9b6824, #584420); }
    .game-tip.kind-gargantuan .game-tip-head { background: linear-gradient(90deg, #773eb0, #442465); }
    .game-tip.kind-enchant .game-tip-head { background: linear-gradient(90deg, #773eb0, #442465); }
    .game-tip-title { min-width: 0; font-size: 12px; font-weight: 900; line-height: 1.25; text-shadow: 0 1px 2px #111; }
    .game-tip-rarity { flex: 0 0 auto; padding: 3px 6px; border: 1px solid rgba(255,255,255,.24); border-radius: 5px; background: rgba(9, 13, 23, .42); color: #fff; font-size: 8px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
    .game-tip-body { display: grid; grid-template-columns: 72px minmax(0,1fr); gap: 10px; padding: 10px; }
    .game-tip-image { width: 72px; height: 72px; display: grid; place-items: center; overflow: hidden; border: 1px solid rgba(255,255,255,.18); border-radius: 8px; background: radial-gradient(circle at 50% 42%, #526580, #202b3e 72%); box-shadow: inset 0 1px 8px rgba(0,0,0,.3); }
    .game-tip-image img { width: 100%; height: 100%; object-fit: contain; }
    .game-tip-image span { color: #e6eaf2; font-size: 27px; font-weight: 950; }
    .game-tip-copy { min-width: 0; align-self: center; }
    .game-tip-subtitle { color: #d8deeb; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    .game-tip-desc { margin-top: 5px; color: #bac4d5; font-size: 9px; line-height: 1.45; }
    .game-tip-foot { display: grid; gap: 5px; padding: 7px 10px 9px; border-top: 1px solid rgba(255,255,255,.13); background: rgba(5, 9, 17, .27); }
    .game-tip-line { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; color: #b9c4d4; font-size: 9px; line-height: 1.35; }
    .game-tip-line span:first-child { flex: 0 0 auto; color: #8797ad; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
    .game-tip-line strong { color: #fff; text-align: right; font-size: 9px; font-weight: 850; }
    .game-tip-line strong.chance { color: #ffe083; }
    .game-tip-line strong.gargantuan { color: #e1b7ff; }
    .error-line { margin: 0 0 14px; padding: 11px 13px; border-radius: 11px; color: #ffc8cb; background: rgba(181, 65, 76, .11); border: 1px solid rgba(255, 127, 140, .15); font-size: 11px; }
    .muted { color: var(--muted); }
    /* A quieter, hand-tuned catalog palette: ink, sea glass, and brass. */
    :root {
      --bg: #10232c;
      --panel: #193641;
      --panel-2: #21444d;
      --line: #355963;
      --muted: #b5c4bf;
      --text: #f8f2df;
      --cyan: #85ded0;
      --blue: #a9d9dc;
      --gold: #f2c966;
      --pink: #e5ae82;
      --green: #b5df8b;
      font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      color: var(--text);
      background: #10232c;
      -webkit-font-smoothing: antialiased;
    }
    body::before { opacity: .035; background-image: radial-gradient(rgba(240, 235, 205, .8) .7px, transparent .7px); background-size: 18px 18px; }
    .shell { width: min(1160px, calc(100% - 40px)); }
    .topbar { height: 68px; border-bottom: 1px solid #355963; }
    .brand { gap: 10px; letter-spacing: .045em; }
    .brand-mark {
      border: 1px solid #f5dea0;
      border-bottom: 3px solid #b7833d;
      border-radius: 8px;
      background: #f0ca67;
      color: #342f20;
      box-shadow: none;
    }
    .brand small { color: #a8c0bb; letter-spacing: .1em; }
    .top-meta { color: #afc3bf; }
    .live-pill { padding: 6px 9px; border: 1px solid #41695b; border-radius: 7px; color: #c5e8a4; background: #1d3d3d; letter-spacing: .07em; }
    .live-dot { box-shadow: none; }
    .hero { padding: 42px 0 24px; gap: 24px; }
    .eyebrow { color: #a9c9be; letter-spacing: .11em; }
    .eyebrow::before { width: 7px; height: 7px; background: var(--gold); }
    h1 { margin: 12px 0 11px; max-width: 700px; font-size: clamp(34px, 4.6vw, 54px); line-height: 1.02; letter-spacing: -.04em; font-weight: 900; text-shadow: none; }
    h1 span { color: var(--gold); text-shadow: none; }
    .hero-copy { max-width: 620px; color: #c2d1ca; font-size: 14px; line-height: 1.65; font-weight: 500; }
    .hero-side { padding: 14px 15px; border: 1px solid #3c6266; border-left: 3px solid var(--gold); border-radius: 9px; background: #193641; box-shadow: none; }
    .side-label, .stat-label, .filter-label { color: #b4c9c1; }
    .release-number { text-shadow: none; }
    .release-state { color: #bde293; }
    .toolbar { margin-top: 4px; }
    .searchbox input {
      height: 48px;
      border: 1px solid #52747b;
      border-radius: 9px;
      background: #142d37;
      box-shadow: none;
      font-weight: 600;
    }
    .searchbox input:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(242, 201, 102, .15); }
    .searchbox input::placeholder { color: #91aaa6; }
    .searchbox svg { stroke: #9ab5b0; }
    .search-hint { border-color: #49676d; border-radius: 4px; color: #a8c0bb; }
    .refresh-btn, .load-more {
      border: 1px solid #54766e;
      border-radius: 8px;
      color: #d8edbc;
      background: #264b48;
      box-shadow: none;
      text-shadow: none;
      font-weight: 800;
    }
    .refresh-btn:hover, .load-more:hover { background: #315b54; transform: none; }
    .stats {
      gap: 0;
      overflow: hidden;
      margin-bottom: 20px;
      border: 1px solid #355963;
      border-radius: 10px;
      background: #193641;
    }
    .stat { min-height: 68px; padding: 12px 16px; border: 0; border-right: 1px solid #355963; border-radius: 0; background: transparent; box-shadow: none; }
    .stat:last-child { border-right: 0; }
    .stat-label { font-size: 9px; letter-spacing: .1em; }
    .stat-value { margin-top: 6px; font-size: 21px; text-shadow: none; }
    .stat-value.cyan { color: #8ce0cf; }
    .stat-value.gold { color: var(--gold); }
    .coverage-note {
      gap: 10px;
      padding: 12px 14px;
      margin-bottom: 20px;
      border: 1px solid #675d3c;
      border-left: 3px solid var(--gold);
      border-radius: 8px;
      background: #292f2d;
      color: #d4d0b8;
      font-size: 11px;
    }
    .coverage-note strong { color: #f3d77d; }
    .coverage-icon { border-radius: 5px; color: #312f25; background: var(--gold); box-shadow: none; }
    .section-head { margin: 26px 0 12px; }
    .section-title { color: #f5efd9; font-size: 21px; font-weight: 850; text-shadow: none; letter-spacing: -.025em; }
    .section-subtitle, .result-count { color: #afc2bb; }
    .filter-groups { gap: 9px; padding: 11px 13px; border: 1px solid #355963; border-radius: 9px; background: #18343e; box-shadow: none; }
    .filter-label { font-size: 9px; letter-spacing: .1em; }
    .filters { gap: 6px; }
    .filter-btn { padding: 7px 10px; border: 1px solid #46656c; border-radius: 6px; background: #213f49; color: #c1cfca; box-shadow: none; font-weight: 700; }
    .filter-btn:hover { border-color: #8ec9bb; color: #fff6df; transform: none; }
    .filter-btn.active { border-color: #b5df8b; color: #1d352d; background: #b5df8b; box-shadow: none; }
    [data-kind="titanic"].active { border-color: #f2c966; color: #3d321c; background: #f2c966; box-shadow: none; }
    [data-kind="gargantuan"].active { border-color: #e5ae82; color: #442d23; background: #e5ae82; box-shadow: none; }
    .cards, .panel-grid, .loading { gap: 12px; }
    .pet-card {
      padding: 13px;
      border: 1px solid #355963;
      border-top: 3px solid #78bba6;
      border-radius: 10px;
      background: #193641;
      box-shadow: none;
      transition: border-color .15s, background .15s;
    }
    .pet-card.titanic { border-top-color: var(--gold); }
    .pet-card.gargantuan { border-top-color: #e5ae82; }
    .pet-card:hover { transform: none; border-color: #6e9895; background: #1c3b45; box-shadow: none; }
    .pet-open { border: 1px solid #597b7f; background: #23434a; box-shadow: none; }
    .pet-name { font-size: 14px; font-weight: 850; text-shadow: none; }
    .pet-name.huge { color: #c3e9c6; }
    .pet-name.titanic { color: #f4d77f; text-shadow: none; }
    .pet-name.gargantuan { color: #efbd99; text-shadow: none; }
    .pet-kind { padding: 3px 6px; border-radius: 4px; box-shadow: none !important; letter-spacing: .07em; }
    .pet-kind.huge { color: #b9e8ca; background: #23473f; border-color: #426a58; }
    .pet-kind.titanic { color: #f2d989; background: #4a412b; border-color: #71623a; }
    .pet-kind.gargantuan { color: #f0c19e; background: #4d3b32; border-color: #71513f; }
    .pool-count { color: #aac0bb; }
    .card-divider { height: 1px; margin: 12px 0 9px; background: #355963; }
    .source-list { gap: 5px; }
    .source-row { gap: 8px; padding: 4px; border-radius: 6px; }
    .source-row:hover, .source-row:focus-visible { border-color: #476b70; background: #23444b; }
    .source-thumb { border: 1px solid #547278; border-radius: 0; background: #23434a; box-shadow: none; }
    .source-thumb img, .modifier-icon img, .modal-source img, .game-tip-image img { border-radius: 0; }
    .source-name { color: #eee8d7; font-size: 10px; font-weight: 750; }
    .source-status { color: #a6bbb4; }
    .source-odds { color: #9de2d0; text-shadow: none; }
    .source-odds small { color: #a5bbb4; }
    .no-odds { padding: 9px 10px; border: 1px dashed #49656a; border-radius: 7px; color: #c1cbc1; background: #172f37; }
    .empty { border: 1px dashed #58757a; border-radius: 9px; color: #c3d0c7; background: #193641; }
    .empty strong { color: #f8f2df; }
    .modifier-card { min-height: 170px; border: 1px solid #3e626c; border-radius: 10px; background: #193641; box-shadow: none; transition: border-color .15s, background .15s; }
    .modifier-card:hover { transform: none; border-color: #8bc5ba; background: #1d3b44; }
    .modifier-icon { border: 1px solid #557278; border-radius: 0; background: #23434a; box-shadow: none; }
    .modifier-class { color: #b4d1c2; }
    .modifier-copy { color: #bdcbc2; }
    .modifier-value { color: #d9ca83; }
    .unavailable-card { border: 1px solid #675d3c; border-left: 3px solid var(--gold); border-radius: 8px; background: #292f2d; box-shadow: none; }
    .unavailable-icon { border-radius: 6px; color: #312f25; background: var(--gold); }
    .unavailable-card p { color: #c7c5b5; }
    .unavailable-card strong { color: #f3d77d; }
    .section-foot { color: #a4b7b0; }
    .footer { margin-top: 36px; border-top: 1px solid #355963; color: #a6bab4; }
    .footer a { color: #9cdecf; }
    .skeleton { border: 1px solid #355963; border-radius: 9px; background: #193641; animation: none; }
    dialog { border: 1px solid #50717a; border-radius: 12px; background: #18343e; box-shadow: 0 18px 55px rgba(2, 12, 17, .48); }
    dialog::backdrop { background: rgba(5, 15, 19, .72); backdrop-filter: blur(2px); }
    .modal-head { border-bottom: 1px solid #355963; }
    .modal-kicker, .modal-odds { color: #9de2d0; }
    .modal-close { border-radius: 6px; color: #c1cbc1; background: #23434a; }
    .modal-image { border: 1px solid #597b7f; border-radius: 0; background: #23434a; box-shadow: none; }
    .modal-desc { color: #c1cbc1; }
    .modal-label { color: #afc2bb; }
    .modal-source { border-bottom-color: #355963; }
    .modal-source img { border: 1px solid #557278; border-radius: 0; background: #23434a; }
    .modal-source-sub { color: #a4b7b0; }
    .game-tip { border: 1px solid #78938d; border-radius: 8px; color: #f8f2df; background: #18343e; box-shadow: 0 8px 28px rgba(0, 0, 0, .45); font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif; }
    .game-tip.kind-huge { border-color: #85c6a0; }
    .game-tip.kind-titanic { border-color: #d8ba69; }
    .game-tip.kind-gargantuan, .game-tip.kind-enchant { border-color: #d09d78; }
    .game-tip-head, .game-tip.kind-huge .game-tip-head, .game-tip.kind-titanic .game-tip-head, .game-tip.kind-gargantuan .game-tip-head, .game-tip.kind-enchant .game-tip-head { border-bottom: 1px solid #355963; background: #23444b; }
    .game-tip-title { text-shadow: none; }
    .game-tip-image { border: 1px solid #597b7f; border-radius: 0; background: #23434a; box-shadow: none; }
    .game-tip-copy { color: #c1cbc1; }
    .game-tip-subtitle { color: #b5d0c4; }
    .game-tip-desc { color: #c1cbc1; }
    .game-tip-foot { border-top: 1px solid #355963; background: #142d37; }
    .game-tip-line, .game-tip-line strong { color: #e8e4d4; }
    .game-tip-line span:first-child { color: #a9beb7; }
    .game-tip-line strong.chance { color: #f2d77a; }
    .error-line { color: #f3c1ad; background: #3d2928; border-color: #734a42; }
    @media (max-width: 900px) { .cards, .panel-grid, .loading { grid-template-columns: repeat(2, minmax(0, 1fr)); } .hero { grid-template-columns: minmax(0, 1fr) 220px; } }
    @media (max-width: 650px) {
      .shell { width: min(100% - 26px, 580px); }
      .topbar { height: 62px; }
      .top-meta { gap: 7px; font-size: 10px; }
      .top-meta .data-source { display: none; }
      .hero { display: block; padding: 31px 0 20px; }
      h1 { font-size: clamp(34px, 10vw, 46px); }
      .hero-copy { font-size: 13px; }
      .hero-side { margin-top: 16px; }
      .toolbar { gap: 8px; }
      .refresh-btn { min-width: 46px; width: 46px; padding: 0; font-size: 0; }
      .refresh-btn svg { width: 18px; height: 18px; }
      .stats { grid-template-columns: repeat(2, 1fr); margin-bottom: 16px; }
      .stat { min-height: 62px; padding: 10px 12px; }
      .stat:nth-child(2) { border-right: 0; }
      .stat:nth-child(-n+2) { border-bottom: 1px solid #355963; }
      .stat-value { font-size: 19px; }
      .coverage-note { font-size: 10px; }
      .cards, .panel-grid, .loading { grid-template-columns: 1fr; }
      .pet-card { padding: 12px; }
      .filter-group { grid-template-columns: 1fr; gap: 6px; }
      .game-tip { width: min(300px, calc(100vw - 18px)); }
      .footer { align-items: flex-start; flex-direction: column; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
    /* White, compact data surfaces inspired by PS99RAP. */
    :root {
      color-scheme: light;
      --bg: #f6f7f8;
      --panel: #ffffff;
      --panel-2: #f3f5f6;
      --line: #e3e7e9;
      --muted: #69747d;
      --text: #202a31;
      --cyan: #36a9a0;
      --blue: #3985a7;
      --gold: #b7832c;
      --pink: #9361b1;
      --green: #378667;
      font-family: Arial, Helvetica, system-ui, sans-serif;
    }
    body { color: var(--text); background: #fff; }
    body::before { display: none; }
    .shell { width: min(1200px, calc(100% - 40px)); }
    .topbar { position: relative; height: 62px; border-bottom-color: #e6e9eb; }
    .brand { color: #202a31; gap: 9px; letter-spacing: .01em; font-size: 13px; }
    .brand-mark { width: 31px; height: 31px; border: 0; border-bottom: 2px solid #26877f; border-radius: 5px; color: #fff; background: #43b6ad; font-size: 12px; box-shadow: none; }
    .brand small { color: #738089; font-size: 8px; letter-spacing: .1em; }
    .top-meta { color: #69747d; }
    .live-pill { border-color: #dcece7; border-radius: 5px; color: #327b5d; background: #f0f8f4; letter-spacing: .04em; }
    .live-dot { background: #57a97b; }
    .hero { padding: 27px 0 18px; grid-template-columns: minmax(0, 1fr) 230px; gap: 22px; }
    .eyebrow { color: #568a86; letter-spacing: .1em; font-size: 9px; }
    .eyebrow::before { width: 6px; height: 6px; background: #43b6ad; }
    h1 { margin: 9px 0 8px; color: #202a31; font-size: clamp(27px, 3.3vw, 36px); line-height: 1.12; letter-spacing: -.035em; font-weight: 750; }
    h1 span { color: #299f97; }
    .hero-copy { max-width: 720px; color: #69747d; font-size: 13px; line-height: 1.55; font-weight: 400; }
    .hero-side { padding: 12px 14px; border: 1px solid #e1e6e8; border-left: 3px solid #43b6ad; border-radius: 6px; background: #fff; }
    .side-label, .stat-label, .filter-label { color: #727d85; }
    .release-number { color: #202a31; font-size: 15px; }
    .release-state { color: #378667; }
    .release-time { color: #7d878e; }
    .toolbar { gap: 9px; margin: 4px 0 15px; }
    .searchbox input { height: 46px; border: 1px solid #dfe4e7; border-radius: 6px; color: #25323a; background: #fff; box-shadow: none; font-size: 14px; font-weight: 500; }
    .searchbox input::placeholder { color: #929ca2; }
    .searchbox input:focus { border-color: #55b5ad; box-shadow: 0 0 0 2px rgba(67, 182, 173, .13); }
    .searchbox svg { stroke: #7e8b92; }
    .search-hint { border-color: #e2e6e8; border-radius: 4px; color: #818c92; background: #fafbfb; }
    .refresh-btn, .load-more { border: 1px solid #cfe3df; border-radius: 6px; color: #287e75; background: #f2faf8; box-shadow: none; font-weight: 700; }
    .refresh-btn:hover, .load-more:hover { background: #e8f5f2; transform: none; }
    .stats { gap: 0; overflow: hidden; margin: 0 0 16px; border: 1px solid #e2e6e8; border-radius: 6px; background: #fff; }
    .stat { min-height: 62px; padding: 11px 14px; border: 0; border-right: 1px solid #e8ebed; border-radius: 0; background: #fff; }
    .stat:last-child { border-right: 0; }
    .stat-label { font-size: 9px; letter-spacing: .08em; }
    .stat-value { margin-top: 5px; color: #26323a; font-size: 20px; font-weight: 750; }
    .stat-value.cyan { color: #279e96; }
    .stat-value.gold { color: #a87425; }
    .coverage-note { gap: 9px; padding: 10px 12px; margin-bottom: 18px; border: 1px solid #efe4c4; border-left: 3px solid #d7ae52; border-radius: 5px; color: #615b4a; background: #fffdf7; font-size: 11px; line-height: 1.5; }
    .coverage-note strong { color: #4d493d; }
    .coverage-icon { border-radius: 4px; color: #fff; background: #c99f43; }
    .section-head { margin: 23px 0 11px; }
    .section-title { color: #202a31; font-size: 19px; font-weight: 700; letter-spacing: -.02em; }
    .section-subtitle, .result-count { color: #707c84; }
    .filter-groups { gap: 8px; padding: 10px 11px; margin: 7px 0 12px; border: 1px solid #e3e7e9; border-radius: 6px; background: #fff; }
    .filter-label { font-size: 9px; letter-spacing: .08em; }
    .filters { gap: 5px; }
    .filter-btn { padding: 6px 9px; border: 1px solid #e0e5e7; border-radius: 4px; color: #5e6a72; background: #fff; font-size: 10px; font-weight: 600; transition: background .12s, border-color .12s, color .12s; }
    .filter-btn:hover { border-color: #9ccfc8; color: #267f77; background: #f8fcfb; }
    .filter-btn.active { border-color: #58b5ac; color: #fff; background: #43aaa2; box-shadow: none; }
    [data-kind="titanic"].active { border-color: #c69a44; color: #fff; background: #bd9139; box-shadow: none; }
    [data-kind="gargantuan"].active { border-color: #9871b1; color: #fff; background: #8961a3; box-shadow: none; }
    .cards, .panel-grid, .loading { gap: 10px; }
    .pet-card { padding: 11px; border: 1px solid #e0e5e7; border-top: 2px solid #72b7a2; border-radius: 6px; color: #202a31; background: #fff; box-shadow: none; transition: border-color .12s, background .12s; }
    .pet-card.titanic { border-top-color: #d1aa55; }
    .pet-card.gargantuan { border-top-color: #ad85bd; }
    .pet-card:hover { transform: none; border-color: #c9d6d8; background: #fcfdfd; box-shadow: none; }
    .pet-open { border: 1px solid #edf0f1; border-radius: 0; background: #f7f9f9; box-shadow: none; }
    .pet-open img, .source-thumb img, .modifier-icon img, .modal-source img, .modal-image img, .game-tip-image img { border-radius: 0 !important; }
    .pet-placeholder { color: #4aa49c; }
    .pet-name { color: #26323a; font-size: 13px; font-weight: 700; }
    .pet-name.huge { color: #327e68; }
    .pet-name.titanic { color: #9a7129; text-shadow: none; }
    .pet-name.gargantuan { color: #825b98; text-shadow: none; }
    .pet-kind { margin-top: 5px; padding: 3px 5px; border-radius: 3px; font-size: 8px; letter-spacing: .05em; }
    .pet-kind.huge { color: #31795f; border-color: #d6eadf; background: #f2f8f3; }
    .pet-kind.titanic { color: #8b6827; border-color: #eee1c5; background: #fcf8ed; }
    .pet-kind.gargantuan { color: #805c92; border-color: #e9dff0; background: #f8f4fa; }
    .pet-kind.egg { color: #367b95; border-color: #d9e9ef; background: #f2f8fa; }
    .pet-kind.gift { color: #97722d; border-color: #eee4ce; background: #fbf8f0; }
    .pet-kind.chest { color: #805e95; border-color: #e8e0ed; background: #f7f5f9; }
    .pet-kind.other { color: #5f6e76; border-color: #e1e6e8; background: #f6f8f8; }
    .pool-count { color: #7c878d; }
    .card-divider { margin: 10px 0 7px; background: #eceff0; }
    .source-list { gap: 3px; }
    .source-row { grid-template-columns: 32px minmax(0, 1fr) auto; gap: 7px; padding: 3px; border-radius: 4px; }
    .source-row:hover, .source-row:focus-visible { border-color: #e4edeb; background: #f6faf9; }
    .source-thumb { width: 32px; height: 32px; border: 1px solid #eceff0; border-radius: 0; background: #f8f9f9; }
    .source-thumb img { border-radius: 0; }
    .source-fallback { color: #528e89; }
    .source-name { color: #354149; font-size: 10px; font-weight: 650; }
    .source-status { color: #7d888e; font-size: 9px; }
    .source-odds { color: #258f86; font-size: 11px; }
    .source-odds small { color: #76838a; }
    .more-sources { color: #7a858b; }
    .no-odds { padding: 8px 9px; border-color: #e5e9ea; border-radius: 4px; color: #6b777e; background: #fafbfb; }
    .empty { border-color: #dfe5e7; border-radius: 6px; color: #6f7a81; background: #fff; }
    .empty strong { color: #253139; }
    .modifier-card { min-height: 160px; padding: 13px; border: 1px solid #e0e5e7; border-radius: 6px; background: #fff; box-shadow: none; transition: border-color .12s, background .12s; }
    .modifier-card:hover { transform: none; border-color: #bfdad5; background: #fcfdfd; }
    .modifier-icon { border: 1px solid #e5e9ea; border-radius: 4px; background: #f6f8f8; }
    .modifier-icon span { color: #9166a6; }
    .modifier-name { color: #27333b; }
    .modifier-class { color: #7a6685; }
    .modifier-copy { color: #69757d; }
    .modifier-value { color: #85639a; }
    .unavailable-card { padding: 14px; border: 1px solid #eee4c8; border-left: 3px solid #d2aa4c; border-radius: 5px; background: #fffdf8; }
    .unavailable-icon { border-radius: 4px; color: #fff; background: #c49b43; }
    .unavailable-card h3 { color: #3b4141; }
    .unavailable-card p { color: #726c5d; }
    .unavailable-card strong { color: #8b6c2e; }
    .section-foot { color: #7a858c; }
    .footer { margin-top: 31px; border-top: 1px solid #e5e9ea; color: #737e85; }
    .footer a { color: #258d85; }
    .skeleton { border: 1px solid #e4e8ea; border-radius: 6px; background: #f4f6f7; animation: none; }
    dialog { border: 1px solid #dfe5e7; border-radius: 8px; color: #253139; background: #fff; box-shadow: 0 12px 42px rgba(30, 45, 52, .18); }
    dialog::backdrop { background: rgba(35, 48, 54, .36); backdrop-filter: blur(1px); }
    .modal-head { border-bottom: 1px solid #e5e9ea; }
    .modal-kicker, .modal-odds { color: #258f86; }
    .modal-title { color: #253139; }
    .modal-close { border-color: #e1e6e8; border-radius: 4px; color: #637078; background: #f7f8f8; }
    .modal-content { color: #354149; }
    .modal-image { border: 1px solid #e8ecee; border-radius: 0; background: #f7f9f9; }
    .modal-desc { color: #69757d; }
    .modal-label { color: #758189; }
    .modal-source { border-bottom-color: #e9edef; }
    .modal-source img { border: 1px solid #e9edef; border-radius: 0; background: #f7f9f9; }
    .modal-source-name { color: #344149; }
    .modal-source-sub { color: #7a858c; }
    .game-tip { border: 1px solid #d2dadd; border-radius: 6px; color: #27343b; background: #fff; box-shadow: 0 5px 18px rgba(35, 49, 56, .2); }
    .game-tip.kind-huge { border-color: #8bbca6; }
    .game-tip.kind-titanic { border-color: #cfad5b; }
    .game-tip.kind-gargantuan, .game-tip.kind-enchant { border-color: #ad8cbd; }
    .game-tip-head, .game-tip.kind-huge .game-tip-head, .game-tip.kind-titanic .game-tip-head, .game-tip.kind-gargantuan .game-tip-head, .game-tip.kind-enchant .game-tip-head { border-bottom: 1px solid #e6eaeb; background: #f5f7f7; }
    .game-tip.kind-huge .game-tip-head { background: #eff7f2; }
    .game-tip.kind-titanic .game-tip-head { background: #fbf7ea; }
    .game-tip.kind-gargantuan .game-tip-head, .game-tip.kind-enchant .game-tip-head { background: #f7f2fa; }
    .game-tip-title { color: #26333a; text-shadow: none; }
    .game-tip-rarity { border-color: #dfe5e7; border-radius: 3px; color: #626e75; background: #fff; }
    .game-tip-image { border: 1px solid #e1e6e8; border-radius: 0; background: #f5f7f7; box-shadow: none; }
    .game-tip-image span { color: #4e6268; }
    .game-tip-subtitle { color: #617078; }
    .game-tip-desc { color: #65727a; }
    .game-tip-foot { border-top: 1px solid #e7ebec; background: #fafbfb; }
    .game-tip-line, .game-tip-line strong { color: #344148; }
    .game-tip-line span:first-child { color: #758188; }
    .game-tip-line strong.chance { color: #a17a2e; }
    .game-tip-line strong.gargantuan { color: #845f98; }
    .error-line { color: #a44f4f; background: #fff6f5; border-color: #f0d7d5; }
    .muted { color: #758188; }
    @media (max-width: 900px) { .hero { grid-template-columns: minmax(0, 1fr) 215px; } }
    @media (max-width: 650px) {
      .shell { width: min(100% - 26px, 580px); }
      .topbar { height: 58px; }
      .top-meta { font-size: 9px; }
      .hero { display: block; padding: 22px 0 14px; }
      h1 { font-size: clamp(26px, 8vw, 34px); }
      .hero-copy { font-size: 12px; }
      .hero-side { margin-top: 12px; }
      .toolbar { gap: 7px; }
      .refresh-btn { min-width: 44px; width: 44px; padding: 0; font-size: 0; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .stat:nth-child(2) { border-right: 0; }
      .stat:nth-child(-n+2) { border-bottom: 1px solid #e8ebed; }
      .filter-group { grid-template-columns: 1fr; gap: 5px; }
      .cards, .panel-grid, .loading { grid-template-columns: 1fr; }
      .pet-card { padding: 10px; }
      .game-tip { width: min(300px, calc(100vw - 18px)); }
    }
    /* Dark pet index styling based on the supplied Cosmic Values reference. */
    :root {
      color-scheme: dark;
      --bg: #08090d;
      --panel: #12131a;
      --panel-2: #1a1726;
      --line: #292932;
      --muted: #aaa6bb;
      --text: #f4f1ff;
      --cyan: #70c9d8;
      --blue: #769ae8;
      --gold: #f1c654;
      --pink: #c49afd;
      --green: #6ad5a8;
      font-family: Arial, Helvetica, system-ui, sans-serif;
    }
    body { color: var(--text); background: radial-gradient(ellipse at 50% -18%, #302743 0, #12131a 36rem, #08090d 72rem); }
    body::before { display: none; }
    .shell { width: min(1480px, calc(100% - 48px)); }
    .topbar { display: none; }
    .hero { padding: 17px 0 18px; grid-template-columns: minmax(0, 1fr) 245px; gap: 24px; align-items: end; }
    .eyebrow { color: #a99ac8; font-size: 9px; letter-spacing: .12em; }
    .eyebrow::before { width: 5px; height: 5px; background: #bd91ff; }
    h1 { margin: 0 0 5px; color: #fff; font-size: clamp(34px, 4.4vw, 44px); font-weight: 760; line-height: 1.08; letter-spacing: -.04em; }
    h1 span { color: #d4c5ff; }
    .hero-copy { max-width: 780px; color: #cfccd8; font-size: 13px; line-height: 1.48; }
    .hero-side { padding: 9px 12px; border: 1px solid #393348; border-left: 3px solid #a77cf0; border-radius: 9px; background: rgba(20, 18, 29, .88); }
    .side-label, .stat-label, .filter-label { color: #aaa5b8; }
    .release-number { color: #fff; font-size: 14px; }
    .release-state { color: #8bd8b9; }
    .release-time { color: #aaa6b6; font-size: 10px; }
    .atlas-layout { display: grid; grid-template-columns: 188px minmax(0, 1fr); gap: 24px; align-items: start; }
    .filter-groups { position: sticky; top: 14px; display: flex; flex-direction: column; gap: 15px; min-width: 0; padding: 0; margin: 0; border: 0; background: transparent; }
    .filter-group { display: block; min-width: 0; }
    .filter-label { display: block; margin: 0 0 6px; font-size: 9px; font-weight: 800; letter-spacing: .1em; }
    .filters { display: flex; flex-direction: column; gap: 6px; overflow: visible; }
    .filter-btn { width: 100%; min-height: 35px; padding: 8px 12px; border: 1px solid #363340; border-radius: 9px; color: #f0edf8; background: linear-gradient(180deg, #1c1928, #14131c); text-align: left; font-size: 12px; font-weight: 700; transition: border-color .14s, background .14s, box-shadow .14s; }
    .filter-btn:hover { border-color: #8665bc; color: #fff; background: #242030; }
    .filter-btn.active { border-color: #c7a7ff; color: #fff; background: linear-gradient(180deg, #c09aff, #8b64d2); box-shadow: 0 0 15px rgba(168, 126, 238, .22); }
    [data-kind="titanic"].active { border-color: #e6c76c; color: #fff; background: linear-gradient(180deg, #b58a4a, #80602d); }
    [data-kind="huge"].active { border-color: #8ad3bd; color: #fff; background: linear-gradient(180deg, #61a98b, #36765f); }
    [data-tab="egg"].active { border-color: #73bce2; background: linear-gradient(180deg, #5295b9, #326a8e); }
    .atlas-main { min-width: 0; }
    .toolbar { gap: 10px; margin: 2px 0 10px; }
    .searchbox input { height: 47px; padding: 0 48px; border: 1px solid #514566; border-radius: 14px; color: #fff; background: linear-gradient(180deg, #221d30, #171420); box-shadow: inset 0 1px rgba(255,255,255,.04); font-size: 14px; font-weight: 600; }
    .searchbox input::placeholder { color: #c4b7dc; }
    .searchbox input:focus { border-color: #ba91ff; box-shadow: 0 0 0 2px rgba(171, 126, 239, .2); }
    .searchbox svg { stroke: #d3c6f3; }
    .search-hint { border-color: #594b70; border-radius: 4px; color: #d4c9e7; background: #211b2a; }
    .refresh-btn { height: 47px; min-width: 104px; border: 1px solid #4b3c62; border-radius: 9px; color: #e7ddfa; background: #211b2d; }
    .refresh-btn:hover { border-color: #9872d0; background: #2b223b; transform: none; }
    .toolbar-options { display: flex; align-items: center; gap: 10px; min-height: 39px; margin: 0 0 8px; }
    .variant-select { display: flex; align-items: center; gap: 8px; }
    .variant-select .filter-label { margin: 0; white-space: nowrap; }
    .variant-select select { min-width: 158px; height: 36px; padding: 0 32px 0 11px; border: 1px solid #3a3745; border-radius: 7px; color: #f4f0fb; background: #191720; font: inherit; font-size: 11px; font-weight: 700; }
    .variant-select select:focus { outline: 2px solid #956dc8; outline-offset: 1px; }
    .variant-note { color: #898496; font-size: 9px; }
    .stats { display: flex; align-items: center; justify-content: flex-end; gap: 17px; margin: 0 0 8px; padding: 0; border: 0; background: transparent; overflow: visible; }
    .stat { min-height: auto; padding: 2px 0; border: 0; background: transparent; }
    .stat-label { font-size: 8px; letter-spacing: .08em; }
    .stat-value { margin-top: 3px; color: #eee9fa; font-size: 15px; font-weight: 750; }
    .stat-value.cyan { color: #82d2e0; }
    .stat-value.gold { color: #e8c55d; }
    .coverage-note { gap: 8px; padding: 8px 10px; margin-bottom: 12px; border: 1px solid #39333f; border-left: 2px solid #b796e8; border-radius: 6px; color: #b9b4c4; background: rgba(22, 19, 28, .74); font-size: 10px; line-height: 1.45; }
    .coverage-note strong { color: #e0d5f5; }
    .coverage-icon { width: 18px; height: 18px; flex-basis: 18px; border-radius: 5px; color: #21192c; background: #bfa1ed; font-size: 11px; }
    .section-head { margin: 13px 0 9px; align-items: center; }
    .section-title { color: #f3effb; font-size: 18px; font-weight: 750; letter-spacing: -.02em; }
    .section-subtitle, .result-count { color: #a39eae; font-size: 10px; }
    .cards, .panel-grid, .loading { gap: 11px; }
    .cards { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .pet-card { min-width: 0; padding: 9px; border: 1px solid #292a33; border-radius: 14px; color: #f0edf8; background: linear-gradient(180deg, #15161e, #111219); box-shadow: 0 4px 12px rgba(0,0,0,.14); transition: border-color .15s, background .15s; }
    .pet-card:hover { transform: none; border-color: #49435c; background: linear-gradient(180deg, #191922, #12131a); box-shadow: 0 8px 22px rgba(0,0,0,.2); }
    .pet-open { display: block; width: 100%; height: 136px; padding: 0; border: 0; border-radius: 0; overflow: visible; background: transparent; box-shadow: none; cursor: pointer; }
    .pet-open:hover img { transform: scale(1.035); }
    .pet-art { position: relative; width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; border: 1px dashed #5794aa; border-radius: 12px; background: radial-gradient(ellipse at 26% 22%, #604e8a, #222440 61%, #172a3a); box-shadow: inset 0 0 20px rgba(123, 100, 187, .16); }
    .pet-art-image { position: relative; z-index: 1; display: block; width: min(66%, 104px); height: min(76%, 104px); object-fit: contain; border: 2px solid #07080c; border-radius: 0 !important; background: #dce5ed; box-shadow: 0 4px 13px rgba(0,0,0,.45); transition: transform .16s, filter .16s; }
    .pet-art .pet-placeholder { position: relative; z-index: 1; width: min(66%, 104px); height: min(76%, 104px); display: grid; place-items: center; border: 2px solid #07080c; color: #201d28; background: #dce5ed; font-size: 27px; }
    .pet-art-modal { width: 96px; height: 88px; flex: 0 0 96px; }
    .pet-art-row { width: 32px; height: 30px; }
    .game-tip-image .pet-art { width: 72px; height: 72px; border-radius: 4px; }
    .game-tip-image .pet-art-image, .game-tip-image .pet-art .pet-placeholder { width: 48px; height: 54px; }
    .pet-art-row .pet-art-image, .pet-art-row .pet-placeholder { width: 24px; height: 24px; }
    .pet-art.variant-gold, .pet-art.variant-shiny-gold { border-color: #e7c65a; background: radial-gradient(ellipse at 25% 20%, #876e3e, #392e25 62%, #211c19); box-shadow: inset 0 0 21px rgba(255, 208, 72, .19), 0 0 12px rgba(227, 189, 70, .13); }
    .pet-art.variant-fallback .pet-art-image { filter: sepia(1) saturate(2) hue-rotate(350deg) brightness(1.06); }
    .pet-art.variant-rainbow, .pet-art.variant-shiny-rainbow { border-color: #b17cf0; background: radial-gradient(ellipse at 20% 18%, #774f9d, #242443 62%, #17283a); box-shadow: inset 0 0 19px rgba(197, 123, 246, .2), 0 0 13px rgba(141, 108, 222, .13); }
    .pet-art.variant-rainbow::before, .pet-art.variant-shiny-rainbow::before { position: absolute; z-index: 2; inset: 0; content: ""; pointer-events: none; background: linear-gradient(118deg, rgba(255,62,105,.42), rgba(255,198,67,.30) 22%, rgba(117,255,106,.32) 44%, rgba(78,196,255,.38) 67%, rgba(208,95,255,.4)); mix-blend-mode: color; opacity: .7; }
    .pet-art.variant-rainbow .pet-art-image, .pet-art.variant-shiny-rainbow .pet-art-image { filter: saturate(1.25) contrast(1.03); }
    .pet-art.variant-shiny::after, .pet-art.variant-shiny-gold::after, .pet-art.variant-shiny-rainbow::after { position: absolute; z-index: 3; inset: -30%; content: ""; pointer-events: none; background: radial-gradient(circle at 25% 30%, rgba(255,255,255,.95) 0 1px, transparent 3px), radial-gradient(circle at 72% 22%, rgba(255,245,196,.95) 0 1.5px, transparent 4px), radial-gradient(circle at 69% 76%, rgba(255,255,255,.9) 0 1px, transparent 3px), linear-gradient(112deg, transparent 37%, rgba(255,255,255,.36) 49%, transparent 57%); mix-blend-mode: screen; opacity: .68; animation: pet-shimmer 3.6s ease-in-out infinite; }
    .pet-art.variant-shiny, .pet-art.variant-shiny-gold, .pet-art.variant-shiny-rainbow { box-shadow: inset 0 0 22px rgba(255,255,255,.16), 0 0 15px rgba(180,153,255,.18); }
    @keyframes pet-shimmer { 0%, 20% { transform: translateX(-13%) rotate(-5deg); opacity: .18; } 55% { opacity: .72; } 100% { transform: translateX(13%) rotate(5deg); opacity: .25; } }
    .pet-title-wrap { min-width: 0; margin-top: 8px; }
    .pet-name { margin: 0; overflow: hidden; color: #f5f1fb; font-size: 12px; font-weight: 750; line-height: 1.28; letter-spacing: -.01em; text-overflow: ellipsis; white-space: nowrap; }
    .pet-name.huge, .pet-name.titanic, .pet-name.gargantuan { color: #f5f1fb; text-shadow: none; }
    .pet-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; min-width: 0; }
    .pet-kind { margin: 0; padding: 0; border: 0 !important; border-radius: 0; color: #aaa5b7 !important; background: transparent !important; font-size: 8px; font-weight: 750; letter-spacing: .04em; }
    .variant-label { overflow: hidden; color: #b6abc9; font-size: 8px; font-weight: 750; text-overflow: ellipsis; white-space: nowrap; }
    .pool-count { overflow: hidden; margin-left: auto; color: #8d889a; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
    .card-divider { height: 1px; margin: 7px 0 6px; background: #282933; }
    .source-list { display: grid; gap: 2px; }
    .source-row { grid-template-columns: 27px minmax(0, 1fr) auto; gap: 6px; padding: 3px; border-radius: 5px; }
    .source-row:hover, .source-row:focus-visible { border-color: #393347; background: #1a1921; }
    .source-thumb { width: 27px; height: 27px; border: 1px solid #30303a; border-radius: 4px; background: #1b1b24; }
    .source-thumb img { border-radius: 2px; }
    .source-fallback { color: #b99ae6; }
    .source-name { color: #e8e3f1; font-size: 9px; font-weight: 650; }
    .source-status { color: #9691a1; font-size: 8px; }
    .source-odds { color: #d8cbf2; font-size: 9px; }
    .source-odds small { color: #9b95a8; font-size: 8px; }
    .more-sources { color: #928ba0; font-size: 8px; }
    .no-odds { padding: 8px; border: 1px dashed #373541; border-radius: 6px; color: #aaa5b5; background: #17171e; font-size: 9px; }
    .no-odds strong { display: block; margin-bottom: 2px; color: #ded6eb; font-size: 9px; }
    .no-odds span { color: #9691a1; font-size: 8px; }
    .empty { border: 1px dashed #40394d; border-radius: 10px; color: #bcb5ca; background: #13131a; }
    .empty strong { color: #f2edfb; }
    .load-more { border: 1px solid #4b3c62; border-radius: 8px; color: #e7ddfa; background: #211b2d; }
    .load-more:hover { background: #2b223b; }
    .modifier-card { min-height: 150px; padding: 12px; border: 1px solid #302d3a; border-radius: 11px; background: #14141b; }
    .modifier-card:hover { transform: none; border-color: #73559b; background: #1a1822; }
    .modifier-icon { border: 1px solid #40364f; border-radius: 8px; background: #231d30; }
    .modifier-name { color: #f3effa; }
    .modifier-class { color: #ba9be0; }
    .modifier-copy { color: #b4afbd; }
    .modifier-value { color: #d2b5ff; }
    .unavailable-card { border: 1px solid #51442d; border-left: 3px solid #d4af52; border-radius: 8px; color: #eee3c3; background: #211d18; }
    .unavailable-icon { color: #f1d67d; background: #3b3020; }
    .unavailable-card p { color: #c4b99c; }
    .unavailable-card strong { color: #f4dd9a; }
    .section-foot { color: #8f8a9b; font-size: 9px; }
    .footer { margin-top: 24px; border-top: 1px solid #292932; color: #8e8999; }
    .footer a { color: #c1a4ef; }
    .skeleton { border: 1px solid #2a2932; border-radius: 13px; background: linear-gradient(100deg, #15151d 25%, #20202a 38%, #15151d 62%); background-size: 400% 100%; animation: shimmer 1.8s ease infinite; }
    dialog { border: 1px solid #51465e; border-radius: 13px; color: #f1eef8; background: #14141b; box-shadow: 0 24px 70px rgba(0,0,0,.72); }
    dialog::backdrop { background: rgba(3, 3, 7, .78); backdrop-filter: blur(4px); }
    .modal-head { border-bottom-color: #302d38; }
    .modal-kicker, .modal-odds { color: #d3b6ff; }
    .modal-title { color: #faf8ff; }
    .modal-close { border-color: #423b4d; color: #d8d1e5; background: #201d28; }
    .modal-content { color: #ebe6f2; }
    .modal-image { display: grid; place-items: center; border: 1px solid #302d38; border-radius: 10px; background: #191821; }
    .modal-desc { color: #c0bbc9; }
    .modal-label { color: #a69eaf; }
    .modal-source { border-bottom-color: #302d38; }
    .modal-source img { border-color: #36323f; border-radius: 4px; background: #201d28; }
    .modal-source-name { color: #ebe6f2; }
    .modal-source-sub { color: #9b95a5; }
    .game-tip { border: 1px solid #a489c9; border-radius: 5px; color: #f5f2fa; background: linear-gradient(150deg,#262233,#14141b 72%); box-shadow: 0 8px 25px rgba(0,0,0,.65); }
    .game-tip.kind-huge { border-color: #73c3a3; }
    .game-tip.kind-titanic { border-color: #e5c15e; }
    .game-tip.kind-gargantuan, .game-tip.kind-enchant { border-color: #bb8bec; }
    .game-tip-head, .game-tip.kind-huge .game-tip-head, .game-tip.kind-titanic .game-tip-head, .game-tip.kind-gargantuan .game-tip-head, .game-tip.kind-enchant .game-tip-head { border-bottom-color: rgba(255,255,255,.1); background: #282334; }
    .game-tip.kind-huge .game-tip-head { background: #205541; }
    .game-tip.kind-titanic .game-tip-head { background: #6b5425; }
    .game-tip.kind-gargantuan .game-tip-head, .game-tip.kind-enchant .game-tip-head { background: #57367a; }
    .game-tip-title { color: #fff; text-shadow: 0 1px 2px #14121b; }
    .game-tip-rarity { border-color: rgba(255,255,255,.2); color: #fff; background: rgba(0,0,0,.28); }
    .game-tip-image { border: 1px solid rgba(255,255,255,.14); border-radius: 4px; background: #303043; }
    .game-tip-subtitle { color: #e3ddec; }
    .game-tip-desc { color: #c5bfce; }
    .game-tip-foot { border-top-color: rgba(255,255,255,.1); background: rgba(0,0,0,.18); }
    .game-tip-line, .game-tip-line strong { color: #eee9f4; }
    .game-tip-line span:first-child { color: #aaa2b4; }
    .game-tip-line strong.chance { color: #ffe394; }
    .game-tip-line strong.gargantuan { color: #e1c1ff; }
    .error-line { color: #ffc8ce; background: #27181e; border-color: #57313c; }
    .muted { color: #aaa3b2; }
    @media (max-width: 1180px) { .cards { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    @media (max-width: 960px) { .atlas-layout { grid-template-columns: 165px minmax(0, 1fr); gap: 17px; } .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); } .hero { grid-template-columns: minmax(0, 1fr) 220px; } }
    @media (max-width: 840px) {
      .atlas-layout { display: block; }
      .filter-groups { position: static; display: grid; grid-template-columns: 1fr; gap: 10px; margin: 0 0 12px; padding: 10px; border: 1px solid #302d38; border-radius: 10px; background: #13131a; }
      .filters { flex-direction: row; overflow-x: auto; gap: 5px; padding-bottom: 2px; }
      .filter-btn { width: auto; min-height: 31px; flex: 0 0 auto; padding: 6px 9px; font-size: 10px; }
      .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      .shell { width: min(100% - 28px, 620px); }
      .hero { display: block; padding: 16px 0 14px; }
      h1 { font-size: clamp(32px, 8vw, 42px); }
      .hero-side { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; padding: 8px 10px; }
      .release-line { margin: 0; }
      .release-time { margin: 0; }
      .atlas-layout { display: block; }
      .filter-groups { position: static; display: grid; grid-template-columns: 1fr; gap: 10px; margin: 0 0 12px; padding: 10px; border: 1px solid #302d38; border-radius: 10px; background: #13131a; }
      .filter-group { display: block; }
      .filters { flex-direction: row; overflow-x: auto; gap: 5px; padding-bottom: 2px; }
      .filter-btn { width: auto; min-height: 31px; flex: 0 0 auto; padding: 6px 9px; font-size: 10px; }
      .toolbar { gap: 7px; }
      .refresh-btn { min-width: 43px; width: 43px; padding: 0; font-size: 0; }
      .toolbar-options { justify-content: space-between; }
      .variant-select { gap: 6px; }
      .variant-select select { min-width: 138px; }
      .stats { justify-content: space-between; gap: 7px; }
      .stat-label { font-size: 7px; }
      .stat-value { font-size: 13px; }
      .coverage-note { margin-bottom: 10px; }
      .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
      .pet-card { padding: 7px; border-radius: 11px; }
      .pet-open { height: 120px; }
      .pet-title-wrap { margin-top: 7px; }
      .pet-name { font-size: 11px; }
      .source-row { grid-template-columns: 24px minmax(0, 1fr) auto; gap: 4px; }
      .source-thumb { width: 24px; height: 24px; }
      .source-name { font-size: 8px; }
      .source-odds { font-size: 8px; }
    }
    @media (max-width: 410px) { .cards { grid-template-columns: 1fr; } .pet-open { height: 150px; } .stats { flex-wrap: wrap; } .variant-note { display: none; } }
    @media (prefers-reduced-motion: reduce) { .pet-art.variant-shiny::after, .pet-art.variant-shiny-gold::after, .pet-art.variant-shiny-rainbow::after { animation: none; } }
    /* Icon-only pet catalog with 3 / 5 / 8 type-specific columns. */
    .cards.pet-catalog { grid-template-columns: repeat(120, minmax(0, 1fr)); gap: 0; align-items: start; }
    .cards.pet-catalog[data-kind="gargantuan"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .cards.pet-catalog[data-kind="titanic"] { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .cards.pet-catalog[data-kind="huge"] { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .cards.pet-catalog[data-kind="all"] .pet-card.gargantuan { grid-column: span 40; }
    .cards.pet-catalog[data-kind="all"] .pet-card.titanic { grid-column: span 24; }
    .cards.pet-catalog[data-kind="all"] .pet-card.huge { grid-column: span 15; }
    .cards.pet-catalog[data-kind="all"] .pet-card.pet-group-start { grid-column-start: 1; }
    .cards.pet-catalog .empty { grid-column: 1 / -1; margin: 0; }
    .cards.pet-catalog .pet-card { min-width: 0; margin: 0 5px 12px; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
    .cards.pet-catalog .pet-card:hover { border: 0; background: transparent; box-shadow: none; }
    .pet-open { display: grid; width: 100%; height: auto; aspect-ratio: 1; place-items: center; padding: 0; border: 0; border-radius: 0; overflow: visible; background: transparent; box-shadow: none; cursor: pointer; }
    .pet-open:hover img { transform: none; }
    .pet-open:focus-visible .pet-visual { filter: drop-shadow(0 0 5px rgba(255,255,255,.8)); }
    .pet-art, .game-tip-image .pet-art { position: relative; display: grid; width: 100%; height: 100%; place-items: center; overflow: visible; border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }
    .pet-art.variant-gold, .pet-art.variant-shiny-gold, .pet-art.variant-rainbow, .pet-art.variant-shiny-rainbow, .pet-art.variant-shiny { border: 0 !important; background: transparent !important; box-shadow: none !important; }
    .pet-art.variant-rainbow::before, .pet-art.variant-shiny-rainbow::before, .pet-art.variant-shiny::after, .pet-art.variant-shiny-gold::after, .pet-art.variant-shiny-rainbow::after { display: none !important; content: none !important; }
    .pet-visual { position: relative; display: grid; width: 100%; height: 100%; place-items: center; overflow: hidden; }
    .pet-card.gargantuan .pet-visual { width: 100%; height: 100%; }
    .pet-card.titanic .pet-visual { width: 82%; height: 82%; }
    .pet-card.huge .pet-visual { width: 66%; height: 66%; }
    .game-tip.kind-gargantuan .pet-visual { width: 100%; height: 100%; }
    .game-tip.kind-titanic .pet-visual { width: 82%; height: 82%; }
    .game-tip.kind-huge .pet-visual { width: 66%; height: 66%; }
    .pet-card .pet-art-image, .game-tip .pet-art-image { position: relative; z-index: 1; display: block; width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100% !important; object-fit: contain; border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; transition: filter .16s; }
    .pet-art .pet-placeholder { position: relative; z-index: 1; width: 100%; height: 100%; display: grid; place-items: center; border: 0; color: #eee8ff; background: transparent; font-size: clamp(18px, 3vw, 38px); }
    .pet-art.variant-fallback .pet-art-image { filter: sepia(1) saturate(2) hue-rotate(350deg) brightness(1.06); }
    .pet-art.variant-rainbow .pet-art-image { filter: saturate(1.45) contrast(1.05); }
    .pet-art.variant-shiny .pet-art-image, .pet-art.variant-shiny-gold .pet-art-image { filter: saturate(1.35) brightness(1.13) drop-shadow(0 0 8px rgba(255,239,170,.55)); }
    .pet-art.variant-shiny-rainbow .pet-art-image { filter: saturate(1.6) contrast(1.08) drop-shadow(0 0 8px rgba(218,162,255,.42)); }
    .pet-effect-rainbow, .pet-effect-stripes, .pet-effect-sweep { position: absolute; pointer-events: none; }
    .pet-effect-rainbow { z-index: 2; top: 0; bottom: 0; left: 0; width: 200%; display: none; opacity: .29; mix-blend-mode: color; background: linear-gradient(90deg, #ff244d 0%, #ff9e22 7.14%, #ffeb36 14.28%, #48ef49 21.42%, #1de2e9 28.56%, #367bff 35.7%, #c32cff 42.84%, #ff244d 50%, #ff9e22 57.14%, #ffeb36 64.28%, #48ef49 71.42%, #1de2e9 78.56%, #367bff 85.7%, #c32cff 92.84%, #ff244d 100%); animation: pet-rainbow-loop 38s linear infinite; }
    .pet-art.variant-rainbow .pet-effect-rainbow, .pet-art.variant-shiny-rainbow .pet-effect-rainbow { display: block; }
    .pet-effect-stripes { z-index: 3; inset: 0; display: none; opacity: .24; mix-blend-mode: screen; background: repeating-linear-gradient(112deg, transparent 0 8px, rgba(255,255,255,.26) 9px 10px, transparent 11px 21px), radial-gradient(circle at 22% 26%, rgba(255,255,255,.6) 0 1px, transparent 3px), radial-gradient(circle at 73% 66%, rgba(255,255,255,.45) 0 1px, transparent 3px); }
    .pet-art.variant-shiny .pet-effect-stripes, .pet-art.variant-shiny-gold .pet-effect-stripes, .pet-art.variant-shiny-rainbow .pet-effect-stripes { display: block; }
    .pet-effect-sweep { z-index: 4; top: -55%; left: -95%; width: 72%; height: 210%; display: none; opacity: .8; transform: translateX(0) rotate(-9deg); mix-blend-mode: screen; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.16) 34%, rgba(255,255,255,.94) 50%, rgba(255,255,255,.22) 66%, transparent 100%); }
    .pet-art.variant-shiny .pet-effect-sweep, .pet-art.variant-shiny-gold .pet-effect-sweep, .pet-art.variant-shiny-rainbow .pet-effect-sweep { display: block; animation: pet-shine-sweep 1.05s linear infinite; }
    .game-tip { width: min(720px, calc(100vw - 20px)); max-height: min(760px, calc(100vh - 16px)); overflow-y: auto; overscroll-behavior: contain; pointer-events: auto; scrollbar-color: #655477 #211c2b; scrollbar-width: thin; }
    .game-tip-body { grid-template-columns: 166px minmax(0, 1fr); align-items: start; gap: 14px; padding: 14px; }
    .game-tip-image { width: 100%; height: auto; aspect-ratio: 1; overflow: visible; }
    .game-tip-image .pet-art { width: 100%; height: 100%; }
    .game-tip .pet-art-image, .game-tip .pet-art .pet-placeholder { width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100% !important; }
    .game-tip.kind-gargantuan .game-tip-body { grid-template-columns: 200px minmax(0, 1fr); }
    .game-tip.kind-titanic .game-tip-body { grid-template-columns: 166px minmax(0, 1fr); }
    .game-tip.kind-huge .game-tip-body { grid-template-columns: 132px minmax(0, 1fr); }
    .game-tip-foot { gap: 8px; padding: 12px 14px; }
    .game-tip-line { gap: 14px; font-size: 11px; }
    .game-tip-line span:first-child { flex: 1 1 auto; white-space: normal; }
    .game-tip-line strong { font-size: 12px; }
    .game-tip-subtitle { margin: 0; }
    .game-tip-source-line { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 14px; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.09); }
    .game-tip-source-main { min-width: 0; display: flex; align-items: center; gap: 9px; }
    .game-tip-source-thumb { width: 32px; height: 32px; flex: 0 0 32px; display: grid; place-items: center; overflow: hidden; border: 1px solid rgba(255,255,255,.14); border-radius: 4px; background: rgba(0,0,0,.14); }
    .game-tip-source-icon { width: 100%; height: 100%; object-fit: contain; }
    .game-tip-source-copy { min-width: 0; display: grid; gap: 3px; }
    .game-tip-source-copy strong { color: #f4efff; font-size: 11px; font-weight: 750; overflow-wrap: anywhere; }
    .game-tip-source-copy small { color: #aaa2b4; font-size: 9px; line-height: 1.4; }
    .game-tip-source-odds { color: #ffe394; text-align: right; font-size: 11px; font-weight: 850; }
    .game-tip-meta-note { color: #bdb4ce; font-size: 10px; line-height: 1.4; }
    @keyframes pet-rainbow-loop { to { transform: translateX(-50%); } }
    @keyframes pet-shine-sweep { to { transform: translateX(480%) rotate(-9deg); } }
    @media (max-width: 840px) { .game-tip { width: min(680px, calc(100vw - 20px)); } }
    @media (max-width: 720px) { .game-tip { width: min(620px, calc(100vw - 18px)); } .game-tip.kind-gargantuan .game-tip-body, .game-tip.kind-titanic .game-tip-body, .game-tip.kind-huge .game-tip-body { grid-template-columns: 112px minmax(0, 1fr); } }
    @media (max-width: 410px) { .game-tip-body { grid-template-columns: 94px minmax(0, 1fr); gap: 9px; padding: 10px; } .game-tip-source-line { gap: 7px; } .game-tip-source-odds { font-size: 10px; } }
    @media (prefers-reduced-motion: reduce) { .pet-effect-rainbow, .pet-effect-sweep { animation: none !important; } }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="PS99 Odds Atlas home">
        <span class="brand-mark">99</span>
        <span>ODDS ATLAS<small>PET SIMULATOR 99</small></span>
      </a>
      <div class="top-meta">
        <span class="data-source">BIG Games public game data</span>
        <span class="live-pill" id="livePill"><i class="live-dot"></i><span>Connecting</span></span>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div>
          <div class="eyebrow">PS99 odds reference</div>
          <h1>Rare pets.<br><span>Odds &amp; sources.</span></h1>
          <p class="hero-copy">Look up Huge, Titanic, and Gargantuan pets, their egg pools, and the items that can award them. Exact rates appear when the game publishes the weights.</p>
        </div>
        <aside class="hero-side" aria-label="Latest game data update">
          <div class="side-label">Latest game data</div>
          <div class="release-line"><span class="release-number" id="releaseNumber">Checking…</span><span class="release-state" id="releaseState">Live feed</span></div>
          <div class="release-time" id="releaseTime">Waiting for the public API</div>
        </aside>
      </section>
      <div class="atlas-layout">
        <aside class="filter-groups" id="sourceFilters" aria-label="Catalog filters">
          <div class="filter-group"><span class="filter-label">PET TYPE</span><nav class="filters" aria-label="Filter by pet type">
            <button class="filter-btn active" type="button" data-kind="all" id="allKindFilter">All rare pets</button>
            <button class="filter-btn" type="button" data-kind="gargantuan" id="gargantuanKindFilter">Gargantuan</button>
            <button class="filter-btn" type="button" data-kind="titanic" id="titanicKindFilter">Titanic</button>
            <button class="filter-btn" type="button" data-kind="huge" id="hugeKindFilter">Huge</button>
          </nav></div>
          <div class="filter-group"><span class="filter-label">SOURCE</span><nav class="filters" aria-label="Filter by source">
            <button class="filter-btn active" type="button" data-tab="all">All sources</button>
            <button class="filter-btn" type="button" data-tab="active">Active Huges</button>
            <button class="filter-btn" type="button" data-tab="egg">Eggs</button>
            <button class="filter-btn" type="button" data-tab="gift">Gift bags</button>
            <button class="filter-btn" type="button" data-tab="chest">Chests &amp; drops</button>
            <button class="filter-btn" type="button" data-tab="other">Other</button>
            <button class="filter-btn" type="button" data-tab="enchant">Enchants</button>
            <button class="filter-btn" type="button" data-tab="extras">Rewards &amp; boosts</button>
          </nav></div>
        </aside>
        <div class="atlas-main">
          <div class="toolbar">
            <label class="searchbox">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>
              <input id="search" type="search" autocomplete="off" placeholder="Search for a pet or odds source…" aria-label="Search pets and odds sources">
              <span class="search-hint">/</span>
            </label>
            <button class="refresh-btn" id="refresh" type="button" aria-label="Refresh game data" title="Refresh now">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"></path><path d="M5.5 9a7 7 0 0 1 11.8-2L20 12M4 12l2.7 5a7 7 0 0 0 11.8-2"></path></svg>
              Refresh
            </button>
          </div>
          <div class="toolbar-options">
            <label class="variant-select"><span class="filter-label">PET VARIANT</span><select id="variantSelect" aria-label="Pet icon variant">
              <option value="normal">Normal</option>
              <option value="gold">Gold</option>
              <option value="rainbow">Rainbow</option>
              <option value="shiny">Shiny</option>
              <option value="shiny-gold">Shiny Gold</option>
              <option value="shiny-rainbow">Shiny Rainbow</option>
            </select></label>
            <span class="variant-note">Visual preview only · odds remain at the base rate</span>
          </div>
          <section class="stats" aria-label="Tracker overview">
            <div class="stat"><div class="stat-label">Rare pets</div><div class="stat-value cyan" id="statPets">—</div></div>
            <div class="stat"><div class="stat-label">Weighted pools</div><div class="stat-value" id="statPools">—</div></div>
            <div class="stat"><div class="stat-label">Gift pools</div><div class="stat-value gold" id="statGifts">—</div></div>
            <div class="stat"><div class="stat-label">Luck modifiers</div><div class="stat-value" id="statModifiers">—</div></div>
          </section>
          <div class="coverage-note" role="note">
            <span class="coverage-icon">i</span>
            <span><strong>Rates use the published pool weights.</strong> Exclusive Eggs are left out. The game feed can retain old timed sources and often does not mark them inactive, so those entries are labeled unconfirmed. When a source mentions a pet but publishes no rate, it stays listed without a guessed percentage.</span>
          </div>
          <section class="catalog-section" aria-labelledby="catalogTitle">
            <div class="section-head">
              <div><h2 class="section-title" id="catalogTitle">Pet index</h2><p class="section-subtitle" id="catalogSubtitle">Loading the latest game config…</p></div>
              <span class="result-count" id="resultCount"></span>
            </div>
            <div id="errorBox"></div>
            <div class="cards" id="cards" aria-live="polite"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
            <button class="load-more" id="loadMore" type="button" hidden>Show more pets</button>
            <div class="source-panel" id="specialPanel"></div>
            <p class="section-foot" id="dataFoot"></p>
          </section>
        </div>
      </div>
    </main>

    <footer class="footer">
      <span>Odds Atlas is a fan-made reference. Pet Simulator 99 and its assets belong to BIG Games.</span>
      <span>Data: <a href="https://ps99.biggamesapi.io/" target="_blank" rel="noreferrer">BIG Games API</a> · <span id="lastChecked">Not synced yet</span></span>
    </footer>
  </div>

  <dialog id="detailModal" aria-labelledby="modalTitle">
    <div class="modal-head"><div><div class="modal-kicker" id="modalKicker">Odds details</div><h2 class="modal-title" id="modalTitle">Details</h2></div><button class="modal-close" id="closeModal" type="button" aria-label="Close details">×</button></div>
    <div class="modal-content" id="modalContent"></div>
  </dialog>
  <div id="gameTip" class="game-tip" role="tooltip" hidden></div>

  <script>
    const state = { pools: [], pets: [], modifiers: [], otherSources: [], missingChests: [], thumbs: {}, thumbMisses: new Set(), thumbPending: new Set(), thumbIndex: null, petIndex: new Map(), poolIndex: new Map(), modifierIndex: new Map(), otherSourceIndex: new Map(), filterCacheKey: null, filteredPets: null, tab: "all", kind: "all", variant: "normal", query: "", showLimit: 18, data: null, lastChecked: null, busy: false };
    const apiCacheKey = "ps99-odds-atlas-cache-v2";
    const recentDays = 60;
    const pageSize = 18;
    let activeGameTip = null;
    let searchTimer = 0;
    let searchWorker = null;
    let searchWorkerUrl = "";
    let searchRequestId = 0;
    let searchPendingKey = "";
    const $ = (id) => document.getElementById(id);

    function esc(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch) { return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]; });
    }
    function assetId(value) {
      const match = String(value || "").match(/(\d{5,})/);
      return match ? match[1] : "";
    }
    function readData(result) { return result && result.status === "ok" ? result.data : null; }
    function asArray(value) { return Array.isArray(value) ? value : []; }
    function parseApiDate(value) { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date : null; }
    function ageInDays(value) {
      const date = parseApiDate(value);
      if (!date) return Infinity;
      return Math.max(0, (Date.now() - date.getTime()) / 86400000);
    }
    function labelKind(name, pet) {
      const config = pet && pet.configData ? pet.configData : {};
      if (config.gargantuan || /gargantuan/i.test(name)) return "Gargantuan";
      if (config.titanic || /titanic/i.test(name)) return "Titanic";
      return "Huge";
    }
    function isRarePet(pet) {
      const config = pet && pet.configData ? pet.configData : {};
      const name = String(config.name || (pet && pet.configName) || "");
      return !!(config.huge || config.titanic || config.gargantuan || /\b(Huge|Titanic|Gargantuan)\b/i.test(name));
    }
    function hasExclusiveEggOnlyDescription(pet) {
      const config = pet && pet.configData ? pet.configData : {};
      const description = String(config.indexDesc || "");
      return /exclusive\b[^.!\n]*\begg\b|\begg\b[^.!\n]*\bexclusive\b/i.test(description);
    }
    function sourceType(entry) {
      const text = ((entry.configData && entry.configData.name) || entry.configName || "") + " " + (entry.category || "");
      if (/gift|present|bag|parcel/i.test(text)) return "gift";
      if (/chest|lootbox|breakable|drop table/i.test(text)) return "chest";
      if (/\begg\b|hatch/i.test(text)) return "egg";
      return "other";
    }
    function sourceEligibility(entry) {
      const category = String(entry.category || "");
      const config = entry.configData || {};
      const name = String(config.name || entry.configName || "");
      const productIds = config.productIds && typeof config.productIds === "object" ? Object.keys(config.productIds) : [];
      const soldAsExclusiveEgg = productIds.some(function(productName) { return /exclusive\s+eggs?/i.test(productName); });
      const hiddenExclusiveEgg = config.rarity && config.rarity._id === "Exclusive" && config.allPetsRare && /^other$/i.test(category);
      if (/exclusive eggs/i.test(category) || /^exclusive\b.*\begg\b/i.test(name) || soldAsExclusiveEgg || hiddenExclusiveEgg) return null;
      const source = sourceType(entry);
      const age = ageInDays(entry.dateModified || entry.dateCreated);
      if (/\bworld\s*\d+\b/i.test(category) || /diamondmountain/i.test(category)) {
        return age <= recentDays ? { status: "World pool · recently updated", confidence: "recent" } : { status: "World pool in feed · activity unconfirmed", confidence: "unconfirmed" };
      }
      if (/hatchwar/i.test(category) && age <= recentDays) return { status: "Seasonal · recently updated", confidence: "recent" };
      if (/active huge egg/i.test(name) && age <= 120) return { status: "Active Huge pool · recently updated", confidence: "recent" };
      if (age <= recentDays) return { status: "Recent game config", confidence: "recent" };
      return { status: "Odds in feed · activity unconfirmed", confidence: "unconfirmed" };
    }
    function pctLabel(value) {
      if (!Number.isFinite(value) || value <= 0) return "—";
      if (value >= 10) return value.toFixed(1).replace(/\.0$/, "") + "%";
      if (value >= 0.1) return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + "%";
      const precise = value.toPrecision(3);
      if (precise.includes("e")) return precise.replace(/\.?0+(?=e)/, "").replace("e", " × 10^") + "%";
      return precise.replace(/0+$/, "").replace(/\.$/, "") + "%";
    }
    function oneInLabel(value) {
      if (!Number.isFinite(value) || value < 1) return "";
      return "1 in " + Math.round(value).toLocaleString("en-US");
    }
    function isActiveHugeSource(source) {
      return /active huge/i.test(source && source.pool && source.pool.name || "");
    }
    function sourceMatchesTab(source) {
      return state.tab === "all" || (state.tab === "active" ? isActiveHugeSource(source) : source.pool.type === state.tab);
    }
    function petHasSourceTab(pet, tab) {
      return pet.sources.some(function(source) { return tab === "active" ? isActiveHugeSource(source) : source.pool.type === tab; }) ||
        asArray(pet.otherSources).some(function(source) { return tab !== "active" && source.type === tab; });
    }
    function oddsSubLabel(source, item) {
      return isActiveHugeSource(source) ? "of listed active pool" : oneInLabel(item.oneIn);
    }
    function niceDate(value) {
      const date = parseApiDate(value);
      if (!date) return "date not supplied";
      return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
    }
    function getPoolRecords(api) {
      const eggs = asArray(readData(api.eggs));
      const pets = asArray(readData(api.pets));
      const petMap = new Map();
      pets.forEach(function(pet) {
        const data = pet.configData || {};
        const petName = data.name || pet.configName;
        if (petName) petMap.set(String(petName).toLowerCase(), pet);
      });
      const pools = [];
      eggs.forEach(function(entry) {
        const availability = sourceEligibility(entry);
        if (!availability) return;
        const data = entry.configData || {};
        const entries = asArray(data.pets).map(function(row) {
          if (!Array.isArray(row) || row.length < 2) return null;
          const name = String(row[0] || "");
          const weight = Number(row[1]);
          if (!name || !Number.isFinite(weight) || weight <= 0) return null;
          const pet = petMap.get(name.toLowerCase());
          if (!/\b(Huge|Titanic|Gargantuan)\b/i.test(name) && !isRarePet(pet)) return null;
          const kind = labelKind(name, pet);
          return { name: name, weight: weight, kind: kind, pet: pet || null };
        }).filter(Boolean);
        const allRows = asArray(data.pets).filter(function(row) { return Array.isArray(row) && Number(row[1]) > 0; });
        const total = allRows.reduce(function(sum, row) { return sum + Number(row[1] || 0); }, 0);
        if (!entries.length || !total) return;
        const sourceName = String(data.name || entry.configName || "Odds pool");
        const type = sourceType(entry);
        const icon = assetId(data.icon || data.Icon || "");
        const pool = {
          id: String(entry.configName || sourceName),
          name: sourceName,
          category: String(entry.category || "Game pool"),
          type: type,
          icon: icon,
          availability: availability,
          updated: entry.dateModified || entry.dateCreated || null,
          total: total,
          odds: entries.map(function(item) { return Object.assign(item, { pct: item.weight / total * 100, oneIn: total / item.weight }); }),
          modifiers: { gold: data.goldChance, rainbow: data.rainbowChance, shiny: data.shinyChance, goldDisabled: data.disableGold, rainbowDisabled: data.disableRainbow, shinyDisabled: data.disableModifiers }
        };
        pools.push(pool);
      });
      pools.sort(function(a, b) { return a.name.localeCompare(b.name); });
      return pools;
    }
    function getModifierRecords(api) {
      const enchants = asArray(readData(api.enchants));
      const records = [];
      enchants.forEach(function(entry) {
        const config = entry.configData || {};
        const tiers = asArray(config.Tiers);
        tiers.forEach(function(tier) {
          const title = String(tier.DisplayName || entry.configName || "Enchant");
          const desc = String(tier.Desc || "");
          if (!/huge|titanic|gargantuan/i.test(title + " " + desc) || !/odds|chance|luck|hatch|roll|random|adds?\s+\d+\s+rare/i.test(desc + " " + title)) return;
          records.push({
            id: title,
            name: title,
            group: String(entry.category || "Enchant"),
            description: desc,
            icon: assetId(tier.Icon || config.PageIcon || ""),
            value: /breakable mayhem/i.test(title) ? "Rare pet roll · exact rate not published" : /active huge overload/i.test(title) ? "Adds 1 rare Active Huge · +40% Active Huge luck" : /huge hunter/i.test(title) ? "+25% Active Huge hatch odds" : "Chance modifier · see in-game description"
          });
        });
      });
      const unique = new Map();
      records.forEach(function(record) { unique.set(record.name, record); });
      return Array.from(unique.values()).sort(function(a, b) { return a.name.localeCompare(b.name); });
    }
    function getSupplementalChanceSources(api) {
      const rarePetNames = asArray(readData(api.pets)).filter(isRarePet).map(function(pet) {
        const config = pet.configData || {};
        return String(config.name || pet.configName || "");
      }).filter(Boolean);
      const feeds = [
        { key: "lootboxes", label: "Gift & lootbox", rows: readData(api.lootboxes) },
        { key: "miscItems", label: "Keys & event items", rows: readData(api.miscItems) },
        { key: "potions", label: "Potion", rows: readData(api.potions) },
        { key: "cardItems", label: "Rare card recipe", rows: readData(api.cardItems) },
        { key: "boosts", label: "Luck boost config", rows: readData(api.boosts) }
      ];
      const records = [];
      function add(feed, entry, config, tier) {
        const name = String((tier && tier.DisplayName) || config.DisplayName || config.name || entry.configName || "Rare chance source");
        const description = String((tier && tier.Desc) || config.Desc || config.description || "");
        const context = name + " " + String(entry.category || "") + " " + description;
        if (feed.key === "boosts") {
          if (!/huge|titanic|gargantuan/i.test(context)) return;
          const maxPercent = Number(config.MaximumPercent);
          records.push({
            id: "boosts:" + String(entry.configName || name),
            name: name,
            group: feed.label + (entry.category ? " · " + String(entry.category) : ""),
            description: "The game config exposes a maximum boost value, but not the base pet drop chance or the complete boost formula.",
            chanceNote: Number.isFinite(maxPercent) ? "Configured maximum: " + maxPercent.toLocaleString("en-US") + "% boost cap · this is not a pet drop chance." : "Luck boost config · exact drop chance and formula are not published.",
            icon: assetId(config.Icon || config.icon || ""),
            iconUrl: String(config.AtlasThumbnailUrl || ""),
            rolls: null,
            updated: entry.dateModified || entry.dateCreated || null,
            activity: "Config value · not a drop rate",
            type: "other",
            petNames: [],
            searchText: (name + " " + feed.label + " " + context).toLowerCase()
          });
          return;
        }
        if (!/\b(Huge|Titanic|Gargantuan)\b/i.test(context)) return;
        const isRecipe = /combine\s+\d+\s+to\s+create/i.test(description);
        if (!isRecipe && feed.key !== "lootboxes" && !/chance|odds|luck|roll|random|boost|points|key|chest|machine|present|egg/i.test(description)) return;

        let chanceNote = "Rare-pet reward is mentioned, but this source publishes no numeric rate.";
        const recipe = description.match(/combine\s+(\d+)\s+to\s+create\s+(?:a\s+)?(.+?)(?:[.!\n]|$)/i);
        const modifierPercent = description.match(/(?:increases?|boosts?)\b[^.!\n]{0,90}?\bby\s+(\d+(?:\.\d+)?)\s*%/i) || description.match(/\b(\d+(?:\.\d+)?)\s*%\s+(?:more\s+)?(?:active\s+)?(?:huge|titanic|gargantuan)\s+(?:luck|odds|chance)/i);
        const multiplier = description.match(/\b(\d+(?:\.\d+)?)\s*x\s+(?:huge|titanic|gargantuan)\s+(?:pet\s+)?chance\b/i);
        const points = description.match(/adds?\s+([\d,]+)\s+points?\s+to\s+(?:your\s+)?(.+?)(?:[.!\n]|$)/i);
        const exactPercent = description.match(/\b(?:chance|odds)\b[^.!\n]{0,80}?\b(\d+(?:\.\d+)?)\s*%/i) || description.match(/\b(\d+(?:\.\d+)?)\s*%\s+(?:chance|odds)\b/i);
        const exactOneIn = description.match(/\b(?:chance|odds)\b[^.!\n]{0,80}?\b1\s+in\s+([\d,]+)/i) || description.match(/\b1\s+in\s+([\d,]+)[^.!\n]{0,40}?\b(?:chance|odds)\b/i);
        if (recipe) {
          chanceNote = "Guaranteed card conversion: " + recipe[1] + " cards → " + recipe[2].trim() + ". The chance of finding a required card is not published.";
        } else if (multiplier) {
          chanceNote = multiplier[1] + "× Huge chance modifier; the base chance and final rate are not published.";
        } else if (modifierPercent) {
          chanceNote = "+" + modifierPercent[1] + "% luck modifier; this is not the final pet chance.";
        } else if (exactPercent && !/luck|increase|boost|more|multipl/i.test(description)) {
          chanceNote = "Published description rate: " + exactPercent[1] + "%";
        } else if (exactOneIn && !/luck|increase|boost|more|multipl/i.test(description)) {
          chanceNote = "Published description rate: 1 in " + exactOneIn[1];
        } else if (points) {
          chanceNote = "Adds " + points[1] + " points to " + points[2].trim() + "; the resulting pet odds are not published.";
        } else if (/chance|odds/i.test(description)) {
          chanceNote = "Rare-pet chance is mentioned, but no numeric rate is published.";
        } else if (/luck|boost/i.test(description)) {
          chanceNote = "Chance modifier is described, but its numeric effect or final pet rate is not published.";
        }

        const rollCount = Number(config.Rolls || 0);
        if (rollCount && /card/i.test(description) && !/\d+\s+card/i.test(chanceNote)) chanceNote += " " + rollCount + " cards per pack.";
        const id = feed.key + ":" + String(entry.configName || name) + (tier ? ":" + String(tier.DisplayName || "tier") : "");
        const sourceText = name + " " + String(entry.category || "") + " " + description;
        const sourceTypeValue = /gift|present|bag|parcel/i.test(sourceText) ? "gift" : /chest|lootbox|breakable|drop table|key/i.test(sourceText) ? "chest" : "other";
        const lowerSourceText = sourceText.toLowerCase();
        records.push({
          id: id,
          name: name,
          group: feed.label + (entry.category ? " · " + String(entry.category) : ""),
          description: description || "No item description is published.",
          chanceNote: chanceNote,
          icon: assetId((tier && tier.Icon) || config.Icon || config.icon || config.PageIcon || ""),
          iconUrl: String((tier && tier.AtlasThumbnailUrl) || config.AtlasThumbnailUrl || ""),
          rolls: rollCount || null,
          updated: entry.dateModified || entry.dateCreated || null,
          activity: ageInDays(entry.dateModified || entry.dateCreated) <= recentDays ? "Recently updated" : "Activity unconfirmed",
          type: sourceTypeValue,
          petNames: rarePetNames.filter(function(petName) { return lowerSourceText.includes(petName.toLowerCase()); }),
          searchText: (name + " " + feed.label + " " + String(entry.category || "") + " " + description + " " + chanceNote).toLowerCase()
        });
      }
      feeds.forEach(function(feed) {
        asArray(feed.rows).forEach(function(entry) {
          const config = entry.configData || {};
          const tiers = feed.key === "potions" ? asArray(config.Tiers) : [];
          if (tiers.length) tiers.forEach(function(tier) { add(feed, entry, config, tier); });
          else add(feed, entry, config, null);
        });
      });
      const rarePetByName = new Map(rarePetNames.map(function(name) { return [name.toLowerCase(), name]; }));
      asArray(readData(api.guildBattles)).forEach(function(entry) {
        const config = entry.configData || {};
        const now = Date.now() / 1000;
        const start = Number(config.StartTime || 0);
        const finish = Number(config.FinishTime || 0);
        if (!start || !finish || start > now || finish < now) return;
        const battleName = String(config.Title || entry.configName || "Guild Battle");
        asArray(config.PlacementRewards).forEach(function(reward) {
          const petName = String(reward && reward.Item && reward.Item._data && reward.Item._data.id || "");
          const matchedName = rarePetByName.get(petName.toLowerCase());
          if (!matchedName) return;
          const best = Number(reward.Best || 0);
          const worst = Number(reward.Worst || best);
          const contributor = reward.BestContributor && reward.WorstContributor ? " · contributor ranks " + reward.BestContributor + "–" + reward.WorstContributor : "";
          const rankLabel = best === worst ? "rank " + best : "ranks " + best + "–" + worst;
          const pet = asArray(readData(api.pets)).find(function(record) { return String(record.configData && record.configData.name || record.configName || "").toLowerCase() === matchedName.toLowerCase(); });
          const icon = assetId(pet && pet.configData && (pet.configData.thumbnail || pet.configData.Thumbnail || pet.configData.icon) || "");
          const iconUrl = String(pet && pet.configData && pet.configData.AtlasThumbnailUrl || "");
          const description = matchedName + " is a listed placement reward for " + battleName + " (" + rankLabel + contributor + "). This is a rank reward, not a random drop.";
          const id = "guild:" + String(entry.configName || battleName) + ":" + matchedName + ":" + best + ":" + worst;
          records.push({
            id: id,
            name: battleName + " · " + matchedName,
            group: "Active guild battle · placement reward",
            description: description,
            chanceNote: "Guaranteed for " + rankLabel + contributor + " · not a random chance.",
            icon: icon,
            iconUrl: iconUrl,
            rolls: null,
            updated: entry.dateModified || entry.dateCreated || null,
            activity: "Active · ends " + niceDate(new Date(finish * 1000)),
            type: "other",
            petNames: [matchedName],
            searchText: (battleName + " " + matchedName + " " + description).toLowerCase()
          });
        });
      });
      return records.sort(function(a, b) { return a.name.localeCompare(b.name); });
    }
    function createCatalog(api, resolveIcons) {
      state.data = api;
      state.pools = getPoolRecords(api);
      state.modifiers = getModifierRecords(api);
      const petMap = new Map();
      state.pools.forEach(function(pool) { pool.odds.forEach(function(item) {
        const key = item.name.toLowerCase();
        if (!petMap.has(key)) petMap.set(key, { name: item.name, kind: item.kind, pet: item.pet, sources: [] });
        petMap.get(key).sources.push({ pool: pool, odds: item });
      }); });
      asArray(readData(api.pets)).forEach(function(pet) {
        if (!isRarePet(pet)) return;
        const config = pet.configData || {};
        const name = String(config.name || pet.configName || "");
        if (!name) return;
        const key = name.toLowerCase();
        const record = petMap.get(key);
        if (hasExclusiveEggOnlyDescription(pet) && (!record || !record.sources.length)) return;
        if (record) { record.pet = pet; record.kind = labelKind(name, pet); }
        else petMap.set(key, { name: name, kind: labelKind(name, pet), pet: pet, sources: [] });
      });
      state.pets = Array.from(petMap.values()).sort(function(a, b) {
        const rank = { Gargantuan: 0, Titanic: 1, Huge: 2 };
        if (a.kind !== b.kind) return rank[a.kind] - rank[b.kind];
        return a.name.localeCompare(b.name);
      });
      state.pets.forEach(function(pet) {
        const config = pet.pet && pet.pet.configData ? pet.pet.configData : {};
        pet.searchText = (pet.name + " " + String(config.indexDesc || "") + " " + pet.sources.map(function(source) { return source.pool.name + " " + source.pool.category; }).join(" ")).toLowerCase();
      });
      state.petIndex = new Map(state.pets.map(function(pet) { return [pet.name, pet]; }));
      state.poolIndex = new Map(state.pools.map(function(pool) { return [pool.id, pool]; }));
      state.modifierIndex = new Map(state.modifiers.map(function(item) { return [item.id, item]; }));
      state.otherSources = getSupplementalChanceSources(api);
      state.otherSourceIndex = new Map(state.otherSources.map(function(item) { return [item.id, item]; }));
      const extraSourcesByPet = new Map();
      state.otherSources.forEach(function(item) {
        item.petNames.forEach(function(name) {
          if (!extraSourcesByPet.has(name)) extraSourcesByPet.set(name, []);
          extraSourcesByPet.get(name).push(item);
        });
      });
      state.pets.forEach(function(pet) {
        pet.otherSources = extraSourcesByPet.get(pet.name) || [];
        if (pet.otherSources.length) pet.searchText += " " + pet.otherSources.map(function(item) { return item.name + " " + item.description; }).join(" ").toLowerCase();
      });
      state.filterCacheKey = null;
      state.filteredPets = null;
      state.missingChests = [];
      updateSearchWorkerIndex();
      updateStats();
      render();
    }
    function releaseInfo(api) {
      const body = readData(api.releases);
      const releases = body && Array.isArray(body.releases) ? body.releases : [];
      return releases.find(function(item) { return Number(item.added || 0) + Number(item.changed || 0) > 0; }) || releases[0] || null;
    }
    function updateRelease(api) {
      const release = releaseInfo(api);
      $("releaseNumber").textContent = release ? "Update " + release.version : "Game data loaded";
      $("releaseState").textContent = release ? (Number(release.added || 0) + Number(release.changed || 0) > 0 ? "Odds feed" : "Live feed") : "Live feed";
      $("releaseTime").textContent = release ? "Synced " + niceDate(release.importedAt || release.publishedAt) : "Latest release info unavailable";
    }
    function updateStats() {
      $("statPets").textContent = String(state.pets.length);
      $("statPools").textContent = String(state.pools.length);
      $("statGifts").textContent = String(state.pools.filter(function(pool) { return pool.type === "gift"; }).length);
      $("statModifiers").textContent = String(state.modifiers.length);
      const counts = { Huge: 0, Titanic: 0, Gargantuan: 0 };
      state.pets.forEach(function(pet) { counts[pet.kind] = (counts[pet.kind] || 0) + 1; });
      $("allKindFilter").textContent = "All rare pets · " + state.pets.length;
      $("hugeKindFilter").textContent = "Huge · " + counts.Huge;
      $("titanicKindFilter").textContent = "Titanic · " + counts.Titanic;
      $("gargantuanKindFilter").textContent = "Gargantuan · " + counts.Gargantuan;
    }
    function thumb(asset) {
      if (!asset) return "";
      const value = String(asset);
      if (/^https?:\/\//i.test(value)) return value;
      return state.thumbs[value] || (state.thumbIndex && state.thumbIndex[value]) || "";
    }
    function iconHtml(asset, label, className) {
      const url = thumb(asset);
      if (url) return '<img class="' + (className || "") + '" src="' + esc(url) + '" alt="' + esc(label) + '" loading="lazy" decoding="async">';
      return '<span class="' + (className || "source-fallback") + '" aria-hidden="true">✦</span>';
    }
    function getPetAsset(pet) {
      const config = pet && pet.configData ? pet.configData : {};
      if ((state.variant === "gold" || state.variant === "shiny-gold") && config.goldenThumbnail) return assetId(config.goldenThumbnail);
      return assetId(config.thumbnail || config.Thumbnail || config.icon || "");
    }
    function petVariantLabel() {
      return ({ normal: "NORMAL", gold: "GOLD", rainbow: "RAINBOW", shiny: "SHINY", "shiny-gold": "SHINY GOLD", "shiny-rainbow": "SHINY RAINBOW" })[state.variant] || "NORMAL";
    }
    function petIconHtml(pet, label, className) {
      const config = pet && pet.configData ? pet.configData : {};
      const goldMode = state.variant === "gold" || state.variant === "shiny-gold";
      const fallback = goldMode && !assetId(config.goldenThumbnail);
      const variantClass = "variant-" + String(state.variant || "normal");
      const fallbackClass = fallback ? " variant-fallback" : "";
      const icon = getPetAsset(pet);
      const configMark = pet && pet.configData ? (pet.configData.titanic ? "T" : pet.configData.gargantuan ? "G" : "H") : "✦";
      const content = thumb(icon) ? iconHtml(icon, label, "pet-art-image") : '<span class="pet-placeholder">' + esc(configMark) + "</span>";
      const effects = '<span class="pet-effect-rainbow" aria-hidden="true"></span><span class="pet-effect-stripes" aria-hidden="true"></span><span class="pet-effect-sweep" aria-hidden="true"></span>';
      return '<span class="pet-art ' + esc(className || "") + " " + esc(variantClass + fallbackClass) + '"><span class="pet-visual">' + content + effects + "</span></span>";
    }
    function uniqueAssetIds() {
      const ids = new Set();
      const visible = state.tab === "enchant" || state.tab === "extras" ? [] : (getVisiblePets() || []).slice(0, state.showLimit);
      visible.forEach(function(pet) {
        const id = getPetAsset(pet.pet);
        if (id) ids.add(id);
        pet.sources.filter(sourceMatchesTab).slice(0, 3).forEach(function(source) { if (source.pool.icon) ids.add(source.pool.icon); });
        asArray(pet.otherSources).filter(function(item) { return state.tab === "all" || item.type === state.tab; }).slice(0, 3).forEach(function(item) { if (item.icon) ids.add(item.icon); });
      });
      if (state.tab === "enchant") state.modifiers.forEach(function(item) { if (item.icon) ids.add(item.icon); });
      if (state.tab === "extras") state.otherSources.filter(function(item) { return !state.query || item.searchText.includes(state.query); }).slice(0, state.showLimit).forEach(function(item) { if (item.icon) ids.add(item.icon); });
      return Array.from(ids).filter(function(id) { return !state.thumbs[id] && !state.thumbMisses.has(id) && !state.thumbPending.has(id); });
    }
    async function resolveVisibleThumbs() {
      const ids = uniqueAssetIds();
      if (!ids.length) return;
      ids.forEach(function(id) { state.thumbPending.add(id); });
      if (window.PS99_THUMBNAILS_URL) {
        try {
          if (!state.thumbIndex) {
            const response = await fetch(window.PS99_THUMBNAILS_URL, { cache: "force-cache" });
            if (!response.ok) { ids.forEach(function(id) { state.thumbMisses.add(id); }); return; }
            state.thumbIndex = await response.json();
          }
          let added = false;
          ids.forEach(function(id) {
            if (state.thumbIndex[id]) { state.thumbs[id] = state.thumbIndex[id]; added = true; }
            else state.thumbMisses.add(id);
          });
          if (added) render();
        } catch (_) { ids.forEach(function(id) { state.thumbMisses.add(id); }); }
        finally { ids.forEach(function(id) { state.thumbPending.delete(id); }); }
        return;
      }
      const chunks = [];
      for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100));
      let added = false;
      await Promise.all(chunks.map(async function(chunk) {
        try {
          const response = await fetch("/api/thumbs?ids=" + encodeURIComponent(chunk.join(",")), { cache: "force-cache" });
          if (!response.ok) { chunk.forEach(function(id) { state.thumbMisses.add(id); }); return; }
          const body = await response.json();
          const found = new Set();
          asArray(body.data).forEach(function(item) {
            if (item && item.targetId && item.imageUrl) { const id = String(item.targetId); state.thumbs[id] = item.imageUrl; found.add(id); added = true; }
          });
          chunk.forEach(function(id) { if (!found.has(id)) state.thumbMisses.add(id); });
        } catch (_) { chunk.forEach(function(id) { state.thumbMisses.add(id); }); }
        finally { chunk.forEach(function(id) { state.thumbPending.delete(id); }); }
      }));
      if (added) render();
    }
    function sourceAsset(pool) { return pool.icon || ""; }
    function sourceRowHtml(source) {
      const pool = source.pool;
      const item = source.odds;
      const icon = sourceAsset(pool);
      return '<button class="source-row" type="button" data-source-key="' + esc(encodeURIComponent(pool.id)) + '" data-tip-type="source" data-tip-key="' + esc(encodeURIComponent(pool.id)) + '" data-tip-pet="' + esc(encodeURIComponent(item.name)) + '" aria-label="Open ' + esc(pool.name) + ' odds details">' +
        '<span class="source-thumb">' + iconHtml(icon, pool.name, "") + '</span>' +
        '<span class="source-meta"><span class="source-name">' + esc(pool.name) + '</span><span class="source-status">' + esc(pool.availability.status) + '</span></span>' +
        '<span class="source-odds">' + esc(pctLabel(item.pct)) + '<small>' + esc(oddsSubLabel(source, item)) + '</small></span></button>';
    }
    function chanceSourceRowHtml(item) {
      return '<button class="source-row" type="button" data-chance-source-key="' + esc(encodeURIComponent(item.id)) + '" data-tip-type="chance-source" data-tip-key="' + esc(encodeURIComponent(item.id)) + '" aria-label="Open ' + esc(item.name) + ' chance source details">' +
        '<span class="source-thumb">' + iconHtml(item.iconUrl || item.icon, item.name, "") + '</span>' +
        '<span class="source-meta"><span class="source-name">' + esc(item.name) + '</span><span class="source-status">' + esc(item.chanceNote) + '</span></span>' +
        '<span class="source-odds">See info<small>' + esc(item.activity) + '</small></span></button>';
    }
    function filterKey(tab, kind, query) { return tab + "\u0000" + kind + "\u0000" + query; }
    function updateSearchWorkerIndex() {
      if (!searchWorker) return;
      const rows = state.pets.map(function(pet) {
        const types = Array.from(new Set(pet.sources.map(function(source) { return source.pool.type; }).concat(asArray(pet.otherSources).map(function(source) { return source.type; }))));
        return { text: pet.searchText, kind: pet.kind.toLowerCase(), types: types, active: pet.sources.some(isActiveHugeSource) };
      });
      searchWorker.postMessage({ type: "index", rows: rows });
    }
    function makeSearchWorker() {
      if (!window.Worker || !window.Blob || !window.URL || !window.URL.createObjectURL) return;
      const source = [
        "let rows = [];",
        "self.onmessage = function(event) {",
        "  const message = event.data || {};",
        "  if (message.type === 'index') { rows = message.rows || []; self.postMessage({ type: 'ready' }); return; }",
        "  if (message.type !== 'search') return;",
        "  const indices = []; const query = message.query || ''; const tab = message.tab || 'all'; const kind = message.kind || 'all';",
        "  for (let i = 0; i < rows.length; i += 1) {",
        "    const row = rows[i];",
        "    if (kind !== 'all' && row.kind !== kind) continue;",
        "    if (tab === 'active' ? !row.active : (tab !== 'all' && row.types.indexOf(tab) === -1)) continue;",
        "    if (query && row.text.indexOf(query) === -1) continue;",
        "    indices.push(i);",
        "  }",
        "  self.postMessage({ type: 'result', id: message.id, tab: tab, kind: kind, query: query, indices: indices });",
        "};"
      ].join("\n");
      try {
        searchWorkerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
        searchWorker = new Worker(searchWorkerUrl);
        searchWorker.onmessage = function(event) {
          const message = event.data || {};
          if (message.type === "ready") {
            if (searchWorkerUrl) URL.revokeObjectURL(searchWorkerUrl);
            searchWorkerUrl = "";
            return;
          }
          if (message.type !== "result" || message.id !== searchRequestId) return;
          applySearchResults(message.id, message.tab, message.kind, message.query, message.indices || []);
        };
        searchWorker.onerror = function() {
          if (searchWorker) searchWorker.terminate();
          searchWorker = null;
          if (searchWorkerUrl) URL.revokeObjectURL(searchWorkerUrl);
          searchWorkerUrl = "";
          if (searchPendingKey) { searchPendingKey = ""; requestPetSearch(); }
        };
        updateSearchWorkerIndex();
      } catch (_) {
        searchWorker = null;
        if (searchWorkerUrl) URL.revokeObjectURL(searchWorkerUrl);
        searchWorkerUrl = "";
      }
    }
    function applySearchResults(id, tab, kind, query, indices) {
      if (id !== searchRequestId || tab !== state.tab || kind !== state.kind || query !== state.query) return;
      state.filteredPets = indices.map(function(index) { return state.pets[index]; });
      state.filterCacheKey = filterKey(tab, kind, query);
      searchPendingKey = "";
      $("cards").setAttribute("aria-busy", "false");
      if (state.tab === "chest") renderChests();
      else renderPetCards();
    }
    function runSlicedSearch(id, tab, kind, query) {
      const indices = [];
      let cursor = 0;
      function nextSlice() {
        if (id !== searchRequestId) return;
        const end = Math.min(cursor + 100, state.pets.length);
        for (; cursor < end; cursor += 1) {
          const pet = state.pets[cursor];
          if (kind !== "all" && pet.kind.toLowerCase() !== kind) continue;
          if (tab !== "all" && !petHasSourceTab(pet, tab)) continue;
          if (query && !pet.searchText.includes(query)) continue;
          indices.push(cursor);
        }
        if (cursor < state.pets.length) window.setTimeout(nextSlice, 0);
        else applySearchResults(id, tab, kind, query, indices);
      }
      nextSlice();
    }
    function requestPetSearch() {
      const tab = state.tab;
      const kind = state.kind;
      const query = state.query;
      const key = filterKey(tab, kind, query);
      if (state.filterCacheKey === key && state.filteredPets) {
        if (tab === "chest") renderChests();
        else renderPetCards();
        return;
      }
      if (searchPendingKey === key) return;
      searchPendingKey = key;
      $("resultCount").textContent = "Searching…";
      $("cards").setAttribute("aria-busy", "true");
      const id = ++searchRequestId;
      if (searchWorker) searchWorker.postMessage({ type: "search", id: id, tab: tab, kind: kind, query: query });
      else runSlicedSearch(id, tab, kind, query);
    }
    function getVisiblePets() {
      const key = filterKey(state.tab, state.kind, state.query);
      if (state.filterCacheKey === key && state.filteredPets) return state.filteredPets;
      requestPetSearch();
      return null;
    }
    function renderPetCards() {
      const matches = getVisiblePets();
      if (!matches) return;
      $("cards").classList.add("pet-catalog");
      $("cards").dataset.kind = state.kind;
      const pets = matches.slice(0, state.showLimit);
      $("resultCount").textContent = matches.length > state.showLimit ? "Showing " + pets.length + " of " + matches.length + " pets" : matches.length + (matches.length === 1 ? " pet" : " pets");
      $("catalogSubtitle").textContent = state.tab === "active" ? "Hover an Active Huge pet to see its share of the published pool" : "Hover a pet to see every published chance and source note";
      if (!matches.length) {
        $("cards").innerHTML = '<div class="empty"><strong>No matching rare pet records</strong>Try a different name or source filter. Exclusive Egg-only pets and odds are intentionally left out.</div>';
        $("loadMore").hidden = true;
        return;
      }
      let previousKind = "";
      $("cards").innerHTML = pets.map(function(pet) {
        const kind = pet.kind.toLowerCase();
        const groupStart = kind !== previousKind ? " pet-group-start" : "";
        previousKind = kind;
        return '<article class="pet-card ' + esc(kind) + groupStart + '" data-tip-type="pet" data-tip-key="' + esc(encodeURIComponent(pet.name)) + '">' +
          '<button class="pet-open" type="button" data-pet-key="' + esc(encodeURIComponent(pet.name)) + '" aria-label="' + esc(pet.name) + ' · hover for odds · activate for details">' + petIconHtml(pet.pet, pet.name, "") + '</button>' +
          '</article>';
      }).join("");
      const loadMore = $("loadMore");
      loadMore.hidden = matches.length <= state.showLimit;
      if (!loadMore.hidden) loadMore.textContent = "Show more pets · " + state.showLimit + " of " + matches.length;
      resolveVisibleThumbs();
    }
    function renderModifiers() {
      $("loadMore").hidden = true;
      const query = state.query;
      const modifiers = state.modifiers.filter(function(item) { return !query || (item.name + " " + item.description + " " + item.group).toLowerCase().includes(query); });
      $("resultCount").textContent = modifiers.length + (modifiers.length === 1 ? " modifier" : " modifiers");
      $("catalogSubtitle").textContent = "Chance modifiers for Huge, Titanic, or Gargantuan rolls · separate from base pool odds";
      $("cards").innerHTML = "";
      $("specialPanel").className = "source-panel visible";
      $("specialPanel").innerHTML = '<div class="panel-grid">' + (modifiers.length ? modifiers.map(function(item) {
        return '<button class="modifier-card" type="button" data-enchant-key="' + esc(encodeURIComponent(item.id)) + '" data-tip-type="enchant" data-tip-key="' + esc(encodeURIComponent(item.id)) + '"><span class="modifier-top"><span class="modifier-icon">' + iconHtml(item.icon, item.name, "") + '</span><span><h3 class="modifier-name">' + esc(item.name) + '</h3><span class="modifier-class">' + esc(item.group || "Enchant") + '</span></span></span><span class="modifier-copy">' + esc(item.description) + '</span><span class="modifier-value">' + esc(item.value) + '</span></button>';
      }).join("") : '<div class="empty"><strong>No matching enchant effects</strong>Try a shorter search.</div>') + '</div>' +
        '<p class="section-foot">Modifier descriptions come from the game config. They are not folded into pet pool chances because the API does not expose a complete formula for combined player boosts.</p>';
      resolveVisibleThumbs();
    }
    function renderChanceSources() {
      const query = state.query;
      const matches = state.otherSources.filter(function(item) { return !query || item.searchText.includes(query); });
      const visible = matches.slice(0, state.showLimit);
      $("cards").style.display = "none";
      $("resultCount").textContent = matches.length + (matches.length === 1 ? " source" : " sources");
      $("catalogSubtitle").textContent = "Rare reward items, chance modifiers, and card conversions found in game config. Exact rates appear only when the config publishes them.";
      $("loadMore").hidden = matches.length <= state.showLimit;
      if (!$("loadMore").hidden) $("loadMore").textContent = "Show more sources · " + state.showLimit + " of " + matches.length;
      $("specialPanel").className = "source-panel visible";
      $("specialPanel").innerHTML = '<div class="panel-grid">' + (visible.length ? visible.map(function(item) {
        return '<button class="modifier-card" type="button" data-chance-source-key="' + esc(encodeURIComponent(item.id)) + '" data-tip-type="chance-source" data-tip-key="' + esc(encodeURIComponent(item.id)) + '"><span class="modifier-top"><span class="modifier-icon">' + iconHtml(item.iconUrl || item.icon, item.name, "") + '</span><span><h3 class="modifier-name">' + esc(item.name) + '</h3><span class="modifier-class">' + esc(item.group) + '</span></span></span><span class="modifier-copy">' + esc(item.description) + '</span><span class="modifier-value">' + esc(item.chanceNote) + '</span><span class="source-status">' + esc(item.activity) + (item.rolls ? ' · ' + item.rolls + ' rolls per pack' : '') + '</span></button>';
      }).join("") : '<div class="empty"><strong>No matching rare-pet chance sources</strong>Try a shorter search.</div>') + '</div>' +
        '<p class="section-foot">Gift and lootbox descriptions may say a Huge, Titanic, or Gargantuan is possible without publishing its rate. The feed also lists chest and breakable spawns without item-by-item pet drops. Those missing rates stay unquantified. <a href="https://github.com/BIG-Games-LLC/ps99-public-api-docs/blob/master/legacy/README.md" target="_blank" rel="noreferrer">View the game-config API docs</a>.</p>';
      resolveVisibleThumbs();
    }
    function renderChests() {
      renderPetCards();
      $("catalogSubtitle").textContent = "Published chest and breakable odds from the game feed · missing drop tables are not estimated";
      $("specialPanel").className = "source-panel visible";
      $("specialPanel").innerHTML = '<div class="unavailable-card"><div class="unavailable-icon">▣</div><div><h3>Some chest drop tables are not published</h3><p>The game config lists chest and breakable spawn data, but not item-by-item Huge, Titanic, or Gargantuan drop weights. Check Rewards &amp; boosts for every gift, key, potion, and card source the feed describes; missing rates remain unquantified.</p></div></div>';
    }
    function render() {
      if (!state.data) return;
      $("loadMore").hidden = true;
      $("specialPanel").className = "source-panel";
      $("cards").style.display = "grid";
      if (state.tab === "enchant") { renderModifiers(); return; }
      if (state.tab === "extras") { renderChanceSources(); return; }
      if (state.tab === "chest") { renderChests(); return; }
      renderPetCards();
    }
    function updateFilterStyles() {
      document.querySelectorAll("[data-tab]").forEach(function(button) { button.classList.toggle("active", button.dataset.tab === state.tab); });
      document.querySelectorAll("[data-kind]").forEach(function(button) { button.classList.toggle("active", button.dataset.kind === state.kind); });
    }
    function cacheFallback(quiet) {
      try {
        const cached = JSON.parse(localStorage.getItem(apiCacheKey) || "null");
        if (cached && cached.data) { createCatalog(cached.data, true); updateRelease(cached.data); state.lastChecked = new Date(cached.savedAt || Date.now()); setLive(false, "Cached data"); if (!quiet) $("errorBox").innerHTML = '<div class="error-line">Could not reach the live odds feed. Showing the last saved snapshot.</div>'; updateLastChecked(); return true; }
      } catch (_) { /* Ignore malformed browser cache. */ }
      return false;
    }
    function setLive(ok, label) {
      const pill = $("livePill");
      pill.innerHTML = '<i class="live-dot" style="background:' + (ok ? "#6ef0aa" : "#ffd982") + ';box-shadow:0 0 10px ' + (ok ? "#6ef0aa" : "#ffd982") + '"></i><span>' + esc(label) + '</span>';
    }
    function updateLastChecked() {
      if (!state.lastChecked) return;
      $("lastChecked").textContent = "checked " + new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(state.lastChecked);
      const freshnessNote = window.PS99_STATIC_MODE
        ? " GitHub Pages refreshes its game-feed snapshot about every 15 minutes. The public feed may cache config briefly and does not confirm current availability for every source."
        : " The public game feed may cache config for up to a minute and does not reliably confirm current availability.";
      $("dataFoot").textContent = "Last checked " + new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(state.lastChecked) + "." + freshnessNote + " Older source odds are kept for reference and marked unconfirmed.";
    }
    async function loadData(force) {
      if (state.busy) return;
      state.busy = true;
      $("refresh").classList.add("spinning");
      $("errorBox").innerHTML = "";
      if (!state.data) $("cards").innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
      try {
        const endpoint = window.PS99_DATA_URL || "/api/data";
        const suffix = force && !window.PS99_DATA_URL ? "?fresh=" + Date.now() : "";
        const response = await fetch(endpoint + suffix, { cache: "no-cache" });
        if (!response.ok) throw new Error("API request returned " + response.status);
        const api = await response.json();
        if (!api.eggs || !api.pets) throw new Error("The live feed response was incomplete.");
        if (state.data && api.generated_at && api.generated_at === state.data.generated_at) {
          state.lastChecked = new Date(api.generated_at);
          updateLastChecked();
          setLive(true, window.PS99_STATIC_MODE ? "Scheduled snapshot" : "Live data");
          return;
        }
        try { localStorage.setItem(apiCacheKey, JSON.stringify({ data: api, savedAt: Date.now() })); } catch (_) { /* Keep the fresh response even when storage is full. */ }
        createCatalog(api, true);
        updateRelease(api);
        state.lastChecked = api.generated_at ? new Date(api.generated_at) : new Date();
        updateLastChecked();
        setLive(true, window.PS99_STATIC_MODE ? "Scheduled snapshot" : "Live data");
      } catch (error) {
        if (!state.data) {
          const hadCache = cacheFallback();
          if (!hadCache) {
            $("cards").innerHTML = '<div class="empty"><strong>Live odds are temporarily unavailable</strong>Try refresh in a moment. The page will check the feed again automatically.</div>';
            $("resultCount").textContent = "";
            setLive(false, "Feed offline");
          }
        } else {
          $("errorBox").innerHTML = '<div class="error-line">Live refresh failed; the last loaded odds are still shown.</div>';
          setLive(false, "Using last data");
        }
      } finally {
        state.busy = false;
        $("refresh").classList.remove("spinning");
      }
    }
    function sourceMap() { return state.poolIndex; }
    function petMap() { return state.petIndex; }
    function tipLine(label, value, accent) {
      return '<div class="game-tip-line"><span>' + esc(label) + '</span><strong' + (accent ? ' class="' + esc(accent) + '"' : '') + '>' + esc(value) + '</strong></div>';
    }
    function tipPetSourceLine(name, detail, odds, asset) {
      const icon = thumb(asset) ? iconHtml(asset, name, "game-tip-source-icon") : '<span class="game-tip-source-icon" aria-hidden="true">✦</span>';
      return '<div class="game-tip-source-line"><div class="game-tip-source-main"><span class="game-tip-source-thumb">' + icon + '</span><span class="game-tip-source-copy"><strong>' + esc(name) + '</strong><small>' + esc(detail) + '</small></span></div><strong class="game-tip-source-odds">' + esc(odds) + '</strong></div>';
    }
    function gameTipHtml(title, badge, kind, asset, mark, subtitle, description, lines, imageMarkup) {
      const image = imageMarkup || (thumb(asset) ? iconHtml(asset, title, "") : '<span>' + esc(mark || "✦") + '</span>');
      return '<div class="game-tip-content kind-' + esc(String(kind || "item").toLowerCase()) + '">' +
        '<div class="game-tip-head"><strong class="game-tip-title">' + esc(title) + '</strong><span class="game-tip-rarity">' + esc(badge) + '</span></div>' +
        '<div class="game-tip-body"><div class="game-tip-image">' + image + '</div><div class="game-tip-copy">' + (subtitle ? '<div class="game-tip-subtitle">' + esc(subtitle) + '</div>' : '') + '<div class="game-tip-desc">' + esc(description || "") + '</div></div></div>' +
        (lines && lines.length ? '<div class="game-tip-foot">' + lines.join("") + '</div>' : '') + '</div>';
    }
    function gameTipMarkup(target) {
      const type = target.dataset.tipType;
      const key = decodeURIComponent(target.dataset.tipKey || "");
      if (type === "pet") {
        const pet = petMap().get(key);
        if (!pet) return "";
        const config = pet.pet && pet.pet.configData ? pet.pet.configData : {};
        const description = String(config.indexDesc || "").split(/\n+/)[0].trim() || "Hover preview of this rare pet. Click for its full odds.";
        const sources = pet.sources.slice().sort(function(a, b) { return a.odds.pct - b.odds.pct; });
        const extraSources = asArray(pet.otherSources);
        const lines = [tipLine("Icon variant", petVariantLabel() + " · visual only; odds stay at base rate")];
        if (sources.length + extraSources.length) lines.push(tipLine("Published sources", String(sources.length + extraSources.length)));
        sources.forEach(function(source) {
          const odds = pctLabel(source.odds.pct) + (isActiveHugeSource(source) ? " · share of listed pool" : " · " + oneInLabel(source.odds.oneIn));
          const availability = source.pool.availability && source.pool.availability.status || "Availability not supplied";
          const detail = [source.pool.category, availability, source.pool.updated ? "Config " + niceDate(source.pool.updated) : ""].filter(Boolean).join(" · ");
          lines.push(tipPetSourceLine(source.pool.name, detail, odds, source.pool.icon));
        });
        extraSources.forEach(function(source) {
          const detail = [source.group, source.activity, source.description, source.updated ? "Updated " + niceDate(source.updated) : ""].filter(Boolean).join(" · ");
          lines.push(tipPetSourceLine(source.name, detail, source.chanceNote || "Chance not published", source.iconUrl || source.icon));
        });
        if (!sources.length && !extraSources.length) lines.push(tipLine("Odds", "No published chance or reward source in the game feed"));
        return gameTipHtml(pet.name, pet.kind, pet.kind.toLowerCase(), getPetAsset(pet.pet), pet.kind.charAt(0), petVariantLabel() + " visual preview · odds remain at base rate", description, lines, petIconHtml(pet.pet, pet.name, "game-tip-pet-art"));
      }
      if (type === "source") {
        const pool = sourceMap().get(key);
        if (!pool) return "";
        const petName = decodeURIComponent(target.dataset.tipPet || "");
        const item = pool.odds.find(function(odds) { return odds.name === petName; });
        if (!item) return "";
        const typeLabel = pool.type === "egg" ? "Egg" : pool.type === "gift" ? "Gift bag" : pool.type === "chest" ? "Chest / drop" : "Game source";
        const lines = [
          tipLine("Pet outcome", item.name),
          tipLine("Chance", pctLabel(item.pct) + (isActiveHugeSource({ pool: pool }) ? " · share of listed pool" : " · " + oneInLabel(item.oneIn)), "chance"),
          tipLine("Availability", pool.availability.status)
        ];
        return gameTipHtml(pool.name, typeLabel, item.kind.toLowerCase(), pool.icon, "✦", pool.category, "Configured chance for " + item.name + ".", lines);
      }
      if (type === "enchant") {
        const item = state.modifiers.find(function(value) { return value.id === key; });
        if (!item) return "";
        return gameTipHtml(item.name, "Enchant", "enchant", item.icon, "✦", item.group || "Chance modifier", item.description, [
          tipLine("Effect", item.value, "gargantuan"),
          tipLine("Odds formula", "Not fully exposed by the game feed")
        ]);
      }
      if (type === "chance-source") {
        const item = state.otherSourceIndex.get(key);
        if (!item) return "";
        const lines = [tipLine("Chance info", item.chanceNote, "chance"), tipLine("Activity", item.activity)];
        if (item.rolls) lines.push(tipLine("Pack contents", item.rolls + " rolls per pack"));
        return gameTipHtml(item.name, "Chance source", "item", item.iconUrl || item.icon, "✦", item.group, item.description, lines);
      }
      return "";
    }
    let gameTipPoint = null;
    function positionGameTip(target, pointX, pointY) {
      if (!target || $("gameTip").hidden) return;
      const tip = $("gameTip");
      const rect = target.getBoundingClientRect();
      const width = tip.getBoundingClientRect().width;
      const height = tip.getBoundingClientRect().height;
      const point = Number.isFinite(pointX) && Number.isFinite(pointY) ? { x: pointX, y: pointY } : gameTipPoint;
      let left = point ? point.x + 18 : rect.right + 12;
      let top = point ? point.y + 18 : rect.top + rect.height / 2 - height / 2;
      if (point && left + width > window.innerWidth - 10) left = point.x - width - 18;
      if (!point && left + width > window.innerWidth - 10) left = rect.left - width - 12;
      left = Math.max(10, Math.min(left, window.innerWidth - width - 10));
      if (point && top + height > window.innerHeight - 10) top = point.y - height - 18;
      top = Math.max(10, Math.min(top, window.innerHeight - height - 10));
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    }
    function hideGameTip() {
      if (activeGameTip) activeGameTip.removeAttribute("aria-describedby");
      activeGameTip = null;
      $("gameTip").hidden = true;
    }
    function showGameTip(target, pointX, pointY) {
      const markup = gameTipMarkup(target);
      if (!markup) return;
      gameTipPoint = Number.isFinite(pointX) && Number.isFinite(pointY) ? { x: pointX, y: pointY } : null;
      const tip = $("gameTip");
      const panelClass = markup.match(/class="game-tip-content ([^"]+)"/);
      tip.className = "game-tip" + (panelClass ? " " + panelClass[1] : "");
      tip.innerHTML = markup;
      tip.hidden = false;
      if (activeGameTip && activeGameTip !== target) activeGameTip.removeAttribute("aria-describedby");
      activeGameTip = target;
      target.setAttribute("aria-describedby", "gameTip");
      requestAnimationFrame(function() { positionGameTip(target, pointX, pointY); });
    }
    function bindGameTips(root) {
      root.addEventListener("pointerover", function(event) {
        if (event.pointerType === "touch") return;
        const target = event.target.closest && event.target.closest("[data-tip-type]");
        if (!target || !root.contains(target) || target.contains(event.relatedTarget)) return;
        showGameTip(target, event.clientX, event.clientY);
      });
      root.addEventListener("pointermove", function(event) {
        if (event.pointerType === "touch") return;
        const target = event.target.closest && event.target.closest("[data-tip-type]");
        if (!target || target !== activeGameTip) return;
        gameTipPoint = { x: event.clientX, y: event.clientY };
        positionGameTip(target, event.clientX, event.clientY);
      });
      root.addEventListener("pointerout", function(event) {
        if ($("gameTip").contains(event.relatedTarget)) return;
        if (!activeGameTip || !root.contains(activeGameTip) || !activeGameTip.contains(event.target) || activeGameTip.contains(event.relatedTarget)) return;
        hideGameTip();
      });
      root.addEventListener("focusin", function(event) {
        const target = event.target.closest && event.target.closest("[data-tip-type]");
        if (target && root.contains(target)) showGameTip(target);
      });
      root.addEventListener("focusout", function(event) {
        if (activeGameTip && root.contains(activeGameTip) && activeGameTip.contains(event.target) && !activeGameTip.contains(event.relatedTarget)) hideGameTip();
      });
    }
    bindGameTips($("cards"));
    bindGameTips($("specialPanel"));
    $("gameTip").addEventListener("pointerleave", function(event) {
      if (activeGameTip && activeGameTip.contains(event.relatedTarget)) return;
      hideGameTip();
    });
    window.addEventListener("scroll", function(event) { if (event.target === $("gameTip")) return; hideGameTip(); }, true);
    window.addEventListener("resize", hideGameTip);
    function showPet(name) {
      const pet = petMap().get(name);
      if (!pet) return;
      hideGameTip();
      $("modalKicker").textContent = pet.kind + " · base chances";
      $("modalTitle").textContent = pet.name;
      const sources = pet.sources.slice().sort(function(a, b) { return a.odds.pct - b.odds.pct; });
      const config = pet.pet && pet.pet.configData ? pet.pet.configData : {};
      const description = String(config.indexDesc || "Game source details are not provided in the public feed.");
      const extraSources = asArray(pet.otherSources);
      const sourceBody = sources.map(function(source) { return '<div class="modal-source"><div class="source-thumb">' + iconHtml(source.pool.icon, source.pool.name, "") + '</div><div><div class="modal-source-name">' + esc(source.pool.name) + '</div><div class="modal-source-sub">' + esc(source.pool.category) + ' · ' + esc(source.pool.availability.status) + '</div></div><div class="modal-odds">' + esc(pctLabel(source.odds.pct)) + '<br><span class="muted">' + esc(oddsSubLabel(source, source.odds)) + '</span></div></div>'; }).join("") + extraSources.map(function(item) { return '<div class="modal-source"><div class="source-thumb">' + iconHtml(item.icon, item.name, "") + '</div><div><div class="modal-source-name">' + esc(item.name) + '</div><div class="modal-source-sub">' + esc(item.group) + ' · ' + esc(item.activity) + '</div></div><div class="modal-odds"><span class="muted">' + esc(item.chanceNote) + '</span></div></div>'; }).join("") || '<div class="no-odds">No non-exclusive odds or reward source is published for this pet. The game index source note is shown above; current availability and exact chances cannot be confirmed from the public feed.</div>';
      const hasActivePool = sources.some(isActiveHugeSource);
      const activeNote = hasActivePool ? ' For Active Huge Egg, the feed exposes relative weights among the listed Active Huge outcomes, not the chance that a hatch produces an Active Huge.' : '';
      $("modalContent").innerHTML = '<div class="modal-hero"><div class="modal-image">' + petIconHtml(pet.pet, pet.name, "pet-art-modal") + '</div><div><span class="pet-kind ' + esc(pet.kind.toLowerCase()) + '">' + esc(pet.kind) + '</span><p class="modal-desc">' + esc(description) + '</p></div></div><div class="modal-label">Non-exclusive odds and reward source notes</div>' + sourceBody + '<p class="section-foot">Pool odds are calculated from weights in the public game config. Chance mentions, rank rewards, and modifiers are shown with their actual meaning; missing drop rates are not estimated. Exclusive Eggs and their odds are excluded. Public data does not confirm current availability for every source.' + activeNote + '</p>';
      $("detailModal").showModal();
    }
    function showPool(id) {
      const pool = sourceMap().get(id);
      if (!pool) return;
      hideGameTip();
      $("modalKicker").textContent = pool.type === "gift" ? "Gift odds pool" : pool.type === "egg" ? "Egg odds pool" : pool.type === "chest" ? "Chest & drop odds pool" : "Game odds pool";
      $("modalTitle").textContent = pool.name;
      const oddsRows = pool.odds.slice().sort(function(a, b) { return a.pct - b.pct; });
      const petBody = oddsRows.map(function(item) { return '<div class="modal-source"><div class="source-thumb">' + petIconHtml(item.pet, item.name, "pet-art-row") + '</div><div><div class="modal-source-name">' + esc(item.name) + '</div><div class="modal-source-sub">' + esc(item.kind) + ' · weight ' + esc(item.weight) + '</div></div><div class="modal-odds">' + esc(pctLabel(item.pct)) + '<br><span class="muted">' + esc(isActiveHugeSource({ pool: pool }) ? "of listed active pool" : oneInLabel(item.oneIn)) + '</span></div></div>'; }).join("");
      const chance = pool.modifiers;
      const modifiers = [chance.goldDisabled ? "Gold disabled" : (chance.gold != null ? "Gold roll " + chance.gold + "%" : ""), chance.rainbowDisabled ? "Rainbow disabled" : (chance.rainbow != null ? "Rainbow roll " + chance.rainbow + "%" : ""), chance.shiny != null ? "Shiny roll " + chance.shiny + "%" : ""].filter(Boolean).join(" · ");
      const activePoolNote = isActiveHugeSource({ pool: pool }) ? ' For Active Huge Egg, these percentages show each listed pet’s share of the published Active Huge pool. The public feed does not provide the overall chance of hatching an Active Huge.' : '';
      $("modalContent").innerHTML = '<div class="modal-hero"><div class="modal-image">' + (thumb(pool.icon) ? iconHtml(pool.icon, pool.name, "") : '<span class="pet-placeholder">✦</span>') + '</div><div><span class="pet-kind ' + esc(pool.type) + '">' + esc(pool.availability.status) + '</span><p class="modal-desc">' + esc(pool.category) + ' · config updated ' + esc(niceDate(pool.updated)) + '</p></div></div><div class="modal-label">Huge, Titanic, and Gargantuan outcomes in this pool</div>' + petBody + (modifiers ? '<p class="section-foot">' + esc(modifiers) + '</p>' : '') + '<p class="section-foot">Chance is calculated from the configured weights across the listed pool. Effective odds may be changed by player buffs or hidden server rules.' + activePoolNote + '</p>';
      $("detailModal").showModal();
    }
    function showEnchant(id) {
        const item = state.modifierIndex.get(id);
      if (!item) return;
      hideGameTip();
      $("modalKicker").textContent = item.group + " · chance modifier";
      $("modalTitle").textContent = item.name;
      $("modalContent").innerHTML = '<div class="modal-hero"><div class="modal-image">' + (thumb(item.icon) ? iconHtml(item.icon, item.name, "") : '<span class="pet-placeholder">✦</span>') + '</div><div><div class="modifier-value">' + esc(item.value) + '</div><p class="modal-desc">' + esc(item.description) + '</p></div></div><div class="coverage-note"><span class="coverage-icon">i</span><span>This is the configured enchant description, not a complete formula for combining it with an egg or event pool. Exact effective odds are not available in the public data.</span></div>';
      $("detailModal").showModal();
    }
    function showChanceSource(id) {
      const item = state.otherSourceIndex.get(id);
      if (!item) return;
      hideGameTip();
      $("modalKicker").textContent = item.group + " · rare-pet source";
      $("modalTitle").textContent = item.name;
      const packLine = item.rolls ? '<div class="modal-source"><div class="modal-source-name">Pack contents</div><div class="modal-odds">' + item.rolls + ' rolls</div></div>' : "";
      const sourceIcon = item.iconUrl || item.icon;
      $("modalContent").innerHTML = '<div class="modal-hero"><div class="modal-image">' + (thumb(sourceIcon) ? iconHtml(sourceIcon, item.name, "") : '<span class="pet-placeholder">✦</span>') + '</div><div><span class="pet-kind other">' + esc(item.activity) + '</span><p class="modal-desc">' + esc(item.description) + '</p></div></div><div class="coverage-note"><span class="coverage-icon">i</span><span>' + esc(item.chanceNote) + '</span></div>' + packLine + '<p class="section-foot">Source: BIG Games public configuration feed. A chance mentioned without a numeric rate cannot be converted to an exact percentage from the available data.</p>';
      $("detailModal").showModal();
    }
    document.querySelectorAll("[data-tab]").forEach(function(button) { button.addEventListener("click", function() { state.tab = button.dataset.tab; state.showLimit = pageSize; searchPendingKey = ""; updateFilterStyles(); if (state.data) render(); }); });
    document.querySelectorAll("[data-kind]").forEach(function(button) { button.addEventListener("click", function() { state.kind = button.dataset.kind; state.showLimit = pageSize; updateFilterStyles(); if (state.data) render(); }); });
    $("variantSelect").addEventListener("change", function(event) { state.variant = event.target.value; state.showLimit = pageSize; if (state.data) render(); });
    $("search").addEventListener("input", function(event) { window.clearTimeout(searchTimer); const query = event.target.value.trim().toLowerCase(); searchTimer = window.setTimeout(function() { state.query = query; state.showLimit = pageSize; searchPendingKey = ""; if (state.data) render(); }, 180); });
    $("refresh").addEventListener("click", function() { loadData(true); });
    $("loadMore").addEventListener("click", function() { state.showLimit += pageSize; if (state.tab === "extras") renderChanceSources(); else render(); });
    $("cards").addEventListener("click", function(event) {
      const pet = event.target.closest("[data-pet-key]");
      const source = event.target.closest("[data-source-key]");
      const chanceSource = event.target.closest("[data-chance-source-key]");
      if (pet) { event.stopPropagation(); showPet(decodeURIComponent(pet.dataset.petKey)); }
      else if (source) { event.stopPropagation(); showPool(decodeURIComponent(source.dataset.sourceKey)); }
      else if (chanceSource) { event.stopPropagation(); showChanceSource(decodeURIComponent(chanceSource.dataset.chanceSourceKey)); }
    });
    $("specialPanel").addEventListener("click", function(event) { const enchant = event.target.closest("[data-enchant-key]"); const source = event.target.closest("[data-chance-source-key]"); if (enchant) showEnchant(decodeURIComponent(enchant.dataset.enchantKey)); else if (source) showChanceSource(decodeURIComponent(source.dataset.chanceSourceKey)); });
    $("closeModal").addEventListener("click", function() { $("detailModal").close(); });
    $("detailModal").addEventListener("click", function(event) { if (event.target === $("detailModal")) $("detailModal").close(); });
    document.addEventListener("keydown", function(event) { if (event.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { event.preventDefault(); $("search").focus(); } });
    updateFilterStyles();
    makeSearchWorker();
    cacheFallback(true);
    loadData(false);
    window.setInterval(function() { loadData(false); }, (window.PS99_STATIC_MODE ? 15 : 5) * 60 * 1000);
  </script>
</body>
</html>`;

export { page };

export default {
  async fetch(request, env, ctx) {
    void env;
    const url = new URL(request.url);
    if (url.pathname === "/api/data") return getLiveData(ctx, url.searchParams.has("fresh"));
    if (url.pathname === "/api/thumbs") return getThumbnails(url, ctx);
    if (url.pathname !== "/") return new Response("Not found", { status: 404 });
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
      },
    });
  },
};

async function getLiveData(ctx, force) {
  const cacheKey = new Request("https://ps99-odds-atlas-cache.invalid/live-data-v2");
  const cache = globalThis.caches && globalThis.caches.default;
  if (cache && !force) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }
  try {
    const [eggs, pets, enchants, lootboxes, miscItems, potions, cardItems, boosts, guildBattles, releases] = await Promise.all([
      fetchJson(API + "/api/collection/Eggs"),
      fetchJson(API + "/api/collection/Pets"),
      fetchJson(API + "/api/collection/Enchants"),
      fetchJson(API + "/api/collection/Lootboxes"),
      fetchJson(API + "/api/collection/MiscItems"),
      fetchJson(API + "/api/collection/Potions"),
      fetchJson(API + "/api/collection/CardItems"),
      fetchJson(API + "/api/collection/Boosts"),
      fetchJson(API + "/api/collection/GuildBattles"),
      fetchJson(API + "/v1/releases?pageSize=20"),
    ]);
    const response = Response.json({ eggs, pets, enchants, lootboxes, miscItems, potions, cardItems, boosts, guildBattles, releases }, {
      headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" },
    });
    if (cache && ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (_) {
    return Response.json({ error: "The PS99 data feed is temporarily unavailable." }, {
      status: 502,
      headers: { "cache-control": "no-store" },
    });
  }
}

async function getThumbnails(url, ctx) {
  const ids = Array.from(new Set((url.searchParams.get("ids") || "").split(",").filter((id) => /^\d{5,}$/.test(id)))).slice(0, 100);
  if (!ids.length) return Response.json({ data: [] }, { headers: { "cache-control": "public, max-age=86400" } });
  const cacheKey = new Request("https://ps99-odds-atlas-cache.invalid/thumbs/" + ids.slice().sort().join(","));
  const cache = globalThis.caches && globalThis.caches.default;
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }
  try {
    const apiUrl = "https://thumbnails.roblox.com/v1/assets?assetIds=" + encodeURIComponent(ids.join(",")) + "&size=420x420&format=Png&isCircular=false";
    const body = await fetchJson(apiUrl);
    const response = Response.json(body, { headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } });
    if (cache && ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (_) {
    return Response.json({ data: [] }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Upstream returned " + response.status);
  return response.json();
}
