const cursor=document.querySelector(".cursor");
if(cursor&&matchMedia("(pointer:fine)").matches){
  addEventListener("mousemove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"});
  document.querySelectorAll("a,button,figure").forEach(el=>{
    el.addEventListener("mouseenter",()=>cursor.classList.add("active"));
    el.addEventListener("mouseleave",()=>cursor.classList.remove("active"));
  });
}
const menu=document.querySelector(".mobile-menu");
const openBtn=document.querySelector(".menu-button");
const closeBtn=document.querySelector(".menu-close");
function openMenu(){menu.classList.add("is-open");menu.setAttribute("aria-hidden","false");openBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden"}
function closeMenu(){menu.classList.remove("is-open");menu.setAttribute("aria-hidden","true");openBtn.setAttribute("aria-expanded","false");document.body.style.overflow=""}
openBtn?.addEventListener("click",openMenu);
closeBtn?.addEventListener("click",closeMenu);
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
document.querySelector("#year").textContent=new Date().getFullYear();

const name=document.querySelector(".hero-name");
if(name&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  let t=0;
  function tick(){t+=.004;name.style.transform=`translate3d(${Math.sin(t)*10}px,calc(-50% + ${Math.cos(t*.75)*4}px),0)`;requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
}
const targets=document.querySelectorAll(".project-head,.gallery figure,.about-grid,.contact h2");
if("IntersectionObserver"in window){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});
  targets.forEach(el=>{el.classList.add("reveal");io.observe(el)});
}else targets.forEach(el=>el.classList.add("visible"));