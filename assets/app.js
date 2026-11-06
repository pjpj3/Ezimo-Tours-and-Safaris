
/* ===== EDIT THESE ===== */
const WHATSAPP_NUMBER = "264812775928"; // company phone: country code + number, digits only (no +, spaces or dashes)
const EMAIL = "info@ezimosafaris.com";
const WEEKS_AHEAD = 20;                 // how many upcoming weeks can be booked
const MAX_GUESTS = 8;
const TOURS = [
 {id:"sossusvlei", name:"Sossusvlei & Namib Dunes", days:"3-Day", img:"assets/img/oryx.jpg", d:"Climb the world’s tallest sand dunes and walk the haunting Deadvlei clay pan at sunrise."},
 {id:"etosha", name:"Etosha Wildlife Safari", days:"4-Day", img:"assets/img/waterhole.jpg", d:"Abundant game viewing around the iconic salt pan: elephants, lions, giraffes and waterholes."},
 {id:"skeleton", name:"Skeleton Coast Explorer", days:"3-Day", img:"assets/img/wreck.jpg", d:"Shipwrecks, seal colonies and remote wilderness along Namibia’s dramatic Atlantic shore."},
 {id:"damaraland", name:"Damaraland & Spitzkoppe", days:"2-Day", img:"assets/img/spitz.jpg", d:"Rugged granite landscapes, rock arches, desert-adapted wildlife and star-filled camp nights."},
 {id:"swakop", name:"Swakopmund Adventure", days:"2-Day", img:"assets/img/coast.jpg", d:"Charming coastal town with German colonial architecture and thrilling desert adventures."},
 {id:"okavango", name:"Okavango & Victoria Falls", days:"7-Day", img:"assets/img/falls.jpg", d:"A journey across Botswana’s wild delta to the thundering Victoria Falls."},
];
const GALLERY = [
 ["assets/img/camp.jpg","Sossusvlei","Dune-side camps"],["assets/img/etosha.jpg","Etosha","Giants at the waterhole"],["assets/img/delta.jpg","Okavango Delta","Botswana"],
 ["assets/img/dune.jpg","Namib Desert","Big Daddy-style climbs"],["assets/img/spitz.jpg","Spitzkoppe","Namibia’s Matterhorn"],["assets/img/fire.jpg","Culture","Fireside traditions"],
 ["assets/img/misty.jpg","Namib Plains","Wild horses at dawn"],["assets/img/lizard.jpg","Desert Life","Small five wonders"]
];
/* ====================== */
const $=s=>document.querySelector(s);
const st={tour:null,week:null,guests:2};
const fmt=d=>d.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const fmtL=d=>d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
const wa=t=>`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t)}`;

// build tours + picker
if($("#tg"))$("#tg").innerHTML=TOURS.slice(0,+($("#tg").dataset.limit||99)).map(t=>`<article class="tour rv"><div class="im"><img src="${t.img}" alt="${t.name}" loading="lazy"><span class="tag">${t.days}</span></div><div class="b"><h3>${t.name}</h3><p>${t.d}</p><a class="bt" href="book.html?tour=${t.id}">Book this safari</a></div></article>`).join("");
if($("#pk"))$("#pk").innerHTML=TOURS.map(t=>`<button type="button" data-id="${t.id}">${t.name}<small>${t.days} tour</small></button>`).join("");
if($("#gl"))$("#gl").innerHTML=GALLERY.map(g=>`<figure class="rv"><img src="${g[0]}" alt="${g[1]}" loading="lazy"><figcaption>${g[1]}<small>${g[2]}</small></figcaption></figure>`).join("");

// weeks: upcoming Mondays
const first=new Date();first.setHours(0,0,0,0);
first.setDate(first.getDate()+((8-first.getDay())%7||7));
const weeks=Array.from({length:WEEKS_AHEAD},(_,i)=>{const d=new Date(first);d.setDate(d.getDate()+i*7);return d});
if($("#wk"))$("#wk").innerHTML=weeks.map((d,i)=>`<button type="button" data-i="${i}"><small>${d.toLocaleDateString("en-GB",{month:"short"})}</small><b>${d.getDate()}</b><small>Week of Mon</small></button>`).join("");

