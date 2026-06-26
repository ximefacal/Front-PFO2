const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.portal-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
});

const promptDialog = document.querySelector('#prompt-dialog');
const openPromptButton = document.querySelector('#open-prompt');
const closePromptButton = document.querySelector('#close-prompt');
const promptOutput = document.querySelector('#prompt-output');
const promptFallback = document.querySelector('#prompt-fallback');
const typingCursor = document.querySelector('#typing-cursor');
const terminalBody = document.querySelector('.terminal-window__body');
const terminalEnd = document.querySelector('.terminal-command--end');
const lineCount = document.querySelector('#line-count');
let promptText;
let typingFrame;
let typingRun = 0;

async function readPromptFile() {
  if (promptText) return promptText;

  try {
    const response = await fetch('./prompt-utilizado.txt', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo leer el prompt');
    promptText = await response.text();
  } catch {
    // Los navegadores bloquean fetch() desde file://; esta copia mantiene la portada autocontenida.
    promptText = promptFallback.value.replace(/^\s*\n/, '');
  }

  return promptText;
}

function typePrompt(text) {
  const currentRun = ++typingRun;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const charactersPerSecond = 1200;
  const startTime = performance.now();

  promptOutput.textContent = '';
  terminalEnd.classList.remove('is-ready');
  typingCursor.hidden = false;
  lineCount.textContent = `${text.split('\n').length} líneas`;

  if (reduceMotion) {
    promptOutput.textContent = text;
    typingCursor.hidden = true;
    terminalEnd.classList.add('is-ready');
    return;
  }

  const writeFrame = (now) => {
    if (currentRun !== typingRun || !promptDialog.open) return;

    const visibleLength = Math.min(
      text.length,
      Math.floor(((now - startTime) / 1000) * charactersPerSecond)
    );

    promptOutput.textContent = text.slice(0, visibleLength);
    terminalBody.scrollTop = terminalBody.scrollHeight;

    if (visibleLength < text.length) {
      typingFrame = requestAnimationFrame(writeFrame);
    } else {
      typingCursor.hidden = true;
      terminalEnd.classList.add('is-ready');
    }
  };

  typingFrame = requestAnimationFrame(writeFrame);
}

openPromptButton.addEventListener('click', async () => {
  promptDialog.showModal();
  document.body.style.overflow = 'hidden';
  promptOutput.textContent = 'Leyendo prompt-utilizado.txt…';
  terminalBody.scrollTop = 0;
  const text = await readPromptFile();
  if (promptDialog.open) typePrompt(text);
});

closePromptButton.addEventListener('click', () => promptDialog.close());

promptDialog.addEventListener('click', (event) => {
  if (event.target === promptDialog) promptDialog.close();
});

promptDialog.addEventListener('close', () => {
  typingRun += 1;
  cancelAnimationFrame(typingFrame);
  document.body.style.overflow = '';
});

document.querySelector('#year').textContent = new Date().getFullYear();
