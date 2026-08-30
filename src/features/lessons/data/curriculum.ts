import { getExpectedKey } from "@/features/keyboard/data/phoneticMap";
import type { Lesson, LessonStep, LessonStepKind } from "@/features/lessons/types";

export interface CharacterDefinition {
  character: string;
  name: string;
  phonetic: string;
  description: string;
  meaning: string;
}

export interface PracticeWord {
  urdu: string;
  transliteration: string;
  meaning: string;
}

const characters: CharacterDefinition[] = [
  ["ا", "Alif", "a", "The long vowel carrier used in many Urdu words.", "alif"],
  ["آ", "Alif Madd", "Shift+A", "The long aa sound used in words such as آج and آسمان.", "long aa"],
  ["ب", "Bay", "b", "The b sound, formed with the lips.", "b sound"],
  ["پ", "Pay", "p", "The p sound used in everyday Urdu words.", "p sound"],
  ["ت", "Tay", "t", "The regular t sound.", "t sound"],
  ["ٹ", "Ṭay", "Shift+T", "The retroflex ṭ sound; curl the tongue slightly back.", "retroflex t"],
  ["ث", "Say", "Shift+C", "The s sound in many Arabic-origin Urdu words.", "s sound"],
  ["ج", "Jeem", "j", "The j sound.", "j sound"],
  ["چ", "Chay", "c", "The ch sound.", "ch sound"],
  ["ح", "Hay", "h", "A breathy h used in Arabic-origin vocabulary.", "h sound"],
  ["خ", "Khay", "Shift+K", "The deep kh sound.", "kh sound"],
  ["د", "Daal", "d", "The d sound.", "d sound"],
  ["ڈ", "Ḍaal", "Shift+D", "The retroflex ḍ sound.", "retroflex d"],
  ["ذ", "Zaal", "Shift+Z", "The z sound used in many Arabic and Persian loanwords.", "z sound"],
  ["ر", "Ray", "r", "The r sound.", "r sound"],
  ["ڑ", "Rray", "Shift+R", "The retroflex ṛ sound found in words such as بڑا.", "retroflex r"],
  ["ز", "Zay", "z", "The regular z sound.", "z sound"],
  ["ژ", "Zhay", "Shift+X", "The zh sound, familiar from words such as ژالہ.", "zh sound"],
  ["س", "Seen", "s", "The regular s sound.", "s sound"],
  ["ش", "Sheen", "x", "The sh sound.", "sh sound"],
  ["ص", "Suaad", "Shift+S", "The s sound in many Arabic-origin words.", "emphatic s"],
  ["ض", "Zuaad", "Shift+J", "The z sound in common Urdu pronunciation.", "z sound"],
  ["ط", "Tuae", "v", "The t sound in Arabic-origin vocabulary.", "emphatic t"],
  ["ظ", "Zoae", "Shift+V", "The z sound in Arabic-origin vocabulary.", "emphatic z"],
  ["ع", "Ain", "e", "A throat-letter used widely in Urdu vocabulary.", "ain"],
  ["غ", "Ghain", "Shift+G", "The gh sound.", "gh sound"],
  ["ف", "Fay", "f", "The f sound.", "f sound"],
  ["ق", "Qaaf", "q", "The q sound.", "q sound"],
  ["ک", "Kaaf", "k", "The k sound.", "k sound"],
  ["گ", "Gaaf", "g", "The g sound.", "g sound"],
  ["ل", "Laam", "l", "The l sound.", "l sound"],
  ["م", "Meem", "m", "The m sound.", "m sound"],
  ["ن", "Noon", "n", "The n sound.", "n sound"],
  ["ں", "Noon Ghunna", "Shift+N", "The nasal ending used in words such as ماں and ہیں.", "nasal n"],
  ["و", "Wow", "w", "The w sound and a common vowel carrier.", "w sound"],
  ["ؤ", "Wao Hamza", "Shift+W", "The hamza form written above wao in words such as مؤثر.", "wao hamza"],
  ["ہ", "Gol Hay", "o", "The regular h sound used in many Urdu words.", "h sound"],
  ["ھ", "Do-Chashmi Hay", "Shift+H", "The aspirating h used in sounds such as بھ, پھ and تھ.", "aspiration marker"],
  ["ء", "Hamza", "u", "A glottal stop used in several Urdu spellings.", "glottal stop"],
  ["ئ", "Hamza on Yay", "Shift+U", "Hamza written on yay, used in spellings such as چائے.", "hamza on yay"],
  ["ی", "Choti Yay", "i", "The y sound and a common vowel carrier.", "y sound"],
  ["ے", "Bari Yay", "y", "The final e/ay sound used in words such as میرے.", "long e/ay"],
].map(([character, name, phonetic, description, meaning]) => ({
  character,
  name,
  phonetic,
  description,
  meaning,
}));

