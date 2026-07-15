const musicButton = document.querySelector('#musicButton');
const musicLabel = document.querySelector('#musicLabel');
const musicTrack = document.querySelector('#musicTrack');
let playing = false;

function toggleMusic() {
  playing = !playing;
  if (playing) {
    musicTrack.play().then(() => { musicLabel.textContent = 'Музыка қосулы'; }).catch(() => {
      playing = false;
      musicLabel.textContent = 'Музыка қолжетімсіз';
      musicButton.setAttribute('aria-pressed', 'false');
    });
  } else { musicTrack.pause(); musicLabel.textContent = 'Музыка'; }
  musicButton.setAttribute('aria-pressed', playing);
}
musicButton.addEventListener('click', toggleMusic);

// Browsers that allow audible autoplay will begin the invitation music immediately.
window.addEventListener('load', () => {
  musicTrack.play().then(() => {
    playing = true;
    musicLabel.textContent = 'Музыка қосулы';
    musicButton.setAttribute('aria-pressed', 'true');
  }).catch(() => {
    // Mobile browsers require the guest's first tap; the music button remains available.
  });
});

const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const countdown = document.querySelector('.countdown');
if (countdown) {
  const target = new Date(countdown.dataset.eventDate).getTime();
  const fields = { days: document.querySelector('#countDays'), hours: document.querySelector('#countHours'), minutes: document.querySelector('#countMinutes'), seconds: document.querySelector('#countSeconds') };
  const updateCountdown = () => {
    let remaining = Math.max(0, target - Date.now());
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); const seconds = Math.floor((remaining % 60000) / 1000);
    fields.days.textContent = String(days).padStart(2, '0'); fields.hours.textContent = String(hours).padStart(2, '0');
    fields.minutes.textContent = String(minutes).padStart(2, '0'); fields.seconds.textContent = String(seconds).padStart(2, '0');
  };
  updateCountdown(); setInterval(updateCountdown, 1000);
}

document.querySelector('#rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const response = Object.fromEntries(new FormData(form).entries());
  const message = document.querySelector('#formMessage');
  const saved = JSON.parse(localStorage.getItem('elviraRsvpResponses') || '[]');
  saved.push({ ...response, sentAt: new Date().toISOString() });
  localStorage.setItem('elviraRsvpResponses', JSON.stringify(saved));
  message.textContent = 'Жіберілуде…';
  fetch('https://script.google.com/macros/s/AKfycbzIupoI9T2d5aMKNzhq10-zBHBOtSfhAbzX2Z94m4BvB4qExJ77A9zaJF-eptQhReEk/exec', {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ ...response, sentAt: new Date().toISOString() }).toString()
  }).then(() => {
    message.textContent = `${response.name}, жауабыңыз қабылданды. Рақмет!`;
    form.reset();
  }).catch(() => {
    message.textContent = 'Жауап браузерде сақталды. Интернет байланысын тексеріп, қайта жіберіңіз.';
  });
});
