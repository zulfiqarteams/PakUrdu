import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Filter, Headphones,
  Keyboard, ListChecks, RotateCcw, Search, Sparkles, Target, Trophy,
  Volume2, XCircle, Bookmark, BookmarkCheck, Save,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { ContentSidebar } from "@/components/ContentSidebar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { Alert } from "@/components/Alert";
import { cn } from "@/lib/cn";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/i18n/useLanguage";
import { useTypingEngine } from "@/features/typing/hooks/useTypingEngine";
import { TypingCaptureArea } from "@/features/typing/components/TypingCaptureArea";
import { TypingText } from "@/features/typing/components/TypingText";
import { VirtualKeyboard, HandFingerGuide, getExpectedKey, fingerForKey, usePressedKey } from "@/features/keyboard";
import { sahiUrduCategories, sahiUrduWords } from "@/features/sahiUrdu/data/words";
import { getDailyWords, loadSahiUrduProgress, markViewed, recordPractice, recordQuiz } from "@/features/sahiUrdu/services/progress";
import type { UrduWord } from "@/features/sahiUrdu/types";
import { isBookmarked, isSavedLater, toggleBookmark, toggleSavedLater } from "@/features/library/services/savedContent";

const SAHI_URDU_BOOKMARK_PREFIX = "sahi-urdu:word:";
const wordStorageId = (id: string) => `${SAHI_URDU_BOOKMARK_PREFIX}${id}`;

function speak(word: UrduWord) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return { started: false, message: "آپ کے browser میں pronunciation speech support دستیاب نہیں۔" };
  const voices = window.speechSynthesis.getVoices();
  const urduVoice = voices.find((voice) => voice.lang.toLowerCase() === "ur-pk") ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("ur"));
  if (!urduVoice) {
    return { started: false, message: "Urdu pronunciation voice دستیاب نہیں۔ اپنے device/browser میں Urdu text-to-speech voice install کریں۔" };
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.correctWord.replace(/[ًٌٍَُِّْٰٓ]/g, ""));
  utterance.lang = urduVoice.lang || "ur-PK";
  utterance.voice = urduVoice;
  utterance.rate = 0.72;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return { started: true, message: "" };
}