export const characterDefinitions = characters;

const rawPracticeWordBank: [string, string, string][] = [
  ["اب", "ab", "now"], ["با", "baa", "with / by"], ["تا", "taa", "up to"], ["ات", "ut", "that"],
  ["باب", "baab", "chapter / door"], ["بات", "baat", "talk / matter"], ["پتا", "pata", "address / knowledge"], ["تاب", "taab", "strength / patience"],
  ["جا", "jaa", "go"], ["چا", "chaa", "tea (colloquial)"], ["چاپ", "chaap", "print"], ["داد", "daad", "praise / justice"],
  ["دال", "daal", "lentil"], ["رات", "raat", "night"], ["راز", "raaz", "secret"], ["زار", "zaar", "sad / afflicted"],
  ["سارا", "saara", "all / whole"], ["استاد", "ustaad", "teacher"], ["درخت", "darakht", "tree"], ["بڑا", "bara", "big"],
  ["کار", "kaar", "work / car"], ["کاغذ", "kaaghaz", "paper"], ["کتاب", "kitaab", "book"], ["دل", "dil", "heart"],
  ["دال", "daal", "lentil"], ["قلم", "qalam", "pen"], ["کام", "kaam", "work"], ["محمد", "Muhammad", "Muhammad"],
  ["احمد", "Ahmad", "Ahmad"], ["حسن", "Hasan", "Hasan"], ["حسین", "Husain", "Husain"], ["علی", "Ali", "Ali"],
  ["مریم", "Maryam", "Maryam"], ["فاطمہ", "Fatima", "Fatimah"], ["بچہ", "bacha", "child"], ["خاتون", "khaatoon", "woman"],
  ["خواب", "khwaab", "dream"], ["خوش", "khush", "happy"], ["غذا", "ghiza", "food"], ["نماز", "namaaz", "prayer"],
  ["مسجد", "masjid", "mosque"], ["ایمان", "imaan", "faith"], ["اللہ", "Allah", "Allah"], ["قرآن", "Quran", "Qur'an"],
  ["سکول", "school", "school"], ["دوست", "dost", "friend"], ["وقت", "waqt", "time"], ["دن", "din", "day"],
  ["نام", "naam", "name"], ["ہاتھ", "haath", "hand"], ["اچھا", "acha", "good"], ["نیا", "naya", "new"],
  ["چھوٹا", "chhota", "small"], ["صبح", "subah", "morning"], ["شام", "shaam", "evening"], ["کل", "kal", "yesterday / tomorrow"],
  ["میرا", "mera", "my"], ["میری", "meri", "my (feminine)"], ["آپ", "aap", "you"], ["ہم", "hum", "we"],
  ["وہ", "woh", "he / she / that"], ["یہ", "yeh", "this / he / she"], ["باہر", "baahar", "outside"], ["اندر", "andar", "inside"],
  ["کتنی", "kitni", "how many (f.)"], ["کتنا", "kitna", "how much"], ["پھول", "phool", "flower"], ["پہاڑ", "pahaڑ", "mountain"],
  ["زمین", "zameen", "earth / land"], ["دریا", "darya", "river"], ["سمندر", "samandar", "sea"], ["کتابیں", "kitaabein", "books"],
  ["بچوں", "bachon", "children"], ["طالب", "talib", "student"], ["طالبہ", "taliba", "female student"], ["تعلیم", "taleem", "education"],
  ["محنت", "mehnat", "hard work"], ["کامیابی", "kaamyaabi", "success"], ["خاندان", "khandaan", "family"], ["دوستوں", "doston", "friends"],
  ["زندگی", "zindagi", "life"], ["دنیا", "duniya", "world"], ["محبت", "mohabbat", "love"], ["خدمت", "khidmat", "service"],
  ["سلام", "salaam", "greeting / peace"], ["شکریہ", "shukriya", "thank you"], ["براہ", "baraah", "please / by way of"], ["کرنا", "karna", "to do"],
  ["کرتا", "karta", "does (masc.)"], ["کرتے", "karte", "do (plural)"], ["ہے", "hai", "is"], ["ہیں", "hain", "are"],
  ["تھا", "tha", "was"], ["تھی", "thi", "was (f.)"], ["ہوں", "hoon", "am"], ["ہو", "ho", "be / are"],
  ["آج", "aaj", "today"], ["آپ", "aap", "you"], ["پانی", "paani", "water"], ["گھر", "ghar", "house"],
  ["چائے", "chaaye", "tea"], ["عائشہ", "Ayesha", "Ayesha"], ["آسمان", "aasmaan", "sky"], ["ماں", "maan", "mother"],
  ["ماں", "maan", "mother"], ["میرے", "mere", "my"], ["تیرے", "tere", "your (informal)"], ["میرے", "mere", "my"],
  ["بہت", "bohat", "very / much"], ["بھی", "bhi", "also"], ["پھر", "phir", "then / again"], ["پہلے", "pehle", "before / first"],
  ["دوسرا", "doosra", "second / another"], ["ضروری", "zaroori", "necessary"], ["صحت", "sehat", "health"], ["خوبصورت", "khoobsurat", "beautiful"],
  ["پاکستان", "Pakistan", "Pakistan"], ["لاہور", "Lahore", "Lahore"], ["کراچی", "Karachi", "Karachi"], ["اسلام", "Islam", "Islam"],
  ["مسلمان", "muslim", "Muslim"], ["مدرسہ", "madrasa", "school / seminary"], ["استغفار", "istighfaar", "seeking forgiveness"], ["دعا", "dua", "prayer / supplication"],
  ["ایماندار", "imaandaar", "honest / faithful"], ["نمازی", "namazi", "one who prays"], ["مسافر", "musaafir", "traveller"], ["خوشی", "khushi", "happiness"],
  ["امید", "umeed", "hope"], ["محفوظ", "mehfooz", "safe"], ["معلومات", "maloomaat", "information"], ["سوال", "sawaal", "question"],
  ["جواب", "javaab", "answer"], ["مثال", "misaal", "example"], ["سبق", "sabaq", "lesson"], ["مشق", "mashq", "practice"],
  ["رفتار", "raftaar", "speed"], ["درست", "durust", "correct"], ["غلط", "ghalat", "wrong"], ["آسان", "aasaan", "easy"], ["مشکل", "mushkil", "difficult"],
];

