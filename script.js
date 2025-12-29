import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const startButton = document.getElementById('startButton');
const speedValue = document.getElementById('speedValue');
const distanceValue = document.getElementById('distanceValue');
const statusValue = document.getElementById('statusValue');
const nitroBar = document.getElementById('nitroBar');
const healthBar = document.getElementById('healthBar');
const toast = document.getElementById('toast');
const hint = document.getElementById('hint');

const controls = {
  left: false,
  right: false,
  accel: false,
  brake: false,
  boost: false,
};

const state = {
  started: false,
  speed: 0,
  distance: 0,
  nitro: 1,
  health: 1,
  streak: 0,
  message: 'Hazır',
};

const params = {
  accel: 14,
  brake: 22,
  friction: 8,
  maxSpeed: 48,
  steer: 9,
  boostForce: 32,
  nitroDrain: 0.55,
  nitroRegen: 0.18,
};

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070d, 18, 160);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 6.5, -9);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
let lastDelta = 0;

// Lighting
const ambient = new THREE.AmbientLight(0x7dbdff, 0.45);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0x79e2ff, 0x0b0f1a, 0.35);
scene.add(hemi);

const chaseLight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 6, 0.35, 1);
chaseLight.position.set(0, 4, -5);
chaseLight.target.position.set(0, 0, 10);
scene.add(chaseLight);
scene.add(chaseLight.target);

// Road pieces for infinite scroll
const roadSegments = [];
const roadLength = 120;
for (let i = 0; i < 3; i++) {
  const geo = new THREE.PlaneGeometry(14, roadLength, 1, 20);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0f121c,
    metalness: 0.3,
    roughness: 0.92,
    emissive: 0x060911,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.z = i * roadLength;
  mesh.receiveShadow = true;
  scene.add(mesh);
  roadSegments.push(mesh);
}

// Lane markers
const laneGroup = new THREE.Group();
scene.add(laneGroup);
function buildLaneMarkers() {
  const stripeGeo = new THREE.BoxGeometry(0.22, 0.02, 3.4);
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0x7de4ff });
  for (let i = 0; i < 40; i++) {
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.02, i * 6);
    laneGroup.add(stripe);
  }
}
buildLaneMarkers();

// Guard rails with neon
const railGroup = new THREE.Group();
scene.add(railGroup);
function buildRails() {
  const railGeo = new THREE.BoxGeometry(0.3, 0.6, 10);
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x101421,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x121c3a,
  });
  for (let i = 0; i < 30; i++) {
    const left = new THREE.Mesh(railGeo, railMat);
    left.position.set(-7.6, 0.35, i * 12);
    const right = left.clone();
    right.position.x = 7.6;

    const glowGeo = new THREE.BoxGeometry(0.12, 0.2, 10);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x6cf0ff, transparent: true, opacity: 0.9 });
    const glowLeft = new THREE.Mesh(glowGeo, glowMat);
    glowLeft.position.set(-7.25, 0.7, i * 12);
    const glowRight = glowLeft.clone();
    glowRight.position.x = 7.25;

    railGroup.add(left, right, glowLeft, glowRight);
  }
}
buildRails();

// Neon pylons
const pylons = [];
function buildPylons() {
  const geo = new THREE.CylinderGeometry(0.2, 0.2, 4, 12);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x131c2d,
    metalness: 0.8,
    roughness: 0.25,
    emissive: 0x0b1533,
  });
  for (let i = 0; i < 32; i++) {
    const p1 = new THREE.Mesh(geo, mat);
    p1.position.set(-9.5, 2, i * 10 + 6);
    const p2 = p1.clone();
    p2.position.x = 9.5;
    pylons.push(p1, p2);
    scene.add(p1, p2);

    const light = new THREE.PointLight(0xff3a8c, 1.3, 18, 2);
    light.position.set(-9.5, 3.2, i * 10 + 6);
    const light2 = light.clone();
    light2.position.x = 9.5;
    scene.add(light, light2);
  }
}
buildPylons();

