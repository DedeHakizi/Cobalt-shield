// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Leaflet Map
const map = L.map('mapid',{scrollWheelZoom:false}).setView([34.5, 20.8], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Markers: Athens & Kigali as pilots (tweak as needed)
const sites = [
  { name:'Athens, Greece', coords:[37.9838, 23.7275], note:'Pilot & operations base' },
  { name:'Kigali, Rwanda', coords:[-1.9579, 30.1127], note:'Pilot country' }
];
sites.forEach(s=>{
  L.marker(s.coords).addTo(map).bindPopup(`<strong>${s.name}</strong><br>${s.note}`);
});

// Contact form (static demo - no backend). You can swap to EmailJS or API later.
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // TODO: replace with your API endpoint or EmailJS
  console.log('Contact form payload:', data);
  statusEl.textContent = 'Thanks — we received your message and will reply shortly.';
  form.reset();
});

// Robo Responds (lightweight assistant)
const botFab = document.getElementById('botFab');
const bot = document.getElementById('bot');
const botBody = document.getElementById('botBody');
const botClose = document.getElementById('botClose');
const botForm = document.getElementById('botForm');
const botText = document.getElementById('botText');

const KB = [
  { q:['price','pricing','cost','fee'], a:'We keep pricing simple: fixed-fee mini audits, affordable training bundles, and sponsored pilots. Share your org details and we'll suggest the leanest option.' },
  { q:['pilot','school','ngo'], a:'Pilot focus is Greece & Rwanda for now. If you're a school/NGO, send your city and timeline — we review weekly.' },
  { q:['incident','report','help','support'], a:'For incidents, use the contact form with subject “Incident”. We reply calmly with a 1–2–3 action plan.' },
  { q:['ev','charging','battery','ethic'], a:'Our EV Ethics Pack covers transparent pricing signage, user-friendly steps, and sourcing awareness. Great for hosts and city programs.' },
  { q:['email','contact','reach'], a:'Email us at delphin@cobalt-shield.com or use the form. We prefer clean, written comms.' }
];

function botReply(text){
  const div = document.createElement('div');
  div.className = 'msg botmsg';
  div.innerHTML = text;
  botBody.appendChild(div);
  botBody.scrollTop = botBody.scrollHeight;
}

function userMsg(text){
  const div = document.createElement('div');
  div.className = 'msg usermsg';
  div.textContent = text;
  botBody.appendChild(div);
  botBody.scrollTop = botBody.scrollHeight;
}

botFab.addEventListener('click', ()=> bot.style.display='flex');
botClose.addEventListener('click', ()=> bot.style.display='none');

botForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const t = botText.value.trim();
  if(!t) return;
  userMsg(t);
  botText.value='';
  const lower = t.toLowerCase();
  const hit = KB.find(item => item.q.some(k => lower.includes(k)));
  if(hit){
    botReply(hit.a);
  } else {
    botReply('Got it. We handle training, audits, incidents, and EV ethics. Type “pricing”, “pilot”, or “incident” — or leave your email and we'll reach out.');
  }
});