function stripMarks(value: string) {
  return value.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

function ProgressSnapshot() {
  const progress = loadSahiUrduProgress();
  const mastered = Object.values(progress.words).filter((item) => item.mastered).length;
  const viewed = Object.values(progress.words).filter((item) => item.viewed).length;
  const quizAttempts = Object.values(progress.words).reduce((sum, item) => sum + item.quizAttempts, 0);
  const quizCorrect = Object.values(progress.words).reduce((sum, item) => sum + item.quizCorrect, 0);
  return { progress, mastered, viewed, quizAttempts, quizCorrect };
}

function WordCard({ word, status, onOpen }: { word: UrduWord; status?: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group text-start">
      <Card hover className="h-full transition-transform group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1" dir="rtl">
            <p className="urdu-text text-3xl font-bold text-ink">{word.correctWord}</p>
            <p dir="ltr" className="mt-2 text-sm font-medium text-ink-soft">{word.roman ?? "—"}</p>
          </div>
          {status === "mastered" && <CheckCircle2 className="shrink-0 text-success-600" size={20} aria-label="Mastered" />}
        </div>
        <p className="mt-4 text-sm text-ink-soft">{word.meaning}</p>
        {word.commonWrongForms?.length ? (
          <div className="mt-4 rounded-md border border-border bg-paper p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">عام غلط صورت</p>
            <p className="urdu-text mt-1 text-lg text-error-600">{word.commonWrongForms.join("، ")}</p>
          </div>
        ) : word.commonForms?.length ? (
          <div className="mt-4 rounded-md border border-border bg-paper p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">متبادل / عام صورتیں</p>
            <p className="urdu-text mt-1 text-lg text-ink">{word.commonForms.join("، ")}</p>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {word.category.slice(0, 2).map((category) => <Badge key={category}>{category}</Badge>)}
        </div>
      </Card>
    </button>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const snapshot = ProgressSnapshot();
  const daily = getDailyWords(sahiUrduWords);
  const mastery = Math.round((snapshot.mastered / sahiUrduWords.length) * 100);
  const quizAccuracy = snapshot.quizAttempts ? Math.round((snapshot.quizCorrect / snapshot.quizAttempts) * 100) : 0;

  return (
    <>
      <PageHeader title="صحیح اردو" description="اردو کو صحیح پڑھیں، لکھیں اور بولیں — تحقیق شدہ الفاظ کو مشق، تلفظ، املا اور کوئز کے ذریعے سیکھیں۔" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          ["کل الفاظ", sahiUrduWords.length, BookOpen],
          ["سیکھے ہوئے", snapshot.viewed, CheckCircle2],
          ["ماہر الفاظ", snapshot.mastered, Trophy],
          ["کوئز درستگی", `${quizAccuracy}%`, Target],
        ] as [string, string | number, typeof BookOpen][]).map(([label, value, Icon]) => {
          return <Card key={String(label)}><div className="flex items-center justify-between"><div><p className="text-sm text-ink-soft">{label}</p><p className="mt-2 text-2xl font-bold text-ink">{value}</p></div><Icon size={24} className="text-brand-500" /></div></Card>;
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader><CardTitle>آپ کی پیش رفت</CardTitle><CardDescription>الفاظ دیکھنے، مشق کرنے اور ماہر ہونے کی رفتار۔</CardDescription></CardHeader>
          <ProgressBar value={mastery} label="Mastery" />
          <div className="mt-3 flex justify-between text-sm text-ink-soft"><span>Mastery</span><strong>{mastery}%</strong></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-paper p-3"><p className="text-xs text-ink-faint">XP</p><p className="mt-1 text-lg font-bold">{snapshot.progress.xp}</p></div>
            <div className="rounded-md bg-paper p-3"><p className="text-xs text-ink-faint">Streak</p><p className="mt-1 text-lg font-bold">{snapshot.progress.streak}</p></div>
            <div className="rounded-md bg-paper p-3"><p className="text-xs text-ink-faint">آج</p><p className="mt-1 text-lg font-bold">{snapshot.progress.dailyCompleted}/7</p></div>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>سیکھنے کے راستے</CardTitle><CardDescription>ایک ہی reusable learning engine سے مختلف modes۔</CardDescription></CardHeader>
          <div className="grid gap-2">
            <Button to="/sahi-urdu/words" variant="secondary"><BookOpen size={16} />صحیح الفاظ</Button>
            <Button to="/sahi-urdu/diacritics" variant="secondary"><Sparkles size={16} />اعراب سیکھیں</Button>
            <Button to="/sahi-urdu/practice" variant="secondary"><Keyboard size={16} />الفاظ کی مشق</Button>
            <Button to="/sahi-urdu/quiz" variant="primary"><ListChecks size={16} />کوئز شروع کریں</Button>
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-ink">آج کے الفاظ</h2><p className="mt-1 text-sm text-ink-soft">روزانہ کی چھوٹی مگر مستقل مشق۔</p></div><Button to="/sahi-urdu/words" variant="ghost" size="sm">تمام الفاظ <ArrowRight className="directional-icon" size={15} /></Button></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{daily.slice(0, 6).map((word) => <WordCard key={word.id} word={word} onOpen={() => navigate(`/sahi-urdu/word/${word.id}`)} />)}</div>
      </section>
    </>
  );
}

function Library() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") ?? "all";
  useEffect(() => { setCategory(initialCategory); }, [initialCategory]);
  const progress = loadSahiUrduProgress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sahiUrduWords.filter((word) => {
      const matchesQuery = !q || [word.correctWord, word.roman, word.meaning, ...(word.commonWrongForms ?? []), ...(word.commonForms ?? [])].filter(Boolean).some((value) => value!.toLowerCase().includes(q));
      const matchesCategory = category === "all" || word.category.includes(category);
      const matchesDifficulty = difficulty === "all" || word.difficulty === difficulty;
      const wordProgress = progress.words[word.id];
      const matchesStatus = status === "all" || (status === "mastered" && wordProgress?.mastered) || (status === "learning" && wordProgress?.viewed && !wordProgress.mastered) || (status === "new" && !wordProgress?.viewed);
      return matchesQuery && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [query, category, difficulty, status, progress]);

  return (
    <>
      <PageHeader title="صحیح الفاظ" description="اردو، Roman Urdu، عام غلط صورت یا معنی سے تلاش کریں۔" />
      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr_repeat(3,auto)]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="مثلاً دکان، dukaan، دوکان یا shop" aria-label="Search Urdu words" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-sm border border-border bg-surface px-3 py-2 text-sm"><option value="all">تمام categories</option>{sahiUrduCategories.slice(1).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-sm border border-border bg-surface px-3 py-2 text-sm"><option value="all">ہر سطح</option><option value="easy">آسان</option><option value="medium">درمیانہ</option><option value="hard">مشکل</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-sm border border-border bg-surface px-3 py-2 text-sm"><option value="all">تمام status</option><option value="new">باقی</option><option value="learning">زیرِ مطالعہ</option><option value="mastered">سیکھے ہوئے</option></select>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-ink-faint"><Filter size={14} />{filtered.length} الفاظ دکھائے جا رہے ہیں</div>
      </Card>
      {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((word) => <WordCard key={word.id} word={word} status={progress.words[word.id]?.mastered ? "mastered" : undefined} onOpen={() => navigate(`/sahi-urdu/word/${word.id}`)} />)}</div> : <Card><div className="py-12 text-center"><Search className="mx-auto text-ink-faint" size={28}/><p className="mt-3 font-semibold text-ink">کوئی لفظ نہیں ملا</p><p className="mt-1 text-sm text-ink-soft">تلاش یا filters بدل کر دوبارہ کوشش کریں۔</p></div></Card>}
    </>
  );
}

function WordDetail({ word }: { word: UrduWord }) {
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const typingText = stripMarks(word.correctWord);
  const typing = useTypingEngine({ targetText: typingText });
  const pressedKey = usePressedKey(typing.status !== "idle");
  const expectedKey = getExpectedKey(typingText[typing.currentIndex]);
  const finger = expectedKey && expectedKey.key !== "space" ? fingerForKey(expectedKey.key) : null;
  const practicePanelRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const [speechMessage, setSpeechMessage] = useState("");
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(wordStorageId(word.id)));
  const [savedLater, setSavedLater] = useState(() => isSavedLater(wordStorageId(word.id)));

  useEffect(() => { markViewed(word.id); }, [word.id]);
  useEffect(() => {
    setBookmarked(isBookmarked(wordStorageId(word.id)));
    setSavedLater(isSavedLater(wordStorageId(word.id)));
  }, [word.id]);
  useEffect(() => {
    if (!typing.isComplete) return;
    recordPractice(word, true);
  }, [typing.isComplete, word]);

  function listen() {
    const result = speak(word);
    setListening(result.started);
    setSpeechMessage(result.message);
    if (result.started) window.setTimeout(() => setListening(false), 1800);
  }

  function focusPractice() {
    practicePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      practicePanelRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    }, 250);
  }

  function handleBookmark() {
    setBookmarked(toggleBookmark(wordStorageId(word.id)));
  }

  function handleSavedLater() {
    setSavedLater(toggleSavedLater(wordStorageId(word.id)));
  }

  return (
    <>
      <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"><ArrowLeft className="directional-icon" size={16}/> واپس</button>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Card>
            <div className="flex flex-col items-center text-center" dir={direction}>
              <Badge>{word.formStatus === "wrong" ? "غلط" : word.formStatus === "variant" ? "متبادل صورت" : word.formStatus === "common" ? "عام صورت" : "ترجیحی صورت"}</Badge>
              <h1 className="urdu-text mt-5 min-h-[7.5rem] text-6xl font-bold leading-[1.45] text-ink sm:min-h-[9rem] sm:text-7xl sm:leading-[1.4]">{word.correctWord}</h1>
              <p dir="ltr" className="mt-5 text-lg font-medium leading-8 text-ink-soft">{word.roman ?? "—"}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={listen}><Volume2 size={17}/>{listening ? "سنایا جا رہا ہے…" : "تلفظ سنیں"}</Button>
                <Button onClick={focusPractice} variant="primary"><Keyboard size={17}/>Type It</Button>
              </div>
              {speechMessage && <p role="status" className="mt-3 max-w-md text-sm leading-7 text-brand-700">{speechMessage}</p>}
              <div className="mt-5 grid w-full max-w-xl gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-brand-200 bg-brand-50 p-3 text-start">
                  <Button variant={bookmarked ? "primary" : "outline"} size="sm" onClick={handleBookmark}><>{bookmarked ? <BookmarkCheck size={16}/> : <Bookmark size={16}/>} {bookmarked ? "Bookmarked" : "Bookmark"}</></Button>
                  <p className="mt-2 text-xs leading-5 text-brand-800">Bookmark اس لفظ کو ایک مستقل فہرست میں محفوظ کرتا ہے تاکہ آپ اسے بعد میں دوبارہ آسانی سے ڈھونڈ سکیں۔</p>
                </div>
                <div className="rounded-md border border-border-strong bg-paper p-3 text-start">
                  <Button variant={savedLater ? "primary" : "outline"} size="sm" onClick={handleSavedLater}><Save size={16}/>{savedLater ? "Saved" : "Save for Later"}</Button>
                  <p className="mt-2 text-xs leading-5 text-ink-soft">Save for Later اس لفظ کو بعد میں واپس آ کر پڑھنے اور practice مکمل کرنے کے لیے رکھتا ہے۔</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-8 text-ink-soft">{word.meaningUrdu ?? word.meaning}</p>
              <p dir="ltr" className="mt-1 text-sm leading-7 text-ink-faint">{word.meaning}</p>
            </div>
          </Card>

          <Card className="mt-6" dir={direction}>
            <CardHeader><CardTitle>یہ لفظ کیسے سیکھیں؟</CardTitle></CardHeader>
            {word.explanation && <p className="leading-9 text-ink">{word.explanation}</p>}
            {word.commonWrongForms?.length ? <div className="mt-5 rounded-md border border-brand-300 bg-brand-50 p-4"><p className="text-sm font-semibold text-brand-800">عام غلط صورت</p><p className="urdu-text mt-3 text-2xl leading-[2] text-brand-800">{word.commonWrongForms.join("، ")}</p></div> : null}
            {word.commonForms?.length ? <div className="mt-5 rounded-md border border-border bg-paper p-4"><p className="text-sm font-semibold text-ink-soft">عام / متبادل صورتیں</p><p className="urdu-text mt-3 text-2xl leading-[2] text-ink">{word.commonForms.join("، ")}</p></div> : null}
            {word.diacritics && <div className="mt-5 rounded-md border border-brand-200 bg-brand-50 p-4"><p className="text-sm font-semibold text-brand-800">اعراب کے ساتھ</p><p className="urdu-text mt-3 text-3xl font-semibold leading-[2] text-brand-800">{word.diacritics}</p></div>}
            {word.examples?.map((example) => <div key={example} className="mt-5 rounded-md border border-brand-300 bg-brand-50 p-4"><p className="text-xs font-semibold text-brand-700">مثال</p><p className="urdu-text mt-3 text-lg leading-9 text-ink">{example}</p></div>)}
          </Card>
        </div>

        <div ref={practicePanelRef}>
          <Card>
            <CardHeader><CardTitle>اب یہ لفظ ٹائپ کریں</CardTitle><CardDescription>اعراب والے الفاظ کے لیے typing exercise بنیادی حرفی صورت سے مشق شروع کرتی ہے؛ اعراب الگ Unicode practice میں شامل ہیں۔</CardDescription></CardHeader>
            <TypingCaptureArea typing={typing} suppressNativeKeyboardOnTouch>
              <div className="w-full min-w-0 overflow-hidden"><TypingText characters={typing.characters} statusSummary={`${typing.correctCharacters} درست، ${typing.currentIndex} میں سے۔`} /></div>
            </TypingCaptureArea>
            <div className="mt-5"><VirtualKeyboard pressedKey={pressedKey} expectedKey={expectedKey} sizeVariant="compact" onKeyPress={typing.typeCharacter} onBackspace={typing.backspace} /></div>
            <div className="mt-4"><HandFingerGuide activeGuide={finger} /></div>
            <div className="mt-4 flex items-center justify-between text-sm text-ink-soft"><span>Accuracy {typing.accuracy}%</span><span>{typing.currentIndex}/{typing.totalCharacters}</span></div>
            {typing.isComplete && <div className="mt-4 flex items-center justify-between rounded-md bg-brand-50 p-4"><div><p className="font-semibold text-brand-800">مشق مکمل!</p><p className="text-sm text-brand-700">+10 XP</p></div><Button onClick={typing.reset} variant="outline" size="sm"><RotateCcw size={15}/> دوبارہ</Button></div>}
          </Card>
        </div>
      </div>
    </>
  );
}

