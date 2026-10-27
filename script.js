const appState = {
  introComplete: localStorage.getItem('rimuruIntroComplete') === 'true',
  scene: 'door',
  isMuted: false,
  audioContext: null,
  dialogueQueue: [],
  previousText: null,
  currentSpeaker: '零肆',
  deskClicks: 0,
  musicInterval: null,
};

const storyPages = {
  about: {
    title: '關於我們',
    content: `
      <h3>我們的相遇</h3>
      <p>這裡是屬於兩人心事與回憶的空間，從最初的相識，到日常的陪伴，都是我們一起慢慢築起的故事。</p>
      <ul>
        <li>零肆：我想要帶大家看看這間辦公室裡的每一處，都藏著不經意的幸福。</li>
        <li>利姆路：這裡有工作、有笑聲，也有很多值得珍藏的時光。</li>
      </ul>
    `,
    guide: '這間辦公室對我來說，是個很特別的地方喔。'
  },
  daily: {
    title: '戀愛日常',
    content: `
      <h3>一點一滴的小幸福</h3>
      <p>每一天的對話、每一次的關心，都像是從窗外灑落的光，輕輕地照進兩人的生活裡。</p>
      <ul>
        <li>一起喝咖啡，討論今天的工作與明天的夢想。</li>
        <li>躲在辦公桌旁邊，偷偷笑著看彼此的反應。</li>
        <li>把小小的日常，變成一段長長的回憶。</li>
      </ul>
    `,
    guide: '工作忙碌也好，生活平凡也好，只要有你在，我們就會讓每一天都變得更幸福。'
  },
  anniversary: {
    title: '戀愛紀念日',
    content: `
      <h3>那些重要的日子</h3>
      <p>每一次紀念日，不只是日期，而是兩人一起走過的每一段路、每一次成長與珍惜。</p>
      <ul>
        <li>窗邊的日光，溫柔地照亮我們的相遇與陪伴。</li>
        <li>時間一點一點流過，紀念日也隨著彼此的心意，越來越珍貴。</li>
      </ul>
    `,
    guide: '每當這個日子到來，我都會想起那份溫暖與感動，因為你，這些回憶都美得不像話。'
  },
  qa: {
    title: '戀愛問答',
    content: `
      <h3>問答時間</h3>
      <p>關於愛情，有很多有趣的問題；而最重要的答案，往往藏在彼此的細節裡。</p>
      <ul>
        <li>Q：最想對另一半說的話是什麼？</li>
        <li>A：我希望能陪你看清晨的雲、傍晚的雨，還有每個平凡的日子。</li>
      </ul>
    `,
    guide: '其實戀愛最可貴的，不是華麗的誓言，而是彼此願意一起陪伴，走到最後。'
  },
  fortune: {
    title: '戀愛御神籤',
    content: `
      <h3>幸運簽詩</h3>
      <p>今天的幸運，或許就在你走進這間辦公室的那一刻，也許就在你看見彼此的笑容之時。</p>
      <ul>
        <li>「相遇之時，心意自會相通」</li>
        <li>「持續用心，愛情將慢慢開花結果」</li>
      </ul>
    `,
    guide: '我覺得這道簽，不只是運勢，而是提醒我們：只要真心相待，幸福一定會慢慢出現。'
  },
  guestbook: {
    title: '訪客留言簿',
    content: `
      <h3>來訪留言</h3>
      <p>不管你來自哪裡，都歡迎留下你的故事、你的祝福，讓這裡變成連結心意的地方。</p>
      <ul>
        <li>今天來訪的你，先和我們一起留下暖暖的心意吧。</li>
        <li>遠方的旅人，願你也能找到屬於自己的幸福。</li>
      </ul>
    `,
    guide: '嗯——如果你願意留下留言，那這裡就會多出一段屬於你的故事。'
  }
};

const introNarration = [
  '歡迎來到魔國聯邦。',
  '在這裡，有一間收藏著無數回憶的辦公室。',
  '不妨敲敲門，看看今天會遇見誰吧？'
];

const zero4Welcome = [
  '啊！歡迎歡迎——！',
  '沒想到今天會有客人來呢！嘿嘿，請進請進！',
  '我是零肆・坦派斯特！叫我零肆就可以囉！',
  '這裡是利姆路的辦公室，不過今天由我來帶大家參觀！',
  '至於利姆路嘛……嘿嘿，他現在有點忙，所以就讓我先陪著大家吧！'
];

const guideIntro = [
  '這間辦公室對我來說，是個很特別的地方喔。',
  '雖然利姆路常常在這裡忙著工作，但我們也留下了好多好多回憶！',
  '啊，對了！差點忘記正事了！',
  '既然都來了，要不要讓我帶你四處看看呢？'
];

