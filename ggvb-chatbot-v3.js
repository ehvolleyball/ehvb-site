/* Good Game Volleyball preset FAQ widget. No AI, accounts, or backend required. */
(() => {
  // Works whether the script is placed in <head> or before </body>.
  function initGGVBChatbot() {
  if (document.getElementById('ggvb-faq-root')) return;

  const questions = [
    {
      question: 'How much does training cost?',
      answer: 'Training rates are per athlete: 1-on-1 $80, 2 athletes $50 each, 3 athletes $40 each, and 4 athletes $30 each.'
    },
    {
      question: 'How do I request a session?',
      answer: 'Select the Lessons Sign Ups Image on our website to submit a training request.'
    },
    {
      question: 'Do you offer group training?',
      answer: 'Yes! We offer small-group training for 2 to 4 athletes.'
    },
    {
      question: 'Do you offer video feedback?',
      answer: 'Yes. One video breakdown is included with 1-on-1 and 2-athlete training sessions.'
    },
    {
      question: 'Do athletes get drills for home?',
      answer: 'Yes! All training options include drills that athletes can practice at home in GroupMe.'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    #ggvb-faq-root { --ggvb-red:#bd182a; --ggvb-blue:#173e71; font-family:Arial,Helvetica,sans-serif; }
    #ggvb-faq-root * { box-sizing:border-box; }
    #ggvb-faq-launcher { position:fixed; z-index:2147483000; right:20px; bottom:20px; border:0; border-radius:100px; background:var(--ggvb-red); color:white; display:flex; align-items:center; gap:9px; padding:14px 18px; box-shadow:0 5px 22px #0004; cursor:pointer; font-size:15px; font-weight:700; }
    #ggvb-faq-launcher:focus-visible, #ggvb-faq-root button:focus-visible { outline:3px solid #75a9ff; outline-offset:3px; }
    #ggvb-faq-panel { position:fixed; z-index:2147483001; right:20px; bottom:84px; width:min(365px,calc(100vw - 32px)); max-height:min(560px,calc(100dvh - 110px)); overflow:hidden; display:flex; flex-direction:column; background:white; color:#1f2836; border-radius:16px; border:1px solid #e1e5ec; box-shadow:0 14px 50px #0004; }
    #ggvb-faq-panel[hidden] { display:none; }
    #ggvb-faq-head { display:flex; align-items:center; justify-content:space-between; padding:16px; background:var(--ggvb-blue); color:white; }
    #ggvb-faq-head strong { font-size:16px; }
    #ggvb-faq-head small { display:block; margin-top:3px; opacity:.84; }
    #ggvb-faq-close { background:transparent; border:0; color:white; font-size:25px; cursor:pointer; padding:0 4px; line-height:1; }
    #ggvb-faq-content { overflow:auto; padding:15px; }
    #ggvb-faq-intro { font-size:14px; line-height:1.45; margin:0 0 13px; }
    #ggvb-faq-options { display:grid; gap:8px; }
    #ggvb-faq-options button { background:#f6f8fb; border:1px solid #dce3ed; border-radius:9px; text-align:left; padding:11px 12px; color:#1a375e; font-size:14px; line-height:1.35; cursor:pointer; }
    #ggvb-faq-options button:hover, #ggvb-faq-options button[aria-pressed="true"] { background:#edf3fc; border-color:#8daacc; }
    #ggvb-faq-answer { background:#f4f6f9; padding:13px; border-radius:9px; margin-top:14px; font-size:14px; line-height:1.5; }
    #ggvb-faq-answer[hidden] { display:none; }
    #ggvb-faq-answer strong { display:block; color:#173e71; margin-bottom:7px; }
    #ggvb-faq-footer { border-top:1px solid #e8ebf0; padding:11px 15px; font-size:12px; color:#5b677a; }
    @media (max-width:480px) { #ggvb-faq-launcher { right:12px; bottom:12px; } #ggvb-faq-panel { right:12px; bottom:76px; max-height:calc(100dvh - 98px); } }
    @media (prefers-reduced-motion:no-preference) { #ggvb-faq-launcher { transition:transform .15s ease; } #ggvb-faq-launcher:hover { transform:translateY(-2px); } }
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'ggvb-faq-root';
  root.innerHTML = `
    <button id="ggvb-faq-launcher" type="button" aria-expanded="false" aria-controls="ggvb-faq-panel">🏐 Ask GGVB</button>
    <section id="ggvb-faq-panel" role="dialog" aria-label="GGVB questions and answers" hidden>
      <header id="ggvb-faq-head">
        <div><strong>🏐 GGVB Assistant</strong><small>Good Game Volleyball</small></div>
        <button type="button" id="ggvb-faq-close" aria-label="Close chatbot">×</button>
      </header>
      <div id="ggvb-faq-content">
        <p id="ggvb-faq-intro">Hi! Choose a question to see an instant answer.</p>
        <div id="ggvb-faq-options"></div>
        <div id="ggvb-faq-answer" role="status" aria-live="polite" hidden></div>
      </div>
      <footer id="ggvb-faq-footer">For anything else, use our website's contact options.</footer>
    </section>`;
  document.body.appendChild(root);

  const launcher = root.querySelector('#ggvb-faq-launcher');
  const panel = root.querySelector('#ggvb-faq-panel');
  const closeButton = root.querySelector('#ggvb-faq-close');
  const options = root.querySelector('#ggvb-faq-options');
  const answer = root.querySelector('#ggvb-faq-answer');

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) closeButton.focus(); else launcher.focus();
  }

  questions.forEach(({question, answer: answerText}) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = question;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      options.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      answer.replaceChildren();
      const title = document.createElement('strong');
      title.textContent = question;
      const message = document.createElement('span');
      message.textContent = answerText;
      answer.append(title, message);
      answer.hidden = false;
      answer.scrollIntoView({block:'nearest', behavior:'smooth'});
    });
    options.appendChild(button);
  });

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGGVBChatbot, { once: true });
  } else {
    initGGVBChatbot();
  }
})();
