/* BuildCalc static-site generator.
 * Defines every calculator as data, then stamps out one HTML page each
 * from a shared template — plus the homepage, sitemap.xml and robots.txt.
 * Run with:  node build.js
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'dist'); // deployable site goes here — upload this folder
const SITE = 'https://calculapedia.com';
const VERSION = Date.now(); // cache-busts style.css on every build

/* ---------- calculator definitions ---------- */
// Each: slug, emoji, name (short), tile (homepage blurb),
//   title, desc (meta), h1, sub, buy,
//   inputs: [{id,label,hint,value,step,type?,options?}],
//   lines: [{id,label}]  (the breakdown rows; main result is #main),
//   body: JS that reads inputs (num/intval/val) and writes results (set),
//   content: {intro, example, h3, p, faqs:[{q,a}]}

const C = [];

C.push({
  slug:'concrete-calculator', emoji:'🧱', name:'Concrete Calculator',
  tile:'Cubic yards & bags for slabs, footings & patios',
  title:'Concrete Calculator — How Much Concrete Do I Need? (Yards & Bags)',
  desc:'Free concrete calculator. Enter your slab or footing size for cubic yards, 60lb & 80lb bags, and estimated cost. Includes a 10% waste allowance.',
  h1:'Concrete Calculator', sub:'How much concrete do you need? Enter your dimensions for cubic yards, bags, and cost.',
  buy:'Shop concrete mix & bags →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'10',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'thick',label:'Thickness',hint:'(inches)',value:'4',step:'0.25'},
    {id:'price',label:'Price per cubic yard',hint:'(optional, $)',value:'150',step:'1'}
  ],
  lines:[
    {id:'cyWaste',label:'With 10% waste allowance'},
    {id:'bag60',label:'60 lb bags needed'},
    {id:'bag80',label:'80 lb bags needed'},
    {id:'cost',label:'Estimated concrete cost'}
  ],
  body:`var L=num('len'),W=num('wid'),T=num('thick'),P=num('price');
var cf=L*W*(T/12),cy=cf/27,cfW=cf*1.10;
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('cyWaste',(cy*1.10).toFixed(2)+' cu yd');
set('bag60',Math.ceil(cfW/0.45)+' bags');
set('bag80',Math.ceil(cfW/0.60)+' bags');
set('cost',P>0?money(cy*1.10*P):'—');`,
  content:{
    intro:'The calculator multiplies your slab&rsquo;s length, width and thickness to get the volume, converts it to cubic yards (the unit concrete is sold in), then works out how many bags that equals.',
    example:'<strong>Worked example — a 10&nbsp;ft × 10&nbsp;ft patio at 4&nbsp;inches:</strong><br>10 × 10 × (4 ÷ 12) = 33.3 cubic feet → 33.3 ÷ 27 = <strong>1.23 cubic yards</strong>. Add 10% and you&rsquo;d order about <strong>1.35 cubic yards</strong>.',
    h3:'Bags vs. ready-mix',
    p:'For small jobs under about 1 cubic yard, bagged concrete is easiest. Above that, ready-mix delivered by truck is normally cheaper and far less work than mixing dozens of bags.',
    faqs:[
      {q:'How much concrete do I need for a 10×10 slab?',a:'At 4 inches thick, about <strong>1.23 cubic yards</strong> (≈74 of the 60lb bags). Order ~1.35 cubic yards to cover waste.'},
      {q:'How many 80 lb bags are in a cubic yard?',a:'About <strong>45 bags</strong> — each 80lb bag yields roughly 0.6 cubic feet and a cubic yard is 27 cubic feet.'}
    ]
  }
});

C.push({
  slug:'mulch-calculator', emoji:'🌿', name:'Mulch Calculator',
  tile:'Bags or cubic yards for any garden bed',
  title:'Mulch Calculator — How Much Mulch Do I Need? (Bags & Yards)',
  desc:'Free mulch calculator. Enter your bed size and depth for cubic yards, 2 cu ft bags, and estimated cost. Instant, no signup.',
  h1:'Mulch Calculator', sub:'How much mulch do you need? Enter your bed size and depth for yards, bags, and cost.',
  buy:'Shop mulch by the bag →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'5',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'3',step:'0.5'},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'4',step:'0.5'}
  ],
  lines:[
    {id:'cf',label:'Cubic feet needed'},
    {id:'bags',label:'2 cu ft bags needed'},
    {id:'cost',label:'Estimated cost (bags)'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,bags=Math.ceil(cf/2);
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('cf',cf.toFixed(1)+' cu ft');
set('bags',bags+' bags');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'It multiplies your bed&rsquo;s length, width and depth to find the volume, then converts that into cubic yards (for bulk) and 2-cubic-foot bags (the common store size).',
    example:'<strong>Worked example — a 20&nbsp;ft × 5&nbsp;ft bed at 3&nbsp;inches deep:</strong><br>20 × 5 × (3 ÷ 12) = 25 cubic feet → 25 ÷ 27 = <strong>0.93 cubic yards</strong>. In bags: 25 ÷ 2 = <strong>13 bags</strong>.',
    h3:'Bags or bulk?',
    p:'Under about 1 cubic yard (~13 bags), bagged mulch is convenient. For larger areas, bulk delivery is usually cheaper per unit — the break-even is often around 1.5–2 cubic yards.',
    faqs:[
      {q:'How many bags of mulch are in a yard?',a:'<strong>13.5 bags</strong> of the standard 2 cubic foot size make up one cubic yard.'},
      {q:'How deep should mulch be?',a:'<strong>2–3 inches</strong> is ideal — enough to suppress weeds and hold moisture without smothering roots.'}
    ]
  }
});

