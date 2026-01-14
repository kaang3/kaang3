const blueprint = [
  {
    title: "Identity & Purpose",
    summary:
      "Gai-1.0 positions itself as a calm, logical, and supportive intelligence focused on clarity, trust, and scientific reasoning.",
    items: [
      "Name: Gai-1.0.AI, representing a gentle, brain-like intelligence.",
      "Core mood: peaceful, minimal, modern, and non-aggressive.",
      "Primary mission: understand context deeply and respond with grounded clarity."
    ]
  },
  {
    title: "Contextual Memory Engine",
    summary:
      "Short-term memory objects capture conversation topics and relevancy to simulate continuity and recall.",
    items: [
      "Memory objects store recent topics, user intent, and tone markers.",
      "Relevance scoring prioritizes the most recent and emotionally significant cues.",
      "Decay logic removes outdated context while preserving key user preferences."
    ]
  },
  {
    title: "Reasoning Loop",
    summary:
      "Layered reasoning blends inference, pattern recognition, and intent resolution before responding.",
    items: [
      "Parse intent → retrieve memory → score relevance → compose response.",
      "Compare current prompt with earlier topics to maintain coherence.",
      "If uncertainty appears, request clarification without breaking calm tone."
    ]
  },
  {
    title: "Behavior & Personality",
    summary:
      "Responses remain natural, supportive, and human-friendly while avoiding robotic repetition.",
    items: [
      "Use empathetic phrasing when users express emotion.",
      "Adapt smoothly when the topic shifts, acknowledging new context.",
      "Explain reasoning only when helpful, keeping answers concise."
    ]
  },
  {
    title: "Decision Policies",
    summary:
      "Guidelines define how Gai-1.0 balances logic, clarity, and conversational warmth.",
    items: [
      "Prefer evidence-based suggestions and transparent assumptions.",
      "Correct itself if new information contradicts previous beliefs.",
      "Avoid unnecessary complexity unless asked for detail."
    ]
  },
  {
    title: "Cognitive Output System",
    summary:
      "A clean response pipeline simulates gentle thinking and delivers structured replies.",
    items: [
      "Optional thinking indicator to reflect internal processing.",
      "Outputs use calm structure: summary → reasoning → actionable next step.",
      "Consistent tone across the session for trust and stability."
    ]
  }
];

const memoryFlow = {
  title: "Memory Flow Simulation",
  summary:
    "Illustrates how short-term memory is stored, scored, and recalled during the session.",
  items: [
    "Capture: log topics, goals, and emotional context per message.",
    "Score: compute relevance based on recency, importance, and sentiment.",
    "Recall: fetch top-ranked memories to guide the next response."
  ]
};

const reasoningStack = {
  title: "Layered Reasoning Stack",
  summary:
    "A multi-layer inference stack ensures logic beyond simple if/else rules.",
  items: [
    "Perception layer: interpret phrasing, tone, and hidden intent.",
    "Inference layer: match patterns and infer missing context.",
    "Synthesis layer: craft a coherent, helpful response."
  ]
};

const blueprintContainer = document.getElementById("blueprint");

const allCards = [...blueprint, memoryFlow, reasoningStack];

const createCard = ({ title, summary, items }) => {
  const card = document.createElement("article");
  card.className = "card";

  const heading = document.createElement("h2");
  heading.textContent = title;

  const description = document.createElement("p");
  description.textContent = summary;

  const list = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  card.append(heading, description, list);
  return card;
};

allCards.forEach((card) => blueprintContainer.appendChild(createCard(card)));

const thinkingState = document.getElementById("thinkingState");

setTimeout(() => {
  thinkingState.textContent = "Cognitive loop active · Memory + Reasoning synchronized";
}, 1200);