export const practiceWordBank: PracticeWord[] = rawPracticeWordBank.map(([urdu, transliteration, meaning]) => ({ urdu, transliteration, meaning }));

const ignoredCharacters = new Set([" ", "،", "۔", "؟", "!", "؟", "،", "٬", "ـ"]);

function requiredCharacterSet(text: string): Set<string> {
  return new Set([...text].filter((character) => !ignoredCharacters.has(character)));
}

function isCurriculumSafe(text: string, learned: Set<string>): boolean {
  return [...requiredCharacterSet(text)].every((character) => learned.has(character));
}

function wordsForLesson(learned: Set<string>, targetCharacter?: string, offset = 0): PracticeWord[] {
  const eligible = practiceWordBank.filter((word) => {
    if (!isCurriculumSafe(word.urdu, learned)) return false;
    return targetCharacter ? word.urdu.includes(targetCharacter) : true;
  });
  if (eligible.length === 0) return [];
  const start = offset % eligible.length;
  return Array.from({ length: Math.min(4, eligible.length) }, (_, index) => eligible[(start + index) % eligible.length]);
}

function combinationTarget(learned: CharacterDefinition[], index: number): string {
  const current = learned[index].character;
  const previous = learned[Math.max(0, index - 1)].character;
  const anchor = learned[Math.max(0, index - 2)].character;
  return `${previous}${current} ${current}${previous} ${anchor}${current} ${current}${anchor}`;
}