// Car build
function createCar() {
  const car = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(2, 0.7, 3.6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff3a8c,
    metalness: 0.8,
    roughness: 0.35,
    emissive: 0x5c102e,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.6;
  car.add(body);

  const cabinGeo = new THREE.BoxGeometry(1.4, 0.6, 1.6);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x10192b,
    metalness: 0.8,
    roughness: 0.15,
    emissive: 0x0f2c4a,
    transparent: true,
    opacity: 0.94,
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1, 0);
  car.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0c0f18, metalness: 0.6, roughness: 0.2, emissive: 0x080b11 });
  const wheelPositions = [
    [-0.9, 0.35, 1.3],
    [0.9, 0.35, 1.3],
    [-0.9, 0.35, -1.3],
    [0.9, 0.35, -1.3],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  const glowGeo = new THREE.PlaneGeometry(2.4, 4.2);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x6cf0ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.01;
  car.add(glow);

  const exhaustGeo = new THREE.ConeGeometry(0.12, 0.5, 14);
  const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x6cf0ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.rotation.x = Math.PI;
  exhaust.position.set(0, 0.55, -1.9);
  car.add(exhaust);

  const headLight = new THREE.SpotLight(0x6cf0ff, 12, 40, Math.PI / 5, 0.3, 2);
  headLight.position.set(0, 1.6, 1.6);
  headLight.target.position.set(0, 0.6, 6);
  car.add(headLight);
  car.add(headLight.target);

  return car;
}

const car = createCar();
scene.add(car);

// Speed particles
const speedCount = 500;
const speedGeo = new THREE.BufferGeometry();
const positions = new Float32Array(speedCount * 3);
for (let i = 0; i < speedCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
  positions[i * 3 + 1] = Math.random() * 6 + 1;
  positions[i * 3 + 2] = Math.random() * 160;
}
speedGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const speedMat = new THREE.PointsMaterial({ color: 0x6cf0ff, size: 0.08, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
const speedParticles = new THREE.Points(speedGeo, speedMat);
scene.add(speedParticles);

// Obstacles
const obstacles = [];
function createObstacle(zOffset) {
  const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const mat = new THREE.MeshStandardMaterial({ color: 0x27324d, metalness: 0.6, roughness: 0.32, emissive: 0x1c2440 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set((Math.random() - 0.5) * 10, 0.65, zOffset);
  const light = new THREE.PointLight(0xff7a63, 1.2, 12, 2);
  light.position.set(mesh.position.x, 1.4, zOffset);
  scene.add(mesh, light);
  return { mesh, light };
}

for (let i = 0; i < 14; i++) {
  obstacles.push(createObstacle(20 + i * 14));
}

// Speed streak ring for boosts
const ringGeo = new THREE.RingGeometry(0.4, 0.7, 32);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x6cf0ff, transparent: true, opacity: 0.0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI / 2;
scene.add(ring);

// UI helpers
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}

function updateHUD() {
  speedValue.textContent = Math.round(state.speed * 3.2);
  distanceValue.textContent = Math.round(state.distance);
  statusValue.textContent = state.message;
  nitroBar.style.width = `${Math.max(0, Math.min(1, state.nitro)) * 100}%`;
  healthBar.style.width = `${Math.max(0, Math.min(1, state.health)) * 100}%`;
}

function resetGame() {
  state.speed = 0;
  state.distance = 0;
  state.nitro = 1;
  state.health = 1;
  state.started = false;
  state.streak = 0;
  state.message = 'Hazır';
  hint.textContent = 'Fren: alt';
  car.position.set(0, 0, 0);
  obstacles.forEach((o, idx) => {
    const z = 18 + idx * 12;
    o.mesh.position.set((Math.random() - 0.5) * 9, 0.65, z);
    o.light.position.set(o.mesh.position.x, 1.4, z);
  });
  ring.material.opacity = 0;
  showToast('Hazır. Gazla!');
  updateHUD();
}

function startGame() {
  if (state.health <= 0) {
    resetGame();
  }
  if (!state.started) {
    state.started = true;
    state.message = 'Yolda';
    showToast('Nitro hazır! ⚡');
  }
}

startButton.addEventListener('click', startGame);

// Control bindings
function bindControl(id, key) {
  const btn = document.getElementById(id);
  const set = (pressed) => {
    controls[key] = pressed;
    btn.classList.toggle('active', pressed);
  };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); set(true); });
  btn.addEventListener('pointerup', (e) => { e.preventDefault(); set(false); });
  btn.addEventListener('pointerleave', () => set(false));
  btn.addEventListener('pointercancel', () => set(false));
}

bindControl('leftBtn', 'left');
bindControl('rightBtn', 'right');
bindControl('accelBtn', 'accel');
bindControl('brakeBtn', 'brake');
bindControl('boostBtn', 'boost');

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') controls.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') controls.right = true;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') controls.accel = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') controls.brake = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') controls.boost = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') controls.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') controls.right = false;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') controls.accel = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') controls.brake = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') controls.boost = false;
});

function moveRoad(delta) {
  roadSegments.forEach((seg) => {
    if (seg.position.z + roadLength < car.position.z - 20) {
      seg.position.z += roadLength * roadSegments.length;
    }
  });
  laneGroup.position.z = -((car.position.z * 0.3) % 6);
  railGroup.position.z = -((car.position.z * 0.5) % 12);
  pylons.forEach((pylon) => {
    if (pylon.position.z + 12 < car.position.z - 10) {
      pylon.position.z += 12 * 32;
    }
  });
}

