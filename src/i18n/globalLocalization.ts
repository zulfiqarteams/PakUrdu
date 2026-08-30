import type { AppLanguage } from "@/features/settings/services/settingsStorage";
import { ui } from "./translations";
import { localizeText } from "./localizeText";

/**
 * Global DOM localization bridge.
 *
 * The application predates a fully centralized i18n boundary, so a number of
 * reusable components/data records still contain literal UI strings. This
 * bridge gives those legacy surfaces the same single language source as the
 * rest of the application without changing their visual structure or routing.
 *
 * Typing targets are intentionally excluded by semantic markers/classes; the
 * Urdu material itself must remain the Urdu material being taught.
 */
const manual: Record<string, Record<AppLanguage, string>> = {
  "Learning content navigation": { en: "Learning content navigation", ur: "سیکھنے کے مواد کی نیویگیشن", roman: "Learning content navigation" },
  "Phonetic keyboard learning topics": { en: "Phonetic keyboard learning topics", ur: "فونیٹک کی بورڈ سیکھنے کے موضوعات", roman: "Phonetic keyboard learning topics" },
  "Biography and Islamic History topics": { en: "Biography and Islamic History topics", ur: "سوانح اور اسلامی تاریخ کے موضوعات", roman: "Sawanih aur Islami tareekh ke mauzuaat" },
  "Course navigation": { en: "Course navigation", ur: "کورس کی نیویگیشن", roman: "Course navigation" },
  "Primary": { en: "Primary", ur: "بنیادی نیویگیشن", roman: "Primary" },
  "Footer": { en: "Footer", ur: "فوٹر", roman: "Footer" },
  "Breadcrumb": { en: "Breadcrumb", ur: "صفحے کا راستہ", roman: "Breadcrumb" },
  "Close dialog": { en: "Close dialog", ur: "ڈائیلاگ بند کریں", roman: "Dialog band karein" },
  "Open menu": { en: "Open menu", ur: "مینو کھولیں", roman: "Menu kholein" },
  "Close menu": { en: "Close menu", ur: "مینو بند کریں", roman: "Menu band karein" },
  "Try the Urdu typing test": { en: "Try the Urdu typing test", ur: "اردو ٹائپنگ ٹیسٹ آزمائیں", roman: "Urdu typing test azmaein" },
  "Test duration": { en: "Test duration", ur: "ٹیسٹ کی مدت", roman: "Test ki muddat" },
  "Custom test duration in seconds": { en: "Custom test duration in seconds", ur: "ٹیسٹ کی مدت سیکنڈز میں درج کریں", roman: "Test ki muddat seconds mein darj karein" },
  "Restart": { en: "Restart", ur: "دوبارہ شروع کریں", roman: "Dobara shuru karein" },
  "On-screen keyboard": { en: "On-screen keyboard", ur: "آن اسکرین کی بورڈ", roman: "On-screen keyboard" },
  "Shift": { en: "Shift", ur: "شفٹ", roman: "Shift" },
  "Space": { en: "Space", ur: "اسپیس", roman: "Space" },
  "Backspace": { en: "Backspace", ur: "بیک اسپیس", roman: "Backspace" },
  "Touch typing finger guide": { en: "Touch typing finger guide", ur: "ٹچ ٹائپنگ انگلیوں کی رہنمائی", roman: "Touch typing finger guide" },
  "Finger guide": { en: "Finger guide", ur: "انگلیوں کی رہنمائی", roman: "Finger guide" },
  "Left and right hand finger guide": { en: "Left and right hand finger guide", ur: "بائیں اور دائیں ہاتھ کی انگلیوں کی رہنمائی", roman: "Left aur right hand finger guide" },
  "Left hand": { en: "Left hand", ur: "بایاں ہاتھ", roman: "Left hand" },
  "Right hand": { en: "Right hand", ur: "دایاں ہاتھ", roman: "Right hand" },
  "LEFT HAND": { en: "LEFT HAND", ur: "بایاں ہاتھ", roman: "LEFT HAND" },
  "RIGHT HAND": { en: "RIGHT HAND", ur: "دایاں ہاتھ", roman: "RIGHT HAND" },
  "Examples": { en: "Examples", ur: "مثالیں", roman: "Misalein" },
  "Review": { en: "Review", ur: "جائزہ", roman: "Jaiza" },
  "Completed": { en: "Completed", ur: "مکمل", roman: "Mukammal" },
  "Reviewed": { en: "Reviewed", ur: "جائزہ لیا گیا", roman: "Jaiza liya gaya" },
  "Mark as reviewed": { en: "Mark as reviewed", ur: "جائزہ مکمل کریں", roman: "Jaiza mukammal karein" },
  "This lesson has no learning steps yet.": { en: "This lesson has no learning steps yet.", ur: "اس سبق میں ابھی سیکھنے کے مراحل موجود نہیں۔", roman: "Is lesson mein abhi learning steps maujood nahi." },
  "Lesson complete": { en: "Lesson complete", ur: "سبق مکمل", roman: "Lesson mukammal" },
  "The lesson is saved to your profile. You can repeat it any time or continue to the next lesson.": { en: "The lesson is saved to your profile. You can repeat it any time or continue to the next lesson.", ur: "سبق آپ کے پروفائل میں محفوظ ہے۔ آپ اسے دوبارہ کر سکتے ہیں یا اگلے سبق پر جا سکتے ہیں۔", roman: "Lesson aapke profile mein mehfooz hai. Aap ise dobara kar sakte hain ya agle lesson par ja sakte hain." },
  "Go to Tests": { en: "Go to Tests", ur: "ٹیسٹس پر جائیں", roman: "Tests par jayein" },
  "Lesson path": { en: "Lesson path", ur: "سبق کا راستہ", roman: "Lesson path" },
  "Keyboard": { en: "Keyboard", ur: "کی بورڈ", roman: "Keyboard" },
  "Target character": { en: "Target character", ur: "مطلوبہ حرف", roman: "Target harf" },
  "Get ready for the next typing step": { en: "Get ready for the next typing step", ur: "اگلے ٹائپنگ مرحلے کے لیے تیار ہوں", roman: "Agley typing marhalay ke liye tayyar hon" },
  "Keyboard position": { en: "Keyboard position", ur: "کی بورڈ کی پوزیشن", roman: "Keyboard position" },
  "Step complete": { en: "Step complete", ur: "مرحلہ مکمل", roman: "Marhala mukammal" },
  "I understand": { en: "I understand", ur: "میں سمجھ گیا/گئی", roman: "Main samajh gaya/gayi" },
  "Lesson navigation": { en: "Lesson navigation", ur: "سبق کی نیویگیشن", roman: "Lesson navigation" },
  "Previous": { en: "Previous", ur: "پچھلا", roman: "Pichla" },
  "Next": { en: "Next", ur: "اگلا", roman: "Agla" },
  "Save for Later": { en: "Save for Later", ur: "بعد کے لیے محفوظ کریں", roman: "Baad ke liye mehfooz karein" },
  "Biography Library": { en: "Biography Library", ur: "سوانح کتب خانہ", roman: "Sawanih Library" },
  "Sources & References": { en: "Sources & References", ur: "ماخذ اور حوالہ جات", roman: "Makhaz aur hawalay" },
  "The Greatest Man in History": { en: "The Greatest Man in History", ur: "تاریخ کی عظیم ترین شخصیت", roman: "Tareekh ki azeem tareen shakhsiyat" },
  "English names، اردو نام، Roman aliases، category اور difficulty سے تلاش کریں۔": { en: "Search by English names, Urdu names, Roman aliases, category and difficulty.", ur: "انگریزی نام، اردو نام، رومن نام، زمرہ اور سطح کے ذریعے تلاش کریں۔", roman: "English names, Urdu names, Roman aliases, category aur difficulty se talash karein." },
  "تمام categories": { en: "All categories", ur: "تمام زمرے", roman: "Tamam categories" },
  "ہر سطح": { en: "Every level", ur: "ہر سطح", roman: "Har satah" },
  "Beginner": { en: "Beginner", ur: "ابتدائی", roman: "Beginner" },
  "Intermediate": { en: "Intermediate", ur: "درمیانی", roman: "Intermediate" },
  "Advanced": { en: "Advanced", ur: "اعلیٰ", roman: "Advanced" },
  "Expert": { en: "Expert", ur: "ماہر", roman: "Expert" },
  "Sources": { en: "Sources", ur: "ماخذ", roman: "Makhaz" },
  "Save": { en: "Save", ur: "محفوظ کریں", roman: "Mehfooz karein" },
  "Save changes": { en: "Save changes", ur: "تبدیلیاں محفوظ کریں", roman: "Tabdeeliyan mehfooz karein" },
  "Saved": { en: "Saved", ur: "محفوظ ہو گیا", roman: "Mehfooz ho gaya" },
  "Profile": { en: "Profile", ur: "پروفائل", roman: "Profile" },
  "Avatar": { en: "Avatar", ur: "اوتار", roman: "Avatar" },
  "Create Profile": { en: "Create Profile", ur: "پروفائل بنائیں", roman: "Profile banayein" },
  "Local profile": { en: "Local profile", ur: "مقامی پروفائل", roman: "Local profile" },
  "Edit": { en: "Edit", ur: "ترمیم", roman: "Edit" },
  "Delete": { en: "Delete", ur: "حذف کریں", roman: "Delete karein" },
  "Local profiles on this device": { en: "Local profiles on this device", ur: "اس ڈیوائس کے مقامی پروفائلز", roman: "Is device ke local profiles" },
  "Typing Test": { en: "Typing Test", ur: "ٹائپنگ ٹیسٹ", roman: "Typing Test" },
  "Choose your practice": { en: "Choose your practice", ur: "اپنی مشق منتخب کریں", roman: "Apni practice muntakhib karein" },
  "Choose a duration": { en: "Choose a duration", ur: "مدت منتخب کریں", roman: "Muddat muntakhib karein" },
  "Select how long you'd like your test to run.": { en: "Select how long you'd like your test to run.", ur: "منتخب کریں کہ ٹیسٹ کتنی دیر چلنا چاہیے۔", roman: "Muntakhib karein ke test kitni dair chalna chahiye." },
  "Minutes": { en: "Minutes", ur: "منٹ", roman: "Minutes" },
  "Start Test": { en: "Start Test", ur: "ٹیسٹ شروع کریں", roman: "Test shuru karein" },
  "Test complete": { en: "Test complete", ur: "ٹیسٹ مکمل", roman: "Test mukammal" },
  "View Full Results": { en: "View Full Results", ur: "مکمل نتائج دیکھیں", roman: "Mukammal nataij dekhein" },
  "New Test": { en: "New Test", ur: "نیا ٹیسٹ", roman: "Naya test" },
  "Your test is complete.": { en: "Your test is complete.", ur: "آپ کا ٹیسٹ مکمل ہو گیا ہے۔", roman: "Aap ka test mukammal ho gaya hai." },
  "Type the passage below until the timer runs out.": { en: "Type the passage below until the timer runs out.", ur: "ٹائمر ختم ہونے تک نیچے دیا گیا متن ٹائپ کریں۔", roman: "Timer khatam hone tak neeche diya gaya matn type karein." },
  "Your local profile stays on this device — no account required.": { en: "Your local profile stays on this device — no account required.", ur: "آپ کا مقامی پروفائل اسی ڈیوائس پر رہتا ہے — اکاؤنٹ کی ضرورت نہیں۔", roman: "Aapka local profile isi device par rehta hai — account ki zaroorat nahi." },
  "Welcome to Urdu Typing Tutorial": { en: "Welcome to Urdu Typing Tutorial", ur: "اردو ٹائپنگ ٹیوٹوریل میں خوش آمدید", roman: "Urdu Typing Tutorial mein khush aamdeed" },
  "Create a local profile to start your learning journey. Your profile stays in this browser — no account is required.": { en: "Create a local profile to start your learning journey. Your profile stays in this browser — no account is required.", ur: "اپنا سیکھنے کا سفر شروع کرنے کے لیے مقامی پروفائل بنائیں۔ پروفائل اسی براؤزر میں محفوظ رہے گا — اکاؤنٹ کی ضرورت نہیں۔", roman: "Apna learning safar shuru karne ke liye local profile banayein. Profile isi browser mein rahega — account ki zaroorat nahi." },
  "Choose a local profile to continue.": { en: "Choose a local profile to continue.", ur: "جاری رکھنے کے لیے مقامی پروفائل منتخب کریں۔", roman: "Jari rakhne ke liye local profile muntakhib karein." },
  "Manage your local profile on this device.": { en: "Manage your local profile on this device.", ur: "اس ڈیوائس پر اپنے مقامی پروفائل کا انتظام کریں۔", roman: "Is device par apne local profile ka intizam karein." },
  "Your Typing Results": { en: "Your Typing Results", ur: "آپ کے ٹائپنگ نتائج", roman: "Aapke typing nataij" },
  "Your previous typing session is no longer available.": { en: "Your previous typing session is no longer available.", ur: "آپ کا پچھلا ٹائپنگ سیشن اب دستیاب نہیں۔", roman: "Aapka pichla typing session ab dastiyab nahi." },
  "Practice session": { en: "Practice session", ur: "مشق کا سیشن", roman: "Practice session" },
  "Correct Characters": { en: "Correct Characters", ur: "درست حروف", roman: "Durust huroof" },
  "Expected": { en: "Expected", ur: "متوقع", roman: "Mutawaqqa" },
  ", typed": { en: ", typed", ur: "، ٹائپ شدہ", roman: ", typed" },
  "New Personal Best": { en: "New Personal Best", ur: "نیا ذاتی بہترین", roman: "Naya zaati best" },
  "Your Learning Progress": { en: "Your Learning Progress", ur: "آپ کی سیکھنے کی پیش رفت", roman: "Aapki learning progress" },
  "A look at how your speed and accuracy improve over time.": { en: "A look at how your speed and accuracy improve over time.", ur: "وقت کے ساتھ آپ کی رفتار اور درستگی میں بہتری کا جائزہ۔", roman: "Waqt ke saath aapki speed aur accuracy mein behtari ka jaiza." },
  "Choose a profile to see your progress": { en: "Choose a profile to see your progress", ur: "اپنی پیش رفت دیکھنے کے لیے پروفائل منتخب کریں", roman: "Apni progress dekhne ke liye profile muntakhib karein" },
  "Progress is tracked per local profile, stored only in this browser.": { en: "Progress is tracked per local profile, stored only in this browser.", ur: "پیش رفت مقامی پروفائل کے مطابق ٹریک ہوتی ہے اور صرف اسی براؤزر میں محفوظ رہتی ہے۔", roman: "Progress local profile ke mutabiq track hoti hai aur sirf isi browser mein mehfooz rehti hai." },
  "Your progress is stored only in this browser.": { en: "Your progress is stored only in this browser.", ur: "آپ کی پیش رفت صرف اسی براؤزر میں محفوظ ہے۔", roman: "Aapki progress sirf isi browser mein mehfooz hai." },
  "Your progress will appear here": { en: "Your progress will appear here", ur: "آپ کی پیش رفت یہاں ظاہر ہوگی", roman: "Aapki progress yahan nazar aayegi" },
  "Complete your first lesson to start tracking speed and accuracy.": { en: "Complete your first lesson to start tracking speed and accuracy.", ur: "رفتار اور درستگی ٹریک کرنے کے لیے اپنا پہلا سبق مکمل کریں۔", roman: "Speed aur accuracy track karne ke liye apna pehla lesson mukammal karein." },
  "Best Accuracy": { en: "Best Accuracy", ur: "بہترین درستگی", roman: "Behtareen accuracy" },
  "Page Not Found": { en: "Page Not Found", ur: "صفحہ نہیں ملا", roman: "Page nahi mila" },
  "Page not found": { en: "Page not found", ur: "صفحہ نہیں ملا", roman: "Page nahi mila" },
  "The page you're looking for doesn't exist. Use the navigation above to get back on track.": { en: "The page you're looking for doesn't exist. Use the navigation above to get back on track.", ur: "آپ جس صفحے کو تلاش کر رہے ہیں وہ موجود نہیں۔ واپس جانے کے لیے اوپر کی نیویگیشن استعمال کریں۔", roman: "Aap jo page dhoond rahe hain woh mojood nahi. Wapas jane ke liye upar navigation istemal karein." },
};

