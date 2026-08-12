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
  tile:'Pounds of seed by grass type',
  title:'Grass Seed Calculator — How Much Grass Seed Do I Need? (By Grass Type)',
  desc:'Free grass seed calculator. Pick your grass type (tall fescue, ryegrass, Kentucky bluegrass, bahia) and lawn size for the pounds of seed needed — new lawn or overseeding.',
  h1:'Grass Seed Calculator', sub:'How much grass seed do you need? Pick your grass type and lawn size.',
  buy:'Shop grass seed →',
  inputs:[
    {id:'len',label:'Lawn length',hint:'(feet)',value:'50',step:'0.1'},
    {id:'wid',label:'Lawn width',hint:'(feet)',value:'40',step:'0.1'},
    {id:'grass',label:'Grass type',type:'select',options:[{v:'3|5',t:'General / mixed (3–5 lb)',sel:true},{v:'4|6',t:'Tall fescue (4–6 lb)'},{v:'5|8',t:'Perennial ryegrass (5–8 lb)'},{v:'2|3',t:'Kentucky bluegrass (2–3 lb)'},{v:'5|10',t:'Bahia (5–10 lb)'}]},
    {id:'mode',label:'Seeding type',type:'select',options:[{v:'new',t:'New lawn (full rate)',sel:true},{v:'over',t:'Overseeding (lighter rate)'}]},
    {id:'price',label:'Price per pound',hint:'(optional, $)',value:'5',step:'0.5'}
  ],
  lines:[
    {id:'area',label:'Lawn area'},
    {id:'rateUsed',label:'Rate applied'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),P=num('price');
var parts=(val('grass')||'3|5').split('|'),low=parseFloat(parts[0])||3,high=parseFloat(parts[1])||5;
var rate=val('mode')==='over'?low:high,area=L*W,lbs=area/1000*rate;
set('main',lbs.toFixed(1)+' pounds');
set('area',area.toFixed(0)+' sq ft');
set('rateUsed',rate+' lb / 1000 sq ft');
set('cost',P>0?money(Math.ceil(lbs)*P):'—');`,
  content:{
    intro:'Seeding rates depend on both the grass species and whether you&rsquo;re starting a new lawn or overseeding. Pick your grass type and the calculator applies the right rate per 1,000 sq ft — the heavier rate for a new lawn, a lighter rate for overseeding.',
    example:'<strong>Worked example — a 50&nbsp;ft × 40&nbsp;ft (2,000 sq ft) new lawn in tall fescue (6 lb / 1,000 sq ft):</strong><br>2,000 ÷ 1,000 × 6 = <strong>12 pounds</strong> of seed.',
    h3:'Why grass type matters',
    p:'Seed size, growth habit, and germination speed change how much you need. Spreading grasses like Kentucky bluegrass (2–3 lb) need less; bunch-type or large-seeded grasses like tall fescue (4–6 lb), perennial ryegrass (5–8 lb), and bahia (5–10 lb) need more. A new lawn uses roughly double the overseeding rate.',
    faqs:[
      {q:'How much grass seed per 1,000 sq ft by type?',a:'For a new lawn, roughly: Kentucky bluegrass <strong>2–3 lb</strong>, tall fescue <strong>4–6 lb</strong>, perennial ryegrass <strong>5–8 lb</strong>, and bahia <strong>5–10 lb</strong> per 1,000 sq ft.'},
      {q:'How much seed for overseeding vs a new lawn?',a:'Overseeding uses about <strong>half</strong> the new-lawn rate — enough to thicken existing turf without crowding it.'}
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

C.push({
  slug:'potting-soil-calculator', emoji:'🪴', name:'Potting Soil Calculator',
  tile:'Potting mix for pots & containers',
  title:'Potting Soil Calculator — How Much Potting Mix Do I Need?',
  desc:'Free potting soil calculator. Enter your pot size and count for the cubic feet and dry quarts of potting mix needed.',
  h1:'Potting Soil Calculator', sub:'How much potting mix do you need? Enter your pot size and how many.',
  buy:'Shop potting mix →',
  inputs:[
    {id:'diam',label:'Pot diameter',hint:'(inches)',value:'12',step:'0.5'},
    {id:'height',label:'Pot height',hint:'(inches)',value:'10',step:'0.5'},
    {id:'pots',label:'Number of pots',hint:'',value:'3',step:'1'},
    {id:'price',label:'Price per cubic foot',hint:'(optional, $)',value:'8',step:'0.5'}
  ],
  lines:[
    {id:'perpot',label:'Per pot'},
    {id:'quarts',label:'Dry quarts needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var d=num('diam'),h=num('height'),n=intval('pots')||1,P=num('price');
var perCuFt=(Math.PI*Math.pow(d/2,2)*h)/1728,total=perCuFt*n,quarts=total*25.714;
set('main',total.toFixed(2)+' cubic feet');
set('perpot',perCuFt.toFixed(2)+' cu ft');
set('quarts',Math.ceil(quarts)+' qt');
set('cost',P>0?money(total*P):'—');`,
  content:{
    intro:'It treats each pot as a cylinder (diameter × height), totals the volume across all your pots, and converts it to cubic feet and dry quarts — the two ways potting mix is sold.',
    example:'<strong>Worked example — three 12&nbsp;in × 10&nbsp;in pots:</strong><br>π × 6² × 10 = 1,131 cu in ÷ 1,728 = 0.65 cu ft each → × 3 = <strong>1.96 cubic feet</strong> (about 50 dry quarts).',
    h3:'Pots taper, so you&rsquo;ll have a little extra',
    p:'Most pots are narrower at the base than a true cylinder, so this estimate runs slightly high — which is good, since fresh mix settles and you&rsquo;ll want a little reserve.',
    faqs:[
      {q:'How many quarts of soil for a 12-inch pot?',a:'About <strong>16–17 dry quarts</strong> for a standard 12 in × 10 in pot.'},
      {q:'How do I convert cubic feet to quarts?',a:'Multiply cubic feet by <strong>25.7</strong> to get dry quarts.'}
    ]
  }
});