if($("#go")){
function message(){
 const t=TOURS.find(x=>x.id===st.tour),w=weeks[st.week];
 const v=i=>$(i).value.trim(),name=v("#nm"),mail=v("#ml"),tel=v("#tl"),ctry=v("#ct"),note=v("#nt");
 let m=`Hi! I'd like to book the ${t?t.days+" "+t.name:"[choose a safari]"} for the week of ${w?fmtL(w):"[choose a week]"} for ${st.guests} guest${st.guests>1?"s":""}. Are you available?`;
 const d=[["Name",name],["Email",mail],["Phone",tel],["Country",ctry],["Notes",note]].filter(x=>x[1]);
 if(d.length)m+="\n\nMy details:\n"+d.map(x=>x[0]+": "+x[1]).join("\n");
 return m;
}
function render(){
 document.querySelectorAll("#pk button").forEach(b=>b.classList.toggle("on",b.dataset.id===st.tour));
 document.querySelectorAll("#wk button").forEach(b=>b.classList.toggle("on",+b.dataset.i===st.week));
 $("#gc").textContent=st.guests;
 $("#pv").innerHTML=message().replace(/</g,"&lt;")+"<i>"+new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})+" ✓✓</i>";
 $("#em").href=`mailto:${EMAIL}?subject=${encodeURIComponent("Safari booking enquiry")}&body=${encodeURIComponent(message())}`;
}
$("#pk").onclick=e=>{const b=e.target.closest("button");if(b){st.tour=b.dataset.id;$("#er").textContent="";render()}};
$("#wk").onclick=e=>{const b=e.target.closest("button");if(b){st.week=+b.dataset.i;$("#er").textContent="";render()}};
$("#mi").onclick=()=>{st.guests=Math.max(1,st.guests-1);render()};
$("#pl").onclick=()=>{st.guests=Math.min(MAX_GUESTS,st.guests+1);render()};
["#nm","#ml","#tl","#ct","#nt"].forEach(i=>$(i).oninput=()=>{$("#er").textContent="";render()});
$("#go").onclick=()=>{
 if(!st.tour)return $("#er").textContent="Please choose a safari first.";
 if(st.week===null)return $("#er").textContent="Please pick a departure week.";
 if(!$("#nm").value.trim()){$("#nm").focus();return $("#er").textContent="Please enter your name so we know who to reply to."}
 if($("#ml").value&&!$("#ml").checkValidity()){$("#ml").focus();return $("#er").textContent="That email address doesn’t look right."}
 window.open(wa(message()),"_blank","noopener");
};
$("#cp").onclick=async()=>{try{await navigator.clipboard.writeText(message());$("#cp").textContent="Copied ✓"}catch{$("#cp").textContent="Copy failed"}setTimeout(()=>$("#cp").textContent="Copy message",1800)};
const q=new URLSearchParams(location.search).get("tour");if(TOURS.some(t=>t.id===q))st.tour=q;
render();}
const hello=wa("Hi Ezimo! I'd like to ask about a safari.");
$("#fb").href=hello;$("#fb").target="_blank";if($("#fw")){$("#fw").href=hello;$("#fw").target="_blank"}
$("#yr").textContent=new Date().getFullYear();

// nav + reveal
const nav=$("#nav"),mn=$("#mn");
const inner=document.body.classList.contains("inner");const sc=()=>nav.classList.toggle("s",inner||scrollY>40);addEventListener("scroll",sc,{passive:true});sc();
$("#bg").onclick=()=>{mn.classList.toggle("o");$("#bg").textContent=mn.classList.contains("o")?"✕":"☰"};
mn.onclick=e=>{if(e.target.tagName==="A"){mn.classList.remove("o");$("#bg").textContent="☰"}};
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in-v");io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
const hv=$("#hv");if(hv&&matchMedia("(prefers-reduced-motion: reduce)").matches){hv.pause();hv.removeAttribute("autoplay")}
