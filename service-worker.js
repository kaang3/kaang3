const VERSION = 'blok-dunyasi-v3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      try { await client.navigate(client.url); } catch (_) {}
    }
  })());
});

function replaceOnce(html, before, after) {
  return html.includes(before) ? html.replace(before, after) : html;
}

function patchHtml(source) {
  let html = source;

  html = replaceOnce(
    html,
    '#status { position: absolute; top: calc(12px + var(--safe-top)); left: 50%; transform: translateX(-50%); padding: 7px 12px; border-radius: 999px; color: white; background: rgba(0,0,0,.38); backdrop-filter: blur(8px); font-size: 13px; font-weight: 700; text-shadow: 0 1px 2px #000; white-space: nowrap; }',
    '#status { position: absolute; top: calc(12px + var(--safe-top)); left: 50%; transform: translateX(-50%); padding: 7px 12px; border-radius: 999px; color: white; background: rgba(0,0,0,.38); backdrop-filter: blur(8px); font-size: 13px; font-weight: 700; text-shadow: 0 1px 2px #000; white-space: nowrap; }\n#miningBar { position:absolute; left:50%; top:calc(50% + 22px); width:92px; height:8px; transform:translateX(-50%); padding:2px; border-radius:999px; background:rgba(0,0,0,.48); opacity:0; transition:opacity .1s; }\n#miningBar.active { opacity:1; }\n#miningFill { width:0%; height:100%; border-radius:999px; background:white; box-shadow:0 0 5px rgba(255,255,255,.7); }'
  );

  html = replaceOnce(
    html,
    '<div id="crosshair" aria-hidden="true"></div>\n    <div id="status">Yükleniyor…</div>',
    '<div id="crosshair" aria-hidden="true"></div>\n    <div id="miningBar" aria-hidden="true"><div id="miningFill"></div></div>\n    <div id="status">Yükleniyor…</div>'
  );

  html = replaceOnce(
    html,
    'mavi ZIPLA tuşuyla bloklara çık.<br />',
    'mavi ZIPLA tuşuyla bloklara çık; KIR tuşuna blok kırılana kadar basılı tut.<br />'
  );

  html = replaceOnce(
    html,
    "  const jumpBtn = document.getElementById('jumpBtn');\n  const slots = [...document.querySelectorAll('.slot')];",
    "  const jumpBtn = document.getElementById('jumpBtn');\n  const miningBar = document.getElementById('miningBar');\n  const miningFill = document.getElementById('miningFill');\n  const slots = [...document.querySelectorAll('.slot')];"
  );

  html = replaceOnce(
    html,
    "  function jump() {\n    if (player.grounded || hasGroundSupport()) {\n      player.velocityY = 6.65;\n      player.grounded = false;\n    }\n  }",
    "  function jump() {\n    if (player.grounded || hasGroundSupport()) {\n      player.velocityY = 7.35;\n      player.grounded = false;\n    }\n  }"
  );

  html = replaceOnce(
    html,
`  function breakBlock() {
    const hit = castBlock();
    if (!hit) return;
    removeBlock(hit.object);
    statusEl.textContent = 'Blok kırıldı';
  }

  function placeBlock() {
    const hit = castBlock();
    if (!hit || !hit.face) return;
    const normal = hit.face.normal;
    const p = hit.object.position.clone().add(normal);
    const dx = Math.abs(p.x - player.position.x);
    const dz = Math.abs(p.z - player.position.z);
    const withinPlayer = dx < 0.7 && dz < 0.7 && p.y >= player.position.y - 0.2 && p.y <= player.position.y + 2;
    if (withinPlayer) return;
    addBlock(p.x, p.y, p.z, selectedBlock);
    statusEl.textContent = \\`${blockNames[selectedBlock]} yerleştirildi\\`;
  }
`,
`  const breakTimes = {
    leaves: 0.18,
    sand: 0.32,
    dirt: 0.52,
    grass: 0.68,
    wood: 1.02,
    stone: 1.42
  };
  const mining = { active: false, target: null, elapsed: 0 };

  function stopMining() {
    mining.active = false;
    mining.target = null;
    mining.elapsed = 0;
    miningBar.classList.remove('active');
    miningFill.style.width = '0%';
  }

  function startMining() {
    const hit = castBlock();
    if (!hit) return;
    mining.active = true;
    mining.target = hit.object;
    mining.elapsed = 0;
    miningBar.classList.add('active');
  }

  function updateMining(dt) {
    if (!mining.active) return;
    const hit = castBlock();
    if (!hit || hit.object !== mining.target || !blocks.has(key(mining.target.userData.x, mining.target.userData.y, mining.target.userData.z))) {
      stopMining();
      return;
    }
    const type = mining.target.userData.type || 'dirt';
    const required = breakTimes[type] ?? 0.7;
    mining.elapsed += dt;
    const progress = Math.min(1, mining.elapsed / required);
    miningFill.style.width = \\`${Math.round(progress * 100)}%\\`;
    statusEl.textContent = \\`${blockNames[type] || 'Blok'} kırılıyor %${Math.round(progress * 100)}\\`;
    if (progress >= 1) {
      removeBlock(mining.target);
      stopMining();
      statusEl.textContent = \\`${blockNames[type] || 'Blok'} kırıldı\\`;
      if (navigator.vibrate) navigator.vibrate(28);
    }
  }

  function blockOverlapsPlayer(blockPos) {
    const blockMinX = blockPos.x - 0.5;
    const blockMaxX = blockPos.x + 0.5;
    const blockMinY = blockPos.y - 0.5;
    const blockMaxY = blockPos.y + 0.5;
    const blockMinZ = blockPos.z - 0.5;
    const blockMaxZ = blockPos.z + 0.5;
    const playerMinX = player.position.x - player.radius;
    const playerMaxX = player.position.x + player.radius;
    const playerMinY = player.position.y;
    const playerMaxY = player.position.y + player.height;
    const playerMinZ = player.position.z - player.radius;
    const playerMaxZ = player.position.z + player.radius;
    const epsilon = 0.015;
    return blockMaxX > playerMinX + epsilon && blockMinX < playerMaxX - epsilon &&
      blockMaxY > playerMinY + epsilon && blockMinY < playerMaxY - epsilon &&
      blockMaxZ > playerMinZ + epsilon && blockMinZ < playerMaxZ - epsilon;
  }

  function placeBlock() {
    const hit = castBlock();
    if (!hit || !hit.face) return;
    const p = hit.object.position.clone().add(hit.face.normal);
    if (blockOverlapsPlayer(p)) {
      statusEl.textContent = 'Buraya blok koyamazsın';
      return;
    }
    const placed = addBlock(p.x, p.y, p.z, selectedBlock);
    if (placed) statusEl.textContent = \\`${blockNames[selectedBlock]} yerleştirildi\\`;
  }
`
  );

  html = replaceOnce(
    html,
    "  const blockNames = { grass: 'Çim', dirt: 'Toprak', stone: 'Taş', wood: 'Odun' };",
    "  const blockNames = { grass: 'Çim', dirt: 'Toprak', stone: 'Taş', wood: 'Odun', sand: 'Kum', leaves: 'Yaprak' };"
  );

  html = replaceOnce(
    html,
`  renderer.domElement.addEventListener('mousedown', e => {
    if (document.pointerLockElement !== renderer.domElement) return;
    if (e.button === 0) breakBlock();
    if (e.button === 2) placeBlock();
  });`,
`  renderer.domElement.addEventListener('mousedown', e => {
    if (document.pointerLockElement !== renderer.domElement) return;
    if (e.button === 0) startMining();
    if (e.button === 2) placeBlock();
  });
  window.addEventListener('mouseup', e => { if (e.button === 0) stopMining(); });`
  );

  html = replaceOnce(
    html,
`  function pressAction(element, fn) {
    element.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); fn();
      if (navigator.vibrate) navigator.vibrate(18);
    });
  }
  pressAction(breakBtn, breakBlock);
  pressAction(placeBtn, placeBlock);
  pressAction(jumpBtn, jump);`,
`  function pressAction(element, fn) {
    element.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); fn();
      if (navigator.vibrate) navigator.vibrate(18);
    });
  }
  breakBtn.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation();
    breakBtn.setPointerCapture?.(e.pointerId);
    startMining();
    if (navigator.vibrate) navigator.vibrate(12);
  });
  const endBreak = e => { e?.preventDefault?.(); stopMining(); };
  breakBtn.addEventListener('pointerup', endBreak);
  breakBtn.addEventListener('pointercancel', endBreak);
  breakBtn.addEventListener('lostpointercapture', endBreak);
  pressAction(placeBtn, placeBlock);
  pressAction(jumpBtn, jump);`
  );

  html = replaceOnce(
    html,
    '    if (gameStarted) updatePlayer(dt);',
    '    if (gameStarted) { updatePlayer(dt); updateMining(dt); }'
  );

  html = replaceOnce(
    html,
    '      moveInput.x = 0; moveInput.y = 0;\n    }',
    '      moveInput.x = 0; moveInput.y = 0;\n      stopMining();\n    }'
  );

  return html;
}

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith((async () => {
    const response = await fetch(event.request, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    const original = await response.text();
    const patched = patchHtml(original);
    const headers = new Headers(response.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('x-blok-dunyasi-version', VERSION);
    headers.delete('content-length');
    return new Response(patched, { status: response.status, statusText: response.statusText, headers });
  })());
});
