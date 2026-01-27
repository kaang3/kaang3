const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const miniMapCanvas = document.getElementById("miniMap");
const miniMapCtx = miniMapCanvas.getContext("2d");

const worldMapCanvas = document.getElementById("worldMap");
const worldMapCtx = worldMapCanvas.getContext("2d");

const ui = {
  hpBar: document.getElementById("hpBar"),
  energyBar: document.getElementById("energyBar"),
  levelValue: document.getElementById("levelValue"),
  xpValue: document.getElementById("xpValue"),
  creditsValue: document.getElementById("creditsValue"),
  scanValue: document.getElementById("scanValue"),
  questList: document.getElementById("questList"),
  biomeLabel: document.getElementById("biomeLabel"),
  threatLabel: document.getElementById("threatLabel"),
  weatherLabel: document.getElementById("weatherLabel"),
  dayLabel: document.getElementById("dayLabel"),
  timeLabel: document.getElementById("timeLabel"),
  contextHint: document.getElementById("contextHint"),
  inventoryGrid: document.getElementById("inventoryGrid"),
  craftList: document.getElementById("craftList"),
  logEntries: document.getElementById("logEntries"),
  mapLegend: document.getElementById("mapLegend"),
  pauseOverlay: document.getElementById("pauseOverlay"),
  helpOverlay: document.getElementById("helpOverlay"),
  inventoryPanel: document.getElementById("inventoryPanel"),
  mapPanel: document.getElementById("mapPanel"),
  craftPanel: document.getElementById("craftPanel")
};

const randomBetween = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const BIOMES = [
  { name: "Kristal Düzlüğü", color: "#6cf3ff", threat: "Düşük", weather: "Işık tozu" },
  { name: "Turbulans Kuşağı", color: "#ff9f68", threat: "Orta", weather: "Elektro fırtına" },
  { name: "Sis Kolonisi", color: "#b8b3ff", threat: "Orta", weather: "Plazma sisi" },
  { name: "Gölgeli Çöl", color: "#ff4d6d", threat: "Yüksek", weather: "Radyoaktif rüzgar" },
  { name: "Nebula Bahçesi", color: "#7cff6c", threat: "Değişken", weather: "Yıldız çiği" }
];

const WEAPONS = {
  pulse: { name: "Darbe Lazer", damage: 14, rate: 220, energy: 6, speed: 8 },
  arc: { name: "Ark Rayı", damage: 8, rate: 130, energy: 4, speed: 10 },
  nova: { name: "Nova Atışı", damage: 26, rate: 360, energy: 12, speed: 7 }
};

const CRAFT_RECIPES = [
  {
    id: "shield",
    name: "Enerji Kalkanı",
    desc: "Hasarı azaltan savunma modülü.",
    cost: { alloy: 6, crystal: 4 },
    reward: { type: "upgrade", key: "shield", value: 0.15 }
  },
  {
    id: "coolant",
    name: "Soğutma Çekirdeği",
    desc: "Enerji yenilenmesini hızlandırır.",
    cost: { alloy: 4, gas: 6 },
    reward: { type: "upgrade", key: "energyRegen", value: 0.35 }
  },
  {
    id: "thruster",
    name: "İtki Güçlendirici",
    desc: "Kaptanın hareket hızını artırır.",
    cost: { alloy: 5, crystal: 2 },
    reward: { type: "upgrade", key: "speed", value: 0.2 }
  },
  {
    id: "nova",
    name: "Nova Odaklayıcı",
    desc: "Nova atışı açılır.",
    cost: { alloy: 8, crystal: 6, data: 4 },
    reward: { type: "weapon", key: "nova" }
  }
];

const QUEST_POOL = [
  {
    id: "q1",
    title: "Sis Kolonisi'ni Tara",
    description: "Sis Kolonisi bölgesinde %60 tarama yap.",
    condition: (state) => state.scan.biomemap[2] >= 60,
    reward: { credits: 200, xp: 90 }
  },
  {
    id: "q2",
    title: "Turbulans Savunması",
    description: "Turbulans Kuşağı'nda 6 korsan etkisiz hale getir.",
    condition: (state) => state.stats.killsByBiome[1] >= 6,
    reward: { credits: 180, xp: 80 }
  },
  {
    id: "q3",
    title: "Kristal Çıkarma",
    description: "Toplam 12 kristal topla.",
    condition: (state) => state.inventory.crystal >= 12,
    reward: { credits: 150, xp: 70 }
  },
  {
    id: "q4",
    title: "Nebula Diplomasisi",
    description: "Nebula Bahçesi'nde bir araştırma cihazı kur.",
    condition: (state) => state.stats.beacons >= 1,
    reward: { credits: 240, xp: 110 }
  }
];

