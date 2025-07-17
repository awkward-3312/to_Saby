const text = "Saby, dime si tú quisieras andar conmigo... 💕";
let i = 0;
const speed = 80;

function typeWriter() {
  if (i < text.length) {
    document.getElementById("typing-text").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    document.getElementById("buttons").style.display = "flex";
  }
}

function aceptar() {
  document.getElementById("respuesta").textContent = "¡Me haces la persona más feliz del mundo! 🌎💘";
  launchConfetti();
}

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 8 + 2,
    speedY: Math.random() * 3 + 1,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.speedY;
      if (p.y > canvas.height) p.y = -10;
    });
    requestAnimationFrame(animate);
  }

  animate();
}

window.onload = typeWriter;