const extraDialogue = {
  desk: [
    '這裡的文件堆得像小山一樣，真是充滿故事的地方呢。',
    '啊！你又點到了這份文件……好像是我們一起留下的紀錄呢。',
    '這些回憶雖然很普通，但連起來看，卻是最珍貴的寶藏。'
  ],
  vase: [
    '這花瓶裡的花，雖然每次都會枯掉一點，但每次都能讓人想起那些美好的時光。',
    '我想，愛情也像這些花一樣，需要細心照顧，才能慢慢綻放。'
  ],
  door: '要離開嗎？如果你想再來看看，我會一直在這裡等你。'
};

const elements = {
  doorScene: document.getElementById('door-scene'),
  officeScene: document.getElementById('office-scene'),
  knockButton: document.getElementById('knock-button'),
  skipIntro: document.getElementById('skip-intro'),
  doorPanel: document.getElementById('door-panel'),
  dialogueText: document.getElementById('dialogue-text'),
  prevLine: document.getElementById('prev-line'),
  replayLine: document.getElementById('replay-line'),
  guideTrigger: document.getElementById('guide-trigger'),
  guidePanel: document.getElementById('guide-panel'),
  guideClose: document.getElementById('guide-close'),
  storyPanel: document.getElementById('story-panel'),
  storyTitle: document.getElementById('story-title'),
  storyContent: document.getElementById('story-content'),
  storyClose: document.getElementById('story-close'),
  backOffice: document.getElementById('back-office'),
  returnDoor: document.getElementById('return-door'),
  musicToggle: document.getElementById('music-toggle'),
  zero4: document.getElementById('zero4-character')
};

function initAudio() {
  if (!appState.audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    appState.audioContext = new AudioCtor();
  }
  if (appState.audioContext.state === 'suspended') {
    appState.audioContext.resume();
  }
}

function tone(freq, duration = 0.18, type = 'triangle', gainValue = 0.03) {
  if (appState.isMuted || !appState.audioContext) return;
  const ctx = appState.audioContext;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
}

function playKnockSound() {
  initAudio();
  tone(220, 0.08, 'triangle', 0.026);
  setTimeout(() => tone(180, 0.1, 'triangle', 0.026), 120);
}

function playButtonChime() {
  initAudio();
  tone(540, 0.08, 'sine', 0.02);
  setTimeout(() => tone(740, 0.12, 'sine', 0.02), 80);
}

function playFootstepSound() {
  initAudio();
  tone(130, 0.12, 'square', 0.014);
  setTimeout(() => tone(110, 0.12, 'square', 0.014), 130);
}

function startMusic() {
  if (appState.isMuted) return;
  initAudio();
  if (appState.musicInterval) clearInterval(appState.musicInterval);

  const notes = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 392.0];
  let index = 0;
  appState.musicInterval = setInterval(() => {
    if (appState.isMuted) return;
    tone(notes[index % notes.length], 0.5, 'sine', 0.017);
    index += 1;
  }, 680);
}

function stopMusic() {
  if (appState.musicInterval) {
    clearInterval(appState.musicInterval);
    appState.musicInterval = null;
  }
}

function setScene(scene) {
  appState.scene = scene;
  elements.doorScene.classList.toggle('active', scene === 'door');
  elements.officeScene.classList.toggle('active', scene === 'office');
}

function enqueueDialogue(messages, speaker = '零肆', speed = 36) {
  const list = Array.isArray(messages) ? messages : [messages];
  for (const text of list) {
    appState.dialogueQueue.push({ text, speaker, speed });
  }
  if (!appState.isTyping) {
    playQueue();
  }
}

function playQueue() {
  const next = appState.dialogueQueue.shift();
  if (!next) {
    return;
  }

  appState.isTyping = true;
  appState.currentSpeaker = next.speaker;
  const label = document.querySelector('.speaker-label');
  if (label) label.textContent = next.speaker;

  elements.dialogueText.textContent = '';
  const text = next.text;
  let index = 0;

  const type = () => {
    if (index <= text.length) {
      elements.dialogueText.textContent = text.slice(0, index);
      index += 1;
      setTimeout(type, next.speed);
    } else {
      appState.isTyping = false;
      appState.previousText = text;
      setTimeout(() => {
        if (appState.dialogueQueue.length) {
          playQueue();
        }
      }, 200);
    }
  };

  type();
}

function revealOffice() {
  setScene('office');
  localStorage.setItem('rimuruIntroComplete', 'true');
  appState.introComplete = true;
  startMusic();

  enqueueDialogue(zero4Welcome, '零肆', 30);
  setTimeout(() => enqueueDialogue(guideIntro, '零肆', 32), 2400);
}

function handleKnockSequence() {
  playKnockSound();
  elements.doorPanel.classList.remove('opening');
  elements.doorPanel.classList.remove('knocking');
  void elements.doorPanel.offsetWidth;
  elements.doorPanel.classList.add('knocking');

  setTimeout(() => playFootstepSound(), 960);
  setTimeout(() => {
    const label = document.querySelector('.speaker-label');
    if (label) label.textContent = '零肆';
    elements.dialogueText.textContent = '來了、來了！請稍等一下！';
  }, 1200);

  setTimeout(() => {
    elements.doorPanel.classList.add('opening');
    setTimeout(() => {
      elements.doorPanel.style.transform = '';
      revealOffice();
    }, 700);
  }, 2000);
}