const WEATHER_STATES = [
  { label: "Sakin", drift: 0.2 },
  { label: "Işık Fırtınası", drift: 0.6 },
  { label: "Manyetik Dalga", drift: 0.4 },
  { label: "Yüksek Basınç", drift: 0.1 }
];

const BASE_SAVE = {
  player: {
    x: 1400,
    y: 1400,
    hp: 120,
    maxHp: 120,
    energy: 100,
    maxEnergy: 100,
    speed: 2.6,
    shield: 0,
    energyRegen: 1,
    level: 1,
    xp: 0,
    credits: 0,
    weapon: "pulse"
  },
  inventory: {
    alloy: 8,
    crystal: 4,
    gas: 3,
    data: 2
  },
  upgrades: {
    shield: 0,
    energyRegen: 1,
    speed: 1
  },
  scan: {
    total: 0,
    biomemap: [0, 0, 0, 0, 0]
  },
  stats: {
    day: 1,
    time: 6 * 60,
    killsByBiome: [0, 0, 0, 0, 0],
    beacons: 0
  },
  quests: [],
  log: []
};

class Player {
  constructor(state) {
    Object.assign(this, state.player);
    this.angle = 0;
    this.velocity = { x: 0, y: 0 };
    this.boost = 0;
  }

  get weaponData() {
    return WEAPONS[this.weapon];
  }

  update(delta, input, world, state) {
    const speedFactor = this.speed * state.upgrades.speed;
    const boostMultiplier = input.boost && this.energy > 5 ? 1.6 : 1;

    if (input.boost && this.energy > 5) {
      this.energy -= 12 * delta;
      this.boost = clamp(this.boost + 0.02, 0, 0.6);
    } else {
      this.boost = clamp(this.boost - 0.03, 0, 0.6);
    }

    const targetVelocity = {
      x: input.horizontal * speedFactor * boostMultiplier,
      y: input.vertical * speedFactor * boostMultiplier
    };

    this.velocity.x += (targetVelocity.x - this.velocity.x) * 0.15;
    this.velocity.y += (targetVelocity.y - this.velocity.y) * 0.15;

    const drift = world.weather.drift;
    this.x += (this.velocity.x + drift) * delta * 60;
    this.y += this.velocity.y * delta * 60;

    this.x = clamp(this.x, 40, world.width - 40);
    this.y = clamp(this.y, 40, world.height - 40);

    this.energy = clamp(this.energy + (0.6 * state.upgrades.energyRegen) * delta * 60, 0, this.maxEnergy);
  }

  takeDamage(amount) {
    const reduced = amount * (1 - this.shield);
    this.hp = clamp(this.hp - reduced, 0, this.maxHp);
  }

  isAlive() {
    return this.hp > 0;
  }
}

class Enemy {
  constructor(x, y, biomeIndex) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.speed = randomBetween(0.8, 1.8) + biomeIndex * 0.1;
    this.hp = 30 + biomeIndex * 12;
    this.maxHp = this.hp;
    this.biomeIndex = biomeIndex;
    this.cooldown = randomBetween(0.8, 1.4);
  }

  update(delta, player, projectiles) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);
    this.angle = Math.atan2(dy, dx);

    if (dist > 40) {
      this.x += Math.cos(this.angle) * this.speed * delta * 50;
      this.y += Math.sin(this.angle) * this.speed * delta * 50;
    }

    this.cooldown -= delta;
    if (this.cooldown <= 0 && dist < 420) {
      projectiles.push(new Projectile(this.x, this.y, this.angle, 4.2, 6, "enemy"));
      this.cooldown = randomBetween(1.2, 2.2);
    }
  }

  takeDamage(amount) {
    this.hp = clamp(this.hp - amount, 0, this.maxHp);
  }

  isAlive() {
    return this.hp > 0;
  }
}

