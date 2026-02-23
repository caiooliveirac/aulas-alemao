import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONTENT DATABASE ───────────────────────────────────────────────────────
const LESSONS = [
  {
    id: "alltag-01",
    title: "Ein neuer Mitbewohner",
    topic: "Alltag",
    level: "B1",
    grammarFocus: "Wechselpräpositionen (Akkusativ/Dativ)",
    lexicalFocus: "Wohnung, Möbel, Umzug",
    estimatedMinutes: 10,
    xpReward: 120,
    steps: [
      {
        type: "text",
        content: "Lukas zieht heute in eine neue Wohngemeinschaft. Er stellt seine Kisten auf den Boden im Flur.",
        glossary: [
          { word: "Wohngemeinschaft", de: "wenn mehrere Personen zusammen in einer Wohnung leben", pt: "república / moradia compartilhada" },
          { word: "Kisten", de: "große Boxen, in die man Sachen packt", pt: "caixas" },
          { word: "Flur", de: "der Gang in einer Wohnung zwischen den Zimmern", pt: "corredor" },
        ],
      },
      {
        type: "text",
        content: "Seine neue Mitbewohnerin heißt Anna. Sie zeigt ihm die Küche und sagt: „Du kannst deine Sachen in den Schrank stellen."",
        glossary: [
          { word: "Mitbewohnerin", de: "eine Person, die mit dir zusammen wohnt", pt: "colega de apartamento" },
          { word: "Schrank", de: "ein Möbelstück mit Türen, wo man Sachen aufbewahrt", pt: "armário" },
        ],
      },
      {
        type: "comprehension",
        question: "Wohin stellt Lukas seine Kisten?",
        options: ["In die Küche", "Auf den Boden im Flur", "In sein Zimmer", "Auf den Tisch"],
        correct: 1,
        explanation: "Im Text steht: „Er stellt seine Kisten auf den Boden im Flur." — Wohin? → Akkusativ (auf den Boden).",
      },
      {
        type: "text",
        content: "Lukas geht in sein Zimmer. Das Bett steht schon an der Wand. Er legt seinen Laptop auf den Schreibtisch und hängt ein Poster an die Wand über dem Bett.",
        glossary: [
          { word: "Wand", de: "die vertikale Fläche in einem Zimmer", pt: "parede" },
          { word: "Schreibtisch", de: "ein Tisch, an dem man arbeitet oder lernt", pt: "escrivaninha" },
        ],
      },
      {
        type: "cloze",
        instruction: "Wechselpräpositionen: Wohin? → Akkusativ / Wo? → Dativ",
        sentence: "Das Bett steht schon an {___} Wand.",
        options: ["der", "die", "dem", "den"],
        correct: "der",
        explanation: "Wo steht das Bett? → Dativ! Die Wand (feminin) → an DER Wand.",
        srsCard: { front: "Das Bett steht an ___ Wand. (Wo? feminin)", back: "der (Dativ feminin)", type: "cloze" },
      },
      {
        type: "cloze",
        instruction: "Wohin legt er den Laptop?",
        sentence: "Er legt seinen Laptop auf {___} Schreibtisch.",
        options: ["dem", "den", "der", "das"],
        correct: "den",
        explanation: "Wohin? → Akkusativ! Der Schreibtisch (maskulin) → auf DEN Schreibtisch.",
        srsCard: { front: "Er legt den Laptop auf ___ Schreibtisch. (Wohin? maskulin)", back: "den (Akkusativ maskulin)", type: "cloze" },
      },
      {
        type: "reorder",
        instruction: "Ordne den Satz richtig:",
        words: ["er", "ein Poster", "hängt", "an die Wand"],
        correct: "Er hängt ein Poster an die Wand",
        hint: "Verb auf Position 2!",
        srsCard: { front: "Ordne: er / ein Poster / hängt / an die Wand", back: "Er hängt ein Poster an die Wand.", type: "reorder" },
      },
      {
        type: "text",
        content: "Am Abend sitzen Lukas und Anna in der Küche. Sie trinken Tee und sprechen über die Hausregeln. Anna sagt: „Bitte stell deine Schuhe nicht vor die Tür, sondern in den Schuhschrank."",
        glossary: [
          { word: "Hausregeln", de: "Regeln, die für alle in der Wohnung gelten", pt: "regras da casa" },
          { word: "Schuhschrank", de: "ein kleiner Schrank nur für Schuhe", pt: "sapateira" },
        ],
      },
      {
        type: "comprehension",
        question: "Was soll Lukas mit seinen Schuhen machen?",
        options: [
          "Sie vor die Tür stellen",
          "Sie in den Schuhschrank stellen",
          "Sie in sein Zimmer bringen",
          "Sie auf den Boden legen",
        ],
        correct: 1,
        explanation: "Anna sagt: „…sondern in den Schuhschrank." — Wohin? → Akkusativ.",
      },
      {
        type: "cloze",
        instruction: "Wo sitzen sie am Abend?",
        sentence: "Am Abend sitzen Lukas und Anna in {___} Küche.",
        options: ["die", "der", "dem", "den"],
        correct: "der",
        explanation: "Wo? → Dativ! Die Küche (feminin) → in DER Küche.",
        srsCard: { front: "Sie sitzen in ___ Küche. (Wo? feminin)", back: "der (Dativ feminin)", type: "cloze" },
      },
      {
        type: "guided_write",
        instruction: "Beschreib dein Zimmer mit 1-2 Sätzen. Benutze Wechselpräpositionen!",
        starters: ["In meinem Zimmer steht...", "Mein Bett steht an...", "Auf dem Schreibtisch liegt..."],
        keywords: ["steht", "liegt", "hängt", "an der Wand", "auf dem", "neben dem"],
        exampleAnswer: "In meinem Zimmer steht das Bett an der Wand. Auf dem Schreibtisch liegt mein Laptop.",
      },
    ],
  },
  {
    id: "reisen-01",
    title: "Am Bahnhof in Bern",
    topic: "Reisen",
    level: "B1",
    grammarFocus: "Nebensätze mit weil, obwohl, dass",
    lexicalFocus: "Reisen, Bahnhof, Verkehr",
    estimatedMinutes: 12,
    xpReward: 140,
    steps: [
      {
        type: "text",
        content: "Maria steht am Bahnhof in Bern. Ihr Zug hat Verspätung, weil es auf der Strecke ein Problem gibt.",
        glossary: [
          { word: "Verspätung", de: "wenn etwas später kommt als geplant", pt: "atraso" },
          { word: "Strecke", de: "der Weg, den der Zug fährt", pt: "trecho / trajeto" },
        ],
      },
      {
        type: "text",
        content: "Sie ist ein bisschen nervös, weil sie einen wichtigen Termin in Zürich hat. Obwohl sie früh losgefahren ist, wird sie wahrscheinlich zu spät kommen.",
        glossary: [
          { word: "Termin", de: "ein geplantes Treffen zu einer bestimmten Zeit", pt: "compromisso" },
          { word: "losgefahren", de: "Partizip II von 'losfahren' — die Reise beginnen", pt: "partiu (saiu de viagem)" },
          { word: "wahrscheinlich", de: "es ist sehr möglich, dass es passiert", pt: "provavelmente" },
        ],
      },
      {
        type: "comprehension",
        question: "Warum ist Maria nervös?",
        options: [
          "Weil sie ihren Koffer verloren hat",
          "Weil sie einen wichtigen Termin hat und der Zug Verspätung hat",
          "Weil der Bahnhof geschlossen ist",
          "Weil sie kein Ticket hat",
        ],
        correct: 1,
        explanation: "Sie hat einen Termin in Zürich und der Zug kommt zu spät.",
      },
      {
        type: "cloze",
        instruction: "Nebensatz mit 'weil' — wo steht das Verb?",
        sentence: "Der Zug hat Verspätung, weil es ein Problem {___}.",
        options: ["gibt", "es gibt", "geben", "hat gegeben"],
        correct: "gibt",
        explanation: "Nach 'weil' geht das konjugierte Verb ans Ende des Satzes: ...weil es ein Problem GIBT.",
        srsCard: { front: "...weil es ein Problem ___. (geben, Präsens)", back: "gibt (Verb am Ende im Nebensatz)", type: "cloze" },
      },
      {
        type: "cloze",
        instruction: "Welcher Konnektor passt? (Gegensatz!)",
        sentence: "{___} sie früh losgefahren ist, wird sie zu spät kommen.",
        options: ["Weil", "Obwohl", "Dass", "Deshalb"],
        correct: "Obwohl",
        explanation: "'Obwohl' zeigt einen Gegensatz: Sie ist früh losgefahren (= gut), ABER sie kommt trotzdem zu spät.",
        srsCard: { front: "___ sie früh los ist, kommt sie zu spät. (Gegensatz)", back: "Obwohl (= apesar de que)", type: "cloze" },
      },
      {
        type: "reorder",
        instruction: "Bilde einen Nebensatz mit 'dass':",
        words: ["Maria", "hofft,", "dass", "der Zug", "bald", "kommt"],
        correct: "Maria hofft, dass der Zug bald kommt",
        hint: "Im dass-Satz: Verb am Ende!",
        srsCard: { front: "Ordne: Maria / hofft, / dass / der Zug / bald / kommt", back: "Maria hofft, dass der Zug bald kommt.", type: "reorder" },
      },
      {
        type: "text",
        content: "Maria ruft ihre Kollegin an und sagt, dass sie etwas später kommt. Die Kollegin antwortet: „Kein Problem! Wir fangen ohne dich an, aber du kannst trotzdem noch mitmachen."",
        glossary: [
          { word: "Kollegin", de: "eine Frau, mit der man zusammen arbeitet", pt: "colega de trabalho (fem.)" },
          { word: "anfangen", de: "beginnen, starten", pt: "começar" },
          { word: "mitmachen", de: "zusammen mit anderen etwas tun, teilnehmen", pt: "participar" },
        ],
      },
      {
        type: "guided_write",
        instruction: "Schreib 1-2 Sätze: Was machst du, wenn dein Zug/Bus Verspätung hat?",
        starters: ["Wenn mein Zug Verspätung hat, ...", "Ich finde es schlimm, wenn...", "Obwohl ich pünktlich bin, ..."],
        keywords: ["weil", "obwohl", "dass", "Verspätung", "warten", "nervös"],
        exampleAnswer: "Wenn mein Zug Verspätung hat, werde ich nervös, weil ich pünktlich sein möchte. Obwohl ich immer früh losfahre, komme ich manchmal zu spät.",
      },
    ],
  },
  {
    id: "gesundheit-01",
    title: "Beim Hausarzt",
    topic: "Gesundheit",
    level: "B1+",
    grammarFocus: "Modalverben im Präteritum + Konjunktiv II (könnte, sollte)",
    lexicalFocus: "Arztbesuch, Symptome, Ratschläge",
    estimatedMinutes: 12,
    xpReward: 150,
    steps: [
      {
        type: "text",
        content: "Seit einer Woche hat Thomas starke Kopfschmerzen. Er konnte letzte Nacht nicht gut schlafen und musste heute früher von der Arbeit nach Hause gehen.",
        glossary: [
          { word: "Kopfschmerzen", de: "Schmerzen im Kopf", pt: "dor de cabeça" },
          { word: "konnte", de: "Präteritum von 'können'", pt: "podia / conseguia" },
          { word: "musste", de: "Präteritum von 'müssen'", pt: "teve que / precisou" },
        ],
      },
      {
        type: "text",
        content: "Er geht zum Hausarzt. Die Ärztin fragt: „Seit wann haben Sie die Beschwerden?" Thomas antwortet: „Seit ungefähr einer Woche. Ich sollte vielleicht weniger am Computer arbeiten."",
        glossary: [
          { word: "Hausarzt", de: "der Arzt, zu dem man normalerweise geht (Allgemeinmedizin)", pt: "clínico geral" },
          { word: "Beschwerden", de: "gesundheitliche Probleme, die man fühlt", pt: "queixas / sintomas" },
          { word: "ungefähr", de: "circa, nicht genau", pt: "aproximadamente" },
        ],
      },
      {
        type: "comprehension",
        question: "Warum geht Thomas zum Arzt?",
        options: [
          "Er hat Bauchschmerzen",
          "Er hat seit einer Woche Kopfschmerzen",
          "Er hatte einen Unfall",
          "Er braucht ein Rezept",
        ],
        correct: 1,
        explanation: "Thomas hat seit einer Woche starke Kopfschmerzen und konnte nicht gut schlafen.",
      },
      {
        type: "cloze",
        instruction: "Modalverb im Präteritum — können → ?",
        sentence: "Er {___} letzte Nacht nicht gut schlafen.",
        options: ["kann", "konnte", "könnte", "gekonnt"],
        correct: "konnte",
        explanation: "Präteritum von 'können' = konnte. Das ist Vergangenheit: Letzte Nacht KONNTE er nicht schlafen.",
        srsCard: { front: "Er ___ letzte Nacht nicht schlafen. (können, Präteritum)", back: "konnte", type: "cloze" },
      },
      {
        type: "cloze",
        instruction: "Konjunktiv II — höflicher Ratschlag",
        sentence: "Sie {___} weniger Kaffee trinken und mehr Wasser.",
        options: ["sollte", "sollten", "musste", "soll"],
        correct: "sollten",
        explanation: "'Sollten' ist Konjunktiv II von 'sollen'. Die Ärztin gibt einen höflichen Ratschlag mit 'Sie' (formal) → sollten.",
        srsCard: { front: "Sie ___ weniger Kaffee trinken. (sollen, Konj. II, formal)", back: "sollten (höflicher Ratschlag)", type: "cloze" },
      },
      {
        type: "text",
        content: "Die Ärztin untersucht Thomas und sagt: „Sie könnten eine Migräne haben. Ich verschreibe Ihnen ein Medikament. Sie sollten außerdem mehr Pausen machen und genug Wasser trinken."",
        glossary: [
          { word: "untersucht", de: "der Arzt schaut den Patienten an und prüft die Gesundheit", pt: "examina" },
          { word: "verschreibe", de: "der Arzt schreibt ein Rezept für Medikamente", pt: "prescrevo / receito" },
          { word: "Pausen", de: "kurze Zeiten ohne Arbeit, in denen man sich ausruht", pt: "pausas" },
        ],
      },
      {
        type: "reorder",
        instruction: "Ordne den Satz mit Modalverb im Präteritum:",
        words: ["Thomas", "musste", "heute", "früher", "nach Hause", "gehen"],
        correct: "Thomas musste heute früher nach Hause gehen",
        hint: "Modalverb auf Position 2, Infinitiv am Ende!",
        srsCard: { front: "Ordne: Thomas / musste / heute / früher / nach Hause / gehen", back: "Thomas musste heute früher nach Hause gehen.", type: "reorder" },
      },
      {
        type: "guided_write",
        instruction: "Stell dir vor: Du bist krank und gehst zum Arzt. Beschreib deine Symptome mit 1-2 Sätzen.",
        starters: ["Ich habe seit... Schmerzen in...", "Ich konnte gestern nicht...", "Ich sollte vielleicht..."],
        keywords: ["konnte", "musste", "sollte", "Schmerzen", "seit", "Beschwerden"],
        exampleAnswer: "Ich habe seit drei Tagen Halsschmerzen und konnte gestern Nacht nicht gut schlafen. Ich sollte vielleicht weniger reden und mehr Tee trinken.",
      },
    ],
  },
  {
    id: "arbeit-01",
    title: "Das Vorstellungsgespräch",
    topic: "Arbeit",
    level: "B1+",
    grammarFocus: "Konnektoren: deshalb, trotzdem, außerdem + Nebensätze",
    lexicalFocus: "Beruf, Bewerbung, Qualifikationen",
    estimatedMinutes: 12,
    xpReward: 150,
    steps: [
      {
        type: "text",
        content: "Sarah hat sich bei einer Firma in Hamburg beworben. Heute hat sie ein Vorstellungsgespräch. Sie ist aufgeregt, trotzdem versucht sie, ruhig zu bleiben.",
        glossary: [
          { word: "beworben", de: "Partizip II von 'sich bewerben' — eine Bewerbung schicken", pt: "se candidatou" },
          { word: "Vorstellungsgespräch", de: "ein Gespräch bei einer Firma, wenn man einen Job möchte", pt: "entrevista de emprego" },
          { word: "aufgeregt", de: "nervös, aber auch ein bisschen froh", pt: "animada/nervosa" },
        ],
      },
      {
        type: "comprehension",
        question: "Wie fühlt sich Sarah?",
        options: [
          "Sie ist müde und will nach Hause",
          "Sie ist aufgeregt, aber versucht ruhig zu bleiben",
          "Sie ist traurig, weil sie den Job nicht bekommen hat",
          "Sie ist entspannt und hat keine Sorgen",
        ],
        correct: 1,
        explanation: "Im Text: „aufgeregt, trotzdem versucht sie, ruhig zu bleiben" — trotzdem zeigt Gegensatz.",
      },
      {
        type: "text",
        content: "Der Chef fragt: „Warum möchten Sie bei uns arbeiten?" Sarah antwortet: „Ich interessiere mich für Ihre Produkte. Außerdem habe ich Erfahrung in diesem Bereich, deshalb glaube ich, dass ich gut ins Team passe."",
        glossary: [
          { word: "Erfahrung", de: "Wissen und Können, das man durch Arbeit oder Übung bekommt", pt: "experiência" },
          { word: "Bereich", de: "ein Thema oder Gebiet (z.B. IT, Medizin)", pt: "área" },
        ],
      },
      {
        type: "cloze",
        instruction: "Welcher Konnektor zeigt eine Folge/Konsequenz?",
        sentence: "Ich habe Erfahrung in diesem Bereich, {___} glaube ich, dass ich gut passe.",
        options: ["trotzdem", "deshalb", "obwohl", "außerdem"],
        correct: "deshalb",
        explanation: "'Deshalb' = por isso. Erfahrung (Grund) → ich passe gut (Folge). Achtung: Nach 'deshalb' steht das Verb auf Position 2 (Inversion!).",
        srsCard: { front: "Ich habe Erfahrung, ___ glaube ich... (Folge/Konsequenz)", back: "deshalb (= por isso, Verb auf Pos. 2)", type: "cloze" },
      },
      {
        type: "cloze",
        instruction: "Welcher Konnektor fügt Information hinzu?",
        sentence: "Ich interessiere mich für Ihre Produkte. {___} habe ich Erfahrung.",
        options: ["Deshalb", "Trotzdem", "Außerdem", "Obwohl"],
        correct: "Außerdem",
        explanation: "'Außerdem' = além disso. Es fügt eine neue Information hinzu. Auch hier: Verb auf Position 2.",
        srsCard: { front: "___ habe ich Erfahrung. (neue Info hinzufügen)", back: "Außerdem (= além disso)", type: "cloze" },
      },
      {
        type: "reorder",
        instruction: "Bilde einen Satz mit 'trotzdem':",
        words: ["Sarah", "ist", "nervös,", "trotzdem", "bleibt", "sie", "ruhig"],
        correct: "Sarah ist nervös, trotzdem bleibt sie ruhig",
        hint: "Trotzdem = Gegensatz. Verb direkt nach trotzdem!",
        srsCard: { front: "Sarah ist nervös, ___ bleibt sie ruhig.", back: "trotzdem (= mesmo assim, apesar disso)", type: "reorder" },
      },
      {
        type: "text",
        content: "Am Ende sagt der Chef: „Vielen Dank, Frau Müller. Wir melden uns nächste Woche bei Ihnen." Sarah geht nach Hause und denkt: „Es war gut, obwohl ich sehr nervös war."",
        glossary: [
          { word: "melden", de: "sich melden = eine Nachricht geben, antworten", pt: "entrar em contato" },
        ],
      },
      {
        type: "guided_write",
        instruction: "Benutze 'deshalb', 'trotzdem' oder 'außerdem' in 1-2 Sätzen über deinen Beruf/dein Studium.",
        starters: ["Ich arbeite als..., deshalb...", "Meine Arbeit ist manchmal stressig, trotzdem...", "Ich spreche Portugiesisch. Außerdem lerne ich..."],
        keywords: ["deshalb", "trotzdem", "außerdem", "Erfahrung", "interessiere mich"],
        exampleAnswer: "Ich arbeite als Arzt, deshalb muss ich oft nachts arbeiten. Trotzdem macht mir die Arbeit Spaß. Außerdem lerne ich Deutsch für meine Karriere.",
      },
    ],
  },
];

