import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const [, , publicBallotPath, outputPath] = process.argv;
if (!publicBallotPath || !outputPath) {
  console.error("usage: node scripts/render-blind-design-review.mjs <public-ballot.json> <output.html>");
  process.exit(2);
}

const ballot = JSON.parse(await readFile(publicBallotPath, "utf8"));
if (ballot.schemaVersion !== 1 || !ballot.evaluationQuestion || !Array.isArray(ballot.comparisons) || ballot.comparisons.length === 0) {
  throw new Error("unsupported or empty public ballot");
}
const safeBallot = JSON.stringify(ballot).replaceAll("<", "\\u003c");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ordivon Design Evaluation</title>
<style>
:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#080b10;color:#edf1f7}
*{box-sizing:border-box}body{margin:0;background:#080b10;color:#edf1f7}.shell{width:min(96vw,1600px);margin:auto;padding:2rem 0 6rem}.top{position:sticky;top:0;z-index:3;padding:1rem 0;background:rgba(8,11,16,.94);backdrop-filter:blur(12px);border-bottom:1px solid #28303d}.top-inner{width:min(96vw,1600px);margin:auto;display:flex;gap:1rem;justify-content:space-between;align-items:center}.eyebrow{font:600 .72rem ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#9ca8b8}.progress{font:600 .76rem ui-monospace,monospace;color:#c9d4e3}.intro{max-width:58rem;padding:3rem 0 1rem}.intro h1{font-size:clamp(2rem,5vw,4.8rem);line-height:.95;letter-spacing:-.055em;margin:.6rem 0 1.2rem}.intro p{color:#aeb8c6;line-height:1.7}.comparison{padding:3.5rem 0 5rem;border-top:1px solid #28303d}.comparison header{display:flex;justify-content:space-between;gap:1rem;align-items:end;margin-bottom:1.2rem}.comparison h2{margin:0;font-size:1rem}.surface{font:600 .68rem ui-monospace,monospace;text-transform:uppercase;color:#9ca8b8}.pair{display:block;width:100%;border:1px solid #28303d;background:#0e131b}.pair img{display:block;width:100%;height:auto}.choice{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}.choice button{appearance:none;border:1px solid #3a4555;background:#111822;color:#edf1f7;padding:1rem;font:700 .8rem ui-monospace,monospace;letter-spacing:.08em;cursor:pointer}.choice button:hover,.choice button:focus-visible{border-color:#7f9fc8;outline:none}.choice button[data-selected="true"]{background:#e6edf6;color:#0a0e14;border-color:#e6edf6}.export{margin-top:3rem;padding:1.25rem 1.5rem;border:1px solid #e6edf6;background:#e6edf6;color:#080b10;font-weight:800;cursor:pointer}.export:disabled{opacity:.35;cursor:not-allowed}.note{margin-top:1rem;color:#8e9aaa;font-size:.82rem;line-height:1.6}
</style>
</head>
<body>
<div class="top"><div class="top-inner"><span class="eyebrow">Blind pairwise evaluation</span><span class="progress" id="progress">0 / ${ballot.comparisons.length}</span></div></div>
<main class="shell">
<section class="intro"><span class="eyebrow">Ordivon Web · anonymous candidates</span><h1>${escapeHtml(ballot.evaluationQuestion)}</h1><p>Inspect the full pair for each surface. Choose the side you would publish. Candidate identities and generation methods are intentionally hidden. Do not infer a numeric score; make one direct choice per pair.</p></section>
<div id="comparisons"></div>
<button class="export" id="export" disabled>Download completed responses</button>
<p class="note">The exported file contains only comparison IDs and LEFT/RIGHT choices. Variant identities are resolved later with a separate private key.</p>
</main>
<script>
const ballot=${safeBallot};
const responses=new Map();
const root=document.getElementById('comparisons');
const progress=document.getElementById('progress');
const exportButton=document.getElementById('export');
function esc(value){return String(value).replace(/[&<>\"]/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));}
ballot.comparisons.forEach((item,index)=>{
  const n=String(index+1).padStart(3,'0');
  const section=document.createElement('section'); section.className='comparison';
  section.innerHTML='<header><div><span class="surface">'+esc(item.surface)+'</span><h2>Comparison '+n+'</h2></div><span class="eyebrow">LEFT · RIGHT</span></header><a class="pair" href="pair-'+n+'.jpg" target="_blank" rel="noreferrer"><img src="pair-'+n+'.jpg" alt="Anonymous left and right design candidates for '+esc(item.surface)+'"></a><div class="choice"><button type="button" data-side="left">Choose LEFT</button><button type="button" data-side="right">Choose RIGHT</button></div>';
  section.querySelectorAll('button[data-side]').forEach((button)=>button.addEventListener('click',()=>{
    responses.set(item.comparisonId,button.dataset.side);
    section.querySelectorAll('button[data-side]').forEach((peer)=>peer.dataset.selected=String(peer===button));
    progress.textContent=responses.size+' / '+ballot.comparisons.length;
    exportButton.disabled=responses.size!==ballot.comparisons.length;
  }));
  root.append(section);
});
exportButton.addEventListener('click',()=>{
  const payload={schemaVersion:1,experimentId:ballot.experimentId,responses:ballot.comparisons.map((item)=>({comparisonId:item.comparisonId,choice:responses.get(item.comparisonId)}))};
  const blob=new Blob([JSON.stringify(payload,null,2)+'\\n'],{type:'application/json'});
  const href=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=href; a.download='ordivon-design-responses.json'; a.click(); URL.revokeObjectURL(href);
});
</script>
</body></html>`;

await writeFile(outputPath, html);
console.log(`design_review_rendered=passed comparisons=${ballot.comparisons.length}`);

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}