function Practice() {
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const words = getDailyWords(sahiUrduWords, 10);
  const word = words[index % words.length];
  return <>
    <PageHeader title="الفاظ کی مشق" description="روزانہ کے منتخب الفاظ کو ایک ایک کر کے سیکھیں، سنیں اور ٹائپ کریں۔" />
    <Card>
      <div className="flex items-center justify-between text-sm text-ink-soft"><span>لفظ {index + 1} از {words.length}</span><span>روزانہ مشق</span></div>
      <div className="mt-6 text-center" dir={direction}><p className="urdu-text text-6xl font-bold text-ink">{word.correctWord}</p><p dir="ltr" className="mt-3 text-lg text-ink-soft">{word.roman}</p><p className="mt-3 text-sm text-ink-soft">{word.meaningUrdu ?? word.meaning}</p></div>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={() => speak(word)}><Headphones size={16}/> سنیں</Button><Button onClick={() => navigate(`/sahi-urdu/word/${word.id}`)}><Keyboard size={16}/> ٹائپنگ شروع کریں</Button></div>
      <div className="mt-6 flex justify-between"><Button variant="ghost" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}><ArrowLeft className="directional-icon" size={15}/> پچھلا</Button><Button variant="ghost" onClick={() => setIndex((value) => (value + 1) % words.length)}>اگلا <ArrowRight className="directional-icon" size={15}/></Button></div>
    </Card>
  </>;
}

