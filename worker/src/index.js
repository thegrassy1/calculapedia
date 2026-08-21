const CHECK_PATHS = [
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/tile-calculator',
  '/landscape-fabric-calculator',
  '/stucco-calculator',
  '/thinset-calculator',
  '/driveway-sealer-calculator'
];

const DASHBOARD_HTML = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Calculapedia Control Plane</title>
<style>
:root{font-family:system-ui,sans-serif;color:#17202a;background:#f4f6f8}body{max-width:1080px;margin:0 auto;padding:28px}h1{margin-bottom:4px}.muted{color:#667085}.card{background:white;border:1px solid #e4e7ec;border-radius:12px;padding:18px;margin:16px 0;box-shadow:0 1px 2px #0000000d}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.metric{font-size:28px;font-weight:750}.label{font-size:13px;color:#667085}.ok{color:#087443}.bad{color:#b42318}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:9px;border-bottom:1px solid #eaecf0;font-size:14px}code{background:#f2f4f7;padding:2px 5px;border-radius:4px}
</style></head><body><h1>Calculapedia Control Plane</h1><p class="muted">Daily site health and revenue monitoring for Hermes.</p>
<div id="app"><div class="card">Loading metrics…</div></div>
<script>
const token=new URLSearchParams(location.search).get('token')||'';
fetch('/api/metrics'+(token?'?token='+encodeURIComponent(token):''),{headers:token?{'Authorization':'Bearer '+token}:{}})
.then(r=>r.ok?r.json():Promise.reject(new Error('Dashboard access denied')))
.then(render).catch(e=>{document.getElementById('app').innerHTML='<div class="card bad">'+e.message+'. Use the private dashboard URL supplied by the administrator.</div>'});
function render(data){
 const checks=data.health?.checks||[];
 const good=checks.filter(x=>x.ok).length;
 document.getElementById('app').innerHTML='<div class="grid">'+card('Health checks',good+'/'+checks.length)+card('Last check',data.health?.metric_date||'—')+card('Data sources',Object.keys(data.sources||{}).length)+'</div><div class="card"><h2>Site health</h2><table><tr><th>Path</th><th>Status</th><th>Response time</th></tr>'+checks.map(x=>'<tr><td><code>'+x.path+'</code></td><td class="'+(x.ok?'ok':'bad')+'">'+x.status+'</td><td>'+x.ms+' ms</td></tr>').join('')+'</table></div><div class="card"><h2>Connected data sources</h2><p class="muted">'+(Object.keys(data.sources||{}).length?'Metrics received: '+Object.keys(data.sources).join(', '):'No private analytics sources connected yet. The next step is connecting Search Console, Analytics, AdSense, and affiliate reporting APIs.')+'</p></div>';
}
function card(label,value){return '<div class="card"><div class="label">'+label+'</div><div class="metric">'+value+'</div></div>'}
</script></body></html>`;

function authorized(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(request.url);
  const supplied = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || url.searchParams.get('token');
  return supplied === expected;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}

async function collectHealth(env) {
  const base = (env.SITE_URL || 'https://calculapedia.com').replace(/\/$/, '');
  const checks = [];
  for (const path of CHECK_PATHS) {
    const started = Date.now();
    try {
      const response = await fetch(base + path, {method:'GET', redirect:'follow'});
      checks.push({path, status:response.status, ok:response.status >= 200 && response.status < 400, ms:Date.now()-started});
    } catch (error) {
      checks.push({path, status:0, ok:false, ms:Date.now()-started, error:String(error)});
    }
  }
  const record = {metric_date:new Date().toISOString(), checks};
  if (env.DB) {
    await env.DB.prepare('INSERT INTO metrics (source, metric_date, payload) VALUES (?, ?, ?)')
      .bind('health', record.metric_date, JSON.stringify(record)).run();
  }
  return record;
}

async function latestMetrics(env) {
  if (!env.DB) return {health:null, sources:{}};
  const rows = await env.DB.prepare(
    'SELECT source, metric_date, payload FROM metrics ORDER BY metric_date DESC LIMIT 100'
  ).all();
  const latest = {};
  for (const row of rows.results || []) if (!latest[row.source]) latest[row.source] = JSON.parse(row.payload);
  return {health:latest.health || null, sources:latest};
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/admin') {
      if (!authorized(request, env)) return new Response('Unauthorized', {status:401});
      return new Response(DASHBOARD_HTML, {headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    }
    if (url.pathname === '/api/metrics') {
      if (!authorized(request, env)) return json({error:'Unauthorized'}, 401);
      return json(await latestMetrics(env));
    }
    if (url.pathname === '/api/collect' && request.method === 'POST') {
      if (!authorized(request, env)) return json({error:'Unauthorized'}, 401);
      return json({health:await collectHealth(env)});
    }
    return new Response('Not found', {status:404});
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(collectHealth(env));
  }
};
