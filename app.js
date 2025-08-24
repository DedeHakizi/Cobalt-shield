// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Map
const map = L.map('mapid',{scrollWheelZoom:false}).setView([34, 15], 3.7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(map);
const pins = [
  { name:'Greece (Pilot)', lat:37.98, lng:23.72 },
  { name:'Rwanda (Pilot)', lat:-1.95, lng:30.06 }
];
pins.forEach(p=>{
  L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<b>${p.name}</b>`);
});

// Contact form (basic front-end ok state)
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Thanks — we received your message and will reply shortly.';
  form.reset();
});

// Mini bot
const bot = document.getElementById('bot');
const fab = document.getElementById('botFab');
const closeBtn = document.getElementById('botClose');
const bodyEl = document.getElementById('botBody');
const formBot = document.getElementById('botForm');
const inputBot = document.getElementById('botText');

const replies = {
  pricing: "We scope quickly. Mini audits start at €450. Education packs are tiered — ask for a quote.",
  pilot: "Pilots run 4–6 weeks with 1 school or org. Includes training, playbooks & light reporting.",
  incident: "If something's urgent: write 'incident' + short summary in the contact form. We'll triage calmly.",
  donate: "You can support the mission here → click the Donate button or go to the Donate section."
};

function say(txt, who='bot'){
  const d = document.createElement('div');
  d.className = `msg ${who==='bot'?'botmsg':'usermsg'}`;
  d.textContent = txt;
  bodyEl.appendChild(d);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

fab?.addEventListener('click',()=> bot.style.display = 'flex');
closeBtn?.addEventListener('click',()=> bot.style.display = 'none');

formBot?.addEventListener('submit', e=>{
  e.preventDefault();
  const q = (inputBot.value||'').trim();
  if(!q) return;
  say(q,'user');
  inputBot.value = '';
  const key = Object.keys(replies).find(k => q.toLowerCase().includes(k));
  say(replies[key] || "I can help with pricing, pilots, incidents, and donations. Try those keywords.");
});
