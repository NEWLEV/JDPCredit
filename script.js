/* ═══════════════════════════════════════════
   JDP CREDIT SOLUTIONS — INTERACTIVE SCRIPTS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ——— Mobile Hamburger Menu ——— */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ——— Scroll Animations ——— */
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ——— Animated Stats Counter ——— */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(num => {
          const text = num.getAttribute('data-value') || num.textContent;
          num.style.animation = 'count-up 0.6s ease both';
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statObserver.observe(statsBar);

  /* ——— Header Shrink on Scroll ——— */
  const header = document.querySelector('header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScroll = scrollY;
  }, { passive: true });

  /* ——— Smooth Scroll for all hash links ——— */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});


/* ═══════════════════════════════════════════
   CREDIT UTILIZATION CALCULATOR
═══════════════════════════════════════════ */
function calcUtil() {
  const bals = [...document.querySelectorAll('.util-bal')].map(i => parseFloat(i.value) || 0);
  const lims = [...document.querySelectorAll('.util-lim')].map(i => parseFloat(i.value) || 0);
  const totalBal = bals.reduce((a, b) => a + b, 0);
  const totalLim = lims.reduce((a, b) => a + b, 0);
  if (totalLim === 0) return;

  const pct = (totalBal / totalLim) * 100;
  const el = document.getElementById('util-result');
  el.classList.add('show');
  document.getElementById('util-pct').textContent = pct.toFixed(1) + '%';

  const pointer = document.getElementById('util-pointer');
  pointer.style.left = Math.min(pct, 100) + '%';

  const msg = document.getElementById('util-msg');
  if (pct <= 10) {
    msg.innerHTML = '✅ <strong>Excellent!</strong> Your utilization is ideal. This positively impacts your credit score.';
    el.style.background = '#ecfdf5'; el.style.borderColor = '#a7f3d0';
  } else if (pct <= 30) {
    msg.innerHTML = '🟡 <strong>Good.</strong> Under 30% is acceptable, but lowering to under 10% would boost your score further.';
    el.style.background = '#fffbeb'; el.style.borderColor = '#fcd34d';
  } else {
    msg.innerHTML = '🔴 <strong>High utilization is hurting your score.</strong> Paying down balances or requesting a limit increase can help.';
    el.style.background = '#fef2f2'; el.style.borderColor = '#fca5a5';
  }
}


/* ═══════════════════════════════════════════
   DEBT-TO-INCOME (DTI) CALCULATOR
═══════════════════════════════════════════ */
function calcDTI() {
  const income = parseFloat(document.getElementById('dti-income').value) || 0;
  if (income === 0) return;

  const debts = [...document.querySelectorAll('.dti-debt')].map(i => parseFloat(i.value) || 0);
  const totalDebt = debts.reduce((a, b) => a + b, 0);
  const dti = (totalDebt / income) * 100;

  const el = document.getElementById('dti-result');
  el.classList.add('show');
  document.getElementById('dti-pct').textContent = dti.toFixed(1) + '%';

  const msg = document.getElementById('dti-msg');
  if (dti <= 28) {
    msg.innerHTML = '✅ <strong>Excellent DTI.</strong> Most lenders will see you as a very low-risk borrower.';
    el.style.background = '#ecfdf5'; el.style.borderColor = '#a7f3d0';
  } else if (dti <= 36) {
    msg.innerHTML = '🟡 <strong>Good DTI.</strong> Within the ideal range for most conventional loan approvals.';
    el.style.background = '#fffbeb'; el.style.borderColor = '#fcd34d';
  } else if (dti <= 43) {
    msg.innerHTML = '⚠️ <strong>Borderline.</strong> You may qualify for some loans, but reducing debt will improve options.';
    el.style.background = '#fff7ed'; el.style.borderColor = '#fdba74';
  } else {
    msg.innerHTML = '🔴 <strong>High DTI.</strong> Most lenders require under 43%. A finance consulting plan can help reduce this.';
    el.style.background = '#fef2f2'; el.style.borderColor = '#fca5a5';
  }
}