class Projectile {
  constructor(x, y, angle, speed, damage, source) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.damage = damage;
    this.source = source;
    this.life = 3.5;
  }

  update(delta) {
    this.x += Math.cos(this.angle) * this.speed * delta * 60;
    this.y += Math.sin(this.angle) * this.speed * delta * 60;
    this.life -= delta;
  }

  isAlive() {
    return this.life > 0;
  }
}

class ResourceNode {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.amount = Math.floor(randomBetween(2, 6));
    this.scanValue = randomBetween(4, 10);
  }

  harvest(state) {
    if (this.amount <= 0) return null;
    this.amount -= 1;
    state.inventory[this.type] += 1;
    return this.type;
  }

  isDepleted() {
    return this.amount <= 0;
  }
}

class World {
  constructor() {
    this.width = 2800;
    this.height = 2800;
    this.cells = 7;
    this.cellSize = this.width / this.cells;
    this.weather = WEATHER_STATES[0];
    this.biomeMap = this.generateBiomes();
    this.resourceNodes = this.spawnResources();
  }

  generateBiomes() {
    const map = [];
    for (let y = 0; y < this.cells; y += 1) {
      const row = [];
      for (let x = 0; x < this.cells; x += 1) {
        const index = Math.floor(randomBetween(0, BIOMES.length));
        row.push(index);
      }
      map.push(row);
    }
    return map;
  }

  getBiomeIndex(x, y) {
    const cellX = clamp(Math.floor(x / this.cellSize), 0, this.cells - 1);
    const cellY = clamp(Math.floor(y / this.cellSize), 0, this.cells - 1);
    return this.biomeMap[cellY][cellX];
  }

  spawnResources() {
    const nodes = [];
    const types = ["alloy", "crystal", "gas", "data"];
    for (let i = 0; i < 60; i += 1) {
      nodes.push(
        new ResourceNode(
          randomBetween(120, this.width - 120),
          randomBetween(120, this.height - 120),
          types[Math.floor(randomBetween(0, types.length))]
        )
      );
    }
    return nodes;
  }

  updateWeather(dayTime) {
    if (dayTime % 360 === 0) {
      this.weather = WEATHER_STATES[Math.floor(randomBetween(0, WEATHER_STATES.length))];
    }
  }
}

class Game {
  constructor() {
    this.state = this.loadState();
    this.world = new World();
    this.player = new Player(this.state);
    this.enemies = [];
    this.projectiles = [];
    this.effects = [];
    this.input = {
      horizontal: 0,
      vertical: 0,
      boost: false,
      firing: false,
      interact: false,
      mouse: { x: canvas.width / 2, y: canvas.height / 2 }
    };
    this.lastFire = 0;
    this.paused = false;
    this.context = "";

    this.bindEvents();
    this.seedQuests();
    this.log("Uyanış: Kozmik Kaşif gemisi aktif.");
    this.loop(performance.now());
  }

  loadState() {
    const stored = localStorage.getItem("cosmicSave");
    if (!stored) return structuredClone(BASE_SAVE);
    const parsed = JSON.parse(stored);
    return {
      ...structuredClone(BASE_SAVE),
      ...parsed,
      player: { ...structuredClone(BASE_SAVE.player), ...parsed.player },
      inventory: { ...structuredClone(BASE_SAVE.inventory), ...parsed.inventory },
      upgrades: { ...structuredClone(BASE_SAVE.upgrades), ...parsed.upgrades },
      scan: { ...structuredClone(BASE_SAVE.scan), ...parsed.scan },
      stats: { ...structuredClone(BASE_SAVE.stats), ...parsed.stats }
    };
  }

  saveState() {
    const data = {
      ...this.state,
      player: {
        ...this.player,
        angle: undefined,
        velocity: undefined,
        boost: undefined
      }
    };
    localStorage.setItem("cosmicSave", JSON.stringify(data));
    this.log("Günlük kaydı güncellendi.");
  }