function Diacritics() {
  const { direction } = useLanguage();
  const marks = [
    ["زبر", "َ", "a"], ["زیر", "ِ", "i"], ["پیش", "ُ", "u"], ["جزم", "ْ", "ْ"], ["تشدید", "ّ", "ّ"], ["کھڑا زبر", "ٰ", "ٰ"], ["مد", "ٓ", "ٓ"],
  ];
  const [index, setIndex] = useState(0);
  const target = marks[index][1];
  const typing = useTypingEngine({ targetText: target });
  const pressedKey = usePressedKey(typing.status !== "idle");
  const expectedKey = getExpectedKey(target);
  return <>
    <PageHeader title="اعراب" description="زبر، زیر، پیش، جزم، تشدید اور دوسرے Unicode اعراب کو الگ مشق کریں۔" />
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card dir={direction}><CardHeader><CardTitle>{marks[index][0]}</CardTitle><CardDescription>Unicode character</CardDescription></CardHeader><p className="urdu-text text-center text-8xl font-bold">{target}</p><p dir="ltr" className="mt-4 text-center text-sm text-ink-soft">{marks[index][2]}</p><div className="mt-6 flex justify-between"><Button variant="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>پچھلا</Button><Button variant="ghost" disabled={index === marks.length - 1} onClick={() => setIndex(index + 1)}>اگلا</Button></div></Card>
      <Card><CardHeader><CardTitle>صحیح اعراب ٹائپ کریں</CardTitle><CardDescription>یہ exercise اصل combining mark کو target کے طور پر استعمال کرتی ہے۔</CardDescription></CardHeader><TypingCaptureArea typing={typing}><div className="w-full min-w-0 overflow-hidden"><TypingText characters={typing.characters} statusSummary={`${typing.correctCharacters} درست، ${typing.currentIndex} میں سے۔`} /></div></TypingCaptureArea><div className="mt-5"><VirtualKeyboard pressedKey={pressedKey} expectedKey={expectedKey} onKeyPress={typing.typeCharacter} /></div>{typing.isComplete && <Alert variant="success" className="mt-4">درست! یہ Unicode اعراب رجسٹر ہو گیا۔</Alert>}</Card>
    </div>
  </>;
}

