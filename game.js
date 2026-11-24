(() => {
  const characters = {
    mira: {
      name: 'Mira', age: 21, pronoun: 'she', intro: 'Hey, I saved you the comfiest spot. ☕',
      greetings: ['I’m glad you’re here. The rain makes everything feel a little slower, doesn’t it?', 'Oh, hi! I was just deciding what to do with this very important cup of tea.', 'You made it! I’ve got a cozy seat and absolutely no urgent plans.'],
      replies: {
        hello: ['Hey, you! I’m happy you stopped by. ♡', 'Hi! It’s nice having a little company.', 'Oh, hello! Settle in—there’s room right here.'],
        good: ['That really is good. I love collecting little bright spots like that.', 'Aww, tell me more—I’m officially invested now.', 'That’s lovely. I’m going to tuck that thought away for a rainy day.'],
        joke: ['Why did the tea bag get promoted? It was steeped in experience. ...I’ll work on the delivery. 😅', 'I tried to write a book about clouds. It kept going over my head.', 'What’s a book’s favorite kind of music? Anything with a good cover.'],
        kind: ['You’re sweet. Let’s make this a nice little moment for both of us. ♡', 'That’s really kind of you to say. Thank you.', 'You have a way of making this corner feel warmer.'],
        story: ['Once, a tiny moonbeam got lost on its way home. A sleepy moth offered to guide it, and they took the scenic route—past every porch light in town. The moonbeam arrived late, but with a new friend.', 'There was a little bookstore that only opened when it rained. Every book inside had a note from the person who left it. One day, someone found a note addressed to them: “You got here. That’s enough for today.”', 'A fox found a fallen star in the garden and tried to put it back using a very tall ladder. The ladder was too short, so the fox made a wish instead: for someone to see the star, too.']
      }
    },
    leo: {
      name: 'Leo', age: 22, pronoun: 'he', intro: 'Hey, glad you found me. Want to make this a good day? 🌿',
      greetings: ['Hey! I picked a spot with a view. Not a bad little hideaway, right?', 'Oh, hey. I was planning a tiny adventure. You in?', 'Nice to see you! I’ve got a playlist in my head and time to spare.'],
      replies: {
        hello: ['Hey, you! Good to have you here.', 'Hi! This is already a better afternoon.', 'There you are. Come hang out a while.'],
        good: ['That rules. I’m a big fan of small wins.', 'That’s the stuff! A little bit of good goes a long way.', 'Love that for you. What was the best part?'],
        joke: ['I bought a boat because it was on sail. No regrets.', 'Why don’t mountains get cold? They wear snowcaps. I’ll see myself out.', 'I started a band called 1023 Megabytes. We haven’t got a gig yet.'],
        kind: ['Aw, thanks. You’re pretty good company yourself.', 'That means a lot. I’m glad we’re hanging out.', 'Right back at you. This is a nice little moment.'],
        story: ['A bicycle once got tired of going in circles, so it took the long way home. It found a bakery, three new friends, and the world’s best cinnamon roll. The lesson: sometimes the detour is the point.', 'A little lighthouse got stage fright on its first night. The stars twinkled extra bright until it found its rhythm. By morning, the ships all knew the way—and the lighthouse had made a whole sky of friends.', 'A cloud decided to take the day off and became a very convincing sheep. Nobody noticed, except one kid who waved. The cloud waved back with a little sprinkle of rain.']
      }
    }
  };
  const moods = {
    cozy: { label: 'COZY', opener: 'cozy', greeting: 'A slow afternoon', tag: 'SLOW AFTERNOON' },
    silly: { label: 'SILLY', opener: 'silly', greeting: 'A tiny bit of fun', tag: 'GOOFY LITTLE HOUR' },
    thoughtful: { label: 'THOUGHTFUL', opener: 'thoughtful', greeting: 'A quiet moment', tag: 'ROOM TO THINK' }
  };
  const scenes = [
    { name: 'The window seat', description: 'Rain taps softly on the glass', tag: 'SLOW AFTERNOON', className: '' },
    { name: 'A garden nook', description: 'Warm light through the leaves', tag: 'GARDEN DAYDREAM', className: 'scene-garden' },
    { name: 'By the seaside', description: 'A soft breeze, nowhere to be', tag: 'SALT AIR & DAYDREAMS', className: 'scene-beach' },
    { name: 'The evening porch', description: 'The sky is turning lavender', tag: 'DUSK TOGETHER', className: 'scene-evening' }
  ];
  const actionLines = {
    wave: { pose: 'wave', bubble: 'a little hello!', reply: ['Mira waves back with a smile. “Hey, you!”', 'Leo gives you an enthusiastic wave. “Hi there!”'] },
    dance: { pose: 'dance', bubble: 'tiny dance break!', reply: ['Mira does a delightfully wobbly little dance. “That counts as cardio, right?”', 'Leo breaks into a goofy two-step. “I’m calling that a masterpiece.”'] },
    joke: { pose: 'laugh', bubble: 'trying not to giggle', reply: null },
    breathe: { pose: 'breathe', bubble: 'taking a slow breath', reply: ['Mira takes a gentle breath with you. “In for four… out for four. No rush.”', 'Leo closes his eyes for a moment. “One slow breath. We’re right here.”'] },
    cheer: { pose: 'cheer', bubble: 'a little celebration!', reply: ['Mira throws both hands up. “That deserves a tiny celebration!”', 'Leo raises his arms with a grin. “Let’s go! Small wins still count.”'] },
    sit: { pose: 'sit', bubble: 'getting comfy', reply: ['Mira settles in and pats the seat beside her. “Comfier already.”', 'Leo gets comfortable. “Okay, this is a good spot.”'] },
    think: { pose: 'think', bubble: 'thinking it over', reply: ['Mira taps her chin thoughtfully. “Hmm… I like where this is going.”', 'Leo considers it with a grin. “Let me think on that for a second.”'] },
    blush: { pose: 'blush', bubble: 'a little bashful', reply: ['Mira’s cheeks turn pink. “Well, that’s nice of you to say.”', 'Leo smiles, a little bashful. “You’re making me grin over here.”'] }
  };
  const $ = (selector) => document.querySelector(selector);
  const chatLog = $('#chat-log');
  const input = $('#chat-input');
  let selected = 'mira';
  let mood = 'cozy';
  let sceneIndex = 0;
  let moments = 0;
  let toastTimer;
  let audioOn = false;
  let audioContext;

  function companion() { return characters[selected]; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function addMessage(text, who = 'companion') {
    const message = document.createElement('div');
    message.className = `message ${who}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    const stamp = document.createElement('span');
    stamp.className = 'stamp';
    stamp.textContent = who === 'player' ? 'you · now' : `${companion().name} · now`;
    message.append(bubble, stamp);
    chatLog.append(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function setPose(pose, bubbleText, duration = 2600) {
    const stage = $('#character-stage');
    stage.dataset.pose = pose;
    $('#pose-bubble').textContent = bubbleText;
    window.clearTimeout(setPose.timer);
    if (pose !== 'idle') setPose.timer = window.setTimeout(() => {
      stage.dataset.pose = 'idle';
      $('#pose-bubble').textContent = 'just hanging out';
    }, duration);
  }
  function addMoment() {
    moments += 1;
    $('#moment-count').textContent = moments;
    if (moments === 3 || moments === 7 || moments === 12) {
      showToast(moments === 3 ? 'Three sweet moments already ✨' : moments === 7 ? 'You’re making a lovely little memory ♡' : 'A dozen moments shared. That’s pretty special ✦');
    }
  }
  function playChime() {
    if (!audioOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = 660;
      gain.gain.setValueAtTime(.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .13);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + .14);
    } catch { /* Audio is optional; the game still works without it. */ }
  }
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2300);
  }
  function updateCharacter() {
    const person = $('#person');
    person.classList.toggle('leo', selected === 'leo');
    $('#chat-name').textContent = companion().name;
    const avatar = $('#profile-avatar');
    avatar.classList.toggle('leo-mini', selected === 'leo');
    avatar.classList.toggle('mira-mini', selected === 'mira');
    $('#session-label').textContent = `A little time with ${companion().name}`;
    setPose('idle', 'just hanging out');
  }
  function action(name, requested = false) {
    const data = actionLines[name];
    if (!data) return;
    setPose(data.pose, data.bubble, name === 'dance' ? 2500 : 2100);
    playChime();
    const reply = data.reply ? (Array.isArray(data.reply) ? data.reply[selected === 'mira' ? 0 : 1] : data.reply) : pick(companion().replies.joke);
    window.setTimeout(() => addMessage(reply), 260);
    if (requested) addMoment();
    else addMoment();
  }
  function changeScene() {
    sceneIndex = (sceneIndex + 1) % scenes.length;
    const scene = scenes[sceneIndex];
    const backdrop = $('#scene-backdrop');
    backdrop.classList.remove('scene-evening', 'scene-beach', 'scene-garden');
    if (scene.className) backdrop.classList.add(scene.className);
    $('#scene-name').textContent = scene.name;
    $('#scene-description').textContent = scene.description;
    $('#scene-tag-text').textContent = scene.tag;
    $('#pose-bubble').textContent = 'somewhere new together';
    addMessage(pick([`A change of scenery! ${scene.name} feels like a good place to pause.`, `Ooh, ${scene.name}. I like this little spot.`, `New view, same good company. What do you think?`]));
    addMoment(); playChime();
  }
  function isBoundaryRequest(text) {
    return /\b(force|hurt|hit|kill|die|weapon|drug|drunk|steal|stalk|blackmail|threaten|humiliate|strip|nude|naked|sex|sexual|kiss me|obey|your slave|no choice|without consent)\b/i.test(text);
  }
  function respondTo(text) {
    const lower = text.toLowerCase();
    if (isBoundaryRequest(lower)) {
      setPose('idle', 'keeping it comfy');
      const reply = selected === 'mira'
        ? 'I’m going to pass on that. I like keeping our moments kind and comfortable for both of us. We could do a silly dance, swap stories, or pick a new scene instead.'
        : 'That’s not for me, but thanks for asking instead of assuming. How about a joke, a little dance, or a change of scenery?'
      addMessage(reply);
      return;
    }
    if (/\b(wave|hello|hi\b|hey\b|greet)\b/.test(lower)) { action('wave', true); return; }
    if (/\b(dance|boogie|groove)\b/.test(lower)) { action('dance', true); return; }
    if (/\b(joke|funny|laugh)\b/.test(lower)) { action('joke', true); return; }
    if (/\b(breathe|breathing|calm|relax|anxious|stress)\b/.test(lower)) { action('breathe', true); return; }
    if (/\b(cheer|celebrate|yay|excited)\b/.test(lower)) { action('cheer', true); return; }
    if (/\b(sit|comfy|comfortable|rest)\b/.test(lower)) { action('sit', true); return; }
    if (/\b(thinking|think|ponder)\b/.test(lower)) { action('think', true); return; }
    if (/\b(blush|bashful|compliment|cute|pretty|handsome|beautiful)\b/.test(lower)) { action('blush', true); return; }
    if (/\b(scene|somewhere|place|beach|garden|change the view)\b/.test(lower)) { changeScene(); return; }
    if (/\b(story|bedtime|once upon|tell me about)\b/.test(lower)) { addMessage(pick(companion().replies.story)); addMoment(); return; }
    if (/\b(good|great|happy|win|nice|wonderful|excited|proud)\b/.test(lower)) { addMessage(pick(companion().replies.good)); addMoment(); return; }
    if (/\b(thank|kind|sweet|love hanging|good company)\b/.test(lower)) { addMessage(pick(companion().replies.kind)); addMoment(); return; }
    if (/\b(hello|hi\b|hey\b|how are you|what's up)\b/.test(lower)) { addMessage(pick(companion().replies.hello)); addMoment(); return; }
    const moodReplies = {
      cozy: ['That sounds like a good thing to sit with. I’m listening. ♡', 'I like hearing what’s on your mind. Want to tell me a little more?', 'We don’t have to rush to an answer. We can just enjoy the quiet for a moment.'],
      silly: ['I’m going to give that thought a tiny party hat. 🎉 What else?', 'That has the makings of a very unusual adventure. I’m listening!', 'Important question: would it be improved by a tiny frog? (Most things are.)'],
      thoughtful: ['Thanks for sharing that with me. What part feels most important to you?', 'That’s worth thinking about. I’m here for the whole thought, not just the tidy version.', 'Sometimes saying it out loud makes a little more room around it.']
    };
    addMessage(pick(moodReplies[mood]));
    addMoment();
  }
  function send(text) {
    const clean = text.trim();
    if (!clean) return;
    addMessage(clean, 'player');
    input.value = '';
    playChime();
    window.setTimeout(() => respondTo(clean), 330);
  }
  function reset() {
    chatLog.innerHTML = '';
    moments = 0;
    $('#moment-count').textContent = '0';
    sceneIndex = 0;
    const backdrop = $('#scene-backdrop');
    backdrop.classList.remove('scene-evening', 'scene-beach', 'scene-garden');
    $('#scene-name').textContent = scenes[0].name;
    $('#scene-description').textContent = scenes[0].description;
    $('#scene-tag-text').textContent = scenes[0].tag;
    setPose('idle', 'just hanging out');
    addMessage(`Hey, ${pick(['what would make this moment nice for you?', 'I’m glad you’re here. What are you in the mood for?', 'we can chat, try a little action, or find a new scene.'])} ${companion().name === 'Mira' ? '☕' : '🌿'}`);
    showToast('A fresh little moment ♡');
  }

  document.querySelectorAll('.character-pick').forEach((button) => button.addEventListener('click', () => {
    selected = button.dataset.character;
    document.querySelectorAll('.character-pick').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateCharacter();
    addMessage(pick(companion().greetings));
    addMoment(); playChime();
  }));
  document.querySelectorAll('.mood-chip').forEach((button) => button.addEventListener('click', () => {
    mood = button.dataset.mood;
    document.querySelectorAll('.mood-chip').forEach((item) => {
      const active = item === button;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $('#footer-vibe').textContent = moods[mood].label;
    addMessage(mood === 'cozy' ? 'Let’s keep it mellow. ☁️' : mood === 'silly' ? 'Silly mode engaged. No promises about the quality of my jokes. ✨' : 'We can take our time with this one. 🌙');
    addMoment(); playChime();
  }));
  document.querySelectorAll('.action-button').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));
  $('#scene-switch').addEventListener('click', changeScene);
  $('#chat-form').addEventListener('submit', (event) => { event.preventDefault(); send(input.value); });
  document.querySelectorAll('.prompt-chip').forEach((button) => button.addEventListener('click', () => send(button.textContent)));
  $('#reset-game').addEventListener('click', reset);
  $('#sound-toggle').addEventListener('click', (event) => {
    audioOn = !audioOn;
    const button = event.currentTarget;
    button.classList.toggle('sound-on', audioOn);
    button.setAttribute('aria-label', audioOn ? 'Turn sound off' : 'Turn sound on');
    button.title = audioOn ? 'Sound on' : 'Sound off';
    button.querySelector('.sound-slash').style.display = audioOn ? 'none' : 'block';
    if (audioOn) playChime();
    showToast(audioOn ? 'Soft chimes on ♫' : 'Sound off');
  });
  const dialog = $('#about-dialog');
  $('#about-button').addEventListener('click', () => dialog.showModal());
  $('#dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-ok').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  reset();
})();