C.push({
  slug:'thinset-calculator', emoji:'🛠️', name:'Thinset Mortar Calculator',
  tile:'Bags of thinset for tiling',
  title:'Thinset Calculator — How Much Thinset Mortar Do I Need?',
  desc:'Free thinset mortar calculator. Enter your tile area and trowel size for the number of 50 lb bags of thinset needed and cost.',
  h1:'Thinset Mortar Calculator', sub:'How much thinset do you need? Enter your area and trowel size.',
  buy:'Shop thinset mortar →',
  inputs:[
    {id:'len',label:'Area length',hint:'(feet)',value:'10',step:'0.1'},
    {id:'wid',label:'Area width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'trowel',label:'Trowel size',type:'select',options:[{v:'95',t:'1/4 in V-notch (~95 sq ft)'},{v:'70',t:'1/4 in square (~70 sq ft)',sel:true},{v:'45',t:'1/2 in square (~45 sq ft)'}]},
    {id:'price',label:'Price per bag',hint:'(optional, $)',value:'15',step:'1'}
  ],
  lines:[
    {id:'area',label:'Area to tile'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),cov=parseFloat(val('trowel'))||70,P=num('price');
var area=L*W,bags=cov>0?Math.ceil(area/cov):0;
set('main',bags+' bags');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'Thinset coverage depends mostly on your trowel size — bigger notches lay a thicker bed and cover less area. The calculator divides your tile area by the coverage for the chosen trowel (per 50 lb bag).',
    example:'<strong>Worked example — 100 sq ft with a 1/4&nbsp;in square-notch trowel (~70 sq ft/bag):</strong><br>100 ÷ 70 = 1.43 → <strong>2 bags</strong> of thinset.',
    h3:'Bigger tiles need bigger notches',
    p:'Large-format tiles and uneven substrates need a deeper notch (1/2 in), which uses more thinset. Match the trowel to your tile size — the manufacturer lists the recommended notch.',
    faqs:[
      {q:'How much thinset for 100 square feet?',a:'Roughly <strong>1–2 bags</strong> (50 lb) depending on trowel size.'},
      {q:'How much area does a bag of thinset cover?',a:'About <strong>45–95 sq ft</strong> per 50 lb bag, depending on the trowel notch.'}
    ]
  }
});

C.push({
  slug:'vinyl-siding-calculator', emoji:'🏘️', name:'Vinyl Siding Calculator',
  tile:'Squares of siding for any exterior wall',
  title:'Vinyl Siding Calculator — How Much Vinyl Siding Do I Need? (Squares)',
  desc:'Free vinyl siding calculator. Enter your wall dimensions for the squares of siding needed, with waste allowance and estimated cost.',
  h1:'Vinyl Siding Calculator', sub:'How much vinyl siding do you need? Enter your wall size for squares and cost.',
  buy:'Shop vinyl siding →',
  inputs:[
    {id:'len',label:'Total wall length',hint:'(feet, all sides)',value:'120',step:'1'},
    {id:'height',label:'Average wall height',hint:'(feet)',value:'9',step:'0.1'},
    {id:'doors',label:'Doors',hint:'(subtracted)',value:'3',step:'1'},
    {id:'windows',label:'Windows',hint:'(subtracted)',value:'8',step:'1'},
    {id:'price',label:'Price per square',hint:'(optional, $)',value:'120',step:'5'}
  ],
  lines:[
    {id:'area',label:'Gross wall area'},
    {id:'net',label:'Net area (minus openings)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),doors=intval('doors'),win=intval('windows'),P=num('price');
var gross=L*H,net=Math.max(0,gross-doors*21-win*15),sq=net/100*1.10;
set('main',(Math.ceil(sq*10)/10).toFixed(1)+' squares (buy '+Math.ceil(sq)+')');
set('area',gross.toFixed(0)+' sq ft');
set('net',net.toFixed(0)+' sq ft');
set('cost',P>0?money(Math.ceil(sq)*P):'—');`,
  content:{
    intro:'It multiplies your total wall length by the average height for the gross area, subtracts 21 sq ft per door and 15 sq ft per window, then converts to siding &ldquo;squares&rdquo; (each covering 100 sq ft) and adds 10% for cuts and waste.',
    example:'<strong>Worked example — a house with 120&nbsp;ft of wall at 9&nbsp;ft height, 3 doors and 8 windows:</strong><br>120 × 9 = 1,080 sq ft &minus; (63 + 120) = 897 sq ft net → ÷ 100 × 1.10 = <strong>9.9 squares</strong> → buy 10.',
    h3:'How siding is sold',
    p:'Vinyl siding is sold by the &ldquo;square&rdquo; — a unit covering 100 sq ft. Each carton typically includes several panels and covers one square. Always check the carton label, as coverage can vary by panel style.',
    faqs:[
      {q:'How many squares of siding do I need?',a:'Measure total wall area, subtract openings, divide by 100, and add 10% for waste. A typical 1,500 sq ft ranch-style house takes roughly <strong>12–15 squares</strong>.'},
      {q:'How much does vinyl siding cost per square?',a:'Material cost runs roughly <strong>$80–$150 per square</strong>; installed cost is typically $100–$200 per square.'}
    ]
  }
});

C.push({
  slug:'landscape-fabric-calculator', emoji:'🌿', name:'Landscape Fabric Calculator',
  tile:'Rolls of weed barrier for beds & paths',
  title:'Landscape Fabric Calculator — How Much Weed Barrier Do I Need?',
  desc:'Free landscape fabric (weed barrier) calculator. Enter your bed or path size and roll coverage for rolls needed and estimated cost.',
  h1:'Landscape Fabric Calculator', sub:'How much weed barrier do you need? Enter your area and roll size.',
  buy:'Shop landscape fabric →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'10',step:'0.1'},
    {id:'cov',label:'Coverage per roll',hint:'(sq ft)',value:'300',step:'10'},
    {id:'price',label:'Price per roll',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'area',label:'Area to cover'},
    {id:'areaW',label:'Area with 10% overlap'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),cov=num('cov'),P=num('price');
var area=L*W,areaW=area*1.10,rolls=cov>0?Math.ceil(areaW/cov):0;
set('main',rolls+' rolls');
set('area',area.toFixed(0)+' sq ft');
set('areaW',areaW.toFixed(0)+' sq ft');
set('cost',P>0?money(rolls*P):'—');`,
  content:{
    intro:'It calculates your bed or path area, adds 10% for overlapping seams and tucking edges, then divides by the square footage each roll covers — printed on the label.',
    example:'<strong>Worked example — a 20&nbsp;ft × 10&nbsp;ft bed, 300 sq ft per roll:</strong><br>200 sq ft × 1.10 = 220 sq ft ÷ 300 = <strong>1 roll</strong>.',
    h3:'Why overlap matters',
    p:'Overlap seams by at least 6 inches so weeds can&rsquo;t push through gaps. Pin the fabric every 18–24 inches and tuck edges under edging or stones to hold them down.',
    faqs:[
      {q:'How much landscape fabric do I need?',a:'Measure your bed area, add 10% for overlaps, then divide by the roll&rsquo;s square footage.'},
      {q:'How do I keep landscape fabric from shifting?',a:'Use landscape staples or pins every <strong>18–24 inches</strong>, placed more closely on slopes and around curves.'}
    ]
  }
});

C.push({
  slug:'post-hole-calculator', emoji:'🪛', name:'Post Hole Calculator',
  tile:'Concrete bags for fence or deck post holes',
  title:'Post Hole Calculator — How Many Bags of Concrete for Fence Posts?',
  desc:'Free post hole concrete calculator. Enter hole count, diameter, and depth for the bags of concrete mix needed and estimated cost.',
  h1:'Post Hole Calculator', sub:'How much concrete for your fence posts? Enter hole count, size, and depth.',
  buy:'Shop concrete mix →',
  inputs:[
    {id:'holes',label:'Number of post holes',hint:'',value:'10',step:'1'},
    {id:'diam',label:'Hole diameter',hint:'(inches)',value:'10',step:'1'},
    {id:'depth',label:'Hole depth',hint:'(inches)',value:'36',step:'1'},
    {id:'price',label:'Price per bag (50 lb)',hint:'(optional, $)',value:'5',step:'0.5'}
  ],
  lines:[
    {id:'perhole',label:'Cu ft per hole'},
    {id:'totalcf',label:'Total cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var n=intval('holes'),d=num('diam'),dep=num('depth'),P=num('price');
var r=d/2/12,cf=Math.PI*r*r*(dep/12),total=cf*n,bags=Math.ceil(total/0.375);
set('main',bags+' bags (50 lb)');
set('perhole',cf.toFixed(2)+' cu ft');
set('totalcf',total.toFixed(2)+' cu ft');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'It treats each hole as a cylinder — π × radius² × depth — to find the volume in cubic feet, multiplies by your hole count, and divides by the 0.375 cubic-foot yield of a standard 50&nbsp;lb bag of concrete mix.',
    example:'<strong>Worked example — 10 holes, 10&nbsp;in diameter, 36&nbsp;in deep:</strong><br>π × (5 ÷ 12)² × 3 = 0.55 cu ft per hole × 10 = 5.5 cu ft → <strong>15 bags</strong>.',
    h3:'How deep should a post hole be?',
    p:'A common rule is to bury at least one-third of the post length. For a 6&nbsp;ft fence using 8&nbsp;ft posts, that means going 2.5–3&nbsp;ft deep — deeper in freeze-thaw climates to get below the frost line.',
    faqs:[
      {q:'How many bags of concrete per fence post?',a:'About <strong>1–3 bags</strong> (50 lb each) depending on hole size — typically 2 bags for a standard 10-inch diameter, 30-inch deep hole.'},
      {q:'What diameter should a post hole be?',a:'About <strong>3 times the post width</strong> — so a 4-inch post needs roughly a 12-inch hole.'}
    ]
  }
});

C.push({
  slug:'board-foot-calculator', emoji:'🪵', name:'Board Foot Calculator',
  tile:'Board feet of lumber for any project',
  title:'Board Foot Calculator — How Many Board Feet of Lumber Do I Need?',
  desc:'Free board foot calculator. Enter thickness, width, length and quantity to find total board feet and estimated cost of lumber.',
  h1:'Board Foot Calculator', sub:'How many board feet of lumber do you need? Enter your board dimensions and quantity.',
  buy:'Shop dimensional lumber →',
  inputs:[
    {id:'thick',label:'Thickness',hint:'(inches)',value:'1',step:'0.25'},
    {id:'wid',label:'Width',hint:'(inches)',value:'6',step:'0.25'},
    {id:'len',label:'Length',hint:'(feet)',value:'8',step:'0.5'},
    {id:'qty',label:'Number of boards',hint:'',value:'10',step:'1'},
    {id:'price',label:'Price per board foot',hint:'(optional, $)',value:'4',step:'0.25'}
  ],
  lines:[
    {id:'perboard',label:'Board feet per board'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var T=num('thick'),W=num('wid'),L=num('len'),Q=intval('qty')||1,P=num('price');
var per=(T*W*L)/12,total=per*Q;
set('main',total.toFixed(1)+' board feet');
set('perboard',per.toFixed(2)+' bf per board');
set('cost',P>0?money(total*P):'—');`,
  content:{
    intro:'A board foot is a unit of lumber volume equal to 12 × 12 × 1 inch. The formula is simple: thickness (in) × width (in) × length (ft) ÷ 12 — then multiply by the number of boards.',
    example:'<strong>Worked example — 10 boards at 1&nbsp;in × 6&nbsp;in × 8&nbsp;ft:</strong><br>(1 × 6 × 8) ÷ 12 = 4 board feet each × 10 = <strong>40 board feet</strong>.',
    h3:'When board feet matter',
    p:'Softwood framing lumber is typically priced by the linear foot or per piece, but hardwood (oak, maple, walnut) is almost always priced by the board foot. Knowing your total makes it easy to compare prices at the lumber yard.',
    faqs:[
      {q:'What is a board foot of lumber?',a:'One board foot equals <strong>144 cubic inches</strong> — the volume of a piece 1 inch thick, 12 inches wide, and 1 foot long.'},
      {q:'How do I calculate board feet?',a:'Multiply thickness (inches) × width (inches) × length (feet), then divide by <strong>12</strong>.'}
    ]
  }
});

C.push({
  slug:'ceiling-tile-calculator', emoji:'🏢', name:'Ceiling Tile Calculator',
  tile:'Tiles for a drop or acoustic ceiling',
  title:'Ceiling Tile Calculator — How Many Ceiling Tiles Do I Need?',
  desc:'Free ceiling tile calculator for drop and acoustic ceilings. Enter room size and tile size for the number of tiles and boxes needed, with waste allowance and cost.',
  h1:'Ceiling Tile Calculator', sub:'How many ceiling tiles do you need? Enter your room size and tile size.',
  buy:'Shop acoustic ceiling tiles →',
  inputs:[
    {id:'len',label:'Room length',hint:'(feet)',value:'16',step:'0.1'},
    {id:'wid',label:'Room width',hint:'(feet)',value:'12',step:'0.1'},
    {id:'tile',label:'Tile size',type:'select',options:[{v:'4',t:'2×2 ft (4 sq ft)',sel:true},{v:'8',t:'2×4 ft (8 sq ft)'}]},
    {id:'perbox',label:'Tiles per box',hint:'(optional)',value:'12',step:'1'},
    {id:'price',label:'Price per tile',hint:'(optional, $)',value:'2.5',step:'0.25'}
  ],
  lines:[
    {id:'area',label:'Ceiling area'},
    {id:'boxes',label:'Boxes needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),tsf=parseFloat(val('tile'))||4,perbox=intval('perbox'),P=num('price');
var area=L*W,tiles=tsf>0?Math.ceil(area/tsf*1.10):0;
set('main',tiles+' tiles');
set('area',area.toFixed(0)+' sq ft');
set('boxes',perbox>0?Math.ceil(tiles/perbox)+' boxes':'—');
set('cost',P>0?money(tiles*P):'—');`,
  content:{
    intro:'It divides your ceiling area by the area of one tile, adds 10% for edge cuts and waste, and converts to the number of tiles and boxes to buy.',
    example:'<strong>Worked example — a 16&nbsp;ft × 12&nbsp;ft room with 2×2 tiles:</strong><br>192 sq ft ÷ 4 = 48 tiles × 1.10 = <strong>53 tiles</strong> (~5 boxes of 12).',
    h3:'Plan your grid first',
    p:'Start the grid from the center of the room so edge cuts are equal on opposite sides. Aim for border tiles that are at least half a tile wide for a clean, professional look.',
    faqs:[
      {q:'How many ceiling tiles for a 12×12 room?',a:'About <strong>40 tiles</strong> using 2×2 ft tiles (144 sq ft ÷ 4, plus 10% waste).'},
      {q:'Do I need extra ceiling tiles?',a:'Yes — add about <strong>10%</strong> for edge cuts and the occasional damaged tile, and keep a few spares for future repairs.'}
    ]
  }
});

C.push({
  slug:'stucco-calculator', emoji:'🏡', name:'Stucco Calculator',
  tile:'Bags of stucco mix for exterior walls',
  title:'Stucco Calculator — How Many Bags of Stucco Do I Need?',
  desc:'Free stucco calculator. Enter your wall area and coat type for the number of 80 lb bags of stucco mix needed and estimated cost.',
  h1:'Stucco Calculator', sub:'How much stucco do you need? Enter your wall area and coat type.',
  buy:'Shop stucco mix →',
  inputs:[
    {id:'len',label:'Total wall length',hint:'(feet)',value:'60',step:'0.5'},
    {id:'height',label:'Wall height',hint:'(feet)',value:'9',step:'0.1'},
    {id:'coat',label:'Application',type:'select',options:[{v:'35',t:'One-coat (3/8 in, ~35 sq ft/bag)',sel:true},{v:'25',t:'Three-coat (full depth, ~25 sq ft/bag)'}]},
    {id:'price',label:'Price per bag (80 lb)',hint:'(optional, $)',value:'18',step:'1'}
  ],
  lines:[
    {id:'area',label:'Wall area'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),cov=parseFloat(val('coat'))||35,P=num('price');
var area=L*H,bags=cov>0?Math.ceil(area*1.10/cov):0;
set('main',bags+' bags (80 lb)');
set('area',area.toFixed(0)+' sq ft');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'One 80&nbsp;lb bag of stucco mix covers about 35&nbsp;sq&nbsp;ft at 3/8&nbsp;inch thick (one-coat application) or 25&nbsp;sq&nbsp;ft for a traditional three-coat system. A 10% waste factor covers corners and edges.',
    example:'<strong>Worked example — a 60&nbsp;ft × 9&nbsp;ft wall, one-coat application:</strong><br>540 sq ft × 1.10 ÷ 35 = <strong>17 bags</strong>.',
    h3:'One-coat vs. three-coat',
    p:'One-coat stucco is a factory-blended mix applied in a single 3/8-inch layer — faster and good for re-stucco work. Traditional three-coat (scratch, brown, finish) is thicker and more durable, and is standard for new construction.',
    faqs:[
      {q:'How much does a bag of stucco cover?',a:'An 80&nbsp;lb bag covers roughly <strong>35&nbsp;sq&nbsp;ft</strong> at 3/8&nbsp;inch for a one-coat application, or about <strong>25&nbsp;sq&nbsp;ft</strong> for a thicker three-coat system.'},
      {q:'How many bags of stucco do I need for a house?',a:'A typical 1,500 sq ft house exterior (minus openings) might need <strong>45–60 bags</strong> for one-coat stucco, depending on wall height and window count.'}
    ]
  }
});

C.push({
  slug:'grout-calculator', emoji:'🔲', name:'Grout Calculator',
  tile:'Bags of grout for floor or wall tile',
  title:'Grout Calculator — How Many Bags of Grout Do I Need?',
  desc:'Free grout calculator. Enter your tile size, grout joint width, and area for the number of 25 lb bags needed and estimated cost.',
  h1:'Grout Calculator', sub:'How much grout do you need? Enter your tile size and joint width for bags and cost.',
  buy:'Shop tile grout →',
  inputs:[
    {id:'area',label:'Area to tile',hint:'(square feet)',value:'100',step:'1'},
    {id:'tile',label:'Tile size',type:'select',options:[
      {v:'4',t:'4"×4" (mosaic)'},
      {v:'6',t:'6"×6"'},
      {v:'12',t:'12"×12"',sel:true},
      {v:'18',t:'18"×18"'},
      {v:'24',t:'24"×24"'}
    ]},
    {id:'joint',label:'Grout joint width',type:'select',options:[
      {v:'0.125',t:'1/8" — narrow'},
      {v:'0.1875',t:'3/16" — standard',sel:true},
      {v:'0.25',t:'1/4" — wide'},
      {v:'0.375',t:'3/8" — extra wide'}
    ]},
    {id:'price',label:'Price per 25 lb bag',hint:'(optional, $)',value:'18',step:'1'}
  ],
  lines:[
    {id:'lbs',label:'Dry grout needed'},
    {id:'coverage',label:'Coverage per bag'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var A=num('area'),TS=parseFloat(val('tile'))||12,JW=parseFloat(val('joint'))||0.1875,P=num('price');
var lbs=A*(2*TS)*JW*0.375*38/(TS*TS)*1.10;
var bags=Math.ceil(lbs/25);
set('main',bags+' bags (25 lb)');
set('lbs',lbs.toFixed(1)+' lbs');
set('coverage',bags>0?(A/bags).toFixed(0)+' sq ft / bag':'—');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'The calculator uses your tile size and joint width to estimate total grout joint volume, converts it to dry bag weight using an industry-calibrated density factor, and adds a 10% waste allowance for squeeze-out and cleanup.',
    example:'<strong>Worked example — 100&nbsp;sq&nbsp;ft, 12"×12" tile, 3/16" joint:</strong><br>(2×12)/12² × 0.1875 × 0.375 × 38 × 100 × 1.10 = <strong>≈50&nbsp;lbs → 2 bags</strong>.',
    h3:'Sanded vs. unsanded grout',
    p:'Use <strong>sanded grout</strong> for joints 1/8" and wider — the sand prevents cracking as the joint cures. Use <strong>unsanded grout</strong> for joints narrower than 1/8", or for soft natural stone (marble, limestone) where sand would scratch the face.',
    faqs:[
      {q:'How much grout do I need for 100 square feet?',a:'For standard 12"×12" tile with a 3/16" joint, expect about <strong>2 bags (25 lb each)</strong> of sanded grout. Smaller tiles or wider joints require significantly more — 4"×4" mosaic with a 3/16" joint uses roughly 6 bags per 100 sq ft.'},
      {q:'How many square feet does a bag of grout cover?',a:'A 25&nbsp;lb bag of sanded grout covers roughly <strong>50–65 square feet</strong> for 12"×12" tile with a standard 3/16" joint. Coverage drops sharply with smaller tiles or wider joints.'}
    ]
  }
});

C.push({
  slug:'caulk-calculator', emoji:'🪝', name:'Caulk Calculator',
  tile:'Tubes of caulk for windows, doors & trim',
  title:'Caulk Calculator — How Many Tubes of Caulk Do I Need?',
  desc:'Free caulk calculator. Enter the linear feet to seal and bead size for the number of 10 oz caulk tubes needed and estimated cost.',
  h1:'Caulk Calculator', sub:'How much caulk do you need? Enter the linear feet and bead size for tubes and cost.',
  buy:'Shop caulk & sealant →',
  inputs:[
    {id:'feet',label:'Linear feet to caulk',hint:'(feet)',value:'40',step:'1'},
    {id:'bead',label:'Bead diameter',type:'select',options:[
      {v:'0.1875',t:'3/16" — trim & windows',sel:true},
      {v:'0.25',t:'1/4" — general purpose'},
      {v:'0.375',t:'3/8" — gaps & siding'},
      {v:'0.5',t:'1/2" — large gaps'}
    ]},
    {id:'price',label:'Price per tube (10 oz)',hint:'(optional, $)',value:'6',step:'0.5'}
  ],
  lines:[
    {id:'perTube',label:'Coverage per tube'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var LF=num('feet'),bead=parseFloat(val('bead'))||0.25,P=num('price');
var ftPerTube=1.9148/(bead*bead);
var tubes=Math.ceil(LF*1.10/ftPerTube);
set('main',tubes+' tubes (10 oz)');
set('perTube',ftPerTube.toFixed(0)+' ft per tube');
set('cost',P>0?money(tubes*P):'—');`,
  content:{
    intro:'A standard 10&nbsp;oz caulk tube holds about 18 cubic inches of material. Dividing that by the cross-sectional area of a round bead gives the linear feet per tube, and the calculator adds 10% for starts, stops, and tooling waste.',
    example:'<strong>Worked example — caulking 40&nbsp;ft of window and door trim at 3/16" bead:</strong><br>18 ÷ (π × 0.094²) ÷ 12 = 54&nbsp;ft per tube → ceil(40 × 1.10 / 54) = <strong>1 tube</strong>.',
    h3:'Match the caulk to the job',
    p:'Use <strong>paintable latex caulk</strong> for interior trim and baseboards. Use <strong>silicone or siliconized acrylic</strong> for wet areas (tub surrounds, sinks) and exterior joints. Use <strong>polyurethane caulk</strong> for driveways and masonry joints that get heavy movement.',
    faqs:[
      {q:'How many linear feet does a tube of caulk cover?',a:'A 10&nbsp;oz tube covers about <strong>54&nbsp;ft at 3/16"</strong>, 30&nbsp;ft at 1/4", 13&nbsp;ft at 3/8", or 7&nbsp;ft at 1/2" — depending on bead size.'},
      {q:'How much caulk do I need for windows and doors?',a:'A typical exterior window or door perimeter is about 20–25 linear feet. With a 3/16" bead, <strong>one 10&nbsp;oz tube</strong> handles 2–3 windows comfortably.'}
    ]
  }
});

C.push({
  slug:'epoxy-floor-calculator', emoji:'🏎️', name:'Epoxy Floor Calculator',
  tile:'Gallons of epoxy coating for a garage or basement floor',
  title:'Epoxy Floor Calculator — How Much Epoxy Do I Need for My Garage?',
  desc:'Free epoxy floor coating calculator. Enter your floor size and number of coats for the gallons of epoxy needed and estimated cost.',
  h1:'Epoxy Floor Calculator', sub:'How much epoxy floor coating do you need? Enter your floor size for gallons and cost.',
  buy:'Shop garage floor epoxy →',
  inputs:[
    {id:'len',label:'Floor length',hint:'(feet)',value:'20',step:'0.5'},
    {id:'wid',label:'Floor width',hint:'(feet)',value:'20',step:'0.5'},
    {id:'coats',label:'Number of coats',type:'select',options:[
      {v:'1',t:'1 coat (touch-up / budget)'},
      {v:'2',t:'2 coats (standard)',sel:true},
      {v:'3',t:'3 coats (high-durability)'}
    ]},
    {id:'price',label:'Price per gallon',hint:'(optional, $)',value:'60',step:'5'}
  ],
  lines:[
    {id:'area',label:'Floor area'},
    {id:'coatCount',label:'Coats'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),C=parseInt(val('coats'),10)||2,P=num('price');
var area=L*W,gal=Math.ceil(area*1.10*C/250);
set('main',gal+' gallon'+(gal!==1?'s':''));
set('area',area.toFixed(0)+' sq ft');
set('coatCount',C+' coat'+(C!==1?'s':''));
set('cost',P>0?money(gal*P):'—');`,
  content:{
    intro:'Most water-based epoxy floor paints cover 200–250 square feet per gallon on properly etched concrete. The calculator uses 250 sq ft per gallon as a typical rate, adds 10% for roll-off and edges, and multiplies by your number of coats.',
    example:'<strong>Worked example — a 20&nbsp;ft × 20&nbsp;ft garage, 2 coats:</strong><br>400 sq ft × 1.10 × 2 ÷ 250 = 3.52 → <strong>4 gallons</strong>.',
    h3:'Prep is everything',
    p:'Etching or diamond-grinding the concrete surface is critical — un-prepped concrete causes epoxy to peel. Acid etching opens the pores so the epoxy bonds. Fill cracks and oil stains with an appropriate primer before the first coat.',
    faqs:[
      {q:'How many gallons of epoxy do I need for a 2-car garage?',a:'A typical 2-car garage floor is 400–500 sq ft. For 2 coats, plan on <strong>4–5 gallons</strong> (one 2-gallon kit per coat, plus a spare quart for edges).'},
      {q:'How many square feet does a gallon of floor epoxy cover?',a:'Most products cover <strong>200–250 square feet per gallon</strong> on properly prepared concrete. Rough, porous, or first-coat application consumes more — use the lower end for planning.'}
    ]
  }
});

C.push({
  slug:'joint-compound-calculator', emoji:'🪣', name:'Joint Compound Calculator',
  tile:'Pails of drywall mud for taping & finishing',
  title:'Joint Compound Calculator — How Much Drywall Mud Do I Need?',
  desc:'Free joint compound calculator. Enter your drywall area and number of coats for the pails of mud needed and estimated cost.',
  h1:'Joint Compound Calculator', sub:'How much joint compound do you need? Enter your drywall area for pails and cost.',
  buy:'Shop joint compound →',
  inputs:[
    {id:'area',label:'Drywall area',hint:'(square feet)',value:'500',step:'10'},
    {id:'level',label:'Finish level',type:'select',options:[
      {v:'2',t:'2 coats (tape + skim, quick)'},
      {v:'3',t:'3 coats (tape, fill, finish)',sel:true},
      {v:'skim',t:'Full skim coat (whole surface)'}
    ]},
    {id:'price',label:'Price per pail (4.5 gal)',hint:'(optional, $)',value:'18',step:'1'}
  ],
  lines:[
    {id:'coverage',label:'Coverage per pail'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var A=num('area'),lvl=val('level'),P=num('price');
var cov = lvl==='skim'?150:(lvl==='2'?600:400);
var pails=Math.ceil(A*1.10/cov);
set('main',pails+' pails (4.5 gal)');
set('coverage',cov+' sq ft / pail');
set('cost',P>0?money(pails*P):'—');`,
  content:{
    intro:'The calculator uses standard manufacturer coverage rates for premixed all-purpose joint compound — lighter use for a quick 2-coat job, the typical 400 sq ft per 4.5-gallon pail for a standard 3-coat tape/fill/finish system, or much heavier use for a full skim coat over an entire wall or ceiling — then adds 10% for tooling and touch-ups.',
    example:'<strong>Worked example — 500&nbsp;sq&nbsp;ft of new drywall, standard 3-coat finish:</strong><br>500 × 1.10 ÷ 400 = 1.375 → <strong>2 pails</strong>.',
    h3:'Why coverage drops so much for a skim coat',
    p:'Taping only covers the joints themselves — a narrow strip along each seam. A full skim coat covers <strong>every square foot of the surface</strong> in a thin layer to hide texture or damage, so the same pail covers far less area than it would just taping joints.',
    faqs:[
      {q:'How many pails of joint compound do I need for 500 sq ft of drywall?',a:'For a standard 3-coat tape/fill/finish job, plan on about <strong>2 pails</strong> (4.5 gal each). A quick 2-coat job needs less; a full skim coat needs several times more.'},
      {q:'How much area does a pail of joint compound cover?',a:'A 4.5-gallon pail covers roughly <strong>400 sq ft</strong> through a standard 3-coat finish, up to 600 sq ft for a light 2-coat job, but only about <strong>150 sq ft</strong> if skim-coating the entire surface.'}
    ]
  }
});

C.push({
  slug:'artificial-turf-calculator', emoji:'🟩', name:'Artificial Turf Calculator',
  tile:'Square feet of turf & infill for a lawn or patch',
  title:'Artificial Turf Calculator — How Much Turf Do I Need?',
  desc:'Free artificial turf calculator. Enter your yard size and infill type for square feet of turf, infill bags, and estimated cost.',
  h1:'Artificial Turf Calculator', sub:'How much artificial turf do you need? Enter your yard size for turf, infill, and cost.',
  buy:'Shop artificial turf →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.5'},
    {id:'wid',label:'Width',hint:'(feet)',value:'15',step:'0.5'},
    {id:'infill',label:'Infill type',type:'select',options:[
      {v:'sand',t:'Silica sand',sel:true},
      {v:'rubber',t:'Rubber crumb'},
      {v:'none',t:'Pre-infilled / none'}
    ]},
    {id:'price',label:'Price per sq ft of turf',hint:'(optional, $)',value:'3',step:'0.25'}
  ],
  lines:[
    {id:'actual',label:'Actual yard area'},
    {id:'infillOut',label:'Infill needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),type=val('infill'),P=num('price');
var area=L*W,turf=Math.ceil(area*1.10);
var rate=type==='rubber'?2:(type==='sand'?1.5:0);
var lbs=area*rate,bags=Math.ceil(lbs/50);
set('main',turf+' sq ft of turf');
set('actual',area.toFixed(0)+' sq ft');
set('infillOut',rate>0?bags+' bags (50 lb)':'Not needed');
set('cost',P>0?money(turf*P):'—');`,
  content:{
    intro:'The calculator adds a 10% waste allowance on top of your actual yard area — artificial turf has a directional grain, so every piece must run the same way, which costs more material than trimming real sod or gravel. It then estimates infill weight using standard application rates for the infill type you choose.',
    example:'<strong>Worked example — a 20&nbsp;ft × 15&nbsp;ft yard with silica sand infill:</strong><br>300 sq ft × 1.10 = 330 sq ft of turf. Infill: 300 × 1.5 lb = 450 lbs → <strong>9 bags</strong> (50 lb each).',
    h3:'Why turf needs more waste than sod',
    p:'Turf rolls are typically 12–15 ft wide, and every seam must line up with the pile direction (the "grain") so the seams don&rsquo;t show. On odd-shaped or narrow yards this can push waste well above 10% — measure your longest run against the roll width before ordering.',
    faqs:[
      {q:'How much artificial turf do I need for a 300 sq ft yard?',a:'Order about <strong>330 sq ft</strong> (10% extra) to allow for seaming and trimming to match the grain direction.'},
      {q:'How much infill does artificial turf need?',a:'Silica sand infill is typically applied at about <strong>1–2 lbs per sq ft</strong>; rubber crumb infill runs a bit heavier at roughly 2 lbs per sq ft. Some premium turf comes pre-infilled and needs none.'}
    ]
  }
});

C.push({
  slug:'landscape-edging-calculator', emoji:'〰️', name:'Landscape Edging Calculator',
  tile:'Linear feet of edging & stakes for a garden bed',
  title:'Landscape Edging Calculator — How Much Edging Do I Need?',
  desc:'Free landscape edging calculator. Enter your bed dimensions and edging type for linear feet, stakes, and estimated cost.',
  h1:'Landscape Edging Calculator', sub:'How much edging do you need? Enter your bed size for linear feet, stakes, and cost.',
  buy:'Shop landscape edging →',
  inputs:[
    {id:'len',label:'Bed length',hint:'(feet)',value:'20',step:'0.5'},
    {id:'wid',label:'Bed width',hint:'(feet)',value:'10',step:'0.5'},
    {id:'type',label:'Edging type',type:'select',options:[
      {v:'roll',t:'Flexible roll (20 ft)',sel:true},
      {v:'rigid',t:'Rigid sections (4 ft)'}
    ]},
    {id:'price',label:'Price per unit',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'perimeter',label:'Perimeter needed'},
    {id:'stakes',label:'Stakes needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),type=val('type'),P=num('price');
var perimeter=2*(L+W)*1.05;
var unitLen=type==='rigid'?4:20;
var units=Math.ceil(perimeter/unitLen);
var stakes=type==='rigid'?units*2:Math.ceil(perimeter/2);
set('main',units+' '+(type==='rigid'?'sections (4 ft)':'rolls (20 ft)'));
set('perimeter',perimeter.toFixed(0)+' ft');
set('stakes',stakes+' stakes');
set('cost',P>0?money(units*P):'—');`,
  content:{
    intro:'The calculator finds the perimeter of your bed and adds 5% for cuts around curves and corners — the same allowance used for sod — then converts it to whichever way your edging is sold: 20 ft flexible rolls or 4 ft rigid sections, each with the stakes needed to anchor it.',
    example:'<strong>Worked example — a 20&nbsp;ft × 10&nbsp;ft bed with rigid sections:</strong><br>2 × (20 + 10) × 1.05 = 63 ft → 63 ÷ 4 = <strong>16 sections</strong>, with 32 stakes (2 per section).',
    h3:'Flexible vs. rigid edging',
    p:'Flexible roll edging bends easily around curves and is cheaper per foot, making it the better fit for organic bed shapes. Rigid sections hold a straighter, cleaner line and resist lawn-mower damage better, which makes them the common choice for straight bed borders next to a lawn.',
    faqs:[
      {q:'How much edging do I need for a 20x10 garden bed?',a:'The perimeter is 60 ft; with 5% extra for corners that&rsquo;s about 63 ft — <strong>4 rolls</strong> of 20 ft flexible edging, or <strong>16 sections</strong> of 4 ft rigid edging.'},
      {q:'How many stakes does landscape edging need?',a:'Flexible edging typically needs a stake about every <strong>2 ft</strong> to hold its shape. Rigid sections usually come with 2 stakes per section built into the connection points.'}
    ]
  }
});

C.push({
  slug:'firewood-calculator', emoji:'🔥', name:'Firewood Calculator',
  tile:'Cords of wood for a stack or a heating season',
  title:'Firewood Calculator — How Much Firewood Do I Need? (Cords)',
  desc:'Free firewood calculator. Enter your stack length, height and depth for cords, face cords, and estimated cost.',
  h1:'Firewood Calculator', sub:'How much firewood do you need? Enter your stack size for cords and cost.',
  buy:'Shop firewood & wood stoves →',
  inputs:[
    {id:'len',label:'Stack length',hint:'(feet)',value:'8',step:'0.5'},
    {id:'height',label:'Stack height',hint:'(feet)',value:'4',step:'0.5'},
    {id:'depth',label:'Log length / stack depth',hint:'(feet, 16in = 1.33)',value:'1.33',step:'0.01'},
    {id:'price',label:'Price per full cord',hint:'(optional, $)',value:'300',step:'10'}
  ],
  lines:[
    {id:'cf',label:'Cubic feet stacked'},
    {id:'faceCords',label:'Face cords (16in logs)'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),H=num('height'),D=num('depth'),P=num('price');
var cf=L*H*D,cords=cf/128,faceCords=cords*3;
set('main',(cords?cords.toFixed(2):'0')+' cords');
set('cf',cf.toFixed(0)+' cu ft');
set('faceCords',faceCords.toFixed(2)+' face cords');
set('cost',P>0?money(cords*P):'—');`,
  content:{
    intro:'A full cord is a stack measuring 4&nbsp;ft high × 8&nbsp;ft long × 4&nbsp;ft deep — 128 cubic feet of stacked wood. The calculator multiplies your stack&rsquo;s length, height and depth to get cubic feet, then divides by 128 to get cords.',
    example:'<strong>Worked example — an 8&nbsp;ft long, 4&nbsp;ft high stack of 16-inch logs (1.33&nbsp;ft deep):</strong><br>8 × 4 × 1.33 = 42.6 cubic feet → 42.6 ÷ 128 = <strong>0.33 cords</strong> — exactly <strong>1 face cord</strong>.',
    h3:'Cord vs. face cord',
    p:'A full cord is always 128 cubic feet, but a &ldquo;face cord&rdquo; (also called a rick) is a 4×8 stack of shorter logs — commonly 16 inches — and equals about one-third of a full cord. Always confirm which one a seller means before you buy.',
    faqs:[
      {q:'How many cords of firewood do I need for winter?',a:'Most homes burning wood as a primary heat source use <strong>3–6 full cords</strong> per heating season, depending on climate, stove efficiency, and how often it&rsquo;s used.'},
      {q:'What&rsquo;s the difference between a cord and a face cord?',a:'A full cord is 4×4×8&nbsp;ft (128 cubic feet). A face cord is a 4×8&nbsp;ft stack of shorter logs (often 16in) — about <strong>1/3 of a full cord</strong>.'}
    ]
  }
});

C.push({
  slug:'decomposed-granite-calculator', emoji:'🟤', name:'Decomposed Granite Calculator',
  tile:'Tons & cubic yards for pathways & patios',
  title:'Decomposed Granite Calculator — How Much DG Do I Need? (Tons & Yards)',
  desc:'Free decomposed granite calculator. Enter your area and depth for cubic yards, tons, and estimated cost.',
  h1:'Decomposed Granite Calculator', sub:'How much decomposed granite do you need? Enter your area and depth for yards, tons, and cost.',
  buy:'Shop decomposed granite →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'20',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'5',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'3',step:'0.5'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'45',step:'1'}
  ],
  lines:[
    {id:'tons',label:'Estimated tons needed'},
    {id:'cf',label:'Cubic feet'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*W*(D/12),cy=cf/27,tons=cy*1.5;
set('main',(cy?cy.toFixed(2):'0')+' cubic yards');
set('tons',tons.toFixed(2)+' tons');
set('cf',cf.toFixed(1)+' cu ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It calculates the volume of your path or patio, converts it to cubic yards, then to tons using a typical compacted decomposed granite weight of about 1.5 tons per cubic yard.',
    example:'<strong>Worked example — a 20&nbsp;ft × 5&nbsp;ft path at 3&nbsp;inches deep:</strong><br>20 × 5 × (3 ÷ 12) = 25 cubic feet → ÷ 27 = <strong>0.93 cubic yards</strong> → × 1.5 = <strong>1.39 tons</strong>.',
    h3:'Decomposed granite vs. gravel',
    p:'Decomposed granite (DG) contains fine particles that compact into a firm, sandy-textured surface — unlike loose gravel, which stays loose underfoot. That makes it a popular choice for walking paths and patios where a solid, walkable surface matters more than drainage.',
    faqs:[
      {q:'How many tons of decomposed granite do I need per cubic yard?',a:'About <strong>1.5 tons</strong> per cubic yard once compacted, though it varies slightly by moisture and particle size.'},
      {q:'How deep should decomposed granite be for a path?',a:'<strong>2–3 inches</strong> compacted is standard for a walking path. Driveways or patios that see more weight typically want <strong>3–4 inches</strong> over a compacted base.'}
    ]
  }
});

C.push({
  slug:'ice-melt-calculator', emoji:'❄️', name:'Ice Melt Calculator',
  tile:'Bags of rock salt or ice melt for driveways & walkways',
  title:'Ice Melt Calculator — How Much Rock Salt Do I Need? (Bags & Cost)',
  desc:'Free ice melt calculator. Enter your area and application rate for pounds needed, 50lb bags, and estimated cost.',
  h1:'Ice Melt Calculator', sub:'How much rock salt or ice melt do you need? Enter your area for pounds, bags, and cost.',
  buy:'Shop rock salt & ice melt →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'50',step:'1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'12',step:'1'},
    {id:'rate',label:'Application rate',hint:'(lb per 1,000 sq ft)',value:'4',step:'0.5'},
    {id:'price',label:'Price per 50 lb bag',hint:'(optional, $)',value:'12',step:'1'}
  ],
  lines:[
    {id:'area',label:'Area to treat'},
    {id:'lbs',label:'Pounds of salt needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var L=num('len'),W=num('wid'),R=num('rate'),P=num('price');
var area=L*W,lbs=area*(R/1000),bags=Math.ceil(lbs/50)||1;
set('main',bags+' bags (50 lb)');
set('area',area.toFixed(0)+' sq ft');
set('lbs',lbs.toFixed(1)+' lb');
set('cost',P>0?money(bags*P):'—');`,
  content:{
    intro:'The calculator finds the area you need to treat, then applies your chosen spread rate (in pounds per 1,000 square feet) to get total pounds needed, rounded up to whole 50&nbsp;lb bags.',
    example:'<strong>Worked example — a 50&nbsp;ft × 12&nbsp;ft driveway (600 sq ft) at the standard 4&nbsp;lb/1,000&nbsp;sq&nbsp;ft rate:</strong><br>600 × (4 ÷ 1000) = <strong>2.4 lb</strong> per application — well under one 50&nbsp;lb bag, which is why a single bag usually lasts most driveways several applications.',
    h3:'Picking the right application rate',
    p:'Use about <strong>4 lb per 1,000 sq ft</strong> for a light, preventative coating on fresh snow. For packed ice or heavy buildup, bump that up to <strong>8–10 lb per 1,000 sq ft</strong>. Applying more than needed wastes product and can harm nearby grass and concrete.',
    faqs:[
      {q:'How much rock salt do I need for my driveway?',a:'For an average two-car driveway (~600 sq ft) at a light application rate, about <strong>2–3 lb</strong> per application — a single 50&nbsp;lb bag typically covers most driveways for the whole season.'},
      {q:'What ice melt application rate should I use?',a:'<strong>4 lb per 1,000 sq ft</strong> for a light coating on fresh snow, up to <strong>8–10 lb per 1,000 sq ft</strong> for packed ice or heavy snow.'}
    ]
  }
});

C.push({
  slug:'riprap-calculator', emoji:'🪨', name:'Riprap Calculator',
  tile:'Tons of rock for erosion control & slopes',
  title:'Riprap Calculator — How Much Rip Rap Do I Need? (Tons & Yards)',
  desc:'Free riprap calculator. Enter your area and depth for cubic yards, tons, and the estimated cost of erosion-control rock.',
  h1:'Riprap Calculator', sub:'How much riprap do you need? Enter your area and depth for yards, tons, and cost.',
  buy:'Shop riprap & erosion control stone →',
  inputs:[
    {id:'len',label:'Length',hint:'(feet)',value:'30',step:'0.1'},
    {id:'wid',label:'Width',hint:'(feet)',value:'6',step:'0.1'},
    {id:'depth',label:'Depth',hint:'(inches)',value:'12',step:'1'},
    {id:'price',label:'Price per ton',hint:'(optional, $)',value:'65',step:'1'}
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
    intro:'It calculates the volume of your slope or drainage area from length, width and depth, converts that to cubic yards, then to tons using a typical riprap weight of about 1.4 tons per cubic yard.',
    example:'<strong>Worked example — a 30&nbsp;ft × 6&nbsp;ft streambank section at 12&nbsp;inches deep:</strong><br>30 × 6 × (12 ÷ 12) = 180 cubic feet → ÷ 27 = <strong>6.67 cubic yards</strong> → × 1.4 = <strong>9.33 tons</strong>.',
    h3:'How thick should a riprap layer be?',
    p:'Layer thickness should run about <strong>1.5–2× the diameter</strong> of the largest stone in the mix, which usually works out to <strong>9–24 inches</strong> depending on the riprap class and how much erosion energy the slope needs to handle.',
    faqs:[
      {q:'How many tons of riprap per cubic yard?',a:'About <strong>1.4 tons</strong> per cubic yard, though larger, more angular classes can run slightly heavier or lighter depending on void space.'},
      {q:'How deep should a riprap layer be?',a:'Typically <strong>1.5–2 times</strong> the largest stone diameter — commonly <strong>9–24 inches</strong> for slope and streambank protection.'}
    ]
  }
});

C.push({
  slug:'french-drain-calculator', emoji:'🚰', name:'French Drain Calculator',
  tile:'Gravel & pipe for a French drain trench',
  title:'French Drain Calculator — How Much Gravel & Pipe Do I Need?',
  desc:'Free French drain calculator. Enter your trench length, width, and depth for gravel needed in tons, perforated pipe length, and estimated cost.',
  h1:'French Drain Calculator', sub:'How much gravel and pipe do you need? Enter your trench dimensions for tons, pipe, and cost.',
  buy:'Shop drain gravel & perforated pipe →',
  inputs:[
    {id:'len',label:'Trench length',hint:'(feet)',value:'50',step:'1'},
    {id:'wid',label:'Trench width',hint:'(inches)',value:'12',step:'1'},
    {id:'depth',label:'Trench depth',hint:'(inches)',value:'18',step:'1'},
    {id:'price',label:'Price per ton of gravel',hint:'(optional, $)',value:'45',step:'1'}
  ],
  lines:[
    {id:'cy',label:'Cubic yards of gravel'},
    {id:'pipe',label:'Perforated pipe needed'},
    {id:'cost',label:'Estimated gravel cost'}
  ],
  body:`var L=num('len'),W=num('wid'),D=num('depth'),P=num('price');
var cf=L*(W/12)*(D/12),cy=cf/27,tons=cy*1.4,pipe=Math.ceil(L*1.1);
set('main',(tons?tons.toFixed(2):'0')+' tons of gravel');
set('cy',cy.toFixed(2)+' cu yd');
set('pipe',pipe+' ft');
set('cost',P>0?money(tons*P):'—');`,
  content:{
    intro:'It finds the trench volume from its length, width and depth, converts that to cubic yards and tons of drain rock (at about 1.4 tons per cubic yard), and adds 10% to the trench length for the perforated pipe to cover fittings and waste.',
    example:'<strong>Worked example — a 50&nbsp;ft trench, 12&nbsp;in wide, 18&nbsp;in deep:</strong><br>50 × 1 × 1.5 = 75 cubic feet → ÷ 27 = <strong>2.78 cubic yards</strong> → × 1.4 = <strong>3.89 tons</strong> of gravel, plus <strong>55&nbsp;ft</strong> of perforated pipe.',
    h3:'How deep and wide should a French drain trench be?',
    p:'Most residential French drains use a trench <strong>12–18 inches wide</strong> and <strong>18–24 inches deep</strong>, sloped at roughly a 1% grade (about 1 inch of drop per 8 ft) toward the outlet so water keeps moving.',
    faqs:[
      {q:'How much gravel do I need for a French drain?',a:'About <strong>1.4 tons per cubic yard</strong> of trench volume — for a typical 12in-wide, 18in-deep trench that&rsquo;s roughly <strong>0.08 tons per linear foot</strong>.'},
      {q:'What size perforated pipe is used for a French drain?',a:'Most residential drains use <strong>4-inch perforated pipe</strong>, wrapped in fabric sock and surrounded by gravel to filter out sediment.'}
    ]
  }
});

C.push({
  slug:'chain-link-fence-calculator', emoji:'🔗', name:'Chain Link Fence Calculator',
  tile:'Posts, rail & mesh for a chain link fence',
  title:'Chain Link Fence Calculator — How Many Posts & How Much Mesh?',
  desc:'Free chain link fence calculator. Enter your fence length and post spacing for the number of posts, mesh footage, and estimated cost.',
  h1:'Chain Link Fence Calculator', sub:'How many posts and how much mesh do you need? Enter your fence length and spacing.',
  buy:'Shop chain link fencing & posts →',
  inputs:[
    {id:'len',label:'Total fence length',hint:'(feet)',value:'100',step:'1'},
    {id:'spacing',label:'Post spacing',hint:'(feet)',value:'10',step:'0.5'},
    {id:'meshPrice',label:'Price per foot of mesh',hint:'(optional, $)',value:'8',step:'0.5'},
    {id:'postPrice',label:'Price per post',hint:'(optional, $)',value:'25',step:'1'}
  ],
  lines:[
    {id:'mesh',label:'Mesh fabric needed'},
    {id:'rail',label:'Top rail needed'},
    {id:'cost',label:'Estimated cost'}
  ],
  body:`var Ln=num('len'),S=num('spacing'),Mp=num('meshPrice'),Pp=num('postPrice');
var posts=S>0?Math.ceil(Ln/S)+1:0,mesh=Ln,rail=Ln;
set('main',posts+' posts needed');
set('mesh',mesh.toFixed(0)+' ft');
set('rail',rail.toFixed(0)+' ft');
set('cost',(Mp>0||Pp>0)?money(Ln*Mp+posts*Pp):'—');`,
  content:{
    intro:'It divides your total fence length by the post spacing to get the number of line posts (plus one extra end post), then sets the chain link fabric and top rail footage equal to the total run length.',
    example:'<strong>Worked example — a 100&nbsp;ft fence line at 10&nbsp;ft post spacing:</strong><br>100 ÷ 10 = 10 sections → <strong>11 posts</strong>, plus 100&nbsp;ft of mesh fabric and 100&nbsp;ft of top rail.',
    h3:'Don&rsquo;t forget corner, end & gate posts',
    p:'The spacing above covers line posts only. Corners, ends, and gate openings need heavier terminal posts set in larger concrete footings — add those separately before ordering.',
    faqs:[
      {q:'How far apart should chain link fence posts be?',a:'Line posts are typically spaced <strong>8–10 ft</strong> apart, with terminal posts at every corner, end, and gate.'},
      {q:'How much does chain link fencing cost per foot?',a:'Materials alone usually run <strong>$6–$12 per linear foot</strong> for standard residential-height fabric, before installation labor.'}
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
  'underlayment-calculator':'Flooring & Tile',
  'potting-soil-calculator':'Landscaping',
  'thinset-calculator':'Flooring & Tile',
  'vinyl-siding-calculator':'Outdoor',
  'landscape-fabric-calculator':'Landscaping',
  'post-hole-calculator':'Concrete & Masonry',
  'board-foot-calculator':'Walls & Paint',
  'ceiling-tile-calculator':'Flooring & Tile',
  'stucco-calculator':'Outdoor',
  'grout-calculator':'Flooring & Tile',
  'caulk-calculator':'Walls & Paint',
  'epoxy-floor-calculator':'Flooring & Tile',
  'joint-compound-calculator':'Walls & Paint',
  'artificial-turf-calculator':'Landscaping',
  'landscape-edging-calculator':'Landscaping',
  'firewood-calculator':'Outdoor',
  'decomposed-granite-calculator':'Landscaping',
  'ice-melt-calculator':'Outdoor',
  'riprap-calculator':'Landscaping',
  'french-drain-calculator':'Outdoor',
  'chain-link-fence-calculator':'Outdoor'
};
function catOf(slug){ return CAT[slug] || 'Other'; }

/* ---------- templates ---------- */
const FONT = `<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#ff5c35">
<link rel="preconnect" href="https://fonts.googleapis.com">
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
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Fixed iframe height per calculator (inputs render 2-up inside the embed).
function embedHeight(c){ return 70 + Math.ceil(c.inputs.length/2)*90 + 70 + c.lines.length*34 + 60; }
function embedSnippet(c){
  return '<iframe src="'+SITE+'/embed/'+c.slug+'.html" width="100%" height="'+embedHeight(c)+'" '
    + 'style="border:1px solid #e5e7eb;border-radius:14px;max-width:480px" '
    + 'title="'+stripTags(c.h1)+' — Calculapedia" loading="lazy"></iframe>';
}
function embedPage(c){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.h1} — Calculapedia</title>
<meta name="robots" content="noindex">
${FONT}
<link rel="stylesheet" href="../style.css?v=${VERSION}">
</head>
<body class="embed">
<div class="container">
  <section class="calc">
    <h1 style="font-size:21px;margin:0 0 14px;">${c.h1}</h1>
${renderInputs(c.inputs)}
    <div class="result">
      <div class="big" id="main">—</div>
      <div class="lines">
${renderLines(c.lines)}
      </div>
    </div>
    <a class="embed-credit" href="${SITE}/${c.slug}.html" target="_blank" rel="noopener">Powered by <b>Calculapedia</b> ↗</a>
  </section>
</div>
<script>
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

function renderFaqs(faqs){
  return faqs.map(f=>`    <h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n');
}

// Set this to your AdSense publisher ID after approval, e.g. 'ca-pub-1234567890123456'.
// When set, the AdSense loader is injected into every page head and ads.txt is generated.
const ADSENSE_PUB = 'ca-pub-5602511390549170';
const ADSENSE_HEAD = ADSENSE_PUB
  ? `\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB}" crossorigin="anonymous"></script>`
  : '';

const HEADER = `<header class="site">
  <div class="container">
    <a class="brand" href="/index.html"><span class="wm">Calcula<i>pedia</i></span></a>
    <nav><a href="/index.html">All calculators</a></nav>
  </div>
</header>`;

const FOOTER = `<footer class="site">
  <div class="container">
    <nav class="foot-nav"><a href="/index.html">Calculators</a> · <a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · <a href="/contact.html">Contact</a></nav>
    <div>© <span id="yr"></span> Calculapedia — free project calculators.</div>
    <div class="disclaimer">Estimates are for planning only. Always confirm quantities with your supplier or contractor before purchasing. Some links may be affiliate links.</div>
  </div>
</footer>`;

const STATIC = [
  {
    slug:'about',
    title:'About Calculapedia — Free Material &amp; Cost Calculators',
    desc:'Calculapedia is a free collection of material and cost calculators for home and building projects.',
    h1:'About Calculapedia',
    body:`    <p>Calculapedia is a free collection of material and cost calculators for home and building projects. Whether you&rsquo;re pouring a concrete slab, mulching a garden bed, or tiling a floor, our tools tell you exactly how much material to buy &mdash; and roughly what it will cost &mdash; in seconds.</p>
    <h2>Why we built it</h2>
    <p>Estimating materials usually means hunting for a formula, converting units, and second-guessing yourself at the store. We wanted a faster way: enter your measurements, get a clear answer with a sensible waste allowance built in, and get on with the project.</p>
    <h2>How the estimates work</h2>
    <p>Every calculator uses standard industry formulas and rounds up with a reasonable allowance for waste and offcuts, so you&rsquo;re less likely to run short. Each one shows a worked example so you can see exactly how the number was reached.</p>
    <p>Our estimates are for planning only &mdash; always confirm quantities with your supplier or contractor before buying.</p>
    <h2>Free to use, free to share</h2>
    <p>All calculators are free, with no signup. You&rsquo;re welcome to embed any of them on your own website using the embed code at the bottom of each calculator page.</p>`
  },
  {
    slug:'privacy',
    title:'Privacy Policy — Calculapedia',
    desc:'How Calculapedia handles information, cookies, advertising, and affiliate links.',
    h1:'Privacy Policy',
    body:`    <p class="muted-date">Last updated: June 3, 2026</p>
    <p>Calculapedia (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates calculapedia.com. This page explains what information is involved when you use our calculators and how it is handled.</p>
    <h2>Information we collect</h2>
    <p>Our calculators run entirely in your browser. We do not ask you to create an account, and the numbers you type into a calculator are not sent to us or stored on our servers.</p>
    <h2>Cookies and advertising</h2>
    <p>We use third-party advertising companies, including Google, to serve ads when you visit the site. These companies may use cookies and similar technologies to show ads based on your visits to this and other websites.</p>
    <ul>
      <li>Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the internet.</li>
      <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.</li>
      <li>You can also opt out of some third-party vendors&rsquo; use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info/choices</a>.</li>
    </ul>
    <h2>Analytics</h2>
    <p>We may use privacy-respecting analytics to understand which calculators are popular and how the site performs. Any such data is aggregated and does not identify you personally.</p>
    <h2>Affiliate links</h2>
    <p>Some &ldquo;Shop&rdquo; links on our calculators are affiliate links. If you buy through them, we may earn a small commission at no extra cost to you. This helps keep the calculators free.</p>
    <h2>Children&rsquo;s privacy</h2>
    <p>Our site is intended for a general audience and is not directed at children under 13.</p>
    <h2>Changes to this policy</h2>
    <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above reflects the latest revision.</p>
    <h2>Contact</h2>
    <p>Questions about this policy? Email <a href="mailto:hello@calculapedia.com">hello@calculapedia.com</a>.</p>`
  },
  {
    slug:'contact',
    title:'Contact — Calculapedia',
    desc:'Get in touch with Calculapedia to report an error, suggest a calculator, or ask a question.',
    h1:'Contact Us',
    body:`    <p>We&rsquo;d love to hear from you &mdash; whether you&rsquo;ve spotted an error in a calculation, want a new calculator added, or have a partnership question.</p>
    <h2>Email</h2>
    <p>Reach us at <a href="mailto:hello@calculapedia.com">hello@calculapedia.com</a> and we&rsquo;ll get back to you as soon as we can.</p>
    <h2>Suggest a calculator</h2>
    <p>Is there a material or project calculator you wish existed? Tell us what you&rsquo;d find useful and we&rsquo;ll consider adding it to the site.</p>`
  }
];

function staticPage(p){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${SITE}/${p.slug}.html">
${FONT}${ADSENSE_HEAD}
<link rel="stylesheet" href="style.css?v=${VERSION}">
</head>
<body>
${HEADER}

<main class="container">
  <article class="content prose">
    <h1>${p.h1}</h1>
${p.body}
  </article>
</main>

${FOOTER}
<script>document.getElementById('yr').textContent=new Date().getFullYear();</script>
</body>
</html>
`;
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
${FONT}${ADSENSE_HEAD}
<link rel="stylesheet" href="style.css?v=${VERSION}">
<script type="application/ld+json">
${faqSchema(c)}
</script>
</head>
<body>
${HEADER}

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

  <section class="embed-box">
    <h2>Add this calculator to your site &mdash; free</h2>
    <p>Paste this code onto any web page (blog, forum, business site). It always shows the latest version and links back here.</p>
    <textarea class="embed-code" readonly rows="3" onclick="this.select()">${escapeHtml(embedSnippet(c))}</textarea>
    <div class="embed-actions"><button class="embed-copy" type="button">Copy code</button> <span class="embed-copied" hidden>Copied!</span></div>
  </section>
</main>

${FOOTER}

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
(function(){
var cp=document.querySelector('.embed-copy');
if(!cp)return;
cp.addEventListener('click',function(){
  var ta=document.querySelector('.embed-code');
  ta.focus(); ta.select();
  try{ navigator.clipboard.writeText(ta.value); }catch(e){ try{ document.execCommand('copy'); }catch(_){} }
  var m=document.querySelector('.embed-copied');
  if(m){ m.hidden=false; setTimeout(function(){ m.hidden=true; },2000); }
});
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
${FONT}${ADSENSE_HEAD}
<link rel="stylesheet" href="style.css?v=${VERSION}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Calculapedia","url":"${SITE}/","description":"Free material and cost calculators for home projects."}
</script>
</head>
<body>
${HEADER}

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

${FOOTER}
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
  const urls = ['', ...C.map(c=>c.slug+'.html'), ...STATIC.map(s=>s.slug+'.html')];
  const body = urls.map(u=>`  <url><loc>${SITE}/${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/* ---------- write ---------- */
fs.mkdirSync(OUT, { recursive: true });
let count = 0;
for (const c of C){ fs.writeFileSync(path.join(OUT, c.slug+'.html'), page(c)); count++; }
for (const s of STATIC){ fs.writeFileSync(path.join(OUT, s.slug+'.html'), staticPage(s)); }
fs.writeFileSync(path.join(OUT,'index.html'), homepage());
if (ADSENSE_PUB){ fs.writeFileSync(path.join(OUT,'ads.txt'), `google.com, ${ADSENSE_PUB.replace(/^ca-/,'')}, DIRECT, f08c47fec0942fa0\n`); }
fs.writeFileSync(path.join(OUT,'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(OUT,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
const EMBED_DIR = path.join(OUT,'embed');
fs.mkdirSync(EMBED_DIR,{recursive:true});
for (const c of C){ fs.writeFileSync(path.join(EMBED_DIR, c.slug+'.html'), embedPage(c)); }
fs.copyFileSync(path.join(__dirname,'style.css'), path.join(OUT,'style.css'));
fs.copyFileSync(path.join(__dirname,'favicon.svg'), path.join(OUT,'favicon.svg'));
console.log('Generated '+count+' calculator pages + index.html, sitemap.xml, robots.txt, style.css into /dist');
console.log('Calculators: '+C.map(c=>c.slug).join(', '));