function flattenUiByPath(value: unknown, path: string[] = [], out = new Map<string, string>()): Map<string, string> {
  if (typeof value === "string") {
    out.set(path.join("."), value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenUiByPath(item, [...path, String(index)], out));
    return out;
  }
  if (!value || typeof value !== "object") return out;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    flattenUiByPath(child, [...path, key], out);
  }
  return out;
}

const dictionary: Record<string, Record<AppLanguage, string>> = { ...manual };

const localeMaps = [flattenUiByPath(ui.en), flattenUiByPath(ui.ur), flattenUiByPath(ui.roman)];
for (const [path, en] of localeMaps[0]) {
  const ur = localeMaps[1].get(path);
  const roman = localeMaps[2].get(path);
  if (en && ur && roman) {
    const entry = { en, ur, roman };
    dictionary[en] = entry;
    dictionary[ur] = entry;
    dictionary[roman] = entry;
  }
}

const ATTRIBUTES = ["aria-label", "aria-description", "title", "placeholder", "alt"] as const;
const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Map<string, string>>();

function shouldSkip(el: Element) {
  if (el.closest("script, style, noscript, textarea, [data-localization-ignore], [data-typing-target]")) return true;
  // These are the actual class names the typing surface renders
  // (TypingText.tsx / TypingTestSurface.tsx). The previous selectors here
  // (".typing-display", ".typing-text") never matched anything, so every
  // keystroke's DOM update was walked and diffed against the translation
  // dictionary for no reason — a real source of typing lag.
  if (el.closest(".typing-text-shell, .typing-display-global")) return true;
  return false;
}