// ─── TOPIC CONFIG ───────────────────────────────────────────────────────────
const TOPICS = {
  Alltag: { icon: "🏠", color: "#F59E0B" },
  Reisen: { icon: "🚆", color: "#3B82F6" },
  Gesundheit: { icon: "🏥", color: "#10B981" },
  Arbeit: { icon: "💼", color: "#8B5CF6" },
  Technik: { icon: "💻", color: "#EC4899" },
  Medizin: { icon: "🩺", color: "#EF4444" },
};

// ─── SRS ENGINE (SM-2 simplified) ────────────────────────────────────────────
const getNextReview = (card) => {
  const now = Date.now();
  if (!card.interval) return { ...card, interval: 1, easeFactor: 2.5, nextReview: now + 60000 };
  const intervals = [1, 3, 7, 14, 30, 60]; // minutes for first, then days concept
  const idx = Math.min(card.reviewCount || 0, intervals.length - 1);
  const mult = card.lastCorrect ? intervals[idx] : 1;
  return {
    ...card,
    interval: mult,
    nextReview: now + mult * 60000,
    reviewCount: (card.reviewCount || 0) + (card.lastCorrect ? 1 : 0),
  };
};

// ─── LEVEL SYSTEM ────────────────────────────────────────────────────────────
const LEVELS = [
  { name: "Anfänger", xpNeeded: 0, badge: "🌱" },
  { name: "Lerner", xpNeeded: 200, badge: "📖" },
  { name: "Entdecker", xpNeeded: 500, badge: "🧭" },
  { name: "Sprecher", xpNeeded: 1000, badge: "🗣️" },
  { name: "Kenner", xpNeeded: 2000, badge: "🎯" },
  { name: "Meister", xpNeeded: 3500, badge: "⭐" },
  { name: "Experte", xpNeeded: 5000, badge: "🏆" },
  { name: "Brücken\u00adbauer", xpNeeded: 8000, badge: "🌉" },
];

