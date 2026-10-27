(() => {
  const endpoint = window.GGVB_SESSIONS_URL;
  if (!endpoint) return;
  const target = document.querySelector('.events');
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.textContent = 'Loading current sessions…';
  target.before(status);
  const script = document.createElement('script');
  let done = false;
  const fail = () => {
    if (done) return;
    done = true;
    status.textContent = 'Sessions could not load. Please refresh the page or contact us to confirm availability.';
    script.remove();
  };
  const timer = setTimeout(fail, 20000);
  window.ggvbSessionsLoaded = data => {
    if (done) return;
    if (!data || data.error || !Array.isArray(data.sessions)) { clearTimeout(timer); fail(); return; }
    const cards = document.createDocumentFragment();
    const groups = new Map();
    for (const session of data.sessions) {
      const groupKey = JSON.stringify([session.date, session.title.trim()]);
      let card = groups.get(groupKey);
      if (!card) {
      card = document.createElement('div'); card.className = 'event-card';
      const header = document.createElement('div'); header.className = 'event-header';
      const title = document.createElement('h2'); title.textContent = session.title;
      header.append(title); card.append(header);
      groups.set(groupKey, card);
      cards.append(card);
      }
      for (const signup of session.signups.length ? session.signups : [{player:'No confirmed signups yet', time:session.time}]) {
        const row = document.createElement('div'); row.className = 'signup';
        const player = document.createElement('span'); player.className = 'player'; player.textContent = signup.player;
        const time = document.createElement('span'); time.className = 'time'; time.textContent = signup.time;
        row.append(player, time); card.append(row);
      }
    }
    target.replaceChildren(cards);
    done = true; clearTimeout(timer); script.remove();
    status.textContent = data.sessions.length ? '' : 'No sessions are currently listed.';
  };
  try {
    const url = new URL(endpoint);
    if (url.origin !== 'https://script.google.com' || !url.pathname.endsWith('/exec')) throw new Error('Invalid endpoint');
    url.searchParams.set('callback','ggvbSessionsLoaded');
    script.src = url.href; script.onerror = fail; document.head.append(script);
  } catch { clearTimeout(timer); fail(); }
})();