function translateTextNode(node: Text, language: AppLanguage) {
  const parent = node.parentElement;
  if (!parent || shouldSkip(parent)) return;
  const source = originalText.get(node) ?? node.nodeValue ?? "";
  if (!source.trim()) return;
  if (!originalText.has(node)) originalText.set(node, source);
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const core = source.trim();
  const centralized = localizeText(source, language);
  if (centralized !== source) {
    if (node.nodeValue !== centralized) node.nodeValue = centralized;
    return;
  }
  const mapped = dictionary[core]?.[language];
  const next = mapped ? `${leading}${mapped}${trailing}` : source;
  if (node.nodeValue !== next) node.nodeValue = next;
}

function translateElementAttributes(el: Element, language: AppLanguage) {
  if (shouldSkip(el)) return;
  let originals = originalAttr.get(el);
  if (!originals) { originals = new Map(); originalAttr.set(el, originals); }
  for (const attr of ATTRIBUTES) {
    if (!el.hasAttribute(attr)) continue;
    const current = el.getAttribute(attr) ?? "";
    if (!originals.has(attr)) originals.set(attr, current);
    const source = originals.get(attr) ?? current;
    const centralized = localizeText(source, language);
    if (centralized !== source) {
      el.setAttribute(attr, centralized);
      continue;
    }
    const mapped = dictionary[source]?.[language];
    if (mapped) el.setAttribute(attr, mapped);
  }
}

export function applyGlobalLocalization(language: AppLanguage, root: ParentNode = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  for (const text of nodes) translateTextNode(text, language);
  if (root instanceof Element) translateElementAttributes(root, language);
  for (const el of Array.from(root.querySelectorAll?.("*") ?? [])) translateElementAttributes(el, language);
}

export function installGlobalLocalization(language: AppLanguage) {
  applyGlobalLocalization(language);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // The typing surface re-renders its character spans on every single
      // keystroke. Before this check, each of those re-renders triggered a
      // full TreeWalker pass + querySelectorAll("*") over the changed
      // subtree just to discover (via shouldSkip) that none of it should
      // be translated — real, measurable input lag while typing. Bailing
      // out here, before any walking happens, keeps typing responsive.
      const target = mutation.target;
      if (target instanceof Element && shouldSkip(target)) continue;
      if (target instanceof Text && target.parentElement && shouldSkip(target.parentElement)) continue;

      for (const added of Array.from(mutation.addedNodes)) {
        if (added.nodeType === Node.TEXT_NODE) translateTextNode(added as Text, language);
        else if (added instanceof Element) {
          if (shouldSkip(added)) continue;
          applyGlobalLocalization(language, added);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return observer;
}