  resetState() {
    localStorage.removeItem("cosmicSave");
    this.state = structuredClone(BASE_SAVE);
    this.world = new World();
    this.player = new Player(this.state);
    this.enemies = [];
    this.projectiles = [];
    this.state.log = [];
    this.seedQuests();
    this.log("Yeni bir günlük başlatıldı.");
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.resizeCanvas();

    window.addEventListener("keydown", (event) => this.onKey(event, true));
    window.addEventListener("keyup", (event) => this.onKey(event, false));
    canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));
    canvas.addEventListener("mousedown", () => (this.input.firing = true));
    canvas.addEventListener("mouseup", () => (this.input.firing = false));

    document.getElementById("btnSave").addEventListener("click", () => this.saveState());
    document.getElementById("btnNewGame").addEventListener("click", () => this.resetState());
    document.getElementById("btnHelp").addEventListener("click", () => this.toggleHelp(true));
    document.getElementById("btnCloseHelp").addEventListener("click", () => this.toggleHelp(false));
    document.getElementById("btnResume").addEventListener("click", () => this.togglePause(false));
    document.getElementById("btnToggleMap").addEventListener("click", () => this.togglePanel("map"));
    document.getElementById("btnToggleInventory").addEventListener("click", () => this.togglePanel("inventory"));
    document.getElementById("btnToggleCraft").addEventListener("click", () => this.togglePanel("craft"));

    document.querySelectorAll(".close").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const key = event.currentTarget.dataset.close;
        this.togglePanel(key, false);
      });
    });
  }

  onKey(event, isDown) {
    if (event.key === "w" || event.key === "W") this.input.vertical = isDown ? -1 : this.input.vertical === -1 ? 0 : this.input.vertical;
    if (event.key === "s" || event.key === "S") this.input.vertical = isDown ? 1 : this.input.vertical === 1 ? 0 : this.input.vertical;
    if (event.key === "a" || event.key === "A") this.input.horizontal = isDown ? -1 : this.input.horizontal === -1 ? 0 : this.input.horizontal;
    if (event.key === "d" || event.key === "D") this.input.horizontal = isDown ? 1 : this.input.horizontal === 1 ? 0 : this.input.horizontal;
    if (event.key === " ") this.input.boost = isDown;

    if (isDown) {
      if (event.key === "Escape") this.togglePause(!this.paused);
      if (event.key === "i" || event.key === "I") this.togglePanel("inventory");
      if (event.key === "m" || event.key === "M") this.togglePanel("map");
      if (event.key === "c" || event.key === "C") this.togglePanel("craft");
      if (event.key === "e" || event.key === "E") this.input.interact = true;
    }

    if (!isDown && (event.key === "e" || event.key === "E")) this.input.interact = false;
  }

  onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    this.input.mouse.x = event.clientX - rect.left;
    this.input.mouse.y = event.clientY - rect.top;
  }

  resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
  }

  toggleHelp(show) {
    ui.helpOverlay.classList.toggle("active", show);
  }

  togglePause(show) {
    this.paused = show;
    ui.pauseOverlay.classList.toggle("active", show);
  }

  togglePanel(key, force) {
    const panelMap = {
      inventory: ui.inventoryPanel,
      map: ui.mapPanel,
      craft: ui.craftPanel
    };
    const panel = panelMap[key];
    if (!panel) return;
    const nextState = typeof force === "boolean" ? force : !panel.classList.contains("active");
    panel.classList.toggle("active", nextState);
  }

  seedQuests() {
    if (this.state.quests.length === 0) {
      this.state.quests = QUEST_POOL.slice(0, 3).map((quest) => ({ ...quest, complete: false }));
    }
  }

  log(message) {
    const stamp = `${this.state.stats.day}. gün ${this.formatTime(this.state.stats.time)}`;
    this.state.log.unshift({ message, stamp });
    this.state.log = this.state.log.slice(0, 18);
    this.renderLog();
  }

  spawnEnemies() {
    if (this.enemies.length > 12) return;
    if (Math.random() < 0.02) {
      const biomeIndex = this.world.getBiomeIndex(this.player.x, this.player.y);
      this.enemies.push(
        new Enemy(
          this.player.x + randomBetween(-420, 420),
          this.player.y + randomBetween(-420, 420),
          biomeIndex
        )
      );
    }
  }

  handleFiring(delta) {
    if (!this.input.firing) return;
    const weapon = this.player.weaponData;
    if (this.player.energy < weapon.energy) return;

    this.lastFire -= delta * 1000;
    if (this.lastFire > 0) return;

    const dx = this.input.mouse.x - canvas.width / (window.devicePixelRatio || 1) / 2;
    const dy = this.input.mouse.y - canvas.height / (window.devicePixelRatio || 1) / 2;
    const angle = Math.atan2(dy, dx);
    this.projectiles.push(new Projectile(this.player.x, this.player.y, angle, weapon.speed, weapon.damage, "player"));
    this.player.energy -= weapon.energy;
    this.lastFire = weapon.rate;
  }

  update(delta) {
    if (this.paused) return;

    this.state.stats.time += delta * 60;
    if (this.state.stats.time >= 24 * 60) {
      this.state.stats.time = 0;
      this.state.stats.day += 1;
      this.log("Yeni bir gün doğdu. Günlük verileri tazelendi.");
    }

    this.world.updateWeather(Math.floor(this.state.stats.time));
    this.player.update(delta, this.input, this.world, this.state);
    this.spawnEnemies();
    this.handleFiring(delta);

    this.enemies.forEach((enemy) => enemy.update(delta, this.player, this.projectiles));
    this.projectiles.forEach((projectile) => projectile.update(delta));

    this.resolveCombat();
    this.handleResources();
    this.updateScan();
    this.updateQuests();
    this.renderUI();
  }

  resolveCombat() {
    this.projectiles.forEach((projectile) => {
      if (!projectile.isAlive()) return;
      if (projectile.source === "player") {
        this.enemies.forEach((enemy) => {
          if (!enemy.isAlive()) return;
          if (distance(projectile, enemy) < 26) {
            enemy.takeDamage(projectile.damage);
            projectile.life = 0;
            if (!enemy.isAlive()) {
              const biomeIndex = enemy.biomeIndex;
              this.state.stats.killsByBiome[biomeIndex] += 1;
              this.state.player.xp += 12 + biomeIndex * 4;
              this.state.player.credits += 8 + biomeIndex * 4;
              this.log(`Düşman etkisiz. ${BIOMES[biomeIndex].name} güvenliği arttı.`);
              if (Math.random() < 0.4) {
                const lootType = ["alloy", "crystal", "gas", "data"][Math.floor(randomBetween(0, 4))];
                this.state.inventory[lootType] += 1;
                this.log(`Enkazdan ${lootType} toplandı.`);
              }
            }
          }
        });
      } else {
        if (distance(projectile, this.player) < 26) {
          this.player.takeDamage(projectile.damage);
          projectile.life = 0;
        }
      }
    });

    this.enemies = this.enemies.filter((enemy) => enemy.isAlive());
    this.projectiles = this.projectiles.filter((projectile) => projectile.isAlive());

    if (!this.player.isAlive()) {
      this.player.hp = this.player.maxHp;
      this.player.energy = this.player.maxEnergy;
      this.state.player.credits = Math.max(0, this.state.player.credits - 120);
      this.log("Kritik hasar! Acil teleport ile geri çekildin.");
    }

    if (this.state.player.xp >= this.player.level * 120) {
      this.state.player.xp -= this.player.level * 120;
      this.player.level += 1;
      this.player.maxHp += 12;
      this.player.hp = this.player.maxHp;
      this.player.maxEnergy += 8;
      this.player.energy = this.player.maxEnergy;
      this.log(`Seviye atladın! Yeni seviye: ${this.player.level}.`);
    }
  }

  handleResources() {
    const nearby = this.world.resourceNodes.find((node) => distance(node, this.player) < 40);
    if (nearby && this.input.interact) {
      const harvested = nearby.harvest(this.state);
      if (harvested) {
        this.log(`Kaynak toplandı: ${harvested}.`);
        this.state.scan.total += nearby.scanValue;
      }
      this.input.interact = false;
    }
    this.world.resourceNodes = this.world.resourceNodes.filter((node) => !node.isDepleted());
  }

  updateScan() {
    const biomeIndex = this.world.getBiomeIndex(this.player.x, this.player.y);
    const scanBoost = 0.01 + biomeIndex * 0.003;
    this.state.scan.biomemap[biomeIndex] = clamp(
      this.state.scan.biomemap[biomeIndex] + scanBoost,
      0,
      100
    );
    const total = this.state.scan.biomemap.reduce((sum, value) => sum + value, 0) / BIOMES.length;
    this.state.scan.total = clamp(total, 0, 100);
  }

  updateQuests() {
    this.state.quests.forEach((quest) => {
      if (!quest.complete && quest.condition(this.state)) {
        quest.complete = true;
        this.state.player.credits += quest.reward.credits;
        this.state.player.xp += quest.reward.xp;
        this.log(`Görev tamamlandı: ${quest.title}`);
      }
    });
  }

  renderUI() {
    ui.hpBar.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    ui.energyBar.style.width = `${(this.player.energy / this.player.maxEnergy) * 100}%`;
    ui.levelValue.textContent = this.player.level;
    ui.xpValue.textContent = Math.floor(this.state.player.xp);
    ui.creditsValue.textContent = Math.floor(this.state.player.credits);
    ui.scanValue.textContent = `${Math.floor(this.state.scan.total)}%`;

    const biomeIndex = this.world.getBiomeIndex(this.player.x, this.player.y);
    const biome = BIOMES[biomeIndex];
    ui.biomeLabel.textContent = biome.name;
    ui.threatLabel.textContent = biome.threat;
    ui.weatherLabel.textContent = this.world.weather.label;
    ui.dayLabel.textContent = this.state.stats.day;
    ui.timeLabel.textContent = this.formatTime(this.state.stats.time);

    ui.contextHint.textContent = this.context || "Kaynak toplamak için E'ye bas.";

    ui.questList.innerHTML = "";
    this.state.quests.forEach((quest) => {
      const li = document.createElement("li");
      li.textContent = `${quest.complete ? "✅" : "🛰️"} ${quest.title}`;
      ui.questList.appendChild(li);
    });

    ui.inventoryGrid.innerHTML = "";
    Object.entries(this.state.inventory).forEach(([key, value]) => {
      const div = document.createElement("div");
      div.className = "slot";
      div.innerHTML = `<strong>${key}</strong><span>${value} birim</span>`;
      ui.inventoryGrid.appendChild(div);
    });

    ui.craftList.innerHTML = "";
    CRAFT_RECIPES.forEach((recipe) => {
      const div = document.createElement("div");
      div.className = "craft-item";
      const cost = Object.entries(recipe.cost)
        .map(([item, value]) => `${item}: ${value}`)
        .join(", ");
      div.innerHTML = `
        <strong>${recipe.name}</strong>
        <span>${recipe.desc}</span>
        <span>Gereken: ${cost}</span>
      `;
      const button = document.createElement("button");
      button.textContent = "Üret";
      button.addEventListener("click", () => this.craft(recipe));
      div.appendChild(button);
      ui.craftList.appendChild(div);
    });

    this.renderMiniMap();
    this.renderWorldMap();
  }

  renderMiniMap() {
    miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    const scaleX = miniMapCanvas.width / this.world.width;
    const scaleY = miniMapCanvas.height / this.world.height;

    miniMapCtx.fillStyle = "rgba(10, 15, 26, 0.9)";
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

    this.world.resourceNodes.forEach((node) => {
      miniMapCtx.fillStyle = "rgba(255,255,255,0.4)";
      miniMapCtx.fillRect(node.x * scaleX, node.y * scaleY, 2, 2);
    });

    miniMapCtx.fillStyle = "#6cf3ff";
    miniMapCtx.beginPath();
    miniMapCtx.arc(this.player.x * scaleX, this.player.y * scaleY, 3, 0, Math.PI * 2);
    miniMapCtx.fill();
  }

  renderWorldMap() {
    worldMapCtx.clearRect(0, 0, worldMapCanvas.width, worldMapCanvas.height);
    const cellW = worldMapCanvas.width / this.world.cells;
    const cellH = worldMapCanvas.height / this.world.cells;

    for (let y = 0; y < this.world.cells; y += 1) {
      for (let x = 0; x < this.world.cells; x += 1) {
        const index = this.world.biomeMap[y][x];
        worldMapCtx.fillStyle = BIOMES[index].color;
        worldMapCtx.globalAlpha = 0.4;
        worldMapCtx.fillRect(x * cellW, y * cellH, cellW, cellH);
        worldMapCtx.globalAlpha = 1;

        const scanValue = this.state.scan.biomemap[index];
        worldMapCtx.fillStyle = "rgba(255,255,255,0.15)";
        worldMapCtx.fillRect(x * cellW, y * cellH, cellW, cellH);
        worldMapCtx.fillStyle = "rgba(0,0,0,0.4)";
        worldMapCtx.fillText(`${Math.floor(scanValue)}%`, x * cellW + 6, y * cellH + 14);
      }
    }

    const playerX = (this.player.x / this.world.width) * worldMapCanvas.width;
    const playerY = (this.player.y / this.world.height) * worldMapCanvas.height;
    worldMapCtx.fillStyle = "#ffffff";
    worldMapCtx.beginPath();
    worldMapCtx.arc(playerX, playerY, 6, 0, Math.PI * 2);
    worldMapCtx.fill();

    ui.mapLegend.innerHTML = "";
    BIOMES.forEach((biome) => {
      const item = document.createElement("span");
      item.innerHTML = `<span class="legend-color" style="background:${biome.color}"></span>${biome.name}`;
      ui.mapLegend.appendChild(item);
    });
  }

  craft(recipe) {
    const hasItems = Object.entries(recipe.cost).every(
      ([item, value]) => this.state.inventory[item] >= value
    );

    if (!hasItems) {
      this.context = "Kaynaklar yetersiz. Daha fazla keşif yap.";
      return;
    }

    Object.entries(recipe.cost).forEach(([item, value]) => {
      this.state.inventory[item] -= value;
    });

    if (recipe.reward.type === "upgrade") {
      this.state.upgrades[recipe.reward.key] += recipe.reward.value;
      if (recipe.reward.key === "shield") {
        this.player.shield = clamp(this.player.shield + recipe.reward.value, 0, 0.6);
      }
      this.log(`${recipe.name} aktif edildi.`);
    }

    if (recipe.reward.type === "weapon") {
      this.player.weapon = recipe.reward.key;
      this.log(`${recipe.name} silahı devreye alındı.`);
    }
  }

  renderLog() {
    ui.logEntries.innerHTML = "";
    this.state.log.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "log-entry";
      div.innerHTML = `<strong>${entry.stamp}</strong><p>${entry.message}</p>`;
      ui.logEntries.appendChild(div);
    });
  }

  formatTime(minutes) {
    const hour = Math.floor(minutes / 60);
    const min = Math.floor(minutes % 60);
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  }

  drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    const step = 120;
    for (let x = 0; x < this.world.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.world.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.world.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.world.width, y);
      ctx.stroke();
    }
  }

  draw() {
    const ratio = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const view = {
      x: clamp(this.player.x - canvas.width / ratio / 2, 0, this.world.width - canvas.width / ratio),
      y: clamp(this.player.y - canvas.height / ratio / 2, 0, this.world.height - canvas.height / ratio)
    };

    ctx.translate(-view.x, -view.y);

    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, this.world.width, this.world.height);

    this.drawGrid();

    this.world.resourceNodes.forEach((node) => {
      ctx.fillStyle = "rgba(108,243,255,0.7)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    this.enemies.forEach((enemy) => {
      ctx.fillStyle = "rgba(255,77,109,0.9)";
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.stroke();
    });

    this.projectiles.forEach((projectile) => {
      ctx.strokeStyle = projectile.source === "player" ? "#6cf3ff" : "#ff4d6d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.x, projectile.y);
      ctx.lineTo(
        projectile.x - Math.cos(projectile.angle) * 14,
        projectile.y - Math.sin(projectile.angle) * 14
      );
      ctx.stroke();
    });

    const angle = Math.atan2(
      this.input.mouse.y - canvas.height / ratio / 2,
      this.input.mouse.x - canvas.width / ratio / 2
    );
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 14);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.update(delta);
    this.draw();

    requestAnimationFrame((time) => this.loop(time));
  }
}

const game = new Game();

setInterval(() => {
  game.saveState();
}, 60000);
