const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const letterBody = document.getElementById('letterBody');
const seeMore = document.getElementById('seeMore');
const messages = document.getElementById('messages');

let phase = 0; // 0: cerrado, 1: sobre abierto, 2: carta en modo lectura, 3: celebración
let msgIndex = 0;
let isOpening = false; // evita doble clic durante la animación

// timing de la secuencia (ms)
const FLAP_TIME = 500;  // tiempo para girar solapa
const LIFT_DELAY = 350; // espera antes de levantar la carta
const LIFT_TIME = FLAP_TIME + LIFT_DELAY;

const compliments = [
  'Eres mi casualidad favorita ✨',
  'Tu risa es la banda sonora de mis días 🎶',
  'Si estuvieras en el cielo, robarías miradas hasta a las estrellas 🌟',
  'Me haces creer en lo bonito de lo simple 🌈',
  'Mi lugar seguro siempre coincide contigo 🏡',
  'Donde estés tú, está mi mejor versión 💫',
  'Prometo cuidar de tu corazón como si fuera el mío ❤️',
  'Mi corazón ya no puede más…'
];

const petals = ['🌸','💐','🌹','🌷','🌺','💮'];
const hearts = ['💖','💗','💓','💞','💕','❤️'];

function openEnvelope(){
  if (phase > 0 || isOpening) return;
  isOpening = true;

  // 1) gira la solapa
  envelope.classList.add('open');

  // 2) tras un pequeño delay, levanta la carta
  setTimeout(() => {
    envelope.classList.add('lift');
    // al terminar la animación consideramos el sobre "abierto"
    setTimeout(() => {
      isOpening = false;
      phase = 1;
    }, FLAP_TIME);
  }, LIFT_DELAY);
}

// Modo lectura (pantalla casi completa)
function enterFullscreen(){
  letter.classList.add('fullscreen');
  document.body.classList.add('reading'); // bloquea scroll del fondo
  phase = 2;
}
function exitFullscreen(){
  letter.classList.remove('fullscreen');
  document.body.classList.remove('reading');
  // vuelve al estado de carta levantada
  phase = 1;
}

// Click en la carta: abre modo lectura o lo cierra si ya está abierto
function onLetterClick(e){
  // Si el clic fue en el botón "Ver más…", no cerrar/abrir fullscreen
  if (e.target && e.target.id === 'seeMore') return;

  if (phase === 1 && !letter.classList.contains('fullscreen')){
    enterFullscreen();
  } else if (letter.classList.contains('fullscreen')){
    exitFullscreen();
  }
}

function spawnParticle(icon){
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = icon;
  const duration = 6000 + Math.random() * 3000;
  const startX = Math.random() * 100; // vw
  const rotate = (Math.random() * 2 - 1) * 720;
  el.style.left = startX + 'vw';
  el.style.animationDuration = duration + 'ms';
  el.style.transform = `translateY(-40px) rotate(${rotate}deg)`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration + 200);
}

function confettiBurst(){
  const icons = [...hearts, ...petals];
  for (let i = 0; i < 30; i++){
    setTimeout(() => {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      spawnParticle(icon);
    }, i * 60);
  }
}

function toast(text){
  const chip = document.createElement('div');
  chip.className = 'message-chip';
  chip.textContent = text;
  messages.appendChild(chip);
  setTimeout(() => chip.remove(), 3000);
}

function nextCompliment(){
  if (msgIndex < compliments.length){
    const text = compliments[msgIndex++];
    toast(text);
    confettiBurst();
    if (text.includes('Mi corazón ya no puede más…')){
      setTimeout(showFinalPrompt, 1200);
    }
  } else {
    confettiBurst();
  }
}

function showFinalPrompt(){
  const chip = document.createElement('div');
  chip.className = 'message-chip';
  chip.innerHTML = '<div style="text-align:center">¿Quieres ser mi novia? 💍<div class="final"><button class="btn" id="yes1">Sí</button><button class="btn alt" id="yes2">Obvio que sí</button></div></div>';
  messages.appendChild(chip);

  const yes1 = chip.querySelector('#yes1');
  const yes2 = chip.querySelector('#yes2');
  [yes1, yes2].forEach(btn => btn.addEventListener('click', () => {
    confettiBurst();
    toast('¡Prometo hacerte feliz cada día! 🫶');
  }));
}

// Eventos
envelope.addEventListener('click', openEnvelope);
letter.addEventListener('click', onLetterClick);

seeMore.addEventListener('click', (e) => {
  e.stopPropagation();
  if (phase < 2) return;   // requiere modo lectura (pantalla completa)
  if (phase === 2){ phase = 3; }
  nextCompliment();
});

// Accesibilidad con teclado
envelope.tabIndex = 0;
letter.tabIndex = 0;
envelope.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });
letter.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    if (letter.classList.contains('fullscreen')) exitFullscreen();
    else if (phase === 1) enterFullscreen();
  }
});
