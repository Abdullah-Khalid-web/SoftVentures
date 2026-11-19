/* SoftVentures - Common JS: loads header/footer on every page */
async function loadPart(id, file){
  try{ const r=await fetch(file); if(!r.ok) return; document.getElementById(id).innerHTML=await r.text(); }catch(e){}
}
function initCommon(){
  // The shared pre-paint controller owns theme state and both toggle types.
  window.SiteTheme.syncControls();
  // header scroll + mobile menu
  const header=document.getElementById('site-header');
  if(header) window.addEventListener('scroll',()=>{window.scrollY>10?header.classList.add('scrolled'):header.classList.remove('scrolled');});
  const hamburger=document.getElementById('hamburger-btn'); const mobileMenu=document.getElementById('mobile-menu');
  if(hamburger&&mobileMenu){ hamburger.addEventListener('click',()=>mobileMenu.classList.toggle('open')); mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open'))); }
  // active nav
  const page=document.body.dataset.page||'index';
  document.querySelectorAll('[data-nav]').forEach(a=>{ if(a.dataset.nav===page) a.classList.add('active'); });
  if(window.lucide) lucide.createIcons();
  // reveal
  const reveals=document.querySelectorAll('.reveal'); const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('active');obs.unobserve(e.target);}})},{threshold:.1}); reveals.forEach(el=>obs.observe(el));
  initMgmt();
}
const DATA={
retail:{kicker:"RETAIL • MOST POPULAR",title:"Shops, chains and wholesalers",desc:"Know what's on the shelf in every branch, what sold today and what to reorder — from your phone.",time:"⏱ Ready in 7 days",cta:"Retail",mock:"Retail System — Live Preview",s1:"1,284",s1l:"Sales today",s2:"7",s2l:"Low stock items",s3:"36",s3l:"Orders today",line:"New sale — Rs 4,200 • Branch 2",features:["POS across all branches","Stock, barcodes & alerts","Supplier purchase orders","Daily profit on WhatsApp","Loyalty & online store sync","Staff roles & permissions"]},
clinic:{kicker:"CLINICS • HIGH DEMAND",title:"Clinics, hospitals, labs",desc:"Patient records, appointments and billing — so easy a new receptionist learns it in one afternoon.",time:"⏱ Ready in 7 days",cta:"Clinic",mock:"Clinic System — Live Preview",s1:"36",s1l:"Today's bookings",s2:"1,284",s2l:"Patients",s3:"Rs 84k",s3l:"Collected today",line:"Appointment booked — Ahmed, 4:30 PM",features:["Patient records & history","Appointments & queue","Billing & insurance","Pharmacy stock","Lab reports","WhatsApp reminders"]},
school:{kicker:"SCHOOLS",title:"Schools and academies",desc:"Attendance, results and fees in one place — plus a parent app parents actually use.",time:"⏱ Ready in 7 days",cta:"School",mock:"School System — Live Preview",s1:"98%",s1l:"Attendance today",s2:"420",s2l:"Students",s3:"Rs 2.1L",s3l:"Fees collected",line:"Fee paid — Ayesha, Grade 8",features:["Admissions & attendance","Fee invoices & reminders","Exams & report cards","Parent app on WhatsApp","Teacher timetable","Transport & hostel"]},
university:{kicker:"UNIVERSITIES",title:"Universities and colleges",desc:"From admission to transcript — with portals for students, faculty and admin.",time:"⏱ Ready in 14 days",cta:"University",mock:"University System — Live Preview",s1:"1,240",s1l:"Enrolled students",s2:"48",s2l:"Courses",s3:"96%",s3l:"On-time results",line:"Transcript issued — BS CS, 2024",features:["Enrollment & admissions","Course & timetable","Grading & transcripts","Student & faculty portals","Finance & scholarships","Hostel & library"]},
restaurant:{kicker:"RESTAURANTS",title:"Restaurants, cafés, cloud kitchens",desc:"From order to kitchen to rider — one system, zero chaos during rush hour.",time:"⏱ Ready in 5 days",cta:"Restaurant",mock:"Restaurant System — Live Preview",s1:"128",s1l:"Orders today",s2:"12 min",s2l:"Avg. prep time",s3:"4.9 ★",s3l:"Customer rating",line:"New order — Table 4 • 2x Biryani",features:["WhatsApp + dine-in orders","Kitchen display screen","Delivery & rider tracking","Recipe costing & stock","Table bookings","Menu QR & payments"]},
other:{kicker:"EVERYTHING ELSE",title:"If it runs on spreadsheets, it can be a system",desc:"Real estate, gyms, salons, logistics, manufacturing — tell us how work moves today, we systemise it.",time:"⏱ Custom — 7-14 days",cta:"Custom",mock:"Custom System — Live Preview",s1:"100%",s1l:"Your workflow",s2:"0",s2l:"Spreadsheets left",s3:"24/7",s3l:"AI automation",line:"Workflow automated — Invoice #1042 sent",features:["Built around YOUR workflow","Gyms, salons & hotels","Logistics & manufacturing","Real estate & property","Custom reports","AI automation included"]}
};
function initMgmt(){
  const feat=document.getElementById('mgmt-features'); if(!feat) return;
  const btns=document.querySelectorAll('[data-mgmt]');
  function setMgmt(key){ const d=DATA[key];
    const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=v;};
    set('mgmt-kicker',d.kicker); set('mgmt-title',d.title); set('mgmt-desc',d.desc); set('mgmt-time',d.time); set('mgmt-cta',d.cta); set('mgmt-mock-title',d.mock);
    set('mgmt-stat1',d.s1); set('mgmt-stat1-label',d.s1l); set('mgmt-stat2',d.s2); set('mgmt-stat2-label',d.s2l); set('mgmt-stat3',d.s3); set('mgmt-stat3-label',d.s3l); set('mgmt-mock-line',d.line);
    feat.innerHTML=d.features.map(f=>'<div class="feature"><span class="check">✓</span><span>'+f+'</span></div>').join('');
    btns.forEach(b=>b.classList.toggle('active',b.dataset.mgmt===key));
  }
  feat.innerHTML=DATA.retail.features.map(f=>'<div class="feature"><span class="check">✓</span><span>'+f+'</span></div>').join('');
  btns.forEach(b=>b.addEventListener('click',()=>setMgmt(b.dataset.mgmt)));
}
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadPart('site-header-slot','header.html');
  await loadPart('site-footer-slot','footer.html');
  initCommon();
});