function Quiz() {
  const { direction } = useLanguage();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(() => makeQuestions());
  const question = questions[index];
  const answered = selected !== null;
  const correct = selected === question.answer;

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    recordQuiz(question.word.id, option === question.answer);
    if (option === question.answer) setScore((value) => value + 1);
  }

  function next() {
    if (index >= questions.length - 1) {
      setQuestions(makeQuestions());
      setIndex(0);
      setSelected(null);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  return <>
    <PageHeader title="کوئز" description="سوالات dataset سے dynamically بنتے ہیں اور آپ کی غلطیوں کو progress میں محفوظ کیا جاتا ہے۔" />
    <Card>
      <div className="flex items-center justify-between text-sm text-ink-soft"><span>سوال {index + 1} / {questions.length}</span><strong>Score {score}</strong></div>
      <div className="mt-8 text-center" dir={direction}><Badge>{question.type}</Badge><h2 className="urdu-text mt-5 text-4xl font-bold text-ink">{question.prompt}</h2></div>
      <div className="mx-auto mt-8 grid max-w-2xl gap-3">{question.options.map((option) => <button key={option} type="button" onClick={() => choose(option)} className={cn("rounded-md border p-4 text-start transition-colors", selected === option && option === question.answer ? "border-success-500 bg-success-50" : selected === option ? "border-error-500 bg-error-50" : "border-border bg-paper hover:bg-surface")}><span className="urdu-text text-2xl">{option}</span></button>)}</div>
      {answered && <div className={cn("mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-md p-4", correct ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700")}><span>{correct ? <CheckCircle2/> : <XCircle/>}</span><div><p className="font-semibold">{correct ? "درست جواب" : "دوبارہ مشق کی ضرورت ہے"}</p><p className="text-sm">{question.word.explanation ?? "لفظ کی تفصیل word detail میں دیکھیں۔"}</p></div></div>}
      {answered && <div className="mt-6 flex justify-end"><Button onClick={next}>{index === questions.length - 1 ? "نیا کوئز" : "اگلا سوال"} <ArrowRight className="directional-icon" size={15}/></Button></div>}
    </Card>
  </>;
}

type QuizQuestion = { type: string; word: UrduWord; prompt: string; options: string[]; answer: string };
function makeQuestions(): QuizQuestion[] {
  const pool = [...sahiUrduWords].sort(() => Math.random() - 0.5).slice(0, 10);
  return pool.map((word, i) => {
    if (word.commonWrongForms?.length) {
      const wrong = word.commonWrongForms[0];
      const distractor = sahiUrduWords.find((candidate) => candidate.id !== word.id)?.correctWord ?? "لفظ";
      return { type: "صحیح املا", word, prompt: `صحیح صورت منتخب کریں: ${wrong}`, options: shuffle([word.correctWord, wrong, distractor]), answer: word.correctWord };
    }
    if (word.diacritics) {
      const distractor = sahiUrduWords.find((candidate) => candidate.diacritics && candidate.id !== word.id)?.diacritics ?? "—";
      return { type: "صحیح اعراب", word, prompt: `صحیح ضبط منتخب کریں: ${stripMarks(word.correctWord)}`, options: shuffle([word.diacritics, distractor, word.correctWord]), answer: word.diacritics };
    }
    const distractors = sahiUrduWords.filter((candidate) => candidate.id !== word.id).slice(i, i + 2).map((candidate) => candidate.meaning);
    return { type: "معنی", word, prompt: word.correctWord, options: shuffle([word.meaning, ...distractors]), answer: word.meaning };
  });
}
function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

function ProgressPage() {
  const snapshot = ProgressSnapshot();
  const rows = sahiUrduWords.filter((word) => snapshot.progress.words[word.id]?.viewed).slice(0, 30);
  return <>
    <PageHeader title="میری پیش رفت" description="آپ نے کون سے الفاظ دیکھے، مشق کیے اور master کیے۔" />
    <div className="grid gap-4 sm:grid-cols-3"><Card><p className="text-sm text-ink-soft">XP</p><p className="mt-2 text-3xl font-bold">{snapshot.progress.xp}</p></Card><Card><p className="text-sm text-ink-soft">Streak</p><p className="mt-2 text-3xl font-bold">{snapshot.progress.streak}</p></Card><Card><p className="text-sm text-ink-soft">Mastered</p><p className="mt-2 text-3xl font-bold">{snapshot.mastered}</p></Card></div>
    <Card className="mt-6"><CardHeader><CardTitle>حال ہی میں پڑھے گئے الفاظ</CardTitle></CardHeader>{rows.length ? <div className="divide-y divide-border">{rows.map((word) => { const state = snapshot.progress.words[word.id]; return <Link key={word.id} to={`/sahi-urdu/word/${word.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-paper"><span className="urdu-text text-xl font-semibold">{word.correctWord}</span><span className="text-sm text-ink-soft">{state.mastered ? "Mastered" : `${state.practiceCount} مشق`}</span></Link>; })}</div> : <p className="py-8 text-center text-sm text-ink-soft">ابھی کوئی لفظ شروع نہیں کیا۔</p>}</Card>
  </>;
}

export default function SahiUrdu() {
  const location = useLocation();
  const { id } = useParams();
  const segments = location.pathname.replace(/^\/sahi-urdu\/?/, "").split("/").filter(Boolean);
  const mode = segments[0] ?? "dashboard";
  const wordId = segments[0] === "word" ? segments[1] : id;
  const word = wordId ? sahiUrduWords.find((item) => item.id === wordId) : undefined;
  const seoTitle = word ? `${word.correctWord} — صحیح اردو` : mode === "dashboard" ? "صحیح اردو — Correct Urdu Words" : `صحیح اردو — ${mode}`;
  const seoDescription = word
    ? `Learn the correct Urdu spelling, meaning, common forms and typing practice for ${word.correctWord}.`
    : "Learn correct Urdu spelling, diacritics, vocabulary and typing through PAKURDU's guided practice.";
  useSEO({ title: seoTitle, description: seoDescription, noIndex: mode === "progress" || mode === "quiz" });

  const content = mode === "word" && word ? <WordDetail word={word}/> : mode === "word" && !word ? (
    <Card><div className="py-12 text-center"><p className="font-semibold">لفظ نہیں ملا</p><Button to="/sahi-urdu/words" className="mt-4">Word Library</Button></div></Card>
  ) : (
    <>
      {mode === "words" && <Library/>}
      {mode === "practice" && <Practice/>}
      {mode === "diacritics" && <Diacritics/>}
      {mode === "quiz" && <Quiz/>}
      {mode === "progress" && <ProgressPage/>}
      {(mode === "dashboard" || !["words", "practice", "diacritics", "quiz", "progress"].includes(mode)) && <Dashboard/>}
    </>
  );

  return <PageContainer><div className="py-8 sm:py-10"><div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start"><ContentSidebar/><main className="min-w-0">{content}</main></div></div></PageContainer>;
}