function moveSpeedLines(delta) {
  const pos = speedGeo.attributes.position.array;
  for (let i = 0; i < speedCount; i++) {
    const idx = i * 3 + 2;
    pos[idx] -= (state.speed + 5) * delta * 6;
    if (pos[idx] < car.position.z - 10) {
      pos[idx] = car.position.z + 160;
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6 + 1;
    }
  }
  speedGeo.attributes.position.needsUpdate = true;
}

function updateObstacles(delta) {
  const carBox = new THREE.Box3().setFromObject(car);
  obstacles.forEach((obj) => {
    obj.light.position.set(obj.mesh.position.x, 1.4, obj.mesh.position.z + 0.6);
    if (obj.mesh.position.z < car.position.z - 10) {
      obj.mesh.position.z = car.position.z + 120 + Math.random() * 40;
      obj.mesh.position.x = (Math.random() - 0.5) * 8.5;
      obj.light.position.set(obj.mesh.position.x, 1.4, obj.mesh.position.z + 0.6);
    }

    const obsBox = new THREE.Box3().setFromObject(obj.mesh);
    if (carBox.intersectsBox(obsBox) && state.health > 0) {
      state.health = Math.max(0, state.health - 0.12);
      state.speed = Math.max(0, state.speed * 0.6);
      hint.textContent = 'Çarpışma! Enerji düşüyor';
      state.message = 'Çarpışma';
      showToast('⚡ Kıvılcım etkisi!');
      obj.mesh.material.emissive.setHex(0xff3a8c);
      setTimeout(() => obj.mesh.material.emissive.setHex(0x1c2440), 350);

      if (state.health <= 0.02) {
        state.started = false;
        state.message = 'Durdu';
        showToast('Enerji bitti! Tekrar başlat.');
      }
    }
  });
}

function applyControls(delta) {
  if (!state.started) {
    state.speed = Math.max(0, state.speed - params.friction * delta * 1.6);
    state.message = 'Hazır';
    return;
  }

  if (controls.accel) state.speed += params.accel * delta;
  else state.speed -= params.friction * delta;

  if (controls.brake) state.speed -= params.brake * delta;

  if (controls.boost && state.nitro > 0.05) {
    state.speed += params.boostForce * delta;
    state.nitro = Math.max(0, state.nitro - params.nitroDrain * delta);
    ring.material.opacity = 0.6;
    ring.scale.setScalar(1 + Math.sin(clock.elapsedTime * 10) * 0.1);
  } else {
    state.nitro = Math.min(1, state.nitro + params.nitroRegen * delta);
    ring.material.opacity = Math.max(0, ring.material.opacity - delta);
  }

  state.speed = Math.max(0, Math.min(params.maxSpeed, state.speed));

  const steerInput = (controls.left ? -1 : 0) + (controls.right ? 1 : 0);
  car.position.x += steerInput * params.steer * delta * (0.6 + state.speed / params.maxSpeed);
  car.position.x = THREE.MathUtils.clamp(car.position.x, -5.8, 5.8);
  car.rotation.z = THREE.MathUtils.lerp(car.rotation.z, -steerInput * 0.25, 0.12);
  car.rotation.x = THREE.MathUtils.lerp(car.rotation.x, state.speed > 26 ? 0.03 : 0, 0.06);

  car.position.z += state.speed * delta;
  ring.position.set(car.position.x, 0.25, car.position.z + 1.8);

  state.distance += state.speed * delta * 1.2;
  state.message = state.speed > 25 ? 'Hyper' : state.speed > 5 ? 'Cruise' : 'Yavaş';
}

function updateCamera(delta) {
  const target = new THREE.Vector3(car.position.x * 0.6, 4.6, car.position.z - 8.5);
  camera.position.lerp(target, 0.08);
  const lookAt = new THREE.Vector3(car.position.x, 0.9, car.position.z + 6);
  camera.lookAt(lookAt);
  chaseLight.position.lerp(new THREE.Vector3(car.position.x, 4, car.position.z - 5), 0.1);
  chaseLight.target.position.lerp(new THREE.Vector3(car.position.x, 0.6, car.position.z + 6), 0.1);
}

function animate() {
  const delta = Math.min(0.05, clock.getDelta());
  lastDelta = delta;

  applyControls(delta);
  moveRoad(delta);
  moveSpeedLines(delta);
  updateObstacles(delta);
  updateCamera(delta);
  updateHUD();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

resetGame();
animate();