const getLevel = (xp) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpNeeded) lvl = l;
  }
  return lvl;
};

const getNextLevel = (xp) => {
  for (const l of LEVELS) {
    if (xp < l.xpNeeded) return l;
  }
  return null;
};

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const loadStorage = async (key, fallback) => {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = async (key, value) => {
  try {
    await window.storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function DeutschBruecke() {
  const [screen, setScreen] = useState("loading");
  const [profile, setProfile] = useState({ xp: 0, streak: 0, lastActive: null, completedLessons: [] });
  const [srsCards, setSrsCards] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  // Load data on mount
  useEffect(() => {
    (async () => {
      const p = await loadStorage("db-profile", { xp: 0, streak: 0, lastActive: null, completedLessons: [] });
      const cards = await loadStorage("db-srs-cards", []);
      // Calculate streak
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const yesterday = new Date(now - 86400000).toISOString().slice(0, 10);
      if (p.lastActive === today) {
        // already active today
      } else if (p.lastActive === yesterday) {
        p.streak = (p.streak || 0); // maintained
      } else if (p.lastActive) {
        p.streak = 0; // broken
      }
      setProfile(p);
      setSrsCards(cards);
      setScreen("dashboard");
    })();
  }, []);

  const saveProfile = async (newP) => {
    setProfile(newP);
    await saveStorage("db-profile", newP);
  };

  const saveSrsCards = async (newCards) => {
    setSrsCards(newCards);
    await saveStorage("db-srs-cards", newCards);
  };

  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
    setStepIndex(0);
    setSessionXP(0);
    setSessionResults([]);
    setShowSummary(false);
    setScreen("session");
  };

  const completeStep = (xp, result) => {
    setSessionXP((p) => p + xp);
    if (result) setSessionResults((p) => [...p, result]);
  };

  const addSrsCard = async (card) => {
    const existing = srsCards.find((c) => c.front === card.front);
    if (!existing) {
      const newCard = { ...card, id: Date.now().toString(), nextReview: Date.now(), reviewCount: 0, easeFactor: 2.5, interval: 1 };
      await saveSrsCards([...srsCards, newCard]);
    }
  };

  const nextStep = () => {
    if (stepIndex < currentLesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const wasActiveToday = profile.lastActive === today;
    const newP = {
      ...profile,
      xp: profile.xp + sessionXP,
      streak: wasActiveToday ? profile.streak : (profile.streak || 0) + 1,
      lastActive: today,
      completedLessons: [...new Set([...profile.completedLessons, currentLesson.id])],
    };
    await saveProfile(newP);
    setShowSummary(true);
  };

  const startSrsReview = () => {
    setScreen("srs");
  };

  const getDueCards = () => {
    const now = Date.now();
    return srsCards.filter((c) => c.nextReview <= now);
  };

  if (screen === "loading") {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingIcon}>🌉</div>
          <div style={styles.loadingTitle}>DeutschBrücke</div>
          <div style={styles.loadingSubtitle}>Deine Brücke von B1 zu B2</div>
        </div>
      </div>
    );
  }

  if (screen === "dashboard") {
    return <Dashboard profile={profile} srsCards={srsCards} startLesson={startLesson} startSrsReview={startSrsReview} getDueCards={getDueCards} />;
  }

  if (screen === "session" && currentLesson) {
    if (showSummary) {
      return (
        <SessionSummary
          lesson={currentLesson}
          sessionXP={sessionXP}
          results={sessionResults}
          profile={profile}
          onBack={() => setScreen("dashboard")}
        />
      );
    }
    return (
      <Session
        lesson={currentLesson}
        stepIndex={stepIndex}
        onComplete={completeStep}
        onNext={nextStep}
        onAddSrs={addSrsCard}
        sessionXP={sessionXP}
        onQuit={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "srs") {
    return (
      <SrsReview
        cards={getDueCards()}
        allCards={srsCards}
        onUpdateCards={saveSrsCards}
        onBack={() => setScreen("dashboard")}
        onAddXP={async (xp) => {
          const today = new Date().toISOString().slice(0, 10);
          const wasActiveToday = profile.lastActive === today;
          await saveProfile({
            ...profile,
            xp: profile.xp + xp,
            streak: wasActiveToday ? profile.streak : (profile.streak || 0) + 1,
            lastActive: today,
          });
        }}
      />
    );
  }

  return null;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ profile, srsCards, startLesson, startSrsReview, getDueCards }) {
  const level = getLevel(profile.xp);
  const nextLvl = getNextLevel(profile.xp);
  const progress = nextLvl ? ((profile.xp - level.xpNeeded) / (nextLvl.xpNeeded - level.xpNeeded)) * 100 : 100;
  const dueCount = getDueCards().length;

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.dashHeader}>
          <div>
            <h1 style={styles.dashTitle}>
              <span style={{ fontSize: 32 }}>🌉</span> DeutschBrücke
            </h1>
            <p style={styles.dashSubtitle}>Deine Brücke von B1 zu B2</p>
          </div>
          <div style={styles.streakBadge}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <span style={styles.streakNum}>{profile.streak || 0}</span>
          </div>
        </div>

        {/* Level Card */}
        <div style={styles.levelCard}>
          <div style={styles.levelTop}>
            <div style={styles.levelBadge}>{level.badge}</div>
            <div style={styles.levelInfo}>
              <div style={styles.levelName}>{level.name}</div>
              <div style={styles.levelXP}>{profile.xp} XP</div>
            </div>
            {nextLvl && <div style={styles.nextLevel}>→ {nextLvl.badge} {nextLvl.name}</div>}
          </div>
          <div style={styles.xpBarOuter}>
            <div style={{ ...styles.xpBarInner, width: `${Math.min(progress, 100)}%` }} />
          </div>
          {nextLvl && (
            <div style={styles.xpRemaining}>
              Noch {nextLvl.xpNeeded - profile.xp} XP bis {nextLvl.name}
            </div>
          )}
        </div>

        {/* SRS Review Button */}
        {dueCount > 0 && (
          <button style={styles.srsButton} onClick={startSrsReview}>
            <span style={{ fontSize: 20 }}>🧠</span>
            <div>
              <div style={styles.srsBtnTitle}>Wiederholung fällig!</div>
              <div style={styles.srsBtnCount}>{dueCount} Karte{dueCount !== 1 ? "n" : ""} zum Üben</div>
            </div>
            <span style={styles.srsBtnArrow}>→</span>
          </button>
        )}

        {/* Lessons */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Lektionen</h2>
          <span style={styles.sectionCount}>{profile.completedLessons.length}/{LESSONS.length}</span>
        </div>

        <div style={styles.lessonGrid}>
          {LESSONS.map((lesson) => {
            const topic = TOPICS[lesson.topic] || { icon: "📝", color: "#6B7280" };
            const completed = profile.completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                style={{ ...styles.lessonCard, borderLeft: `4px solid ${topic.color}` }}
                onClick={() => startLesson(lesson)}
              >
                <div style={styles.lessonTop}>
                  <span style={styles.lessonIcon}>{topic.icon}</span>
                  <div style={styles.lessonMeta}>
                    <span style={{ ...styles.levelTag, background: `${topic.color}22`, color: topic.color }}>{lesson.level}</span>
                    <span style={styles.lessonTime}>~{lesson.estimatedMinutes} Min</span>
                  </div>
                </div>
                <h3 style={styles.lessonTitle}>{lesson.title}</h3>
                <p style={styles.lessonGrammar}>{lesson.grammarFocus}</p>
                <div style={styles.lessonBottom}>
                  <span style={styles.lessonXP}>+{lesson.xpReward} XP</span>
                  {completed && <span style={styles.completedBadge}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statNum}>{profile.completedLessons.length}</div>
            <div style={styles.statLabel}>Lektionen</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>{srsCards.length}</div>
            <div style={styles.statLabel}>SRS-Karten</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>{profile.xp}</div>
            <div style={styles.statLabel}>Gesamt-XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SESSION ─────────────────────────────────────────────────────────────────
function Session({ lesson, stepIndex, onComplete, onNext, onAddSrs, sessionXP, onQuit }) {
  const step = lesson.steps[stepIndex];
  const progress = ((stepIndex + 1) / lesson.steps.length) * 100;
  const topic = TOPICS[lesson.topic] || { icon: "📝", color: "#6B7280" };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {/* Session Header */}
        <div style={styles.sessionHeader}>
          <button style={styles.quitBtn} onClick={onQuit}>✕</button>
          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${progress}%`, background: topic.color }} />
          </div>
          <div style={styles.sessionXP}>+{sessionXP} XP</div>
        </div>

        <div style={styles.sessionMeta}>
          <span>{topic.icon} {lesson.title}</span>
          <span style={styles.stepCounter}>{stepIndex + 1} / {lesson.steps.length}</span>
        </div>

        {/* Step Content */}
        {step.type === "text" && <TextStep step={step} onNext={onNext} />}
        {step.type === "comprehension" && <ComprehensionStep step={step} onComplete={onComplete} onNext={onNext} />}
        {step.type === "cloze" && <ClozeStep step={step} onComplete={onComplete} onNext={onNext} onAddSrs={onAddSrs} />}
        {step.type === "reorder" && <ReorderStep step={step} onComplete={onComplete} onNext={onNext} onAddSrs={onAddSrs} />}
        {step.type === "guided_write" && <GuidedWriteStep step={step} onComplete={onComplete} onNext={onNext} />}
      </div>
    </div>
  );
}

// ─── TEXT STEP ───────────────────────────────────────────────────────────────
function TextStep({ step, onNext }) {
  const [showGlossary, setShowGlossary] = useState({});

  const toggleWord = (word) => setShowGlossary((p) => ({ ...p, [word]: !p[word] }));

  const renderText = () => {
    let text = step.content;
    const words = (step.glossary || []).map((g) => g.word);
    const parts = [];
    let remaining = text;

    while (remaining.length > 0) {
      let earliest = -1;
      let earliestWord = null;
      for (const w of words) {
        const idx = remaining.indexOf(w);
        if (idx !== -1 && (earliest === -1 || idx < earliest)) {
          earliest = idx;
          earliestWord = w;
        }
      }
      if (earliest === -1) {
        parts.push(<span key={parts.length}>{remaining}</span>);
        break;
      }
      if (earliest > 0) parts.push(<span key={parts.length}>{remaining.slice(0, earliest)}</span>);
      parts.push(
        <span key={parts.length} style={styles.glossaryWord} onClick={() => toggleWord(earliestWord)}>
          {earliestWord}
          <span style={styles.glossaryDot}>·</span>
        </span>
      );
      remaining = remaining.slice(earliest + earliestWord.length);
    }
    return parts;
  };

  return (
    <div style={styles.stepCard}>
      <div style={styles.stepLabel}>📖 Lesen</div>
      <div style={styles.textContent}>{renderText()}</div>
      {/* Glossary tooltips */}
      {(step.glossary || []).map(
        (g) =>
          showGlossary[g.word] && (
            <div key={g.word} style={styles.glossaryCard}>
              <div style={styles.glossaryTitle}>{g.word}</div>
              <div style={styles.glossaryDe}>🇩🇪 {g.de}</div>
              <div style={styles.glossaryPt}>🇧🇷 {g.pt}</div>
            </div>
          )
      )}
      <button style={styles.nextBtn} onClick={onNext}>
        Weiter →
      </button>
    </div>
  );
}

// ─── COMPREHENSION STEP ──────────────────────────────────────────────────────
function ComprehensionStep({ step, onComplete, onNext }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = (idx) => {
    if (submitted) return;
    setSelected(idx);
    setSubmitted(true);
    const correct = idx === step.correct;
    onComplete(correct ? 15 : 0, { type: "comprehension", correct });
  };

  return (
    <div style={styles.stepCard}>
      <div style={styles.stepLabel}>❓ Verstehen</div>
      <div style={styles.questionText}>{step.question}</div>
      <div style={styles.optionsGrid}>
        {step.options.map((opt, i) => {
          let optStyle = styles.optionBtn;
          if (submitted) {
            if (i === step.correct) optStyle = { ...optStyle, ...styles.optionCorrect };
            else if (i === selected) optStyle = { ...optStyle, ...styles.optionWrong };
          }
          return (
            <button key={i} style={optStyle} onClick={() => submit(i)}>
              <span style={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div style={selected === step.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
          <div style={styles.feedbackIcon}>{selected === step.correct ? "✅" : "❌"}</div>
          <div>
            <div style={styles.feedbackTitle}>{selected === step.correct ? "Richtig!" : "Leider falsch"}</div>
            <div style={styles.feedbackText}>{step.explanation}</div>
          </div>
        </div>
      )}
      {submitted && (
        <button style={styles.nextBtn} onClick={onNext}>
          Weiter →
        </button>
      )}
    </div>
  );
}

// ─── CLOZE STEP ──────────────────────────────────────────────────────────────
function ClozeStep({ step, onComplete, onNext, onAddSrs }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = (opt) => {
    if (submitted) return;
    setSelected(opt);
    setSubmitted(true);
    const correct = opt === step.correct;
    onComplete(correct ? 20 : 5, { type: "cloze", correct });
    if (step.srsCard) onAddSrs(step.srsCard);
  };

  const renderSentence = () => {
    const parts = step.sentence.split("{___}");
    return (
      <span>
        {parts[0]}
        <span
          style={{
            ...styles.clozeBlank,
            ...(submitted ? (selected === step.correct ? styles.clozeCorrect : styles.clozeWrong) : {}),
          }}
        >
          {submitted ? (selected === step.correct ? step.correct : `${selected} → ${step.correct}`) : "___"}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div style={styles.stepCard}>
      <div style={styles.stepLabel}>✏️ Lückentext</div>
      {step.instruction && <div style={styles.instruction}>{step.instruction}</div>}
      <div style={styles.clozeSentence}>{renderSentence()}</div>
      <div style={styles.clozeOptions}>
        {step.options.map((opt) => {
          let s = styles.clozeOptBtn;
          if (submitted) {
            if (opt === step.correct) s = { ...s, ...styles.optionCorrect };
            else if (opt === selected) s = { ...s, ...styles.optionWrong };
            else s = { ...s, opacity: 0.4 };
          }
          return (
            <button key={opt} style={s} onClick={() => submit(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div style={selected === step.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
          <div style={styles.feedbackIcon}>{selected === step.correct ? "✅" : "❌"}</div>
          <div>
            <div style={styles.feedbackTitle}>{selected === step.correct ? "Richtig!" : "Nicht ganz"}</div>
            <div style={styles.feedbackText}>{step.explanation}</div>
          </div>
        </div>
      )}
      {submitted && step.srsCard && (
        <div style={styles.srsAdded}>🧠 Karte zum SRS hinzugefügt</div>
      )}
      {submitted && (
        <button style={styles.nextBtn} onClick={onNext}>
          Weiter →
        </button>
      )}
    </div>
  );
}

// ─── REORDER STEP ────────────────────────────────────────────────────────────
function ReorderStep({ step, onComplete, onNext, onAddSrs }) {
  const [available, setAvailable] = useState([...step.words]);
  const [placed, setPlaced] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const placeWord = (word, idx) => {
    if (submitted) return;
    setPlaced((p) => [...p, word]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeWord = (word, idx) => {
    if (submitted) return;
    setAvailable((a) => [...a, word]);
    setPlaced((p) => p.filter((_, i) => i !== idx));
  };

  const checkAnswer = () => {
    const answer = placed.join(" ").replace(/\s+/g, " ").trim().replace(/[.,!?]$/g, "");
    const correct = step.correct.replace(/[.,!?]$/g, "");
    const ok = answer.toLowerCase() === correct.toLowerCase();
    setIsCorrect(ok);
    setSubmitted(true);
    onComplete(ok ? 25 : 5, { type: "reorder", correct: ok });
    if (step.srsCard) onAddSrs(step.srsCard);
  };

  const reset = () => {
    setAvailable([...step.words]);
    setPlaced([]);
    setSubmitted(false);
  };

  return (
    <div style={styles.stepCard}>
      <div style={styles.stepLabel}>🔀 Satzbau</div>
      {step.instruction && <div style={styles.instruction}>{step.instruction}</div>}
      {step.hint && <div style={styles.hintText}>💡 {step.hint}</div>}

      {/* Placed words */}
      <div style={styles.reorderPlaced}>
        {placed.length === 0 ? (
          <span style={styles.placeholderText}>Tippe auf die Wörter in der richtigen Reihenfolge</span>
        ) : (
          placed.map((w, i) => (
            <button key={`p-${i}`} style={{
              ...styles.wordChip,
              ...styles.wordChipPlaced,
              ...(submitted ? (isCorrect ? styles.wordChipCorrect : styles.wordChipWrong) : {}),
            }} onClick={() => removeWord(w, i)}>
              {w}
            </button>
          ))
        )}
      </div>

      {/* Available words */}
      <div style={styles.reorderAvailable}>
        {available.map((w, i) => (
          <button key={`a-${i}`} style={styles.wordChip} onClick={() => placeWord(w, i)}>
            {w}
          </button>
        ))}
      </div>

      {!submitted && placed.length === step.words.length && (
        <button style={styles.checkBtn} onClick={checkAnswer}>Prüfen</button>
      )}
      {!submitted && placed.length > 0 && placed.length < step.words.length && (
        <button style={styles.resetBtn} onClick={reset}>Zurücksetzen</button>
      )}

      {submitted && (
        <div style={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
          <div style={styles.feedbackIcon}>{isCorrect ? "✅" : "❌"}</div>
          <div>
            <div style={styles.feedbackTitle}>{isCorrect ? "Perfekt!" : "Fast!"}</div>
            {!isCorrect && <div style={styles.feedbackText}>Richtige Antwort: {step.correct}</div>}
          </div>
        </div>
      )}
      {submitted && (
        <button style={styles.nextBtn} onClick={onNext}>Weiter →</button>
      )}
    </div>
  );
}

// ─── GUIDED WRITE STEP ───────────────────────────────────────────────────────
function GuidedWriteStep({ step, onComplete, onNext }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [selectedStarter, setSelectedStarter] = useState(null);

  const useStarter = (s) => {
    setSelectedStarter(s);
    setText(s);
  };

  const submit = () => {
    setSubmitted(true);
    const words = text.toLowerCase().split(/\s+/);
    const keywordsUsed = step.keywords.filter((k) => words.some((w) => w.includes(k.toLowerCase())));
    const xp = Math.min(30, 10 + keywordsUsed.length * 5);
    onComplete(xp, { type: "guided_write", keywordsUsed: keywordsUsed.length, total: step.keywords.length });
  };

  return (
    <div style={styles.stepCard}>
      <div style={styles.stepLabel}>🖊️ Mini-Schreiben</div>
      <div style={styles.instruction}>{step.instruction}</div>

      {/* Starters */}
      {!submitted && (
        <div style={styles.startersSection}>
          <div style={styles.startersLabel}>Satzanfänge zur Hilfe:</div>
          <div style={styles.startersList}>
            {step.starters.map((s, i) => (
              <button
                key={i}
                style={{
                  ...styles.starterChip,
                  ...(selectedStarter === s ? styles.starterChipActive : {}),
                }}
                onClick={() => useStarter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {!submitted && (
        <div style={styles.keywordsSection}>
          <div style={styles.keywordsLabel}>Versuche diese Wörter zu benutzen:</div>
          <div style={styles.keywordsList}>
            {step.keywords.map((k, i) => {
              const used = text.toLowerCase().includes(k.toLowerCase());
              return (
                <span key={i} style={{ ...styles.keywordTag, ...(used ? styles.keywordUsed : {}) }}>
                  {used ? "✓ " : ""}{k}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Text Input */}
      <textarea
        style={styles.writeArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Schreib hier deinen Satz..."
        rows={3}
        disabled={submitted}
      />

      {!submitted && text.length > 10 && (
        <button style={styles.checkBtn} onClick={submit}>Fertig! ✓</button>
      )}

      {submitted && (
        <div style={styles.feedbackCorrect}>
          <div style={styles.feedbackIcon}>👏</div>
          <div>
            <div style={styles.feedbackTitle}>Gut gemacht!</div>
            <div style={styles.feedbackText}>
              Du hast {step.keywords.filter((k) => text.toLowerCase().includes(k.toLowerCase())).length}/{step.keywords.length} Schlüsselwörter benutzt.
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div style={styles.exampleSection}>
          <button style={styles.exampleToggle} onClick={() => setShowExample(!showExample)}>
            {showExample ? "Beispiel verbergen" : "📝 Beispielantwort ansehen"}
          </button>
          {showExample && <div style={styles.exampleText}>{step.exampleAnswer}</div>}
        </div>
      )}

      {submitted && (
        <button style={styles.nextBtn} onClick={onNext}>Weiter →</button>
      )}
    </div>
  );
}

// ─── SESSION SUMMARY ─────────────────────────────────────────────────────────
function SessionSummary({ lesson, sessionXP, results, profile, onBack }) {
  const level = getLevel(profile.xp);
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🎉</div>
          <h2 style={styles.summaryTitle}>Lektion abgeschlossen!</h2>
          <h3 style={styles.summaryLesson}>{lesson.title}</h3>

          <div style={styles.summaryStats}>
            <div style={styles.summaryStat}>
              <div style={styles.summaryStatNum}>+{sessionXP}</div>
              <div style={styles.summaryStatLabel}>XP verdient</div>
            </div>
            <div style={styles.summaryStat}>
              <div style={styles.summaryStatNum}>{total > 0 ? Math.round((correct / total) * 100) : 100}%</div>
              <div style={styles.summaryStatLabel}>Richtig</div>
            </div>
            <div style={styles.summaryStat}>
              <div style={styles.summaryStatNum}>{level.badge}</div>
              <div style={styles.summaryStatLabel}>{level.name}</div>
            </div>
          </div>

          <div style={styles.summaryResults}>
            {results.map((r, i) => (
              <div key={i} style={styles.summaryResultRow}>
                <span>{r.correct ? "✅" : "❌"}</span>
                <span style={styles.summaryResultType}>
                  {r.type === "comprehension" ? "Verstehen" : r.type === "cloze" ? "Lückentext" : r.type === "reorder" ? "Satzbau" : "Schreiben"}
                </span>
              </div>
            ))}
          </div>

          <button style={styles.nextBtn} onClick={onBack}>
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SRS REVIEW ──────────────────────────────────────────────────────────────
function SrsReview({ cards, allCards, onUpdateCards, onBack, onAddXP }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  if (cards.length === 0 || currentIdx >= cards.length) {
    return (
      <div style={styles.app}>
        <div style={styles.container}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>🧠</div>
            <h2 style={styles.summaryTitle}>
              {cards.length === 0 ? "Keine Karten fällig!" : "Wiederholung fertig!"}
            </h2>
            {completed > 0 && (
              <div style={styles.summaryStats}>
                <div style={styles.summaryStat}>
                  <div style={styles.summaryStatNum}>{correctCount}/{completed}</div>
                  <div style={styles.summaryStatLabel}>Richtig</div>
                </div>
              </div>
            )}
            <button style={styles.nextBtn} onClick={onBack}>Zurück</button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIdx];

  const answer = async (correct) => {
    const updated = allCards.map((c) => {
      if (c.id === card.id) {
        return getNextReview({ ...c, lastCorrect: correct });
      }
      return c;
    });
    await onUpdateCards(updated);
    if (correct) {
      setCorrectCount((c) => c + 1);
      await onAddXP(10);
    }
    setCompleted((c) => c + 1);
    setShowAnswer(false);
    setCurrentIdx((i) => i + 1);
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.sessionHeader}>
          <button style={styles.quitBtn} onClick={onBack}>✕</button>
          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${((currentIdx + 1) / cards.length) * 100}%`, background: "#8B5CF6" }} />
          </div>
          <div style={styles.sessionXP}>{currentIdx + 1}/{cards.length}</div>
        </div>

        <div style={styles.srsCard}>
          <div style={styles.srsCardType}>
            {card.type === "cloze" ? "✏️ Lückentext" : card.type === "reorder" ? "🔀 Satzbau" : "📝 Karte"}
          </div>
          <div style={styles.srsCardFront}>{card.front}</div>

          {!showAnswer ? (
            <button style={styles.showAnswerBtn} onClick={() => setShowAnswer(true)}>
              Antwort zeigen
            </button>
          ) : (
            <>
              <div style={styles.srsCardBack}>{card.back}</div>
              <div style={styles.srsRatingRow}>
                <button style={styles.srsRatingBad} onClick={() => answer(false)}>
                  😕 Nochmal
                </button>
                <button style={styles.srsRatingGood} onClick={() => answer(true)}>
                  😊 Gewusst!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
    color: "#E2E8F0",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    maxWidth: 520,
    margin: "0 auto",
    padding: "16px 16px 40px",
  },

  // Loading
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
  },
  loadingContent: { textAlign: "center" },
  loadingIcon: { fontSize: 56, marginBottom: 12 },
  loadingTitle: { fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" },
  loadingSubtitle: { fontSize: 15, color: "#94A3B8", marginTop: 4 },

  // Dashboard
  dashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingTop: 8,
  },
  dashTitle: { fontSize: 24, fontWeight: 700, color: "#F8FAFC", margin: 0, display: "flex", alignItems: "center", gap: 8 },
  dashSubtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  streakBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: 12,
    padding: "6px 12px",
  },
  streakNum: { fontSize: 18, fontWeight: 700, color: "#F59E0B" },

  // Level Card
  levelCard: {
    background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(139,92,246,0.12) 100%)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  levelTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  levelBadge: { fontSize: 36 },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 18, fontWeight: 700, color: "#F8FAFC" },
  levelXP: { fontSize: 13, color: "#94A3B8" },
  nextLevel: { fontSize: 12, color: "#64748B", textAlign: "right" },
  xpBarOuter: { height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" },
  xpBarInner: {
    height: "100%",
    background: "linear-gradient(90deg, #F59E0B, #EF4444)",
    borderRadius: 4,
    transition: "width 0.5s ease",
  },
  xpRemaining: { fontSize: 11, color: "#64748B", marginTop: 6, textAlign: "right" },

  // SRS Button
  srsButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.1))",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#E2E8F0",
    cursor: "pointer",
    marginBottom: 20,
    textAlign: "left",
    fontSize: 14,
  },
  srsBtnTitle: { fontWeight: 600, fontSize: 15 },
  srsBtnCount: { fontSize: 12, color: "#A78BFA" },
  srsBtnArrow: { marginLeft: "auto", fontSize: 20, color: "#A78BFA" },

  // Section
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 600, color: "#F8FAFC", margin: 0 },
  sectionCount: { fontSize: 13, color: "#64748B" },

  // Lesson Cards
  lessonGrid: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  lessonCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    cursor: "pointer",
    textAlign: "left",
    color: "#E2E8F0",
    transition: "all 0.15s",
  },
  lessonTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  lessonIcon: { fontSize: 24 },
  lessonMeta: { display: "flex", alignItems: "center", gap: 8 },
  levelTag: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6 },
  lessonTime: { fontSize: 11, color: "#64748B" },
  lessonTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 4px", color: "#F8FAFC" },
  lessonGrammar: { fontSize: 12, color: "#94A3B8", margin: 0 },
  lessonBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  lessonXP: { fontSize: 12, color: "#F59E0B", fontWeight: 600 },
  completedBadge: {
    background: "rgba(16,185,129,0.2)",
    color: "#10B981",
    borderRadius: "50%",
    width: 22,
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },

  // Stats
  statsRow: { display: "flex", gap: 10 },
  statBox: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 14,
    textAlign: "center",
  },
  statNum: { fontSize: 22, fontWeight: 700, color: "#F8FAFC" },
  statLabel: { fontSize: 11, color: "#64748B", marginTop: 2 },

  // Session
  sessionHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingTop: 4 },
  quitBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "none",
    color: "#94A3B8",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarOuter: { flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" },
  progressBarInner: { height: "100%", borderRadius: 3, transition: "width 0.4s ease" },
  sessionXP: { fontSize: 13, fontWeight: 600, color: "#F59E0B", minWidth: 50, textAlign: "right" },
  sessionMeta: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 16 },
  stepCounter: { color: "#94A3B8" },

  // Step Card
  stepCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
  },
  stepLabel: { fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 },

  // Text Step
  textContent: { fontSize: 17, lineHeight: 1.7, color: "#E2E8F0", marginBottom: 16 },
  glossaryWord: {
    color: "#F59E0B",
    borderBottom: "1px dashed rgba(245,158,11,0.4)",
    cursor: "pointer",
    position: "relative",
  },
  glossaryDot: { fontSize: 8, verticalAlign: "super", marginLeft: 1, color: "#F59E0B" },
  glossaryCard: {
    background: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  glossaryTitle: { fontWeight: 700, fontSize: 15, color: "#F59E0B", marginBottom: 6 },
  glossaryDe: { fontSize: 13, color: "#CBD5E1", marginBottom: 4 },
  glossaryPt: { fontSize: 13, color: "#94A3B8" },

  // Comprehension
  questionText: { fontSize: 16, fontWeight: 600, color: "#F8FAFC", marginBottom: 14 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#E2E8F0",
    cursor: "pointer",
    fontSize: 14,
    textAlign: "left",
    transition: "all 0.15s",
  },
  optionLetter: {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  optionCorrect: { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "#6EE7B7" },
  optionWrong: { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.4)", color: "#FCA5A5" },

  // Feedback
  feedbackCorrect: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    background: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  feedbackWrong: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  feedbackIcon: { fontSize: 20, flexShrink: 0 },
  feedbackTitle: { fontWeight: 600, fontSize: 14, color: "#F8FAFC", marginBottom: 2 },
  feedbackText: { fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 },

  // Cloze
  instruction: { fontSize: 13, color: "#94A3B8", marginBottom: 12, fontStyle: "italic" },
  clozeSentence: { fontSize: 17, lineHeight: 1.7, color: "#E2E8F0", marginBottom: 16 },
  clozeBlank: {
    display: "inline-block",
    background: "rgba(245,158,11,0.15)",
    border: "1px dashed rgba(245,158,11,0.4)",
    borderRadius: 6,
    padding: "2px 12px",
    minWidth: 60,
    textAlign: "center",
    fontWeight: 600,
    color: "#F59E0B",
  },
  clozeCorrect: { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "#6EE7B7" },
  clozeWrong: { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.4)", color: "#FCA5A5" },
  clozeOptions: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  clozeOptBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: "8px 18px",
    color: "#E2E8F0",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    transition: "all 0.15s",
  },

  // SRS added
  srsAdded: {
    fontSize: 12,
    color: "#A78BFA",
    marginTop: 8,
    textAlign: "center",
  },

  // Reorder
  reorderPlaced: {
    minHeight: 50,
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  placeholderText: { fontSize: 13, color: "#475569", fontStyle: "italic" },
  reorderAvailable: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  wordChip: {
    background: "rgba(59,130,246,0.15)",
    border: "1px solid rgba(59,130,246,0.3)",
    borderRadius: 8,
    padding: "8px 14px",
    color: "#93C5FD",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.15s",
  },
  wordChipPlaced: {
    background: "rgba(139,92,246,0.15)",
    borderColor: "rgba(139,92,246,0.3)",
    color: "#C4B5FD",
  },
  wordChipCorrect: {
    background: "rgba(16,185,129,0.15)",
    borderColor: "rgba(16,185,129,0.4)",
    color: "#6EE7B7",
  },
  wordChipWrong: {
    background: "rgba(239,68,68,0.15)",
    borderColor: "rgba(239,68,68,0.4)",
    color: "#FCA5A5",
  },
  hintText: { fontSize: 12, color: "#94A3B8", marginBottom: 12, background: "rgba(255,255,255,0.04)", padding: "6px 10px", borderRadius: 6 },

  // Guided Write
  startersSection: { marginBottom: 12 },
  startersLabel: { fontSize: 12, color: "#94A3B8", marginBottom: 6 },
  startersList: { display: "flex", flexDirection: "column", gap: 6 },
  starterChip: {
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#93C5FD",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "left",
    transition: "all 0.15s",
  },
  starterChipActive: {
    background: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.4)",
  },
  keywordsSection: { marginBottom: 12 },
  keywordsLabel: { fontSize: 12, color: "#94A3B8", marginBottom: 6 },
  keywordsList: { display: "flex", flexWrap: "wrap", gap: 6 },
  keywordTag: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 12,
    color: "#94A3B8",
    transition: "all 0.2s",
  },
  keywordUsed: {
    background: "rgba(16,185,129,0.15)",
    borderColor: "rgba(16,185,129,0.3)",
    color: "#6EE7B7",
  },
  writeArea: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: 14,
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 1.6,
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: 10,
    outline: "none",
    boxSizing: "border-box",
  },
  exampleSection: { marginTop: 10 },
  exampleToggle: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "8px 14px",
    color: "#94A3B8",
    cursor: "pointer",
    fontSize: 13,
    width: "100%",
  },
  exampleText: {
    fontSize: 14,
    color: "#CBD5E1",
    lineHeight: 1.6,
    marginTop: 8,
    background: "rgba(255,255,255,0.04)",
    padding: 12,
    borderRadius: 8,
    fontStyle: "italic",
  },

  // Buttons
  nextBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #F59E0B, #D97706)",
    border: "none",
    borderRadius: 10,
    padding: "14px 20px",
    color: "#0F172A",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 14,
    transition: "all 0.15s",
  },
  checkBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #10B981, #059669)",
    border: "none",
    borderRadius: 10,
    padding: "14px 20px",
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  resetBtn: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "10px 20px",
    color: "#94A3B8",
    fontSize: 13,
    cursor: "pointer",
    marginTop: 6,
  },

  // Summary
  summaryCard: {
    textAlign: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "32px 24px",
    marginTop: 40,
  },
  summaryIcon: { fontSize: 56, marginBottom: 12 },
  summaryTitle: { fontSize: 22, fontWeight: 700, color: "#F8FAFC", margin: "0 0 4px" },
  summaryLesson: { fontSize: 15, fontWeight: 400, color: "#94A3B8", margin: "0 0 24px" },
  summaryStats: { display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 },
  summaryStat: { textAlign: "center" },
  summaryStatNum: { fontSize: 24, fontWeight: 700, color: "#F8FAFC" },
  summaryStatLabel: { fontSize: 11, color: "#64748B", marginTop: 2 },
  summaryResults: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, alignItems: "center" },
  summaryResultRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 14 },
  summaryResultType: { color: "#94A3B8" },

  // SRS Review
  srsCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: 16,
    padding: 24,
    textAlign: "center",
    marginTop: 20,
  },
  srsCardType: { fontSize: 12, color: "#A78BFA", marginBottom: 16, fontWeight: 600, textTransform: "uppercase" },
  srsCardFront: { fontSize: 18, color: "#F8FAFC", lineHeight: 1.6, marginBottom: 20, fontWeight: 500 },
  srsCardBack: {
    fontSize: 18,
    color: "#6EE7B7",
    lineHeight: 1.6,
    marginBottom: 20,
    fontWeight: 600,
    padding: 16,
    background: "rgba(16,185,129,0.1)",
    borderRadius: 10,
  },
  showAnswerBtn: {
    background: "rgba(139,92,246,0.2)",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: 10,
    padding: "14px 24px",
    color: "#C4B5FD",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  srsRatingRow: { display: "flex", gap: 10 },
  srsRatingBad: {
    flex: 1,
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  srsRatingGood: {
    flex: 1,
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#6EE7B7",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
};