function clearStory() {
  elements.storyTitle.textContent = '導覽內容';
  elements.storyContent.innerHTML = '';
  elements.storyPanel.classList.add('hidden');
}

function openGuidePanel() {
  elements.guidePanel.classList.remove('hidden');
}

function closeGuidePanel() {
  elements.guidePanel.classList.add('hidden');
}

function openStoryPage(page) {
  const pageData = storyPages[page];
  if (!pageData) return;

  elements.storyTitle.textContent = pageData.title;
  elements.storyContent.innerHTML = pageData.content;
  elements.storyPanel.classList.remove('hidden');
  closeGuidePanel();
  enqueueDialogue(pageData.guide, '零肆', 25);
}

function handleDeskClick() {
  appState.deskClicks += 1;

  if (appState.deskClicks >= 3) {
    appState.deskClicks = 0;
    enqueueDialogue('這份文件……原來是我們一起留下的「紀念日備忘」呢。這些回憶，比任何話語都更有力量。', '零肆', 22);
    return;
  }

  const text = extraDialogue.desk[(appState.deskClicks - 1) % extraDialogue.desk.length];
  enqueueDialogue(text, '零肆', 24);
}

function handleVaseClick() {
  const text = extraDialogue.vase[Math.floor(Math.random() * extraDialogue.vase.length)];
  enqueueDialogue(text, '零肆', 24);
}

function handleDoorLeave() {
  const confirmLeave = window.confirm('零肆：要離開嗎？');
  if (!confirmLeave) {
    enqueueDialogue(extraDialogue.door, '零肆', 24);
    return;
  }

  setScene('door');
  clearStory();
  closeGuidePanel();
  elements.doorPanel.classList.remove('opening');
  elements.doorPanel.classList.remove('knocking');
  enqueueDialogue(introNarration, '旁白', 28);
}

function attachEvents() {
  elements.knockButton.addEventListener('click', () => {
    if (appState.scene !== 'door') return;
    playButtonChime();
    handleKnockSequence();
  });

  elements.skipIntro.addEventListener('click', () => {
    localStorage.setItem('rimuruIntroComplete', 'true');
    appState.introComplete = true;
    revealOffice();
  });

  elements.guideTrigger.addEventListener('click', openGuidePanel);
  elements.guideClose.addEventListener('click', closeGuidePanel);
  elements.storyClose.addEventListener('click', clearStory);
  elements.backOffice.addEventListener('click', clearStory);
  elements.returnDoor.addEventListener('click', handleDoorLeave);

  elements.prevLine.addEventListener('click', () => {
    if (appState.previousText) {
      enqueueDialogue(appState.previousText, appState.currentSpeaker, 20);
    }
  });

  elements.replayLine.addEventListener('click', () => {
    if (appState.previousText) {
      enqueueDialogue(appState.previousText, appState.currentSpeaker, 24);
      playButtonChime();
    }
  });

  document.querySelectorAll('.guide-item').forEach((button) => {
    button.addEventListener('click', () => {
      openStoryPage(button.dataset.page);
    });
  });

  document.querySelectorAll('.hotspot').forEach((spot) => {
    spot.addEventListener('click', () => {
      const page = spot.dataset.page;
      if (page === 'about') openStoryPage('about');
      if (page === 'daily') openStoryPage('daily');
      if (page === 'anniversary') openStoryPage('anniversary');
      if (page === 'fortune') openStoryPage('fortune');
      if (page === 'qa') openStoryPage('qa');

      if (spot.classList.contains('hotspot-table')) handleDeskClick();
      if (spot.classList.contains('hotspot-vase')) handleVaseClick();
      if (spot.classList.contains('hotspot-door')) handleDoorLeave();
      if (spot.classList.contains('hotspot-shelf')) openStoryPage('about');
      if (spot.classList.contains('hotspot-window')) openStoryPage('anniversary');
      if (spot.classList.contains('hotspot-vase')) openStoryPage('fortune');
    });
  });

  elements.zero4.addEventListener('click', () => {
    openGuidePanel();
    playButtonChime();
  });

  elements.musicToggle.addEventListener('click', () => {
    appState.isMuted = !appState.isMuted;
    elements.musicToggle.textContent = appState.isMuted ? '🔇' : '♫';
    if (appState.isMuted) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

function boot() {
  setScene(appState.introComplete ? 'office' : 'door');
  if (appState.introComplete) {
    revealOffice();
  } else {
    enqueueDialogue(introNarration, '旁白', 36);
  }
  attachEvents();
}

window.addEventListener('load', boot);