function makeStep(
  kind: LessonStepKind,
  title: string,
  instruction: string,
  target?: string,
  options: Partial<LessonStep> = {},
): LessonStep {
  return { id: `${kind}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, kind, title, instruction, target, ...options };
}

function characterLesson(index: number, definition: CharacterDefinition, learned: CharacterDefinition[], moduleId: string, order: number): Lesson {
  const expectedKey = getExpectedKey(definition.character);
  const practiceWords = wordsForLesson(new Set(learned.map((item) => item.character)), definition.character, index);
  const combination = combinationTarget(learned, index);
  const repeated = Array.from({ length: 6 }, () => definition.character).join(" ");
  const wordTarget = practiceWords.map((word) => word.urdu).join(" ");

  const steps: LessonStep[] = [
    // The first character step is deliberately actionable rather than
    // explanatory: the learner sees the Urdu character, its short phonetic
    // cue, the highlighted physical key, and types it once. This keeps the
    // first screen focused on SEE → UNDERSTAND → TYPE.
    makeStep("learn", `Learn ${definition.name}`, `Say: ${definition.name} · Press: ${expectedKey?.key ? expectedKey.key.toUpperCase() : definition.phonetic}`, definition.character, {
      character: definition.character,
      phonetic: definition.phonetic,
      expectedKey,
      minimumAccuracy: 80,
    }),
    makeStep("practice", "Practice the character", `Type ${definition.name} six times.`, repeated, {
      character: definition.character,
      expectedKey,
      minimumAccuracy: 80,
    }),
    makeStep("practice", "Build combinations", `Now combine ${definition.name} with letters you already know.`, combination, {
      character: definition.character,
      expectedKey,
      minimumAccuracy: 80,
    }),
  ];
  if (wordTarget) {
    steps.push(makeStep("practice", "Type real words", `Use ${definition.name} inside real Urdu words.`, wordTarget, {
      character: definition.character,
      expectedKey,
      examples: practiceWords.map((word) => ({ urdu: word.urdu, transliteration: word.transliteration, meaning: word.meaning })),
      minimumAccuracy: 80,
    }));
  }
  steps.push(makeStep("review", "Quick review", `Finish with one short review using ${definition.name} and earlier letters.`, `${definition.character} ${learned[Math.max(0, index - 1)].character} ${definition.character} ${learned[0].character}`, {
    character: definition.character,
    expectedKey,
    minimumAccuracy: 80,
  }));

  return {
    id: `alphabet-${String(index + 1).padStart(2, "0")}-${definition.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    // Must match the level that actually owns `moduleId`
    // (module-letters-1..4 → level-0, per modules.ts). This was
    // previously "level-1" — one level too high — which put every
    // alphabet lesson's *global* sort position (and therefore its
    // sequential-unlock chain) in the wrong bucket entirely.
    levelId: "level-0",
    moduleId,
    order,
    title: `${definition.name} — ${definition.character}`,
    description: `Learn ${definition.name}, the ${definition.character} key, its phonetic sound, finger position, and real Urdu usage.`,
    difficulty: index < 12 ? "Beginner" : "Intermediate",
    objectives: [
      `Recognize ${definition.character} as ${definition.name}.`,
      `Use the correct phonetic key (${definition.phonetic}).`,
      "Build accuracy before speed with combinations and real words.",
    ],
    type: "character",
    targetCharacter: definition.character,
    phonetic: definition.phonetic,
    introducedCharacters: learned.map((item) => item.character),
    requiredAccuracy: 80,
    steps,
    content: {
      explanation: `${definition.character} is ${definition.name}. ${definition.description}`,
      examples: [
        { urdu: definition.character, transliteration: definition.phonetic, meaning: definition.meaning },
        ...practiceWords.slice(0, 3).map((word) => ({ urdu: word.urdu, transliteration: word.transliteration, meaning: word.meaning })),
      ],
      instructions: `Work through each step in order. The keyboard and finger guide follow the real CRULP phonetic mapping used by this app.`,
      exercises: steps.filter((step) => step.target).map((step, exerciseIndex) => ({
        id: `${index + 1}-${exerciseIndex}`,
        type: step.kind === "review" ? "words" : "guidedTyping",
        instruction: step.instruction,
        target: step.target ?? "",
      })),
    },
    metadata: { curriculumStage: "alphabet", characterIndex: index, expectedKey: expectedKey?.key ?? "" },
  };
}

const combinationLessons: Lesson[] = Array.from({ length: 14 }, (_, index) => {
  const start = Math.min(index + 3, characterDefinitions.length - 1);
  const learned = characterDefinitions.slice(0, start + 1);
  const target = `${learned[start - 1].character}${learned[start].character} ${learned[start].character}${learned[start - 2].character} ${learned[start - 2].character}${learned[start - 1].character}${learned[start].character}`;
  const moduleId = index < 8 ? "module-combinations-1" : "module-combinations-2";
  const title = index === 4 || index === 9 || index === 14 ? `Review ${Math.floor(index / 5) + 1}` : `Combination Set ${index + 1}`;
  const type = title.startsWith("Review") ? "review" : "combination";
  return {
    id: `combination-${String(index + 1).padStart(2, "0")}`,
    // module-combinations-1/2 → level-1 (see modules.ts). Was "level-2".
    levelId: "level-1",
    moduleId,
    order: index < 8 ? index + 1 : index - 7,
    title,
    description: "Turn learned letters into connected Urdu shapes and short patterns.",
    difficulty: "Beginner",
    objectives: ["Combine known letters without losing accuracy.", "Keep the correct finger habit while moving between keys."],
    type,
    introducedCharacters: learned.map((item) => item.character),
    requiredAccuracy: 80,
    steps: [
      makeStep("learn", "Understand the pattern", "Read the target from right to left and notice which letters are joining.", undefined, { note: "Urdu letters form connected written shapes, but the phonetic keys remain individual physical keys." }),
      makeStep("observe", "Watch the keyboard", "Follow the highlighted key and finger as you prepare the first combination."),
      makeStep("practice", "Type the combinations", "Type each pattern exactly as shown.", target, { minimumAccuracy: 80 }),
      makeStep("review", "Speed check", "Repeat the same patterns once more with a calm, even rhythm.", `${target} ${target.split(" ").reverse().join(" ")}`, { minimumAccuracy: 85 }),
    ],
    content: {
      explanation: "The next skill is not memorising isolated letters; it is keeping your fingers accurate while letters are combined.",
      examples: target.split(" ").map((urdu) => ({ urdu })),
      instructions: "Focus on the next physical key rather than looking at the whole word at once.",
      exercises: [{ id: `combination-${index + 1}-practice`, type: "guidedTyping", instruction: "Type the combinations.", target }],
    },
    metadata: { curriculumStage: "combinations", set: index + 1 },
  };
});

const wordLessonBands = [
  ["First real words", 8], ["Short everyday words", 12], ["Family and school", 16], ["Home and routine", 20],
  ["Common verbs", 24], ["Daily vocabulary", 28], ["Places and people", 32], ["Faith and values", 36],
  ["Longer words", 41], ["Mixed review", 41], ["Names in Urdu", 41], ["Useful phrases", 41],
  ["Accuracy builder", 41], ["Fluency builder", 41], ["Word review 1", 41], ["Word review 2", 41],
  ["Word review 3", 41], ["Word review 4", 41], ["Word review 5", 41], ["Word review 6", 41],
  ["Word review 7", 41],
] as const;

const wordLessons: Lesson[] = wordLessonBands.map(([title, maxIndex], index) => {
  const learned = new Set(characterDefinitions.slice(0, maxIndex + 1).map((item) => item.character));
  const eligible = practiceWordBank.filter((word) => isCurriculumSafe(word.urdu, learned));
  const chunkSize = Math.max(4, Math.ceil(eligible.length / 24));
  const selected = Array.from({ length: 5 }, (_, offset) => eligible[(index * chunkSize + offset) % eligible.length]);
  const target = selected.map((word) => word.urdu).join(" ");
  const moduleId = index < 8 ? "module-words-foundations" : index < 16 ? "module-words-common" : "module-words-fluency";
  return {
    id: `words-${String(index + 1).padStart(2, "0")}`,
    // module-words-foundations/common/fluency → level-2. Was "level-3".
    levelId: "level-2",
    moduleId,
    order: index < 8 ? index + 1 : index < 16 ? index - 7 : index - 15,
    title: `Word Practice ${index + 1}: ${title}`,
    description: "Build real Urdu typing fluency with a carefully staged word set.",
    difficulty: index < 8 ? "Beginner" : "Intermediate",
    objectives: ["Type real Urdu vocabulary instead of random character strings.", "Keep accuracy high while moving from word to word."],
    type: "word",
    introducedCharacters: characterDefinitions.slice(0, maxIndex + 1).map((item) => item.character),
    requiredAccuracy: 85,
    steps: [
      makeStep("learn", "Preview the words", "Read the Urdu words and their meanings before typing." , undefined, { examples: selected }),
      makeStep("observe", "Prepare your hands", "Look at the first target word and identify the next physical key."),
      makeStep("practice", "Type the word set", "Type all words in order. Spaces are part of the exercise.", target, { minimumAccuracy: 85, examples: selected }),
      makeStep("review", "Review the set", "Repeat the words once more, aiming for smoother rhythm rather than rushing.", target, { minimumAccuracy: 90 }),
    ],
    content: {
      explanation: "Real vocabulary turns individual key knowledge into a usable typing skill. These words are selected only from characters introduced by this stage.",
      examples: selected.map((word) => ({ urdu: word.urdu, transliteration: word.transliteration, meaning: word.meaning })),
      instructions: "Read each word first. Then type the full sequence without skipping spaces.",
      exercises: [{ id: `words-${index + 1}-practice`, type: "words", instruction: "Type the complete word set.", target }],
    },
    metadata: { curriculumStage: "words", wordSet: index + 1 },
  };
});

const sentenceTexts = [
  "میرا نام علی ہے۔",
  "یہ میری کتاب ہے۔",
  "آج موسم اچھا ہے۔",
  "ہم روز اردو کی مشق کرتے ہیں۔",
  "اچھا استاد طلبہ کو درست لکھنا سکھاتا ہے۔",
  "محنت اور صبر سے رفتار اور accuracy دونوں بہتر ہوتی ہیں۔",
];

const sentenceLessons: Lesson[] = sentenceTexts.map((target, index) => ({
  id: `sentences-${String(index + 1).padStart(2, "0")}`,
  // module-sentences → level-3. Was "level-4".
  levelId: "level-3",
  moduleId: "module-sentences",
  order: index + 1,
  title: `Sentence Practice ${index + 1}`,
  description: "Turn familiar words into complete Urdu sentences with punctuation.",
  difficulty: "Intermediate",
  objectives: ["Type complete sentences with spaces and Urdu punctuation.", "Keep rhythm steady across multiple words."],
  type: "sentence",
  requiredAccuracy: 85,
  steps: [
    makeStep("learn", "Read the sentence", "Read the whole sentence once before typing." , undefined, { examples: [{ urdu: target }] }),
    makeStep("observe", "Find the first key", "Notice the highlighted first key and its finger before you begin."),
    makeStep("practice", "Type the sentence", "Type the complete sentence including spaces and the Urdu full stop.", target, { minimumAccuracy: 85 }),
    makeStep("review", "Clean repeat", "Type it again, aiming to reduce hesitation and errors.", target, { minimumAccuracy: 90 }),
  ],
  content: {
    explanation: "Sentence practice adds spacing, punctuation, and sustained attention to the skills you built with individual words.",
    examples: [{ urdu: target }],
    instructions: "Read first, then type from the beginning. Do not rush the final punctuation mark.",
    exercises: [{ id: `sentences-${index + 1}-practice`, type: "sentences", instruction: "Type the sentence.", target }],
  },
  metadata: { curriculumStage: "sentences" },
}));

const paragraphTexts = [
  "صبح جلدی اٹھنا ایک اچھی عادت ہے۔ اس سے دن کے کام وقت پر مکمل ہوتے ہیں۔ ورزش اور ناشتہ بھی اسی وقت میں شامل کریں۔",
  "اردو ایک خوبصورت زبان ہے۔ روزانہ تھوڑی سی مشق سے انگلیوں کو صحیح keys یاد رہتی ہیں۔ accuracy پہلے بہتر کریں اور رفتار بعد میں بڑھائیں۔",
  "ایک اچھا طالب علم سوال پوچھتا ہے، سبق دہراتا ہے اور اپنی غلطیوں سے سیکھتا ہے۔ مسلسل مشق سے typing زیادہ آسان اور تیز ہو جاتی ہے۔",
];

const paragraphLessons: Lesson[] = paragraphTexts.map((target, index) => ({
  id: `paragraphs-${String(index + 1).padStart(2, "0")}`,
  // module-paragraphs → level-4. Was "level-5".
  levelId: "level-4",
  moduleId: "module-paragraphs",
  order: index + 1,
  title: `Fluency Passage ${index + 1}`,
  description: "Sustain accurate Urdu typing across several connected sentences.",
  difficulty: "Intermediate",
  objectives: ["Maintain accuracy across a longer target.", "Recover calmly from mistakes without losing rhythm."],
  type: "paragraph",
  requiredAccuracy: 85,
  steps: [
    makeStep("learn", "Preview the passage", "Read the passage once and notice its punctuation." , undefined, { examples: [{ urdu: target }] }),
    makeStep("observe", "Set your pace", "Keep your wrists relaxed and use the finger guide only when you need it."),
    makeStep("practice", "Type the passage", "Type the full passage from beginning to end.", target, { minimumAccuracy: 85 }),
    makeStep("review", "Fluency repeat", "Repeat the passage and try to make the movement smoother, not merely faster.", target, { minimumAccuracy: 90 }),
  ],
  content: {
    explanation: "Paragraph practice connects words and sentences into sustained writing, preparing you for real documents and tests.",
    targetText: target,
    instructions: "Stay relaxed. Accuracy and consistency are the goal.",
    exercises: [{ id: `paragraphs-${index + 1}-practice`, type: "paragraph", instruction: "Type the complete passage.", target }],
  },
  metadata: { curriculumStage: "paragraphs" },
}));

const professionalTexts = [
  "محترم صاحب، امید ہے آپ خیریت سے ہوں گے۔ درخواست ہے کہ مطلوبہ دستاویزات جلد از جلد ارسال کر دی جائیں تاکہ کام بروقت مکمل ہو سکے۔",
  "محترم طلبہ، براہ کرم مقررہ وقت پر اپنی مشق مکمل کریں۔ درست typing، واضح تحریر اور مستقل محنت آپ کی کارکردگی بہتر بنانے میں مدد دے گی۔",
];

const professionalLessons: Lesson[] = professionalTexts.map((target, index) => ({
  id: `professional-${String(index + 1).padStart(2, "0")}`,
  // module-professional → level-5. Was "level-6".
  levelId: "level-5",
  moduleId: "module-professional",
  order: index + 1,
  title: `Professional Writing ${index + 1}`,
  description: "Practice formal Urdu suitable for school, office, and professional communication.",
  difficulty: "Professional",
  objectives: ["Maintain accuracy in formal Urdu vocabulary.", "Type longer sentences with professional punctuation and spacing."],
  type: "mixed",
  requiredAccuracy: 90,
  steps: [
    makeStep("learn", "Read for meaning", "Understand the formal tone before you type." , undefined, { examples: [{ urdu: target }] }),
    makeStep("observe", "Prepare your hands", "Check the first target key, then settle into a steady rhythm."),
    makeStep("practice", "Type the formal passage", "Type the complete professional text.", target, { minimumAccuracy: 90 }),
    makeStep("review", "Final polish", "Repeat the passage with clean spacing and punctuation.", target, { minimumAccuracy: 92 }),
  ],
  content: {
    explanation: "Professional typing is where accuracy, punctuation, vocabulary, and endurance come together.",
    targetText: target,
    instructions: "Aim for clean, deliberate typing. Speed is secondary to correctness.",
    exercises: [{ id: `professional-${index + 1}-practice`, type: "paragraph", instruction: "Type the formal passage.", target }],
  },
  metadata: { curriculumStage: "professional" },
}));

const masteryTexts = [
  "اردو میں مہارت مسلسل مشق، درست finger placement اور توجہ سے حاصل ہوتی ہے۔ پہلے accuracy بہتر کریں، پھر رفتار بڑھائیں۔",
  "محمد احمد اور فاطمہ نے کتاب، قلم اور کاغذ کے ساتھ اردو typing کی مشق کی۔ انہوں نے غلطیوں کو دیکھا اور دوبارہ درست طریقے سے لکھا۔",
  "اسلامی اور روزمرہ اردو دونوں میں accuracy ضروری ہے۔ قرآن، نماز، مسجد، استاد، دوست اور خاندان جیسے الفاظ کو اعتماد سے لکھیں۔",
  "آج ایک مکمل passage آرام سے ٹائپ کریں، پھر اپنی غلطیوں کو دیکھ کر دوبارہ مشق کریں۔ مستقل مزاجی رفتار سے زیادہ اہم ہے۔",
  "آپ نے Alif سے Yay تک keys سیکھی ہیں۔ اب اپنی رفتار، accuracy اور finger placement کو آزاد practice اور tests میں مضبوط کریں۔",
  "درست اردو تحریر میں punctuation، spaces اور spelling سب اہم ہیں۔ ہر جملے کو سکون سے مکمل کریں اور پھر اپنی غلطیاں دیکھیں۔",
  "آخری review میں عام الفاظ، اسلامی vocabulary اور روزمرہ کے جملے ایک ساتھ آتے ہیں۔ اپنے ہاتھوں کو آرام دہ رکھیں اور confidence کے ساتھ لکھیں۔",
];

const masteryLessons: Lesson[] = masteryTexts.map((target, index) => ({
  id: `mastery-${String(index + 1).padStart(2, "0")}`,
  // module-mastery → level-6 (see modules.ts). Was "level-7", which
  // doesn't exist anywhere in levels.ts (levels only run level-0..6).
  // Two compounding effects: (1) every mastery lesson failed
  // `getLessonContext`'s "unknown level" check and showed "We could
  // not find this lesson"; (2) `getAllLessonsInOrder`'s level-order
  // lookup silently fell back to `0` for a level id it couldn't find,
  // which put all 7 mastery lessons at the very front of the whole
  // course's sequential order — ahead of every alphabet lesson. That
  // pushed "Alif" etc. to position 8+ and made them permanently
  // unlockable only by completing broken, non-existent lessons.
  levelId: "level-6",
  moduleId: "module-mastery",
  order: index + 1,
  title: index === 0 ? "Mastery Passage" : "Final Mixed Review",
  description: "A final mixed lesson combining letters, words, punctuation, and fluent Urdu typing.",
  difficulty: "Professional",
  objectives: ["Demonstrate reliable Urdu phonetic typing across mixed content.", "Prepare for independent practice and timed tests."],
  type: "test",
  requiredAccuracy: 90,
  steps: [
    makeStep("learn", "Set your goal", "Choose accuracy first. Speed will follow a reliable finger habit."),
    makeStep("observe", "Review the keyboard", "Notice that the target keys still follow the same phonetic map you learned from Alif onward."),
    makeStep("practice", "Mastery typing", "Type the full mixed passage.", target, { minimumAccuracy: 90 }),
    makeStep("review", "Final repeat", "Type the passage again and aim for a calm, confident finish.", target, { minimumAccuracy: 92 }),
  ],
  content: {
    explanation: "You now have the complete alphabet, combinations, real words, sentences, and longer passages. This final lesson checks that the habits transfer to mixed Urdu text.",
    targetText: target,
    instructions: "Treat this like a gentle test: accurate, steady, and confident.",
    exercises: [{ id: `mastery-${index + 1}-practice`, type: "paragraph", instruction: "Type the mastery passage.", target }],
  },
  metadata: { curriculumStage: "mastery" },
}));

const alphabetModules = ["module-letters-1", "module-letters-2", "module-letters-3", "module-letters-4"];
const alphabetLessons = characterDefinitions.map((definition, index) => {
  const moduleIndex = index < 10 ? 0 : index < 20 ? 1 : index < 30 ? 2 : 3;
  return characterLesson(index, definition, characterDefinitions.slice(0, index + 1), alphabetModules[moduleIndex], index % 10 + 1);
});

export const generatedLessons: Lesson[] = [
  ...alphabetLessons,
  ...combinationLessons,
  ...wordLessons,
  ...sentenceLessons,
  ...paragraphLessons,
  ...professionalLessons,
  ...masteryLessons,
];

export function getCurriculumLessonCount(): number {
  return generatedLessons.length;
}
