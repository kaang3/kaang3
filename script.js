import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
controls.getObject().position.set(15, 10, 15);

const clock = new THREE.Clock();
let velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let canJump = false;

const blokTipleri = [
  { renk: 0x66bb6a, ad: 'Çimen' },
  { renk: 0x8d6e63, ad: 'Toprak' },
  { renk: 0x9e9e9e, ad: 'Taş' },
];
let seciliBlok = 0;

const zeminGrup = new THREE.Group();
scene.add(zeminGrup);
const raycaster = new THREE.Raycaster();

const ambient = new THREE.HemisphereLight(0xffffff, 0x777777, 0.85);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(50, 80, 30);
scene.add(sun);

function blokOlustur(x, y, z, tip) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: tip.renk });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData.tip = tip;
  zeminGrup.add(mesh);
  return mesh;
}

function dunyaKur() {
  const boyut = 30;
  for (let x = 0; x < boyut; x++) {
    for (let z = 0; z < boyut; z++) {
      const yukseklik = 1 + Math.floor(Math.random() * 3);
      for (let y = 0; y < yukseklik; y++) {
        const tip = y === yukseklik - 1 ? blokTipleri[0] : blokTipleri[1];
        blokOlustur(x, y, z, tip);
      }
    }
  }
}

dunyaKur();

const gridHelper = new THREE.GridHelper(30, 30, 0x222222, 0x555555);
gridHelper.position.y = -0.5;
scene.add(gridHelper);

const hareket = { ileri: false, geri: false, sol: false, sag: false };

const overlay = document.getElementById('overlay');
const baslaBtn = document.getElementById('basla');
baslaBtn.addEventListener('click', () => {
  controls.lock();
});
controls.addEventListener('lock', () => {
  overlay.style.display = 'none';
});
controls.addEventListener('unlock', () => {
  overlay.style.display = 'flex';
});

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': hareket.ileri = true; break;
    case 'KeyS': hareket.geri = true; break;
    case 'KeyA': hareket.sol = true; break;
    case 'KeyD': hareket.sag = true; break;
    case 'Space':
      if (canJump) {
        velocity.y = 6;
        canJump = false;
      }
      break;
    case 'Digit1': seciliBlok = 0; guncelleSecim(); break;
    case 'Digit2': seciliBlok = 1; guncelleSecim(); break;
    case 'Digit3': seciliBlok = 2; guncelleSecim(); break;
    case 'KeyR': controls.getObject().position.set(15, 10, 15); velocity.set(0, 0, 0); break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': hareket.ileri = false; break;
    case 'KeyS': hareket.geri = false; break;
    case 'KeyA': hareket.sol = false; break;
    case 'KeyD': hareket.sag = false; break;
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function guncelleSecim() {
  document.querySelectorAll('#blokSecim span').forEach((el) => {
    el.classList.toggle('secili', Number(el.dataset.tip) === seciliBlok);
  });
}

document.querySelectorAll('#blokSecim span').forEach((el) => {
  el.addEventListener('click', () => {
    seciliBlok = Number(el.dataset.tip);
    guncelleSecim();
  });
});

document.addEventListener('pointerdown', (event) => {
  if (!controls.isLocked) return;
  const ekle = event.button === 2 || event.altKey;
  hedefIslem(ekle ? 'ekle' : 'sil');
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

function hedefIslem(islem) {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersects = raycaster.intersectObjects(zeminGrup.children);
  if (intersects.length === 0) return;

  const hedef = intersects[0];
  const pos = hedef.object.position.clone();

  if (islem === 'sil' && pos.y > 0) {
    zeminGrup.remove(hedef.object);
  } else if (islem === 'ekle') {
    const normal = hedef.face.normal.clone();
    const yeniPos = pos.add(normal);
    blokOlustur(yeniPos.x, yeniPos.y, yeniPos.z, blokTipleri[seciliBlok]);
  }
}

function update() {
  const delta = clock.getDelta();
  velocity.x -= velocity.x * 8.0 * delta;
  velocity.z -= velocity.z * 8.0 * delta;
  velocity.y -= 12 * delta; // yerçekimi

  direction.z = Number(hareket.ileri) - Number(hareket.geri);
  direction.x = Number(hareket.sag) - Number(hareket.sol);
  direction.normalize();

  if (hareket.ileri || hareket.geri) velocity.z -= direction.z * 30.0 * delta;
  if (hareket.sag || hareket.sol) velocity.x -= direction.x * 30.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  controls.getObject().position.y += velocity.y * delta;

  if (controls.getObject().position.y < 2) {
    velocity.y = 0;
    controls.getObject().position.y = 2;
    canJump = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

animate();
