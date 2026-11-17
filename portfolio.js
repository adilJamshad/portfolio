const header = document.querySelector('.top');
header.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const section = document.getElementById(link.hash.slice(1));
  if (!section) return;

  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  section.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const responses = {
  status: {
    route: 'SQL status lookup',
    answer: 'RFC 2065 was obsoleted by RFC 2535.',
    url: 'https://www.rfc-editor.org/info/rfc2065',
    source: 'RFC 2065 status',
  },
  section: {
    route: 'Exact section retrieval',
    answer: 'Section 2.3.4 gives size limits for DNS labels, names, TTL values, and UDP messages.',
    url: 'https://www.rfc-editor.org/rfc/rfc1035#section-2.3.4',
    source: 'RFC 1035 §2.3.4',
  },
  search: {
    route: 'Vector search → answer generation → quote verification',
    answer: 'A DNS label can be up to 63 octets. The source specifies “63 octets or less.”',
    url: 'https://www.rfc-editor.org/rfc/rfc1035#section-2.3.4',
    source: 'RFC 1035 §2.3.4',
  },
};

const demo = document.querySelector('#pipeline-demo');
const questions = demo.querySelectorAll('[data-query]');
const result = demo.querySelector('.result');
const route = result.querySelector('.route');
const answer = result.querySelector('.answer');
const source = result.querySelector('.source');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const question of questions) {
  question.addEventListener('click', () => {
    const response = responses[question.dataset.query];
    for (const option of questions) {
      option.setAttribute('aria-pressed', String(option === question));
    }
    route.textContent = response.route;
    answer.textContent = response.answer;
    source.textContent = response.source + ' ↗';
    source.href = response.url;
    if (!motion.matches) {
      result.getAnimations().forEach(animation => animation.cancel());
      result.animate(
        [{ opacity: 0.45, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 260, easing: 'ease-out' },
      );
    }
  });
}

if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!motion.matches) {
        entry.target.animate(
          [{ opacity: 0.45, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 420, easing: 'ease-out' },
        );
      }
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.14 });
  document.querySelectorAll('.feature, .lab, .project-note, .projects article, .about, .history').forEach(
    section => observer.observe(section),
  );
}