C.push({
  slug:'gravel-calculator', emoji:'⛏️', name:'Gravel Calculator',
  tile:'Tons & cubic yards for driveways & paths',
  title:'Gravel Calculator — How Much Gravel Do I Need? (Tons & Yards)',
  desc:'Free gravel calculator for driveways, paths and drainage. Enter area and depth for cubic yards, tons, and estimated cost.',
  h1:'Gravel Calculator', sub:'How much gravel do you need? Enter the area and depth for cubic yards, tons, and cost.',
  buy:'Find gravel & landscaping stone →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'4',step:'0.5'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'35',step:'1'}
  ],
  lines:[
    {id:'tons',label:'Estimated tons needed'},
    {id:'cf',label:'Cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,tons=cy*1.4;
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('tons',tons.toFixed(2)+' tons');
set('cf',cf.toFixed(1)+' cu ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It calculates the volume of your area, converts it to cubic yards, then to tons using a typical gravel weight of about 1.4 tons per cubic yard.',
    example:'<strong>Worked example — a 20&nbsp;ft × 10&nbsp;ft driveway at 4&nbsp;inches:</strong><br>20 × 10 × (4 ÷ 12) = 66.7 cubic feet → ÷ 27 = <strong>2.47 cubic yards</strong> → × 1.4 = <strong>3.46 tons</strong>.',
    h3:'How deep should gravel be?',
    p:'For a walking path, 2 inches is plenty. For a driveway that holds vehicle weight, aim for 4 inches of gravel over a compacted base.',
    faqs:[
      {q:'How many tons of gravel are in a cubic yard?',a:'About <strong>1.4 tons</strong>, varying from 1.4 to 1.5 by stone type and moisture.'},
      {q:'How much gravel for a driveway?',a:'A 20 × 10 ft driveway at 4 inches deep needs roughly <strong>2.5 cubic yards (~3.4 tons)</strong>.'}
    ]
  }
});

C.push({
  slug:'paint-calculator', emoji:'🎨', name:'Paint Calculator',
  tile:'Gallons needed for any room or wall',
  title:'Paint Calculator — How Much Paint Do I Need? (Gallons per Room)',
  desc:'Free paint calculator. Enter room size, coats, doors and windows to find how many gallons you need and the estimated cost.',
  h1:'Paint Calculator', sub:'How much paint do you need? Enter your room size, coats, and openings.',
  buy:'Shop interior paint →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'8',step:'0.1'},
    {id:'coats',label:'Coats',type:'select',options:[{v:'1',t:'1 coat'},{v:'2',t:'2 coats',sel:true},{v:'3',t:'3 coats'}]},
    {id:'doors',label:'Doors',hint:'(subtracted)',value:'1',step:'1'},
    {id:'windows',label:'Windows',hint:'(subtracted)',value:'2',step:'1'},
    {id:'price',label:'Price per gallon',hint:'(optional, $)',value:'35',step:'1'}
  ],
  lines:[
    {id:'area',label:'Paintable wall area'},
    {id:'totalArea',label:'Total area (incl. coats)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),H=num('height');
var coats=parseInt(val('coats'),10)||1,doors=intval('doors'),win=intval('windows'),P=num('price');
var wall=2*(L+W)*H,paint=Math.max(0,wall-doors*21-win*15),total=paint*coats,gal=total/350;
set('main',(Math.ceil(gal*10)/10).toFixed(1)+' gallons (buy '+Math.ceil(gal)+')');
set('area',Math.round(paint)+' sq ft');
set('totalArea',Math.round(total)+' sq ft');
set('cost',P>0?money(Math.ceil(gal)*P):'—');`,
  content:{
    intro:'It measures your wall area (room perimeter × wall height), subtracts standard sizes for each door and window, multiplies by the number of coats, and divides by a gallon&rsquo;s coverage of about 350 sq ft.',
    example:'<strong>Worked example — a 12&nbsp;ft × 12&nbsp;ft room, 8&nbsp;ft walls, 2 coats:</strong><br>Perimeter 48 × 8 = 384 sq ft of wall. Minus 1 door (21) + 2 windows (30) = 333 sq ft. × 2 ÷ 350 = <strong>1.9 gallons</strong> → buy <strong>2 gallons</strong>.',
    h3:'Standard openings used',
    p:'Each door counts as 21 sq ft and each window as 15 sq ft. Adjust the counts if your openings are unusually large.',
    faqs:[
      {q:'How much paint for a 12×12 room?',a:'About <strong>2 gallons</strong> for two coats on 8-foot walls.'},
      {q:'How many square feet does a gallon cover?',a:'Roughly <strong>350 sq ft</strong> per coat on a smooth, primed surface.'}
    ]
  }
});

C.push({
  slug:'tile-calculator', emoji:'◻️', name:'Tile Calculator',
  tile:'Tiles & boxes for floors & walls',
  title:'Tile Calculator — How Many Tiles Do I Need? (Tiles & Boxes)',
  desc:'Free tile calculator for floors and walls. Enter area and tile size for tiles and boxes needed, with waste allowance and cost.',
  h1:'Tile Calculator', sub:'How many tiles do you need? Enter your area and tile size for tiles, boxes, and cost.',
  buy:'Shop floor & wall tile →',
  inputs:[
    {id:'len',label:'Area length',hint:'(feet)',value:'10',step:'0.1'},
    {id:'wid',label:'Area width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'tlen',label:'Tile length',hint:'(inches)',value:'12',step:'0.25'},
    {id:'twid',label:'Tile width',hint:'(inches)',value:'12',step:'0.25'},
    {id:'waste',label:'Waste allowance',type:'select',options:[{v:'10',t:'10% (straight)',sel:true},{v:'15',t:'15% (some cuts)'},{v:'20',t:'20% (diagonal)'}]},
    {id:'perbox',label:'Tiles per box',hint:'(optional)',value:'10',step:'1'},
    {id:'price',label:'Price per tile',hint:'(optional, $)',value:'3',step:'0.25'}
  ],
  lines:[
    {id:'area',label:'Area to cover'},
    {id:'boxes',label:'Boxes needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),TL=num('tlen'),TW=num('twid');
var waste=parseFloat(val('waste'))||0,perbox=intval('perbox'),P=num('price');
var area=L*W,tsf=(TL*TW)/144,tiles=tsf>0?Math.ceil(area/tsf*(1+waste/100)):0;
set('main',tiles+' tiles');
set('area',area.toFixed(0)+' sq ft');
set('boxes',perbox>0?Math.ceil(tiles/perbox)+' boxes':'—');
set('cost',P>0?money(tiles*P):'—');`,
  content:{
    intro:'It finds the area you&rsquo;re covering and the area of a single tile, divides one by the other, then adds a waste allowance for cuts and breakage and rounds up to whole tiles and boxes.',
    example:'<strong>Worked example — a 10&nbsp;ft × 10&nbsp;ft floor with 12&nbsp;×&nbsp;12 in tiles:</strong><br>Area 100 sq ft, each tile 1 sq ft → 100 tiles. Add 10% → <strong>110 tiles</strong> (11 boxes of 10).',
    h3:'Why the waste allowance matters',
    p:'Cut edges, the occasional break, and future repairs all eat into your count. 10% is standard; use 15–20% for diagonal or herringbone layouts.',
    faqs:[
      {q:'How many 12×12 tiles for 100 sq ft?',a:'<strong>110 tiles</strong> — 100 for the area plus 10% waste.'},
      {q:'How much extra should I buy?',a:'<strong>10%</strong> for simple layouts, <strong>15–20%</strong> for diagonal or busy rooms.'}
    ]
  }
});

C.push({
  slug:'drywall-calculator', emoji:'🔲', name:'Drywall Calculator',
  tile:'Sheets needed for walls & ceilings',
  title:'Drywall Calculator — How Many Sheets of Drywall Do I Need?',
  desc:'Free drywall calculator. Enter room size and sheet size to find how many sheets of drywall you need, with waste and cost.',
  h1:'Drywall Calculator', sub:'How much drywall do you need? Enter your room size for sheets and cost.',
  buy:'Shop drywall sheets →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'8',step:'0.1'},
    {id:'sheet',label:'Sheet size',type:'select',options:[{v:'32',t:"4×8 ft (32 sq ft)",sel:true},{v:'48',t:'4×12 ft (48 sq ft)'}]},
    {id:'price',label:'Price per sheet',hint:'(optional, $)',value:'15',step:'1'}
  ],
  lines:[
    {id:'area',label:'Wall area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),H=num('height'),S=parseFloat(val('sheet'))||32,P=num('price');
var area=2*(L+W)*H,sheets=S>0?Math.ceil(area*1.10/S):0;
set('main',sheets+' sheets');
set('area',Math.round(area)+' sq ft');
set('cost',P>0?money(sheets*P):'—');`,
  content:{
    intro:'It calculates your total wall area (room perimeter × height), adds 10% for waste and cuts, and divides by the area of one drywall sheet.',
    example:'<strong>Worked example — a 12&nbsp;ft × 12&nbsp;ft room, 8&nbsp;ft walls, 4×8 sheets:</strong><br>Perimeter 48 × 8 = 384 sq ft × 1.10 = 422 ÷ 32 = <strong>14 sheets</strong>.',
    h3:'Don&rsquo;t forget the ceiling',
    p:'This estimate covers walls. If you&rsquo;re also drywalling the ceiling, add the room&rsquo;s floor area (length × width) and divide by your sheet size for the extra sheets.',
    faqs:[
      {q:'What size drywall sheet should I buy?',a:'4×8 ft sheets are easiest to handle solo; 4×12 ft sheets mean fewer seams but need two people.'},
      {q:'How much extra drywall for waste?',a:'About <strong>10%</strong> covers offcuts and damaged sheets on a typical room.'}
    ]
  }
});

C.push({
  slug:'sod-calculator', emoji:'🌱', name:'Sod Calculator',
  tile:'Rolls & pallets for a new lawn',
  title:'Sod Calculator — How Much Sod Do I Need? (Rolls & Pallets)',
  desc:'Free sod calculator. Enter your lawn size to find square feet, rolls, and pallets of sod needed, plus estimated cost.',
  h1:'Sod Calculator', sub:'How much sod do you need? Enter your lawn size for rolls, pallets, and cost.',
  buy:'Find sod & turf suppliers →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'40',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'25',step:'0.1'},
    {id:'price',label:'Price per pallet',hint:'(optional, $)',value:'180',step:'5'}
  ],
  lines:[
    {id:'rolls',label:'Rolls (10 sq ft each)'},
    {id:'pallets',label:'Pallets (450 sq ft each)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),P=num('price');
var area=L*W*1.05,rolls=Math.ceil(area/10),pallets=Math.ceil(area/450);
set('main',Math.round(area)+' sq ft');
set('rolls',rolls+' rolls');
set('pallets',pallets+' pallets');
set('cost',P>0?money(pallets*P):'—');`,
  content:{
    intro:'It measures your lawn area and adds 5% for trimming around curves and edges, then converts to the two ways sod is sold: individual rolls and full pallets.',
    example:'<strong>Worked example — a 40&nbsp;ft × 25&nbsp;ft yard:</strong><br>1,000 sq ft × 1.05 = 1,050 sq ft → 105 rolls, or <strong>3 pallets</strong> (450 sq ft each).',
    h3:'Rolls vs. pallets',
    p:'Small patches are sold as rolls; whole lawns are cheaper by the pallet. Lay sod the same day it&rsquo;s delivered — it dries out fast.',
    faqs:[
      {q:'How many square feet is a pallet of sod?',a:'Most pallets cover about <strong>450 sq ft</strong>, though this varies by farm (400–500 sq ft).'},
      {q:'How much extra sod should I order?',a:'Add about <strong>5%</strong> for cuts around beds, paths and curves.'}
    ]
  }
});

C.push({
  slug:'topsoil-calculator', emoji:'🪴', name:'Topsoil Calculator',
  tile:'Cubic yards & bags for beds & lawns',
  title:'Topsoil Calculator — How Much Topsoil Do I Need? (Yards & Bags)',
  desc:'Free topsoil calculator. Enter area and depth for cubic yards, 40lb bags, and estimated cost. Instant, no signup.',
  h1:'Topsoil Calculator', sub:'How much topsoil do you need? Enter area and depth for yards, bags, and cost.',
  buy:'Shop topsoil & garden soil →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'3',step:'0.5'},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'3',step:'0.5'}
  ],
  lines:[
    {id:'cf',label:'Cubic feet needed'},
    {id:'bags',label:'40 lb bags (0.75 cu ft)'},
    {id:'cost',label:'Estimated cost (bags)'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,bags=Math.ceil(cf/0.75);
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('cf',cf.toFixed(1)+' cu ft');
set('bags',bags+' bags');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'It multiplies area by depth for the volume, then shows it as cubic yards (bulk delivery) and 40 lb bags, which hold roughly 0.75 cubic feet each.',
    example:'<strong>Worked example — a 20&nbsp;ft × 10&nbsp;ft bed at 3&nbsp;inches:</strong><br>200 × (3 ÷ 12) = 50 cubic feet → ÷ 27 = <strong>1.85 cubic yards</strong>, or about 67 bags.',
    h3:'Bags or bulk delivery?',
    p:'Bags suit small top-ups. For anything over about 1 cubic yard, bulk topsoil delivered by the yard is far cheaper than buying dozens of bags.',
    faqs:[
      {q:'How many bags of topsoil in a cubic yard?',a:'About <strong>36 bags</strong> of the 40 lb (0.75 cu ft) size make one cubic yard.'},
      {q:'How deep should topsoil be for grass?',a:'Aim for <strong>3–6 inches</strong> of quality topsoil for a healthy new lawn.'}
    ]
  }
});

C.push({
  slug:'fence-calculator', emoji:'🚧', name:'Fence Calculator',
  tile:'Panels & posts for any fence line',
  title:'Fence Calculator — How Many Posts and Panels Do I Need?',
  desc:'Free fence calculator. Enter your fence length and panel width for the number of panels, posts, and estimated cost.',
  h1:'Fence Calculator', sub:'How much fencing do you need? Enter your run length for panels, posts, and cost.',
  buy:'Shop fencing & posts →',
  inputs:[
    {id:'length',label:'Total fence length',hint:'(feet)',value:'100',step:'1'},
    {id:'panel',label:'Panel / section width',hint:'(feet)',value:'8',step:'0.5'},
    {id:'price',label:'Price per linear foot',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'posts',label:'Posts needed'},
    {id:'rails',label:'Rails (3 per section)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var Ln=num('length'),Pw=num('panel'),P=num('price');
var panels=Pw>0?Math.ceil(Ln/Pw):0,posts=panels+1,rails=panels*3;
set('main',panels+' panels / sections');
set('posts',posts+' posts');
set('rails',rails+' rails');
set('cost',P>0?money(Ln*P):'—');`,
  content:{
    intro:'It divides your fence run by the panel width to get the number of sections, then adds one post per section plus a final end post, and three rails per section.',
    example:'<strong>Worked example — a 100&nbsp;ft fence with 8&nbsp;ft sections:</strong><br>100 ÷ 8 = 13 sections → <strong>14 posts</strong> and 39 rails.',
    h3:'Don&rsquo;t forget gates and corners',
    p:'Each gate and corner usually needs an extra, heavier post. Add those to the post count above before you buy.',
    faqs:[
      {q:'How far apart should fence posts be?',a:'Most wood and vinyl fences use <strong>6–8 ft</strong> spacing between posts.'},
      {q:'How many posts for a 100 ft fence?',a:'At 8 ft spacing, about <strong>14 posts</strong> (sections plus one end post).'}
    ]
  }
});

C.push({
  slug:'deck-board-calculator', emoji:'🪵', name:'Deck Board Calculator',
  tile:'Boards needed for any deck size',
  title:'Deck Board Calculator — How Many Deck Boards Do I Need?',
  desc:'Free deck board calculator. Enter deck size and board dimensions for the number of boards, linear feet, and cost.',
  h1:'Deck Board Calculator', sub:'How many deck boards do you need? Enter your deck and board size.',
  buy:'Shop decking boards →',
  inputs:[
    {id:'len',label:'Deck length',hint:'(feet)',value:'16',step:'0.1'},
    {id:'wid',label:'Deck width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'bwid',label:'Board width',hint:'(inches)',value:'5.5',step:'0.25'},
    {id:'blen',label:'Board length',hint:'(feet)',value:'16',step:'1'},
    {id:'price',label:'Price per board',hint:'(optional, $)',value:'18',step:'1'}
  ],
  lines:[
    {id:'area',label:'Deck area'},
    {id:'linft',label:'Linear feet of decking'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),BW=num('bwid'),BL=num('blen'),P=num('price');
var cover=(BW+0.125)/12,area=L*W,linft=cover>0?(area/cover)*1.10:0,boards=BL>0?Math.ceil(linft/BL):0;
set('main',boards+' boards');
set('area',area.toFixed(0)+' sq ft');
set('linft',Math.round(linft)+' ft');
set('cost',P>0?money(boards*P):'—');`,
  content:{
    intro:'It works out how much deck surface each board covers (its width plus a small gap), divides your deck area by that, adds 10% for waste, and converts the total linear footage into whole boards.',
    example:'<strong>Worked example — a 16&nbsp;ft × 12&nbsp;ft deck, 5.5&nbsp;in boards, 16&nbsp;ft lengths:</strong><br>192 sq ft of decking → about 422 linear feet with waste → <strong>27 boards</strong>.',
    h3:'Board gap matters',
    p:'A 1/8-inch gap between boards lets the deck drain and the wood breathe. The calculator includes that gap so you don&rsquo;t come up short.',
    faqs:[
      {q:'What is a standard deck board width?',a:'Most decking boards are <strong>5.5 inches</strong> wide (a nominal 6-inch board).'},
      {q:'How much extra decking should I buy?',a:'Add about <strong>10%</strong> for cuts, waste, and the occasional bad board.'}
    ]
  }
});

C.push({
  slug:'flooring-calculator', emoji:'🪟', name:'Flooring Calculator',
  tile:'Boxes of laminate, vinyl or hardwood',
  title:'Flooring Calculator — How Much Flooring Do I Need? (Boxes)',
  desc:'Free flooring calculator for laminate, vinyl and hardwood. Enter room size and box coverage for boxes needed, with waste and cost.',
  h1:'Flooring Calculator', sub:'How much flooring do you need? Enter your room size and box coverage.',
  buy:'Shop laminate & vinyl flooring →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'box',label:'Coverage per box',hint:'(sq ft)',value:'20',step:'0.5'},
    {id:'price',label:'Price per box',hint:'(optional, $)',value:'40',step:'1'}
  ],
  lines:[
    {id:'area',label:'Room area'},
    {id:'areaW',label:'Area incl. 10% waste'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),B=num('box'),P=num('price');
var area=L*W,areaW=area*1.10,boxes=B>0?Math.ceil(areaW/B):0;
set('main',boxes+' boxes');
set('area',area.toFixed(0)+' sq ft');
set('areaW',areaW.toFixed(0)+' sq ft');
set('cost',P>0?money(boxes*P):'—');`,
  content:{
    intro:'It finds your room area, adds 10% for cuts and waste, then divides by the square footage each box of flooring covers (printed on the box label).',
    example:'<strong>Worked example — a 12&nbsp;ft × 10&nbsp;ft room, 20 sq ft per box:</strong><br>120 sq ft × 1.10 = 132 sq ft ÷ 20 = <strong>7 boxes</strong>.',
    h3:'Buy from the same batch',
    p:'Order all your flooring at once from the same lot number — colors and patterns can shift slightly between production runs.',
    faqs:[
      {q:'How much extra flooring should I buy?',a:'<strong>10%</strong> for straight rooms, up to 15% for diagonal layouts or rooms with many angles.'},
      {q:'How many square feet are in a box of laminate?',a:'It varies — commonly <strong>16–24 sq ft</strong>. Always check the box label and enter that figure.'}
    ]
  }
});

C.push({
  slug:'carpet-calculator', emoji:'🧶', name:'Carpet Calculator',
  tile:'Square yards for any room',
  title:'Carpet Calculator — How Much Carpet Do I Need? (Square Yards)',
  desc:'Free carpet calculator. Enter your room size for square feet, square yards, and estimated cost. Instant, no signup.',
  h1:'Carpet Calculator', sub:'How much carpet do you need? Enter your room size for square yards and cost.',
  buy:'Shop carpet & padding →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'15',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'price',label:'Price per square yard',hint:'(optional, $)',value:'30',step:'1'}
  ],
  lines:[
    {id:'area',label:'Room area'},
    {id:'sqyd',label:'Square yards (incl. 10%)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),P=num('price');
var area=L*W,sqyd=(area/9)*1.10;
set('main',sqyd.toFixed(1)+' sq yards');
set('area',area.toFixed(0)+' sq ft');
set('sqyd',sqyd.toFixed(1)+' sq yd');
set('cost',P>0?money(sqyd*P):'—');`,
  content:{
    intro:'Carpet is priced by the square yard. The calculator finds your room&rsquo;s square footage, adds 10% for trimming and seams, then divides by 9 to convert to square yards.',
    example:'<strong>Worked example — a 15&nbsp;ft × 12&nbsp;ft room:</strong><br>180 sq ft × 1.10 = 198 ÷ 9 = <strong>22 square yards</strong>.',
    h3:'Mind the roll width',
    p:'Carpet usually comes in 12 ft wide rolls. Rooms wider than 12 ft need a seam, which adds a little waste — the 10% allowance covers most cases.',
    faqs:[
      {q:'How do I convert square feet to square yards?',a:'Divide the square footage by <strong>9</strong> (a square yard is 3 ft × 3 ft).'},
      {q:'How much extra carpet should I order?',a:'About <strong>10%</strong> for cuts and seams; more for stairs or oddly shaped rooms.'}
    ]
  }
});

C.push({
  slug:'paver-calculator', emoji:'🧱', name:'Paver Calculator',
  tile:'Pavers needed for patios & walkways',
  title:'Paver Calculator — How Many Pavers Do I Need?',
  desc:'Free paver calculator for patios and walkways. Enter area and paver size for the number of pavers needed, with waste and cost.',
  h1:'Paver Calculator', sub:'How many pavers do you need? Enter your area and paver size.',
  buy:'Shop pavers & edging →',
  inputs:[
    {id:'len',label:'Area length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Area width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'plen',label:'Paver length',hint:'(inches)',value:'8',step:'0.25'},
    {id:'pwid',label:'Paver width',hint:'(inches)',value:'4',step:'0.25'},
    {id:'price',label:'Price per paver',hint:'(optional, $)',value:'1.5',step:'0.25'}
  ],
  lines:[
    {id:'area',label:'Area to cover'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),PL=num('plen'),PW=num('pwid'),P=num('price');
var area=L*W,psf=(PL*PW)/144,pavers=psf>0?Math.ceil(area/psf*1.05):0;
set('main',pavers+' pavers');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(pavers*P):'—');`,
  content:{
    intro:'It calculates your patio area and the surface area of one paver, divides to get the count, and adds 5% for cuts and breakage.',
    example:'<strong>Worked example — a 12&nbsp;ft × 10&nbsp;ft patio with 8&nbsp;×&nbsp;4 in pavers:</strong><br>120 sq ft ÷ 0.22 sq ft per paver × 1.05 = <strong>540 pavers</strong>.',
    h3:'Don&rsquo;t forget the base',
    p:'A solid paver patio needs a 4–6 inch base of gravel plus an inch of sand underneath. Use the gravel and sand calculators for those layers.',
    faqs:[
      {q:'How many pavers do I need per square foot?',a:'It depends on paver size — an 8×4 in paver covers about 0.22 sq ft, so roughly <strong>4.5 per square foot</strong>.'},
      {q:'How much extra for waste?',a:'Add about <strong>5%</strong>, or up to 10% for curved or diagonal patterns.'}
    ]
  }
});

C.push({
  slug:'sand-calculator', emoji:'🏖️', name:'Sand Calculator',
  tile:'Tons & cubic yards of sand',
  title:'Sand Calculator — How Much Sand Do I Need? (Tons & Yards)',
  desc:'Free sand calculator for paver bases, sandboxes and fill. Enter area and depth for cubic yards, tons, and estimated cost.',
  h1:'Sand Calculator', sub:'How much sand do you need? Enter the area and depth for cubic yards, tons, and cost.',
  buy:'Shop sand & paver base →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'1',step:'0.5'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'30',step:'1'}
  ],
  lines:[
    {id:'tons',label:'Estimated tons needed'},
    {id:'cf',label:'Cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,tons=cy*1.35;
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('tons',tons.toFixed(2)+' tons');
set('cf',cf.toFixed(1)+' cu ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It finds the volume of sand from your area and depth, converts to cubic yards, then to tons using a typical sand weight of about 1.35 tons per cubic yard.',
    example:'<strong>Worked example — a 12&nbsp;ft × 10&nbsp;ft paver base at 1&nbsp;inch:</strong><br>120 × (1 ÷ 12) = 10 cubic feet → ÷ 27 = <strong>0.37 cubic yards</strong> → about 0.5 tons.',
    h3:'How much sand under pavers?',
    p:'A 1-inch bedding layer of sand is standard under pavers, on top of a compacted gravel base.',
    faqs:[
      {q:'How many tons of sand in a cubic yard?',a:'About <strong>1.35 tons</strong> for dry sand; wet sand weighs a little more.'},
      {q:'What kind of sand goes under pavers?',a:'Use coarse <strong>concrete or paver sand</strong> for bedding — not fine play sand.'}
    ]
  }
});

C.push({
  slug:'asphalt-calculator', emoji:'🛣️', name:'Asphalt Calculator',
  tile:'Tons of asphalt for driveways',
  title:'Asphalt Calculator — How Much Asphalt Do I Need? (Tons)',
  desc:'Free asphalt calculator for driveways and lots. Enter area and thickness for tons of hot mix asphalt needed and estimated cost.',
  h1:'Asphalt Calculator', sub:'How much asphalt do you need? Enter area and thickness for tons and cost.',
  buy:'Find asphalt suppliers →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'40',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'depth',label:'Thickness',hint:'(inches)',value:'3',step:'0.5'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'120',step:'5'}
  ],
  lines:[
    {id:'area',label:'Area'},
    {id:'cf',label:'Cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var area=L*W,cf=area*(D/12),tons=cf*145/2000;
set('main',tons.toFixed(2)+' tons');
set('area',area.toFixed(0)+' sq ft');
set('cf',cf.toFixed(1)+' cu ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It calculates the volume of asphalt from your area and thickness, then converts to tons using a compacted hot-mix weight of about 145 lb per cubic foot.',
    example:'<strong>Worked example — a 40&nbsp;ft × 12&nbsp;ft driveway at 3&nbsp;inches:</strong><br>480 sq ft × (3 ÷ 12) = 120 cubic feet × 145 ÷ 2000 = <strong>8.7 tons</strong>.',
    h3:'Compacted vs. loose',
    p:'Asphalt is ordered by weight and compacts as it&rsquo;s rolled. This estimate is for the finished compacted thickness — the standard way suppliers quote.',
    faqs:[
      {q:'How thick should an asphalt driveway be?',a:'A residential driveway is usually <strong>2–3 inches</strong> of asphalt over a 4–8 inch gravel base.'},
      {q:'How much does a ton of asphalt cover?',a:'At 2 inches thick, one ton covers roughly <strong>80 sq ft</strong>.'}
    ]
  }
});

C.push({
  slug:'roofing-calculator', emoji:'🏠', name:'Roofing Calculator',
  tile:'Squares & shingle bundles',
  title:'Roofing Calculator — How Many Shingles Do I Need? (Squares & Bundles)',
  desc:'Free roofing calculator. Enter roof size and pitch for roofing squares and shingle bundles needed, with waste and cost.',
  h1:'Roofing Calculator', sub:'How many shingles do you need? Enter your roof size and pitch.',
  buy:'Shop roofing shingles →',
  inputs:[
    {id:'len',label:'Roof length',hint:'(feet, footprint)',value:'40',step:'0.1'},
    {id:'wid',label:'Roof width',hint:'(feet, footprint)',value:'30',step:'0.1'},
    {id:'pitch',label:'Roof pitch',type:'select',options:[{v:'1.03',t:'Low (3/12)'},{v:'1.12',t:'Medium (6/12)',sel:true},{v:'1.25',t:'Steep (9/12)'},{v:'1.42',t:'Very steep (12/12)'}]},
    {id:'price',label:'Price per bundle',hint:'(optional, $)',value:'35',step:'1'}
  ],
  lines:[
    {id:'area',label:'Roof area'},
    {id:'squares',label:'Roofing squares'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),M=parseFloat(val('pitch'))||1,P=num('price');
var area=L*W*M,sq=area/100,bundles=Math.ceil(sq*3*1.10);
set('main',bundles+' bundles');
set('area',Math.round(area)+' sq ft');
set('squares',sq.toFixed(1)+' squares');
set('cost',P>0?money(bundles*P):'—');`,
  content:{
    intro:'It takes your roof&rsquo;s footprint, multiplies by a pitch factor to get the true sloped area, converts to roofing &ldquo;squares&rdquo; (100 sq ft each), then to shingle bundles at 3 bundles per square plus 10% waste.',
    example:'<strong>Worked example — a 40&nbsp;ft × 30&nbsp;ft footprint, 6/12 pitch:</strong><br>1,200 × 1.12 = 1,344 sq ft → 13.4 squares → <strong>45 bundles</strong> with waste.',
    h3:'Measure footprint, not slope',
    p:'Enter the building&rsquo;s footprint (length × width as seen from above). The pitch factor converts it to the larger sloped surface area for you.',
    faqs:[
      {q:'How many bundles of shingles in a square?',a:'<strong>3 bundles</strong> cover one roofing square (100 sq ft) for standard architectural shingles.'},
      {q:'How much extra for waste?',a:'About <strong>10%</strong> for a simple gable roof; 15% for roofs with many hips and valleys.'}
    ]
  }
});

C.push({
  slug:'brick-calculator', emoji:'🧱', name:'Brick Calculator',
  tile:'Bricks needed for any wall',
  title:'Brick Calculator — How Many Bricks Do I Need?',
  desc:'Free brick calculator. Enter your wall size to find how many standard bricks you need, with waste allowance and estimated cost.',
  h1:'Brick Calculator', sub:'How many bricks do you need? Enter your wall size.',
  buy:'Shop bricks & mortar →',
  inputs:[
    {id:'len',label:'Wall length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'8',step:'0.1'},
    {id:'price',label:'Price per brick',hint:'(optional, $)',value:'0.6',step:'0.05'}
  ],
  lines:[
    {id:'area',label:'Wall area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),P=num('price');
var area=L*H,bricks=Math.ceil(area*7*1.05);
set('main',bricks+' bricks');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(bricks*P):'—');`,
  content:{
    intro:'It calculates your wall area and multiplies by about 7 bricks per square foot — the standard for modular bricks with a 3/8-inch mortar joint — then adds 5% for cuts and breakage.',
    example:'<strong>Worked example — a 20&nbsp;ft × 8&nbsp;ft wall:</strong><br>160 sq ft × 7 × 1.05 = <strong>1,176 bricks</strong>.',
    h3:'Single vs. double layer',
    p:'This assumes a single-brick (veneer) face. A double-thickness structural wall needs roughly twice as many bricks.',
    faqs:[
      {q:'How many bricks per square foot?',a:'About <strong>7 modular bricks</strong> per square foot of wall with standard mortar joints.'},
      {q:'How much extra should I order?',a:'Add <strong>5%</strong> for breakage and cuts; keep a few spares for future repairs.'}
    ]
  }
});

C.push({
  slug:'concrete-block-calculator', emoji:'🟫', name:'Block Calculator',
  tile:'Cinder / concrete blocks for a wall',
  title:'Concrete Block Calculator — How Many Blocks Do I Need?',
  desc:'Free concrete block (cinder block) calculator. Enter your wall size for the number of 8×16 blocks needed, with waste and cost.',
  h1:'Concrete Block Calculator', sub:'How many blocks do you need? Enter your wall size.',
  buy:'Shop concrete blocks →',
  inputs:[
    {id:'len',label:'Wall length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'8',step:'0.1'},
    {id:'price',label:'Price per block',hint:'(optional, $)',value:'2',step:'0.1'}
  ],
  lines:[
    {id:'area',label:'Wall area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),P=num('price');
var area=L*H,blocks=Math.ceil(area*1.125*1.05);
set('main',blocks+' blocks');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(blocks*P):'—');`,
  content:{
    intro:'A standard 8×16 inch concrete block covers about 0.89 sq ft of wall with mortar, so it takes roughly 1.125 blocks per square foot. The calculator applies that rate and adds 5% for waste.',
    example:'<strong>Worked example — a 20&nbsp;ft × 8&nbsp;ft wall:</strong><br>160 sq ft × 1.125 × 1.05 = <strong>189 blocks</strong>.',
    h3:'Blocks per square foot',
    p:'The 1.125 figure assumes the common 8×8×16 inch block. Half-height or specialty blocks will change the count.',
    faqs:[
      {q:'How many concrete blocks per square foot?',a:'About <strong>1.125 blocks</strong> per square foot for standard 8×16 inch units with mortar joints.'},
      {q:'How many blocks for a 20×8 wall?',a:'Roughly <strong>189 blocks</strong> including a 5% waste allowance.'}
    ]
  }
});

C.push({
  slug:'deck-stain-calculator', emoji:'🪣', name:'Deck Stain Calculator',
  tile:'Gallons of stain for a deck',
  title:'Deck Stain Calculator — How Much Stain Do I Need?',
  desc:'Free deck stain calculator. Enter your deck size and coats for the gallons of stain needed and estimated cost.',
  h1:'Deck Stain Calculator', sub:'How much stain do you need? Enter your deck size and coats.',
  buy:'Shop deck stain & sealer →',
  inputs:[
    {id:'len',label:'Deck length',hint:'(feet)',value:'16',step:'0.1'},
    {id:'wid',label:'Deck width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'coats',label:'Coats',type:'select',options:[{v:'1',t:'1 coat',sel:true},{v:'2',t:'2 coats'}]},
    {id:'price',label:'Price per gallon',hint:'(optional, $)',value:'40',step:'1'}
  ],
  lines:[
    {id:'area',label:'Deck area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),coats=parseInt(val('coats'),10)||1,P=num('price');
var area=L*W,gal=area*coats/200;
set('main',(Math.ceil(gal*10)/10).toFixed(1)+' gallons (buy '+Math.ceil(gal)+')');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(Math.ceil(gal)*P):'—');`,
  content:{
    intro:'Deck stain covers about 200 sq ft per gallon on wood. The calculator multiplies your deck area by the number of coats and divides by that coverage.',
    example:'<strong>Worked example — a 16&nbsp;ft × 12&nbsp;ft deck, 1 coat:</strong><br>192 sq ft ÷ 200 = <strong>1 gallon</strong>.',
    h3:'Rough wood drinks more',
    p:'Old, dry, or rough-sawn boards soak up more stain, so coverage can drop to 150 sq ft per gallon. Round up if your deck is weathered.',
    faqs:[
      {q:'How much does a gallon of deck stain cover?',a:'About <strong>200 sq ft</strong> on smooth wood; less on rough or thirsty boards.'},
      {q:'Do I need one coat or two?',a:'Most penetrating stains are <strong>one coat</strong>; some semi-transparent and solid stains recommend two.'}
    ]
  }
});

C.push({
  slug:'grass-seed-calculator', emoji:'🌾', name:'Grass Seed Calculator',
  tile:'Pounds of seed for a lawn',
  title:'Grass Seed Calculator — How Much Grass Seed Do I Need?',
  desc:'Free grass seed calculator. Enter lawn size and whether you are seeding new or overseeding for the pounds of seed needed and cost.',
  h1:'Grass Seed Calculator', sub:'How much grass seed do you need? Enter your lawn size.',
  buy:'Shop grass seed →',
  inputs:[
    {id:'len',label:'Lawn length',hint:'(feet)',value:'50',step:'0.1'},
    {id:'wid',label:'Lawn width',hint:'(feet)',value:'40',step:'0.1'},
    {id:'rate',label:'Seeding type',type:'select',options:[{v:'5',t:'New lawn (5 lb / 1000 sq ft)',sel:true},{v:'3',t:'Overseeding (3 lb / 1000 sq ft)'}]},
    {id:'price',label:'Price per pound',hint:'(optional, $)',value:'5',step:'0.5'}
  ],
  lines:[
    {id:'area',label:'Lawn area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),rate=parseFloat(val('rate'))||5,P=num('price');
var area=L*W,lbs=area/1000*rate;
set('main',lbs.toFixed(1)+' pounds');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(Math.ceil(lbs)*P):'—');`,
  content:{
    intro:'Seeding rates are quoted per 1,000 square feet. The calculator multiplies your lawn area by the rate for a new lawn or for overseeding an existing one.',
    example:'<strong>Worked example — a 50&nbsp;ft × 40&nbsp;ft new lawn:</strong><br>2,000 sq ft ÷ 1,000 × 5 = <strong>10 pounds</strong> of seed.',
    h3:'New lawn vs. overseeding',
    p:'Bare soil needs a heavier rate (about 5 lb per 1,000 sq ft); refreshing a thin existing lawn needs less (about 3 lb). Rates vary by grass type, so check the bag.',
    faqs:[
      {q:'How much grass seed per 1000 square feet?',a:'About <strong>5 lb for a new lawn</strong> and <strong>3 lb for overseeding</strong>, depending on the grass species.'},
      {q:'Can I use too much seed?',a:'Yes — overcrowded seedlings compete and grow weak. Stick close to the recommended rate.'}
    ]
  }
});

C.push({
  slug:'plywood-calculator', emoji:'🟧', name:'Plywood Calculator',
  tile:'Sheets for subfloor & sheathing',
  title:'Plywood Calculator — How Many Sheets of Plywood Do I Need?',
  desc:'Free plywood calculator for subfloor and sheathing. Enter the area for the number of 4×8 sheets needed, with waste and cost.',
  h1:'Plywood Calculator', sub:'How much plywood do you need? Enter the area to cover.',
  buy:'Shop plywood & OSB →',
  inputs:[
    {id:'len',label:'Area length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Area width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'price',label:'Price per sheet',hint:'(optional, $)',value:'45',step:'1'}
  ],
  lines:[
    {id:'area',label:'Area to cover'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),P=num('price');
var area=L*W,sheets=Math.ceil(area*1.10/32);
set('main',sheets+' sheets');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(sheets*P):'—');`,
  content:{
    intro:'A 4×8 ft sheet of plywood covers 32 sq ft. The calculator divides your area by 32 and adds 10% for cuts and waste.',
    example:'<strong>Worked example — a 20&nbsp;ft × 12&nbsp;ft subfloor:</strong><br>240 sq ft × 1.10 = 264 ÷ 32 = <strong>9 sheets</strong>.',
    h3:'Subfloor, sheathing or roof?',
    p:'The sheet math is the same for floors, walls and roofs — just enter the total area you&rsquo;re covering. Thickness affects price, not sheet count.',
    faqs:[
      {q:'How many square feet in a sheet of plywood?',a:'A standard 4×8 ft sheet covers <strong>32 square feet</strong>.'},
      {q:'How much extra plywood should I buy?',a:'About <strong>10%</strong> to cover offcuts and the occasional damaged sheet.'}
    ]
  }
});

C.push({
  slug:'baseboard-calculator', emoji:'📏', name:'Baseboard Calculator',
  tile:'Linear feet of trim & molding',
  title:'Baseboard Calculator — How Much Trim Do I Need? (Linear Feet)',
  desc:'Free baseboard and trim calculator. Enter your room size and doorways for the linear feet of molding needed and estimated cost.',
  h1:'Baseboard Calculator', sub:'How much baseboard do you need? Enter your room size and doorways.',
  buy:'Shop baseboard & trim →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'doors',label:'Doorways',hint:'(3 ft each, subtracted)',value:'1',step:'1'},
    {id:'price',label:'Price per linear foot',hint:'(optional, $)',value:'2',step:'0.25'}
  ],
  lines:[
    {id:'perim',label:'Room perimeter'},
    {id:'linft',label:'With 10% waste'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),doors=intval('doors'),P=num('price');
var perim=Math.max(0,2*(L+W)-doors*3),linft=perim*1.10;
set('main',Math.ceil(linft)+' linear feet');
set('perim',perim.toFixed(0)+' ft');
set('linft',linft.toFixed(0)+' ft');
set('cost',P>0?money(Math.ceil(linft)*P):'—');`,
  content:{
    intro:'It adds up your room&rsquo;s perimeter, subtracts 3 feet for each doorway opening, and adds 10% for miter cuts and waste at corners.',
    example:'<strong>Worked example — a 12&nbsp;ft × 12&nbsp;ft room with 1 doorway:</strong><br>Perimeter 48 − 3 = 45 ft × 1.10 = <strong>50 linear feet</strong>.',
    h3:'Buy slightly long',
    p:'Trim is sold in fixed lengths (8, 12, 16 ft). Buy lengths that minimize seams on your longest walls, and keep the offcuts for short runs.',
    faqs:[
      {q:'How do I measure for baseboard?',a:'Add the length of every wall (the room perimeter), then subtract the width of each doorway.'},
      {q:'How much extra trim should I buy?',a:'About <strong>10%</strong> to cover miter cuts and mistakes.'}
    ]
  }
});

C.push({
  slug:'pool-volume-calculator', emoji:'🏊', name:'Pool Volume Calculator',
  tile:'Gallons of water in a pool',
  title:'Pool Volume Calculator — How Many Gallons Is My Pool?',
  desc:'Free pool volume calculator. Enter your pool size and average depth to find how many gallons of water it holds.',
  h1:'Pool Volume Calculator', sub:'How many gallons is your pool? Enter the size and average depth.',
  buy:'Shop pool chemicals →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'32',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'16',step:'0.1'},
    {id:'depth',label:'Average depth',hint:'(feet)',value:'5',step:'0.1'}
  ],
  lines:[
    {id:'area',label:'Surface area'},
    {id:'cf',label:'Volume in cubic feet'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth');
var area=L*W,cf=area*D,gal=cf*7.48;
set('main',Math.round(gal).toLocaleString()+' gallons');
set('area',area.toFixed(0)+' sq ft');
set('cf',cf.toFixed(0)+' cu ft');`,
  content:{
    intro:'It multiplies length × width × average depth for the volume in cubic feet, then converts to gallons (one cubic foot holds about 7.48 gallons).',
    example:'<strong>Worked example — a 32&nbsp;ft × 16&nbsp;ft pool, 5&nbsp;ft average depth:</strong><br>512 sq ft × 5 = 2,560 cubic feet × 7.48 = <strong>≈19,150 gallons</strong>.',
    h3:'Use the average depth',
    p:'For a pool with a shallow and deep end, average the two depths. Knowing the gallons is essential for dosing chlorine and other chemicals correctly.',
    faqs:[
      {q:'How do I calculate pool gallons?',a:'Length × width × average depth × <strong>7.48</strong> for a rectangular pool.'},
      {q:'Why does pool volume matter?',a:'Every chemical dose — chlorine, shock, algaecide — is based on the number of gallons.'}
    ]
  }
});

C.push({
  slug:'excavation-calculator', emoji:'🚜', name:'Excavation Calculator',
  tile:'Cubic yards of dirt to dig or haul',
  title:'Excavation Calculator — How Many Cubic Yards of Dirt?',
  desc:'Free excavation / dirt calculator. Enter area and depth for the cubic yards of soil to dig out or haul away, plus truckloads and cost.',
  h1:'Excavation Calculator', sub:'How much dirt are you digging? Enter area and depth for cubic yards and truckloads.',
  buy:'Find dirt hauling services →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'20',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'12',step:'1'},
    {id:'price',label:'Haul cost per cubic yard',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'cf',label:'Cubic feet'},
    {id:'loads',label:'Dump-truck loads (10 cu yd)'},
    {id:'cost',label:'Estimated haul cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,loads=Math.ceil(cy/10);
set('main',cy.toFixed(2)+' cubic yards');
set('cf',cf.toFixed(0)+' cu ft');
set('loads',loads+' loads');
set('cost',P>0?money(cy*P):'—');`,
  content:{
    intro:'It calculates the volume of soil from your dig area and depth, converts to cubic yards, and estimates how many standard 10-yard dump-truck loads you&rsquo;ll need to haul it away.',
    example:'<strong>Worked example — a 20&nbsp;ft × 20&nbsp;ft area dug 12&nbsp;inches deep:</strong><br>400 × 1 = 400 cubic feet ÷ 27 = <strong>14.8 cubic yards</strong> → 2 truck loads.',
    h3:'Soil swells when dug',
    p:'Loosened soil takes up 15–25% more space than it did in the ground, so hauling volume runs a bit higher than this in-ground estimate.',
    faqs:[
      {q:'How many cubic yards in a dump truck?',a:'A standard dump truck holds about <strong>10–14 cubic yards</strong> of soil.'},
      {q:'How do I calculate dirt to remove?',a:'Multiply length × width × depth (in feet), then divide by 27 for cubic yards.'}
    ]
  }
});

C.push({
  slug:'wallpaper-calculator', emoji:'🖼️', name:'Wallpaper Calculator',
  tile:'Rolls needed for any room',
  title:'Wallpaper Calculator — How Many Rolls of Wallpaper Do I Need?',
  desc:'Free wallpaper calculator. Enter your room size and roll coverage for the number of rolls needed, with waste and estimated cost.',
  h1:'Wallpaper Calculator', sub:'How much wallpaper do you need? Enter your room size and roll type.',
  buy:'Shop wallpaper →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'8',step:'0.1'},
    {id:'roll',label:'Roll type',type:'select',options:[{v:'25',t:'Single roll (~25 sq ft)',sel:true},{v:'50',t:'Double roll (~50 sq ft)'}]},
    {id:'price',label:'Price per roll',hint:'(optional, $)',value:'35',step:'1'}
  ],
  lines:[
    {id:'area',label:'Wall area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),H=num('height'),cov=parseFloat(val('roll'))||25,P=num('price');
var wall=2*(L+W)*H,rolls=cov>0?Math.ceil(wall*1.15/cov):0;
set('main',rolls+' rolls');
set('area',Math.round(wall)+' sq ft');
set('cost',P>0?money(rolls*P):'—');`,
  content:{
    intro:'It measures your wall area (room perimeter × wall height) and adds 15% for pattern matching and trimming, then divides by the usable coverage of one roll.',
    example:'<strong>Worked example — a 12&nbsp;ft × 12&nbsp;ft room, 8&nbsp;ft walls, single rolls:</strong><br>Perimeter 48 × 8 = 384 sq ft × 1.15 = 442 ÷ 25 = <strong>18 rolls</strong>.',
    h3:'Patterns need more',
    p:'Big repeating patterns waste more at each seam. For a large pattern repeat, bump your order up by another roll or two.',
    faqs:[
      {q:'How much wallpaper do I need for one room?',a:'Measure the wall area and divide by the roll&rsquo;s usable coverage — most single rolls cover about <strong>25 sq ft</strong> after trimming.'},
      {q:'Should I buy single or double rolls?',a:'Double rolls have fewer seams and less waste on tall walls, but single rolls are easier to handle.'}
    ]
  }
});

C.push({
  slug:'insulation-calculator', emoji:'🧊', name:'Insulation Calculator',
  tile:'Bags or batts to cover an area',
  title:'Insulation Calculator — How Much Insulation Do I Need?',
  desc:'Free insulation calculator. Enter the area to insulate and the coverage per bag or batt pack for the number of packages and cost.',
  h1:'Insulation Calculator', sub:'How much insulation do you need? Enter the area and coverage per package.',
  buy:'Shop insulation →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'30',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'25',step:'0.1'},
    {id:'cov',label:'Coverage per bag/pack',hint:'(sq ft)',value:'40',step:'1'},
    {id:'price',label:'Price per bag/pack',hint:'(optional, $)',value:'45',step:'1'}
  ],
  lines:[
    {id:'area',label:'Area to insulate'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),cov=num('cov'),P=num('price');
var area=L*W,packs=cov>0?Math.ceil(area/cov):0;
set('main',packs+' bags / packs');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(packs*P):'—');`,
  content:{
    intro:'It divides the area you&rsquo;re insulating by the square footage each bag of blown-in or pack of batts covers — printed on the package for your chosen R-value.',
    example:'<strong>Worked example — a 30&nbsp;ft × 25&nbsp;ft attic, 40 sq ft per bag:</strong><br>750 sq ft ÷ 40 = <strong>19 bags</strong>.',
    h3:'Coverage drops with R-value',
    p:'Higher R-values mean a thicker layer, so each bag covers less area. Always read the coverage chart on the bag for the R-value you want and enter that figure.',
    faqs:[
      {q:'How do I know how many bags of insulation I need?',a:'Divide the area by the coverage-per-bag for your target R-value, which is listed on the bag.'},
      {q:'What R-value do I need for an attic?',a:'Most regions call for <strong>R-38 to R-60</strong> in attics — check your local code.'}
    ]
  }
});

C.push({
  slug:'crown-molding-calculator', emoji:'👑', name:'Crown Molding Calculator',
  tile:'Linear feet of crown molding',
  title:'Crown Molding Calculator — How Much Crown Molding Do I Need?',
  desc:'Free crown molding calculator. Enter your room size for the linear feet of molding needed, with a miter waste allowance and cost.',
  h1:'Crown Molding Calculator', sub:'How much crown molding do you need? Enter your room size.',
  buy:'Shop crown molding →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'14',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'price',label:'Price per linear foot',hint:'(optional, $)',value:'3',step:'0.25'}
  ],
  lines:[
    {id:'perim',label:'Ceiling perimeter'},
    {id:'linft',label:'With 12% waste'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),P=num('price');
var perim=2*(L+W),linft=perim*1.12;
set('main',Math.ceil(linft)+' linear feet');
set('perim',perim.toFixed(0)+' ft');
set('linft',linft.toFixed(0)+' ft');
set('cost',P>0?money(Math.ceil(linft)*P):'—');`,
  content:{
    intro:'Crown molding runs the full perimeter of the ceiling. The calculator adds up all four walls and adds 12% for the angled miter cuts at every corner, which waste more than straight trim.',
    example:'<strong>Worked example — a 14&nbsp;ft × 12&nbsp;ft room:</strong><br>Perimeter 52 ft × 1.12 = <strong>59 linear feet</strong>.',
    h3:'Corners eat material',
    p:'Inside and outside corners on crown are cut at compound angles, so mistakes are common. The 12% cushion gives you room to redo a bad cut.',
    faqs:[
      {q:'How do I measure for crown molding?',a:'Add up the length of all the walls in the room (the ceiling perimeter), then add about 12% for waste.'},
      {q:'Why does crown waste more than baseboard?',a:'The compound miter cuts at corners are harder to get right, so extra material saves a second trip.'}
    ]
  }
});

C.push({
  slug:'stud-calculator', emoji:'🔨', name:'Wall Stud Calculator',
  tile:'Studs & plates for framing a wall',
  title:'Stud Calculator — How Many Studs Do I Need to Frame a Wall?',
  desc:'Free wall stud calculator. Enter the wall length and stud spacing for the number of studs and plate lumber needed, plus cost.',
  h1:'Wall Stud Calculator', sub:'How many studs do you need? Enter the wall length and spacing.',
  buy:'Shop framing lumber →',
  inputs:[
    {id:'len',label:'Wall length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'spacing',label:'Stud spacing',type:'select',options:[{v:'16',t:'16 in on center',sel:true},{v:'24',t:'24 in on center'}]},
    {id:'price',label:'Price per stud',hint:'(optional, $)',value:'4',step:'0.25'}
  ],
  lines:[
    {id:'plates',label:'Plate lumber (top + bottom)'},
    {id:'cost',label:'Estimated cost (studs)'}
  ],
  body:`var L=num('len'),sp=parseFloat(val('spacing'))||16,P=num('price');
var studs=Math.ceil(L*12/sp)+1;
set('main',studs+' studs');
set('plates',Math.ceil(L*2)+' ft');
set('cost',P>0?money(studs*P):'—');`,
  content:{
    intro:'It places one stud every 16 or 24 inches along the wall and adds one for the end, then figures the top and bottom plate lumber as twice the wall length.',
    example:'<strong>Worked example — a 20&nbsp;ft wall at 16&nbsp;in on center:</strong><br>240 in ÷ 16 = 15, plus 1 end stud = <strong>16 studs</strong>, plus 40 ft of plate lumber.',
    h3:'Add for openings and corners',
    p:'Doors, windows and corners need extra studs (king studs, jacks, cripples). Add a few more studs per opening on top of this base count.',
    faqs:[
      {q:'How many studs do I need for a 20 ft wall?',a:'About <strong>16 studs</strong> at 16-inch spacing, before adding extras for openings and corners.'},
      {q:'Is 16 or 24 inch spacing better?',a:'16-inch is standard and stronger; 24-inch uses less lumber and is allowed for many non-load-bearing walls.'}
    ]
  }
});

C.push({
  slug:'mortar-calculator', emoji:'🪣', name:'Mortar Calculator',
  tile:'Bags of mortar for brick or block',
  title:'Mortar Calculator — How Many Bags of Mortar Do I Need?',
  desc:'Free mortar calculator. Enter the number of bricks or blocks for the bags of mortar mix needed and estimated cost.',
  h1:'Mortar Calculator', sub:'How much mortar do you need? Enter your brick or block count.',
  buy:'Shop mortar mix →',
  inputs:[
    {id:'count',label:'Number of units',hint:'(bricks or blocks)',value:'500',step:'1'},
    {id:'type',label:'Unit type',type:'select',options:[{v:'brick',t:'Bricks',sel:true},{v:'block',t:'Concrete blocks'}]},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'8',step:'0.5'}
  ],
  lines:[
    {id:'units',label:'Units to lay'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var n=intval('count'),type=val('type'),P=num('price');
var per=type==='block'?30:125,bags=Math.ceil(n/per);
set('main',bags+' bags');
set('units',n+' '+(type==='block'?'blocks':'bricks'));
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'A standard 70&nbsp;lb bag of mortar lays roughly 125 bricks or 30 concrete blocks. The calculator divides your unit count by that rate and rounds up.',
    example:'<strong>Worked example — 500 bricks:</strong><br>500 ÷ 125 = <strong>4 bags</strong> of mortar mix.',
    h3:'Joint size changes it',
    p:'Thicker mortar joints use more mix. These figures assume a standard 3/8-inch joint; wider joints or hollow blocks filled with mortar will need more.',
    faqs:[
      {q:'How many bricks does a bag of mortar lay?',a:'About <strong>125 bricks</strong> per 70&nbsp;lb bag with a standard joint.'},
      {q:'How much mortar for concrete block?',a:'Roughly one bag per <strong>30 blocks</strong>.'}
    ]
  }
});

C.push({
  slug:'rebar-calculator', emoji:'🔩', name:'Rebar Calculator',
  tile:'Rebar for a slab grid',
  title:'Rebar Calculator — How Much Rebar Do I Need for a Slab?',
  desc:'Free rebar calculator. Enter your slab size and grid spacing for the linear feet of rebar and number of bars needed.',
  h1:'Rebar Calculator', sub:'How much rebar do you need? Enter your slab size and grid spacing.',
  buy:'Shop rebar →',
  inputs:[
    {id:'len',label:'Slab length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Slab width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'spacing',label:'Grid spacing',hint:'(inches)',value:'16',step:'1'},
    {id:'barlen',label:'Bar length',hint:'(feet)',value:'20',step:'1'},
    {id:'price',label:'Price per bar',hint:'(optional, $)',value:'9',step:'0.5'}
  ],
  lines:[
    {id:'linft',label:'Total rebar length'},
    {id:'gridbars',label:'Grid bars (both directions)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),sp=num('spacing')||16,BL=num('barlen')||20,P=num('price');
var nL=Math.floor(W*12/sp)+1,nW=Math.floor(L*12/sp)+1,lin=nL*L+nW*W,bars=BL>0?Math.ceil(lin/BL):0;
set('main',bars+' bars');
set('linft',Math.round(lin)+' ft');
set('gridbars',(nL+nW)+' bars');
set('cost',P>0?money(bars*P):'—');`,
  content:{
    intro:'It lays out a grid of rebar at your chosen spacing in both directions, totals the linear feet, and divides by your bar length to get how many bars to buy.',
    example:'<strong>Worked example — a 20&nbsp;ft × 12&nbsp;ft slab, 16&nbsp;in grid, 20&nbsp;ft bars:</strong><br>≈400 linear feet of rebar → <strong>20 bars</strong>.',
    h3:'Don&rsquo;t forget overlap',
    p:'Where bars meet end-to-end they must overlap (about 40× the bar diameter). For long runs, add a bit extra for these laps.',
    faqs:[
      {q:'What spacing should rebar be in a slab?',a:'A <strong>12–18 inch grid</strong> is common for residential slabs; check your project&rsquo;s requirements.'},
      {q:'How much rebar for a 20×12 slab?',a:'About <strong>400 linear feet</strong> on a 16-inch grid — roughly 20 bars of 20 ft.'}
    ]
  }
});

C.push({
  slug:'retaining-wall-calculator', emoji:'🪨', name:'Retaining Wall Calculator',
  tile:'Blocks for a retaining wall',
  title:'Retaining Wall Calculator — How Many Blocks Do I Need?',
  desc:'Free retaining wall block calculator. Enter wall length, height and block size for the number of blocks, courses, and cost.',
  h1:'Retaining Wall Calculator', sub:'How many blocks do you need? Enter your wall size and block size.',
  buy:'Shop retaining wall block →',
  inputs:[
    {id:'len',label:'Wall length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'3',step:'0.1'},
    {id:'blocklen',label:'Block length',hint:'(inches)',value:'12',step:'0.25'},
    {id:'blockht',label:'Block height',hint:'(inches)',value:'4',step:'0.25'},
    {id:'price',label:'Price per block',hint:'(optional, $)',value:'4',step:'0.25'}
  ],
  lines:[
    {id:'courses',label:'Courses (rows) high'},
    {id:'percourse',label:'Blocks per course'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),BL=num('blocklen')||12,BH=num('blockht')||4,P=num('price');
var per=BL>0?Math.ceil(L*12/BL):0,courses=BH>0?Math.ceil(H*12/BH):0,total=per*courses;
set('main',total+' blocks');
set('courses',courses+' rows');
set('percourse',per+' per row');
set('cost',P>0?money(total*P):'—');`,
  content:{
    intro:'It works out how many blocks fit in one row along the wall, how many rows tall the wall is, and multiplies the two for the total block count.',
    example:'<strong>Worked example — a 20&nbsp;ft long, 3&nbsp;ft high wall with 12&nbsp;×&nbsp;4 in blocks:</strong><br>20 blocks per row × 9 rows = <strong>180 blocks</strong>.',
    h3:'Plan a buried base course',
    p:'The bottom row of a retaining wall should sit below grade on a compacted gravel base. Include that buried course in your height when ordering.',
    faqs:[
      {q:'How many blocks for a retaining wall?',a:'Multiply blocks-per-row by the number of rows — about <strong>180 blocks</strong> for a 20&nbsp;ft × 3&nbsp;ft wall with standard blocks.'},
      {q:'How tall can a DIY retaining wall be?',a:'Walls over about <strong>3–4 feet</strong> usually need engineering and permits — check local rules.'}
    ]
  }
});

C.push({
  slug:'compost-calculator', emoji:'♻️', name:'Compost Calculator',
  tile:'Cubic yards & bags of compost',
  title:'Compost Calculator — How Much Compost Do I Need?',
  desc:'Free compost calculator. Enter your area and depth for cubic yards, bags, and estimated cost of compost.',
  h1:'Compost Calculator', sub:'How much compost do you need? Enter your area and depth.',
  buy:'Shop compost →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'2',step:'0.5'},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'5',step:'0.5'}
  ],
  lines:[
    {id:'cf',label:'Cubic feet needed'},
    {id:'bags',label:'Bags (1.5 cu ft each)'},
    {id:'cost',label:'Estimated cost (bags)'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,bags=Math.ceil(cf/1.5);
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('cf',cf.toFixed(1)+' cu ft');
set('bags',bags+' bags');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'It multiplies your area by the spread depth for the volume, then shows it as cubic yards (bulk) and 1.5 cubic-foot bags.',
    example:'<strong>Worked example — a 20&nbsp;ft × 10&nbsp;ft bed at 2&nbsp;inches:</strong><br>200 × (2 ÷ 12) = 33.3 cubic feet → ÷ 27 = <strong>1.23 cubic yards</strong>, or about 23 bags.',
    h3:'How thick to spread compost?',
    p:'A 1–2 inch top dressing is plenty for established beds; mix 2–3 inches into new beds before planting.',
    faqs:[
      {q:'How many bags of compost in a yard?',a:'About <strong>18 bags</strong> of the 1.5 cubic foot size make one cubic yard.'},
      {q:'How deep should compost be?',a:'<strong>1–2 inches</strong> as a top dressing, more when amending new soil.'}
    ]
  }
});

C.push({
  slug:'raised-bed-soil-calculator', emoji:'🥕', name:'Raised Bed Soil Calculator',
  tile:'Soil to fill a raised garden bed',
  title:'Raised Bed Soil Calculator — How Much Soil to Fill a Raised Bed?',
  desc:'Free raised bed soil calculator. Enter your bed length, width and depth for the cubic feet, bags, and cost of soil to fill it.',
  h1:'Raised Bed Soil Calculator', sub:'How much soil do you need? Enter your raised bed size.',
  buy:'Shop raised bed soil →',
  inputs:[
    {id:'len',label:'Bed length',hint:'(feet)',value:'4',step:'0.1'},
    {id:'wid',label:'Bed width',hint:'(feet)',value:'4',step:'0.1'},
    {id:'depth',label:'Fill depth',hint:'(inches)',value:'10',step:'0.5'},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'6',step:'0.5'}
  ],
  lines:[
    {id:'cy',label:'Cubic yards'},
    {id:'bags',label:'Bags (1.5 cu ft each)'},
    {id:'cost',label:'Estimated cost (bags)'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,bags=Math.ceil(cf/1.5);
set('main',cf.toFixed(1)+' cubic feet');
set('cy',cy.toFixed(2)+' cu yd');
set('bags',bags+' bags');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'It multiplies the bed&rsquo;s length, width and fill depth to find the volume of soil, shown in cubic feet, bags, and cubic yards.',
    example:'<strong>Worked example — a 4&nbsp;ft × 4&nbsp;ft bed filled 10&nbsp;inches deep:</strong><br>16 × (10 ÷ 12) = 13.3 cubic feet → about <strong>9 bags</strong>.',
    h3:'A money-saving mix',
    p:'Filling deep beds entirely with bagged soil gets expensive. Many gardeners fill the bottom third with logs, leaves or cheaper fill, then top with quality soil.',
    faqs:[
      {q:'How much soil for a 4×4 raised bed?',a:'About <strong>13 cubic feet</strong> at a 10-inch fill depth — roughly 9 bags.'},
      {q:'What soil goes in a raised bed?',a:'A blend of topsoil, compost and aeration (like perlite) — often sold as &ldquo;raised bed mix&rdquo;.'}
    ]
  }
});

C.push({
  slug:'fertilizer-calculator', emoji:'🧪', name:'Fertilizer Calculator',
  tile:'Bags of fertilizer for a lawn',
  title:'Fertilizer Calculator — How Much Fertilizer Do I Need for My Lawn?',
  desc:'Free lawn fertilizer calculator. Enter your lawn size and bag coverage for the number of bags needed and estimated cost.',
  h1:'Fertilizer Calculator', sub:'How much fertilizer do you need? Enter your lawn size and bag coverage.',
  buy:'Shop lawn fertilizer →',
  inputs:[
    {id:'len',label:'Lawn length',hint:'(feet)',value:'60',step:'0.1'},
    {id:'wid',label:'Lawn width',hint:'(feet)',value:'40',step:'0.1'},
    {id:'cov',label:'Coverage per bag',hint:'(sq ft)',value:'5000',step:'100'},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'area',label:'Lawn area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),cov=num('cov'),P=num('price');
var area=L*W,bags=cov>0?Math.ceil(area/cov):0;
set('main',bags+' bags');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'Fertilizer bags state the area they cover (e.g. 5,000 sq ft). The calculator divides your lawn area by that coverage and rounds up to whole bags.',
    example:'<strong>Worked example — a 60&nbsp;ft × 40&nbsp;ft lawn, 5,000 sq ft per bag:</strong><br>2,400 sq ft ÷ 5,000 = <strong>1 bag</strong>.',
    h3:'Measure only the grass',
    p:'Subtract the house, driveway and beds — fertilize only the actual lawn area so you don&rsquo;t over-apply (which can burn the grass).',
    faqs:[
      {q:'How much fertilizer for my lawn?',a:'Divide your lawn&rsquo;s square footage by the coverage printed on the bag.'},
      {q:'Can I use too much fertilizer?',a:'Yes — over-applying can burn the lawn and pollute runoff. Stick to the labeled rate.'}
    ]
  }
});

C.push({
  slug:'driveway-sealer-calculator', emoji:'🛢️', name:'Driveway Sealer Calculator',
  tile:'Buckets of sealer for a driveway',
  title:'Driveway Sealer Calculator — How Much Sealer Do I Need?',
  desc:'Free driveway sealer calculator. Enter your driveway size and coats for the gallons of asphalt sealer needed and cost.',
  h1:'Driveway Sealer Calculator', sub:'How much sealer do you need? Enter your driveway size and coats.',
  buy:'Shop driveway sealer →',
  inputs:[
    {id:'len',label:'Driveway length',hint:'(feet)',value:'40',step:'0.1'},
    {id:'wid',label:'Driveway width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'coats',label:'Coats',type:'select',options:[{v:'1',t:'1 coat',sel:true},{v:'2',t:'2 coats'}]},
    {id:'price',label:'Price per gallon',hint:'(optional, $)',value:'18',step:'1'}
  ],
  lines:[
    {id:'area',label:'Driveway area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),coats=parseInt(val('coats'),10)||1,P=num('price');
var area=L*W,gal=area*coats/80;
set('main',(Math.ceil(gal*10)/10).toFixed(1)+' gallons (buy '+Math.ceil(gal)+')');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(Math.ceil(gal)*P):'—');`,
  content:{
    intro:'Asphalt sealer covers roughly 80 sq ft per gallon per coat. The calculator multiplies your driveway area by the number of coats and divides by that coverage.',
    example:'<strong>Worked example — a 40&nbsp;ft × 12&nbsp;ft driveway, 1 coat:</strong><br>480 sq ft ÷ 80 = <strong>6 gallons</strong>.',
    h3:'Two thin coats beat one thick',
    p:'Sealer lasts longer applied as two thin coats than one heavy one. Most driveways get a fresh seal every 2–3 years.',
    faqs:[
      {q:'How much does a gallon of driveway sealer cover?',a:'About <strong>80 sq ft</strong> per coat on older, porous asphalt; a bit more on smooth surfaces.'},
      {q:'How often should I seal my driveway?',a:'Every <strong>2–3 years</strong> is typical, once the surface starts to fade or crack.'}
    ]
  }
});

C.push({
  slug:'gutter-calculator', emoji:'🌧️', name:'Gutter Calculator',
  tile:'Gutter & downspouts for a roof',
  title:'Gutter Calculator — How Much Gutter and Downspouts Do I Need?',
  desc:'Free gutter calculator. Enter your roofline length for the linear feet of gutter, number of downspouts, and estimated cost.',
  h1:'Gutter Calculator', sub:'How much gutter do you need? Enter the roofline length.',
  buy:'Shop gutters & downspouts →',
  inputs:[
    {id:'length',label:'Total roofline length',hint:'(feet)',value:'120',step:'1'},
    {id:'price',label:'Price per linear foot',hint:'(optional, $)',value:'6',step:'0.5'}
  ],
  lines:[
    {id:'downspouts',label:'Downspouts needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var Ln=num('length'),P=num('price');
var ds=Math.ceil(Ln/35);
set('main',Math.ceil(Ln)+' linear feet');
set('downspouts',ds+' downspouts');
set('cost',P>0?money(Math.ceil(Ln)*P):'—');`,
  content:{
    intro:'Measure the total length of roof edge (eaves) that needs gutters. The calculator also adds one downspout for roughly every 35 feet of gutter to drain it properly.',
    example:'<strong>Worked example — 120 feet of roofline:</strong><br><strong>120 linear feet</strong> of gutter and about 4 downspouts.',
    h3:'Downspout spacing',
    p:'One downspout per 30–40 feet of gutter keeps water moving. Long runs or heavy-rain areas benefit from more.',
    faqs:[
      {q:'How many downspouts do I need?',a:'About one per <strong>30–40 feet</strong> of gutter run.'},
      {q:'How do I measure for gutters?',a:'Add up the length of every roof edge (eave) where water needs to drain.'}
    ]
  }
});

C.push({
  slug:'stair-calculator', emoji:'🪜', name:'Stair Calculator',
  tile:'Risers & treads for a staircase',
  title:'Stair Calculator — How Many Steps Do I Need? (Risers & Treads)',
  desc:'Free stair calculator. Enter your total rise to get the number of steps, the exact riser height, treads, and total run.',
  h1:'Stair Calculator', sub:'How many steps do you need? Enter the total height to climb.',
  buy:'Shop stair stringers & treads →',
  inputs:[
    {id:'rise',label:'Total rise',hint:'(inches, floor to floor)',value:'108',step:'0.25'},
    {id:'ideal',label:'Target riser height',hint:'(inches)',value:'7.5',step:'0.25'},
    {id:'tread',label:'Tread depth',hint:'(inches)',value:'10',step:'0.25'}
  ],
  lines:[
    {id:'riser',label:'Actual riser height'},
    {id:'treads',label:'Number of treads'},
    {id:'run',label:'Total horizontal run'}
  ],
  body:`var rise=num('rise'),ideal=num('ideal')||7.5,tread=num('tread')||10;
var n=Math.max(1,Math.round(rise/ideal)),rh=rise/n,treads=n-1,run=treads*tread;
set('main',n+' steps');
set('riser',rh.toFixed(2)+' in');
set('treads',treads+' treads');
set('run',run.toFixed(0)+' in');`,
  content:{
    intro:'It divides your total floor-to-floor rise by a comfortable target riser height to get a whole number of steps, then recalculates the exact riser height and the total horizontal run.',
    example:'<strong>Worked example — a 108&nbsp;inch total rise:</strong><br>108 ÷ 7.5 ≈ 14 steps → riser height <strong>7.71 in</strong>, 13 treads, 130 in of run.',
    h3:'Keep every riser equal',
    p:'Building codes require all risers within a staircase to be nearly identical (within 3/8 inch) — uneven steps are a trip hazard. That&rsquo;s why we round to whole steps and recompute.',
    faqs:[
      {q:'What is a comfortable stair riser height?',a:'About <strong>7 to 7.75 inches</strong>; most codes cap risers at 7.75 in.'},
      {q:'How do I calculate number of stairs?',a:'Divide the total floor-to-floor height by your target riser height and round to a whole number.'}
    ]
  }
});

C.push({
  slug:'baluster-calculator', emoji:'🏗️', name:'Baluster Calculator',
  tile:'Balusters / spindles for a railing',
  title:'Baluster Calculator — How Many Balusters Do I Need?',
  desc:'Free baluster (spindle) calculator. Enter your railing length and spacing for the number of balusters needed and cost.',
  h1:'Baluster Calculator', sub:'How many balusters do you need? Enter the railing length and spacing.',
  buy:'Shop balusters & spindles →',
  inputs:[
    {id:'len',label:'Railing length',hint:'(feet)',value:'16',step:'0.1'},
    {id:'spacing',label:'Spacing on center',hint:'(inches)',value:'4.5',step:'0.25'},
    {id:'price',label:'Price per baluster',hint:'(optional, $)',value:'3',step:'0.25'}
  ],
  lines:[
    {id:'railing',label:'Railing length'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),sp=num('spacing')||4.5,P=num('price');
var n=sp>0?Math.ceil(L*12/sp):0;
set('main',n+' balusters');
set('railing',L.toFixed(1)+' ft');
set('cost',P>0?money(n*P):'—');`,
  content:{
    intro:'It converts your railing length to inches and divides by the on-center spacing to find how many balusters fit along the run.',
    example:'<strong>Worked example — a 16&nbsp;ft railing at 4.5&nbsp;in on center:</strong><br>192 in ÷ 4.5 = <strong>43 balusters</strong>.',
    h3:'Mind the 4-inch rule',
    p:'Most codes require that a 4-inch sphere cannot pass between balusters, so the gap must stay under 4 inches. Tighter spacing means more balusters.',
    faqs:[
      {q:'How far apart should balusters be?',a:'Close enough that a <strong>4-inch ball can&rsquo;t pass through</strong> — usually about 4 to 4.5 inches on center.'},
      {q:'How many balusters per foot?',a:'Roughly <strong>2.5–3 per foot</strong> at standard spacing.'}
    ]
  }
});

C.push({
  slug:'river-rock-calculator', emoji:'⚪', name:'River Rock Calculator',
  tile:'Tons of decorative landscape rock',
  title:'River Rock Calculator — How Much River Rock Do I Need? (Tons)',
  desc:'Free river rock calculator for landscaping. Enter area and depth for cubic yards, tons, and the estimated cost of decorative stone.',
  h1:'River Rock Calculator', sub:'How much river rock do you need? Enter the area and depth.',
  buy:'Shop river rock & landscape stone →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'15',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'2',step:'0.5'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'60',step:'1'}
  ],
  lines:[
    {id:'tons',label:'Estimated tons needed'},
    {id:'cf',label:'Cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,tons=cy*1.4;
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('tons',tons.toFixed(2)+' tons');
set('cf',cf.toFixed(1)+' cu ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It calculates the volume from your area and depth, converts to cubic yards, then to tons using a typical river rock weight of about 1.4 tons per cubic yard.',
    example:'<strong>Worked example — a 15&nbsp;ft × 10&nbsp;ft bed at 2&nbsp;inches:</strong><br>150 × (2 ÷ 12) = 25 cubic feet → ÷ 27 = <strong>0.93 cubic yards</strong> → about 1.3 tons.',
    h3:'How deep for river rock?',
    p:'A 2-inch layer covers the ground for decorative beds; go 3–4 inches for drainage areas or to fully hide landscape fabric.',
    faqs:[
      {q:'How many tons of river rock per cubic yard?',a:'About <strong>1.4 tons</strong>, similar to gravel.'},
      {q:'How deep should river rock be?',a:'<strong>2 inches</strong> for decoration, 3–4 inches for drainage or coverage.'}
    ]
  }
});

C.push({
  slug:'underlayment-calculator', emoji:'📃', name:'Underlayment Calculator',
  tile:'Rolls of floor underlayment',
  title:'Underlayment Calculator — How Much Floor Underlayment Do I Need?',
  desc:'Free flooring underlayment calculator. Enter your room size and roll coverage for the number of rolls needed and cost.',
  h1:'Underlayment Calculator', sub:'How much underlayment do you need? Enter your room size and roll coverage.',
  buy:'Shop floor underlayment →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'12',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'cov',label:'Coverage per roll',hint:'(sq ft)',value:'100',step:'1'},
    {id:'price',label:'Price per roll',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'area',label:'Room area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),cov=num('cov'),P=num('price');
var area=L*W,rolls=cov>0?Math.ceil(area*1.05/cov):0;
set('main',rolls+' rolls');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(rolls*P):'—');`,
  content:{
    intro:'It finds your room area, adds 5% for overlap and trimming, then divides by the square footage each roll of underlayment covers.',
    example:'<strong>Worked example — a 12&nbsp;ft × 10&nbsp;ft room, 100 sq ft per roll:</strong><br>120 sq ft × 1.05 = 126 ÷ 100 = <strong>2 rolls</strong>.',
    h3:'Match it to your floor',
    p:'Laminate, vinyl and hardwood each call for a specific underlayment. Some click floors come with padding pre-attached — check before buying separate rolls.',
    faqs:[
      {q:'How much underlayment do I need?',a:'About the same as your floor area plus a small overlap allowance — divide by the roll&rsquo;s coverage.'},
      {q:'Do I need underlayment under vinyl plank?',a:'Only if the planks don&rsquo;t already have an attached pad — and never double up.'}
    ]
  }
});

/* ---------- categories ---------- */
const CATEGORIES = ['Concrete & Masonry','Landscaping','Flooring & Tile','Walls & Paint','Decking','Roofing','Outdoor'];
const CAT = {
  'concrete-calculator':'Concrete & Masonry',
  'paver-calculator':'Concrete & Masonry',
  'brick-calculator':'Concrete & Masonry',
  'concrete-block-calculator':'Concrete & Masonry',
  'sand-calculator':'Concrete & Masonry',
  'mulch-calculator':'Landscaping',
  'gravel-calculator':'Landscaping',
  'topsoil-calculator':'Landscaping',
  'sod-calculator':'Landscaping',
  'grass-seed-calculator':'Landscaping',
  'tile-calculator':'Flooring & Tile',
  'flooring-calculator':'Flooring & Tile',
  'carpet-calculator':'Flooring & Tile',
  'paint-calculator':'Walls & Paint',
  'drywall-calculator':'Walls & Paint',
  'baseboard-calculator':'Walls & Paint',
  'plywood-calculator':'Walls & Paint',
  'deck-board-calculator':'Decking',
  'deck-stain-calculator':'Decking',
  'roofing-calculator':'Roofing',
  'fence-calculator':'Outdoor',
  'asphalt-calculator':'Outdoor',
  'pool-volume-calculator':'Outdoor',
  'excavation-calculator':'Outdoor',
  'wallpaper-calculator':'Walls & Paint',
  'insulation-calculator':'Walls & Paint',
  'crown-molding-calculator':'Walls & Paint',
  'stud-calculator':'Walls & Paint',
  'mortar-calculator':'Concrete & Masonry',
  'rebar-calculator':'Concrete & Masonry',
  'retaining-wall-calculator':'Outdoor',
  'compost-calculator':'Landscaping',
  'raised-bed-soil-calculator':'Landscaping',
  'fertilizer-calculator':'Landscaping',
  'driveway-sealer-calculator':'Outdoor',
  'gutter-calculator':'Outdoor',
  'stair-calculator':'Decking',
  'baluster-calculator':'Decking',
  'river-rock-calculator':'Landscaping',
  'underlayment-calculator':'Flooring & Tile'
};
function catOf(slug){ return CAT[slug] || 'Other'; }

/* ---------- templates ---------- */
const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">`;

function esc(s){ return s; }

function renderInputs(inputs){
  let html = '';
  for (let i=0;i<inputs.length;i+=2){
    html += '    <div class="inputrow">\n';
    for (let j=i;j<Math.min(i+2,inputs.length);j++){
      const f = inputs[j];
      const hint = f.hint ? ` <span class="hint">${f.hint}</span>` : '';
      let control;
      if (f.type === 'select'){
        const opts = f.options.map(o=>`<option value="${o.v}"${o.sel?' selected':''}>${o.t}</option>`).join('');
        control = `<select id="${f.id}">${opts}</select>`;
      } else {
        control = `<input type="number" id="${f.id}" value="${f.value}" min="0" step="${f.step||'0.1'}" inputmode="decimal">`;
      }
      html += `      <div class="field">\n        <label for="${f.id}">${f.label}${hint}</label>\n        ${control}\n      </div>\n`;
    }
    html += '    </div>\n';
  }
  return html;
}

function renderLines(lines){
  return lines.map(l=>`        <div><span>${l.label}</span><span id="${l.id}">—</span></div>`).join('\n');
}

function faqSchema(c){
  const items = c.content.faqs.map(f=>({"@type":"Question","name":stripTags(f.q),"acceptedAnswer":{"@type":"Answer","text":stripTags(f.a)}}));
  return JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":items});
}
function stripTags(s){ return s.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&rsquo;/g,"'").replace(/&ldquo;|&rdquo;/g,'"').replace(/&amp;/g,'&'); }

function renderFaqs(faqs){
  return faqs.map(f=>`    <h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n');
}

function page(c){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${c.desc}">
<link rel="canonical" href="${SITE}/${c.slug}.html">
${FONT}
<link rel="stylesheet" href="style.css?v=${VERSION}">
<script type="application/ld+json">
${faqSchema(c)}
</script>
</head>
<body>
<header class="site">
  <div class="container">
    <a class="brand" href="index.html"><span class="wm">Calcula<i>pedia</i></span></a>
    <nav><a href="index.html">All calculators</a></nav>
  </div>
</header>

<main class="container">
  <div class="layout">
    <div class="col-stack">
      <section class="calc">
        <h1>${c.h1}</h1>
        <p class="sub">${c.sub}</p>

${renderInputs(c.inputs)}
        <div class="result">
          <div class="big" id="main">—</div>
          <div class="lines">
${renderLines(c.lines)}
          </div>
        </div>

        <a class="buy" href="#" rel="sponsored nofollow">${c.buy}</a>
      </section>

      <div class="ad">Ad space (placeholder)</div>
    </div>

    <section class="content">
      <h2>How this calculator works</h2>
      <p>${c.content.intro}</p>
      <div class="example">${c.content.example}</div>
      <h3>${c.content.h3}</h3>
      <p>${c.content.p}</p>

      <h2>Frequently asked questions</h2>
${renderFaqs(c.content.faqs)}
    </section>
  </div>
</main>

<footer class="site">
  <div class="container">
    <div>© <span id="yr"></span> Calculapedia — free project calculators.</div>
    <div class="disclaimer">Estimates are for planning only. Confirm quantities with your supplier before purchasing. Some links may be affiliate links.</div>
  </div>
</footer>

<script>
document.getElementById('yr').textContent=new Date().getFullYear();
(function(){
function num(id){var e=document.getElementById(id);if(!e)return 0;var v=parseFloat(e.value);return isFinite(v)&&v>0?v:0;}
function val(id){var e=document.getElementById(id);return e?e.value:'';}
function intval(id){var v=parseInt(val(id),10);return isFinite(v)&&v>0?v:0;}
function money(n){return '$'+Math.round(n).toLocaleString();}
function set(id,t){var e=document.getElementById(id);if(e)e.textContent=t;}
function calc(){${c.body}}
document.querySelectorAll('.calc input, .calc select').forEach(function(el){el.addEventListener('input',calc);});
calc();
})();
</script>
</body>
</html>
`;
}

function homepage(){
  const tiles = C.map(c=>{
    const cat = catOf(c.slug);
    const search = (c.name+' '+c.tile+' '+cat).toLowerCase().replace(/"/g,'');
    return `    <a class="tile" href="${c.slug}.html" data-cat="${cat}" data-search="${search}">
      <div class="emoji">${c.emoji}</div>
      <div class="name">${c.name}</div>
      <div class="desc">${c.tile}</div>
      <div class="go">Calculate →</div>
    </a>`;
  }).join('\n');
  const chips = ['All', ...CATEGORIES].map((cat,i)=>
    `      <button class="chip${i===0?' active':''}" data-cat="${cat}">${cat}</button>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Calculapedia — Free Material &amp; Cost Calculators for DIY and Contractors</title>
<meta name="description" content="Free, instant material calculators: figure out exactly how much concrete, mulch, gravel, paint, tile, drywall and more you need — and what it will cost. No signup.">
<link rel="canonical" href="${SITE}/">
${FONT}
<link rel="stylesheet" href="style.css?v=${VERSION}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Calculapedia","url":"${SITE}/","description":"Free material and cost calculators for home projects."}
</script>
</head>
<body>
<header class="site">
  <div class="container">
    <a class="brand" href="index.html"><span class="wm">Calcula<i>pedia</i></span></a>
    <nav><a href="index.html">All calculators</a></nav>
  </div>
</header>

<main class="container">
  <section class="hero">
    <div class="eyebrow">Free · Instant · No signup</div>
    <h1>How much do you need?</h1>
    <p>Smart calculators for home and building projects. Get the exact amount of material &mdash; and what it&rsquo;ll cost &mdash; in seconds.</p>
  </section>

  <div class="tools-bar">
    <input type="search" id="search" class="search" placeholder="Search calculators — concrete, paint, mulch…" autocomplete="off" aria-label="Search calculators">
    <div class="chips" id="chips">
${chips}
    </div>
  </div>

  <div class="grid" id="grid">
${tiles}
  </div>
  <p class="noresults" id="noresults" hidden>No calculators match &mdash; try another word.</p>

  <div class="ad">Ad space (placeholder)</div>

  <section class="content">
    <h2>Estimate materials the easy way</h2>
    <p>Every Calculapedia tool uses the same simple idea: tell it the size of your project, and it tells you exactly how much material to buy &mdash; rounded up with a sensible waste allowance so you don&rsquo;t make a second trip to the store. Each calculator also shows an estimated cost so you can budget before you start.</p>
    <p>Pick a calculator above to get started. They work instantly as you type, on your phone or computer.</p>
  </section>
</main>

<footer class="site">
  <div class="container">
    <div>© <span id="yr"></span> Calculapedia — free project calculators.</div>
    <div class="disclaimer">Estimates are for planning only. Always confirm quantities with your supplier or contractor before purchasing. Some links may be affiliate links.</div>
  </div>
</footer>
<script>
document.getElementById('yr').textContent=new Date().getFullYear();
(function(){
  var search=document.getElementById('search'),grid=document.getElementById('grid'),
      tiles=[].slice.call(grid.querySelectorAll('.tile')),
      chips=[].slice.call(document.querySelectorAll('.chip')),
      noresults=document.getElementById('noresults'),
      activeCat='All';
  function apply(){
    var q=search.value.trim().toLowerCase(),shown=0;
    tiles.forEach(function(t){
      var okCat=activeCat==='All'||t.getAttribute('data-cat')===activeCat;
      var okText=!q||t.getAttribute('data-search').indexOf(q)>-1;
      var show=okCat&&okText;
      t.classList.toggle('hide',!show);
      if(show)shown++;
    });
    noresults.hidden=shown>0;
  }
  search.addEventListener('input',apply);
  chips.forEach(function(ch){
    ch.addEventListener('click',function(){
      chips.forEach(function(c){c.classList.remove('active');});
      ch.classList.add('active');
      activeCat=ch.getAttribute('data-cat');
      apply();
    });
  });
})();
</script>
</body>
</html>
`;
}

function sitemap(){
  const urls = ['', ...C.map(c=>c.slug+'.html')];
  const body = urls.map(u=>`  <url><loc>${SITE}/${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/* ---------- write ---------- */
fs.mkdirSync(OUT, { recursive: true });
let count = 0;
for (const c of C){ fs.writeFileSync(path.join(OUT, c.slug+'.html'), page(c)); count++; }
fs.writeFileSync(path.join(OUT,'index.html'), homepage());
fs.writeFileSync(path.join(OUT,'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(OUT,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync(path.join(__dirname,'style.css'), path.join(OUT,'style.css'));
console.log('Generated '+count+' calculator pages + index.html, sitemap.xml, robots.txt, style.css into /dist');
console.log('Calculators: '+C.map(c=>c.slug).join(', '));