/* ═══════════════════════════════════════════
   CREDIT SCORE IMPACT QUIZ
═══════════════════════════════════════════ */
const quizAnswers = {};

function quizNext(step) {
  const selected = document.querySelector(`input[name="q${step}"]:checked`);
  if (!selected) { alert('Please select an answer to continue.'); return; }
  quizAnswers[`q${step}`] = selected.value;

  document.getElementById(`qs-${step}`).classList.remove('active');
  const next = step + 1;
  document.getElementById(`qs-${next}`).classList.add('active');
  document.getElementById('quiz-progress').style.width = ((next - 1) / 5 * 100) + '%';
}

function quizFinish() {
  const selected = document.querySelector('input[name="q5"]:checked');
  if (!selected) { alert('Please select an answer to continue.'); return; }
  quizAnswers.q5 = selected.value;

  document.getElementById('qs-5').classList.remove('active');
  document.getElementById('qs-result').classList.add('active');
  document.getElementById('quiz-progress').style.width = '100%';

  const score = ['q1','q2','q3','q4'].reduce((a, k) => a + (parseInt(quizAnswers[k]) || 0), 0);
  const goal = quizAnswers.q5;

  const goalMap = {
    mortgage: 'qualify for a mortgage',
    business: 'build business credit and get funding',
    score: 'raise your credit score as fast as possible',
    errors: 'dispute errors and clean your credit report'
  };

  let plan = '';
  if (score >= 10) {
    plan = `<strong>✅ Your credit foundations look solid!</strong> Based on your answers, you\'re in a strong position. Your biggest opportunity is to continue optimizing — reducing utilization and ensuring there are no undetected errors. Your goal to <em>${goalMap[goal]}</em> is very achievable. We recommend a free credit audit to confirm there are no hidden issues.`;
  } else if (score >= 7) {
    plan = `<strong>🟡 You have a good base with some areas to improve.</strong> Your credit has strengths but likely has 1–2 issues holding it back. To <em>${goalMap[goal]}</em>, we recommend starting with a credit audit to identify and dispute any inaccurate items. A free consultation will map your fastest path.`;
  } else {
    plan = `<strong>🔴 Your credit needs focused attention — but it\'s very fixable.</strong> Based on your answers, there are likely multiple factors impacting your score. With a structured plan, most clients see meaningful progress within 90 days. Your goal to <em>${goalMap[goal]}</em> is still achievable — it starts with a free consultation.`;
  }

  document.getElementById('quiz-result-text').innerHTML = plan;
}

function quizSubmit() {
  const email = document.getElementById('quiz-email').value;
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }

  document.getElementById('quiz-result-text').innerHTML = `<strong>✅ Thanks! Your personalized credit plan is on its way to ${email}.</strong><br><br>A JDP Credit Solutions advisor will follow up within 1 business day. Or call us now: <a href="tel:+17865205461">(786) 520-5461</a>`;
  document.getElementById('quiz-email').style.display = 'none';
  document.querySelector('#qs-result .btn.green').style.display = 'none';
}

function quizReset() {
  ['q1','q2','q3','q4','q5'].forEach(n => {
    const checked = document.querySelector(`input[name="${n}"]:checked`);
    if (checked) checked.checked = false;
  });
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  document.getElementById('qs-1').classList.add('active');
  document.getElementById('quiz-progress').style.width = '0%';
}


/* ═══════════════════════════════════════════
   READ MORE / TOGGLE ARTICLES
═══════════════════════════════════════════ */
function toggleArticle(id) {
  const content = document.getElementById(`${id}-content`);
  const fade = document.getElementById(`${id}-fade`);
  const btn = content.closest('.card').querySelector('.btn.outline');

  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    if (fade) fade.classList.remove('hidden');
    btn.textContent = 'Read More ↓';
  } else {
    content.classList.add('expanded');
    if (fade) fade.classList.add('hidden');
    btn.textContent = 'Show Less ↑';
  }
}


/* ═══════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════ */
function validateForm(form) {
  const phone = form.phone.value.replace(/\D/g, '');
  if (phone.length < 10) {
    alert('Please enter a valid phone number.');
    return false;
  }
  return true;
}
