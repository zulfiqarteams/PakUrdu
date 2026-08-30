import type { AppLanguage } from "@/features/settings/services/settingsStorage";
import { ui } from "./translations";

export type LocalizedText = [source: string, en: string, ur: string, roman: string];

/**
 * Central source-string catalog for legacy/static UI chrome. Intentional
 * lesson/typing content is not included here, so functional Urdu material
 * is never translated accidentally.
 */
const entries: LocalizedText[] = [
  ["Primary", "Primary", "بنیادی نیویگیشن", "Primary"],
  ["Urdu Letters", "Urdu Letters", "اردو حروف", "Urdu huruf"],
  ["Urdu Phonetic Typing", "Urdu Phonetic Typing", "اردو فونیٹک ٹائپنگ", "Urdu phonetic typing"],
  ["Learn to type Urdu using a phonetic keyboard — from your very first letter to professional, paragraph-length writing.", "Learn to type Urdu using a phonetic keyboard — from your very first letter to professional, paragraph-length writing.", "فونیٹک کی بورڈ کے ذریعے اردو ٹائپ کرنا سیکھیں — پہلے حرف سے پیشہ ورانہ اور پیراگراف کی سطح کی تحریر تک۔", "Phonetic keyboard ke zariye Urdu type karna seekhein — pehle harf se professional aur paragraph-level tehreer tak."],
  ["Learn Alif through Yay one character at a time, with the correct key and finger.", "Learn Alif through Yay one character at a time, with the correct key and finger.", "الف سے ے تک ہر حرف کو درست key اور انگلی کے ساتھ ایک ایک کر کے سیکھیں۔", "Alif se Yay tak har harf ko durust key aur ungli ke saath aik aik kar ke seekhein."],
  ["Turn individual letters into connected patterns while keeping your finger habits accurate.", "Turn individual letters into connected patterns while keeping your finger habits accurate.", "انفرادی حروف کو جڑے ہوئے پیٹرنز میں استعمال کریں اور انگلیوں کی عادت درست رکھیں۔", "Infiradi huruf ko juray huay patterns mein istemal karein aur ungliyon ki aadat durust rakhein."],
  ["Move from combinations to a large bank of useful Urdu vocabulary.", "Move from combinations to a large bank of useful Urdu vocabulary.", "امتزاج سے مفید اردو الفاظ کے بڑے ذخیرے تک بڑھیں۔", "Imtizaj se mufeed Urdu alfaaz ke baray zakheeray tak barhein."],
  ["Type complete Urdu sentences with spaces and punctuation.", "Type complete Urdu sentences with spaces and punctuation.", "spaces اور رموزِ اوقاف کے ساتھ مکمل اردو جملے ٹائپ کریں۔", "Spaces aur ramooz-e-auqaaf ke saath mukammal Urdu jumlay type karein."],
  ["Build endurance with realistic multi-sentence Urdu passages.", "Build endurance with realistic multi-sentence Urdu passages.", "حقیقی کئی جملوں والے اردو متون سے ٹائپنگ کی برداشت بڑھائیں۔", "Haqeeqi kai jumlon walay Urdu matoon se typing ki bardasht barhaein."],
  ["Practice formal Urdu suitable for school, office, and professional communication.", "Practice formal Urdu suitable for school, office, and professional communication.", "اسکول، دفتر اور پیشہ ورانہ رابطے کے لیے موزوں رسمی اردو کی مشق کریں۔", "School, daftar aur professional rabtay ke liye mozoon rasmi Urdu ki practice karein."],
  ["Finish the guided course with a mixed passage before moving to independent tests.", "Finish the guided course with a mixed passage before moving to independent tests.", "آزاد ٹیسٹ سے پہلے مخلوط متن کے ساتھ رہنمائی والا کورس مکمل کریں۔", "Azad tests se pehle makhlut matn ke saath rehnumai wala course mukammal karein."],
  ["Letter Combinations", "Letter Combinations", "حروف کے امتزاج", "Huruf ke imtizaj"],
  ["Words", "Words", "الفاظ", "Alfaaz"],
  ["Sentences", "Sentences", "جملے", "Jumlay"],
  ["Paragraphs", "Paragraphs", "پیراگراف", "Paragraphs"],
  ["Professional Typing", "Professional Typing", "پیشہ ورانہ ٹائپنگ", "Peshawaranaa typing"],
  ["Mastery", "Mastery", "مہارت", "Maharat"],
  ["Alif to Daal", "Alif to Daal", "الف سے دال تک", "Alif se Daal tak"],
  ["Daal to Sheen", "Daal to Sheen", "دال سے شین تک", "Daal se Sheen tak"],
  ["Suaad to Gaaf", "Suaad to Gaaf", "صاد سے گاف تک", "Suaad se Gaaf tak"],
  ["Laam to Yay", "Laam to Yay", "لام سے ے تک", "Laam se Yay tak"],
  ["Build the Shape", "Build the Shape", "شکل بنائیں", "Shakal banayein"],
  ["Review the Pattern", "Review the Pattern", "پیٹرن کا جائزہ", "Pattern ka jaiza"],
  ["Word Foundations", "Word Foundations", "الفاظ کی بنیاد", "Alfaaz ki bunyaad"],
  ["Common Vocabulary", "Common Vocabulary", "عام الفاظ", "Aam alfaaz"],
  ["Word Fluency", "Word Fluency", "الفاظ میں روانی", "Alfaaz mein rawani"],
  ["Complete Sentences", "Complete Sentences", "مکمل جملے", "Mukammal jumlay"],
  ["Fluency Passages", "Fluency Passages", "روانی کے متن", "Rawani ke matn"],
  ["Formal Writing", "Formal Writing", "رسمی تحریر", "Rasmi tehreer"],
  ["Final Mastery", "Final Mastery", "حتمی مہارت", "Hatmi maharat"],
  ["Learn Alif, the ا key, its phonetic sound, finger position, and real Urdu usage.", "Learn Alif, the ا key, its phonetic sound, finger position, and real Urdu usage.", "الف، اس کی ا key، صوتی آواز، انگلی کی پوزیشن اور حقیقی اردو استعمال سیکھیں۔", "Alif, is ki ا key, phonetic sound, finger position aur real Urdu usage seekhein."],
  ["Learn the Urdu letter Alif. Free Urdu typing lesson 1 of 95 on PAKURDU.", "Learn the Urdu letter Alif. Free Urdu typing lesson 1 of 95 on PAKURDU.", "اردو حرف الف سیکھیں۔ PAKURDU پر مفت اردو ٹائپنگ کا پہلا سبق۔", "Urdu harf Alif seekhein. PAKURDU par muft Urdu typing ka pehla lesson."],
  ["Practice the character", "Practice the character", "حرف کی مشق کریں", "Harf ki practice karein"],
  ["Build combinations", "Build combinations", "حروف ملائیں", "Huruf milaen"],
  ["Type real words", "Type real words", "حقیقی الفاظ ٹائپ کریں", "Haqeeqi alfaaz type karein"],
  ["Quick review", "Quick review", "مختصر جائزہ", "Mukhtasar jaiza"],
  ["Understand the pattern", "Understand the pattern", "پیٹرن سمجھیں", "Pattern samjhein"],
  ["Watch the keyboard", "Watch the keyboard", "کی بورڈ دیکھیں", "Keyboard dekhein"],
  ["Type the combinations", "Type the combinations", "امتزاج ٹائپ کریں", "Imtizaj type karein"],
  ["Speed check", "Speed check", "رفتار جانچیں", "Raftaar jaanchein"],
  ["Preview the words", "Preview the words", "الفاظ دیکھیں", "Alfaaz dekhein"],
  ["Prepare your hands", "Prepare your hands", "اپنی انگلیاں تیار کریں", "Apni ungliyan tayyar karein"],
  ["Type the word set", "Type the word set", "الفاظ کا مجموعہ ٹائپ کریں", "Alfaaz ka majmua type karein"],
  ["Review the set", "Review the set", "مجموعے کا جائزہ لیں", "Majmuay ka jaiza lein"],
  ["Read the sentence", "Read the sentence", "جملہ پڑھیں", "Jumla parhein"],
  ["Find the first key", "Find the first key", "پہلی key تلاش کریں", "Pehli key talash karein"],
  ["Type the sentence", "Type the sentence", "جملہ ٹائپ کریں", "Jumla type karein"],
  ["Clean repeat", "Clean repeat", "صاف انداز میں دوبارہ ٹائپ کریں", "Saaf andaaz mein dobara type karein"],
  ["Preview the passage", "Preview the passage", "متن دیکھیں", "Matn dekhein"],
  ["Set your pace", "Set your pace", "اپنی رفتار طے کریں", "Apni raftaar tay karein"],
  ["Type the passage", "Type the passage", "متن ٹائپ کریں", "Matn type karein"],
  ["Fluency repeat", "Fluency repeat", "روانی کی دوبارہ مشق", "Rawani ki dobara practice"],
  ["Read for meaning", "Read for meaning", "معنی کے لیے پڑھیں", "Maana ke liye parhein"],
  ["Type the formal passage", "Type the formal passage", "رسمی متن ٹائپ کریں", "Rasmi matn type karein"],
  ["Final polish", "Final polish", "حتمی صفائی", "Hatmi safai"],
  ["Set your goal", "Set your goal", "اپنا مقصد طے کریں", "Apna maqsad tay karein"],
  ["Review the keyboard", "Review the keyboard", "کی بورڈ کا جائزہ لیں", "Keyboard ka jaiza lein"],
  ["Mastery typing", "Mastery typing", "مہارت کی ٹائپنگ", "Maharat typing"],
  ["Final repeat", "Final repeat", "حتمی دوبارہ مشق", "Hatmi dobara practice"],
  ["Type the character", "Type the character", "حرف ٹائپ کریں", "Harf type karein"],
  ["Read the target from right to left and notice which letters are joining.", "Read the target from right to left and notice which letters are joining.", "ہدف کو دائیں سے بائیں پڑھیں اور دیکھیں کہ کون سے حروف جڑ رہے ہیں۔", "Target ko right se left parhein aur dekhein ke kaun se huruf jur rahe hain."],
  ["Follow the highlighted key and finger as you prepare the first combination.", "Follow the highlighted key and finger as you prepare the first combination.", "پہلا امتزاج تیار کرتے ہوئے نمایاں key اور انگلی کی رہنمائی دیکھیں۔", "Pehla imtizaj tayyar karte huay numayan key aur ungli ki rehnumai dekhein."],
  ["Type each pattern exactly as shown.", "Type each pattern exactly as shown.", "ہر پیٹرن کو بالکل دکھائی گئی صورت میں ٹائپ کریں۔", "Har pattern ko bilkul dikhai gayi surat mein type karein."],
  ["Repeat the same patterns once more with a calm, even rhythm.", "Repeat the same patterns once more with a calm, even rhythm.", "انہی پیٹرنز کو ایک بار پھر پرسکون اور ہموار رفتار سے ٹائپ کریں۔", "Inhi patterns ko aik baar phir pursukoon aur hamwar raftaar se type karein."],
  ["Read the Urdu words and their meanings before typing.", "Read the Urdu words and their meanings before typing.", "ٹائپ کرنے سے پہلے اردو الفاظ اور ان کے معنی پڑھیں۔", "Type karne se pehle Urdu alfaaz aur un ke maani parhein."],
  ["Look at the first target word and identify the next physical key.", "Look at the first target word and identify the next physical key.", "پہلا ہدف لفظ دیکھیں اور اگلی physical key پہچانیں۔", "Pehla target lafz dekhein aur agli physical key pehchanain."],
  ["Type all words in order. Spaces are part of the exercise.", "Type all words in order. Spaces are part of the exercise.", "تمام الفاظ ترتیب سے ٹائپ کریں۔ spaces بھی مشق کا حصہ ہیں۔", "Tamam alfaaz tartib se type karein. Spaces bhi practice ka hissa hain."],
  ["Repeat the words once more, aiming for smoother rhythm rather than rushing.", "Repeat the words once more, aiming for smoother rhythm rather than rushing.", "الفاظ ایک بار پھر ٹائپ کریں اور جلدی کے بجائے ہموار رفتار پر توجہ دیں۔", "Alfaaz aik baar phir type karein aur jaldi ke bajaye hamwar raftaar par tawajjo dein."],
  ["تمام الفاظ", "All words", "تمام الفاظ", "Tamam alfaaz"],
  ["روزمرہ", "Everyday", "روزمرہ", "Rozmarrah"],
  ["عربی الاصل", "Arabic-origin", "عربی الاصل", "Arabi-ul-asl"],
  ["متشابہ الفاظ", "Similar words", "متشابہ الفاظ", "Mutashabah alfaaz"],
  ["ہمزہ", "Hamza", "ہمزہ", "Hamza"],
  ["ی / ے", "Yay forms", "ی / ے", "Yay forms"],
  ["اسلامی شخصیات", "Islamic figures", "اسلامی شخصیات", "Islami shakhsiyat"],
  ["خاندانِ رسول ﷺ", "Family of the Prophet ﷺ", "خاندانِ رسول ﷺ", "Khandan-e-Rasool ﷺ"],
  ["خلفائے راشدین", "Rightly Guided Caliphs", "خلفائے راشدین", "Khulafa-e-Rashideen"],
  ["صحابہ کرام", "Companions", "صحابہ کرام", "Sahaba Karam"],
  ["اسلامی علماء", "Islamic scholars", "اسلامی علماء", "Islami ulama"],
  ["مسلم سائنس دان", "Muslim scientists", "مسلم سائنس دان", "Muslim scientists"],
  ["اسلامی تاریخ", "Islamic history", "اسلامی تاریخ", "Islami tareekh"],
  ["تمام شخصیات", "All figures", "تمام شخصیات", "Tamam shakhsiyat"],
  ["Read → Learn → Practice", "Read → Learn → Practice", "پڑھیں → سیکھیں → مشق کریں", "Parhein → Seekhein → Practice karein"],
  ["Featured biographies", "Featured biographies", "نمایاں سوانح", "Numayan sawanih"],
  ["کل شخصیات", "Total figures", "کل شخصیات", "Kul shakhsiyat"],
  ["دیکھی گئی", "Viewed", "دیکھی گئی", "Dekhi gayi"],
  ["مطالعہ شروع", "Started reading", "مطالعہ شروع", "Mutala shuru"],
  ["آپ کی پیش رفت", "Your progress", "آپ کی پیش رفت", "Aapki progress"],
  ["سیکھنے کے راستے", "Learning paths", "سیکھنے کے راستے", "Seekhne ke rastay"],
  ["آج کے الفاظ", "Today's words", "آج کے الفاظ", "Aaj ke alfaaz"],
  ["روزانہ مشق", "Daily practice", "روزانہ مشق", "Rozana practice"],
  ["تلفظ سنیں", "Listen to pronunciation", "تلفظ سنیں", "Talafuz sunein"],
  ["سنایا جا رہا ہے…", "Playing pronunciation…", "سنایا جا رہا ہے…", "Pronunciation chal rahi hai…"],
  ["ترجیحی صورت", "Preferred form", "ترجیحی صورت", "Tarjeeh di hui surat"],
  ["متبادل صورت", "Alternative form", "متبادل صورت", "Mutabadil surat"],
  ["عام صورت", "Common form", "عام صورت", "Aam surat"],
  ["سیرت شروع کریں", "Start biography", "سیرت شروع کریں", "Seerat shuru karein"],
  ["تعارف اور جامع مطالعہ", "Introduction and in-depth study", "تعارف اور جامع مطالعہ", "Taaruf aur jami mutala"],
  ["اہم واقعات کو ترتیب کے ساتھ دیکھیں؛ اختلافی امور کو جہاں ضروری ہو محتاط انداز میں بیان کیا گیا ہے۔", "View important events in order; disputed matters are described carefully where necessary.", "اہم واقعات کو ترتیب کے ساتھ دیکھیں؛ اختلافی امور کو جہاں ضروری ہو محتاط انداز میں بیان کیا گیا ہے۔", "Aham waqiat ko tarteeb ke saath dekhein; ikhtilafi umoor ko jahan zaroori ho mohtaat andaaz mein bayan kiya gaya hai."],
  ["Learner level", "Learner level", "سیکھنے کی سطح", "Seekhne ki satah"],
  ["Seven children's basic lineage; six from Khadijah رضي الله عنها and Ibrahim رضي الله عنه from Mariyah Qibtiyyah رضي الله عنها.", "Seven children's basic lineage; six from Khadijah رضي الله عنها and Ibrahim رضي الله عنه from Mariyah Qibtiyyah رضي الله عنها.", "سات بچوں کی بنیادی نسبت؛ چھ حضرت خدیجہ رضی اللہ عنہا سے اور حضرت ابراہیم رضی اللہ عنہ حضرت ماریہ قبطیہ رضی اللہ عنہا سے۔", "Saat bachon ki bunyadi nisbat; chhe Hazrat Khadijah رضی اللہ عنہا se aur Hazrat Ibrahim رضی اللہ عنہ Hazrat Mariyah Qibtiyyah رضی اللہ عنہا se."],
  ["Search", "Search", "تلاش", "Talash"],
  ["Remove", "Remove", "ہٹائیں", "Hataein"],
  ["No saved biographies yet.", "No saved biographies yet.", "ابھی کوئی محفوظ سوانح نہیں۔", "Abhi koi mehfooz sawanih nahi."],
  ["Mastery", "Mastery", "مہارت", "Maharat"],
  ["Score", "Score", "اسکور", "Score"],
  ["Read", "Read", "پڑھیں", "Parhein"],
  ["Practice", "Practice", "مشق", "Practice"],
  ["Daily practice", "Daily practice", "روزانہ مشق", "Rozana practice"],
  ["Word Practice", "Word Practice", "الفاظ کی مشق", "Alfaaz ki practice"],
  ["Correct Words", "Correct Words", "صحیح الفاظ", "Sahi alfaaz"],
  ["Pronunciation", "Pronunciation", "تلفظ", "Talafuz"],
  ["Spelling", "Spelling", "املا", "Imla"],
  ["Diacritics", "Diacritics", "اعراب", "Aeraab"],
  ["Correct Urdu", "Correct Urdu", "صحیح اردو", "Sahi Urdu"],
  ["English", "English", "انگریزی", "English"],
  ["Urdu", "Urdu", "اردو", "Urdu"],
  ["Roman Urdu", "Roman Urdu", "رومن اردو", "Roman Urdu"],
  ["EN", "EN", "EN", "EN"],
  ["Roman", "Roman", "رومن", "Roman"],
  ["Footer", "Footer", "فوٹر", "Footer"],
  ["Breadcrumb", "Breadcrumb", "صفحے کا راستہ", "Breadcrumb"],
  ["Close dialog", "Close dialog", "ڈائیلاگ بند کریں", "Dialog band karein"],
  ["Open menu", "Open menu", "مینو کھولیں", "Menu kholein"],
  ["Close menu", "Close menu", "مینو بند کریں", "Menu band karein"],
  ["Learning content navigation", "Learning content navigation", "سیکھنے کے مواد کی نیویگیشن", "Learning content navigation"],
  ["Course navigation", "Course navigation", "کورس کی نیویگیشن", "Course navigation"],
  ["Phonetic keyboard learning topics", "Phonetic keyboard learning topics", "فونیٹک کی بورڈ سیکھنے کے موضوعات", "Phonetic keyboard learning topics"],
  ["Biography and Islamic History topics", "Biography and Islamic History topics", "سوانح اور اسلامی تاریخ کے موضوعات", "Sawanih aur Islami tareekh ke mauzuaat"],
  ["Keyboard", "Keyboard", "کی بورڈ", "Keyboard"],
  ["On-screen keyboard", "On-screen keyboard", "آن اسکرین کی بورڈ", "On-screen keyboard"],
  ["Urdu typing practice input. Type using your physical or on-screen keyboard.", "Urdu typing practice input. Type using your physical or on-screen keyboard.", "اردو ٹائپنگ مشق کا ان پٹ۔ فزیکل یا آن اسکرین کی بورڈ سے ٹائپ کریں۔", "Urdu typing practice input. Physical ya on-screen keyboard se type karein."],
  ["Typing test content", "Typing test content", "ٹائپنگ ٹیسٹ کا مواد", "Typing test content"],
  ["Reading course progress", "Reading course progress", "مطالعے کے کورس کی پیش رفت", "Reading course progress"],
  ["Keyboard position", "Keyboard position", "کی بورڈ کی پوزیشن", "Keyboard position"],
  ["Finger guide", "Finger guide", "انگلیوں کی رہنمائی", "Finger guide"],
  ["Touch typing finger guide", "Touch typing finger guide", "ٹچ ٹائپنگ انگلیوں کی رہنمائی", "Touch typing finger guide"],
  ["Left hand", "Left hand", "بایاں ہاتھ", "Left hand"],
  ["Right hand", "Right hand", "دایاں ہاتھ", "Right hand"],
  ["LEFT HAND", "LEFT HAND", "بایاں ہاتھ", "LEFT HAND"],
  ["RIGHT HAND", "RIGHT HAND", "دایاں ہاتھ", "RIGHT HAND"],
  ["Shift", "Shift", "شفٹ", "Shift"],
  ["Space", "Space", "اسپیس", "Space"],
  ["Backspace", "Backspace", "بیک اسپیس", "Backspace"],
  ["Target character", "Target character", "مطلوبہ حرف", "Target harf"],
  ["Save", "Save", "محفوظ کریں", "Mehfooz karein"],
  ["Saved", "Saved", "محفوظ ہو گیا", "Mehfooz ho gaya"],
  ["Save changes", "Save changes", "تبدیلیاں محفوظ کریں", "Tabdeeliyan mehfooz karein"],
  ["Save for Later", "Save for Later", "بعد کے لیے محفوظ کریں", "Baad ke liye mehfooz karein"],
  ["Bookmark", "Bookmark", "بُک مارک", "Bookmark"],
  ["Bookmarked", "Bookmarked", "بُک مارک کیا گیا", "Bookmarked"],
  ["Read Later", "Read Later", "بعد میں پڑھیں", "Baad mein parhein"],
  ["Overview", "Overview", "جائزہ", "Overview"],
  ["Chapters", "Chapters", "ابواب", "Chapters"],
  ["Sources & References", "Sources & References", "ماخذ اور حوالہ جات", "Makhaz aur hawalay"],
  ["Examples", "Examples", "مثالیں", "Misalein"],
  ["Review", "Review", "جائزہ", "Jaiza"],
  ["Completed", "Completed", "مکمل", "Mukammal"],
  ["Reviewed", "Reviewed", "جائزہ لیا گیا", "Jaiza liya gaya"],
  ["Mark as reviewed", "Mark as reviewed", "جائزہ مکمل کریں", "Jaiza mukammal karein"],
  ["Lesson complete", "Lesson complete", "سبق مکمل", "Lesson mukammal"],
  ["Complete Lesson", "Complete Lesson", "سبق مکمل کریں", "Lesson mukammal karein"],
  ["Step complete", "Step complete", "مرحلہ مکمل", "Marhala mukammal"],
  ["Next Step", "Next Step", "اگلا مرحلہ", "Agla marhala"],
  ["Previous", "Previous", "پچھلا", "Pichla"],
  ["Next", "Next", "اگلا", "Agla"],
  ["Reset", "Reset", "ری سیٹ", "Reset"],
  ["Reset Step", "Reset Step", "مرحلہ دوبارہ شروع کریں", "Reset step"],
  ["I understand", "I understand", "میں سمجھ گیا/گئی", "Main samajh gaya/gayi"],
  ["Enter → Next", "Enter → Next", "Enter → اگلا", "Enter → Agla"],
  ["Get ready for the next typing step", "Get ready for the next typing step", "اگلے ٹائپنگ مرحلے کے لیے تیار ہوں", "Agley typing marhalay ke liye tayyar hon"],
  ["Learn", "Learn", "سیکھیں", "Seekhein"],
  ["Practice", "Practice", "مشق", "Practice"],
  ["See", "See", "دیکھیں", "Dekhein"],
  ["Master", "Master", "مہارت حاصل کریں", "Mahir banein"],
  ["Lesson path", "Lesson path", "سبق کا راستہ", "Lesson path"],
  ["Lesson navigation", "Lesson navigation", "سبق کی نیویگیشن", "Lesson navigation"],
  ["Step", "Step", "مرحلہ", "Marhala"],
  ["Hold Shift", "Hold Shift", "Shift دبائیں", "Shift dabaein"],
  ["Ctrl + Alt", "Ctrl + Alt", "Ctrl + Alt", "Ctrl + Alt"],
  ["Base key", "Base key", "بنیادی key", "Base key"],
  ["What you will learn", "What you will learn", "آپ کیا سیکھیں گے", "Aap kya seekhein ge"],
  ["Correct", "Correct", "درست", "Durust"],
  ["Incorrect", "Incorrect", "غلط", "Ghalat"],
  ["Accuracy", "Accuracy", "درستگی", "Durustgi"],
  ["Characters", "Characters", "حروف", "Huruf"],
  ["Time", "Time", "وقت", "Waqt"],
  ["Expected", "Expected", "متوقع", "Mutawaqqe"],
  ["typed", "typed", "ٹائپ شدہ", "typed"],
  ["Results", "Results", "نتائج", "Nataij"],
  ["Typing Test", "Typing Test", "ٹائپنگ ٹیسٹ", "Typing Test"],
  ["Choose your practice", "Choose your practice", "اپنی مشق منتخب کریں", "Apni practice muntakhib karein"],
  ["Choose a duration", "Choose a duration", "مدت منتخب کریں", "Muddat muntakhib karein"],
  ["Test duration", "Test duration", "ٹیسٹ کی مدت", "Test ki muddat"],
  ["Start Test", "Start Test", "ٹیسٹ شروع کریں", "Test shuru karein"],
  ["Test complete", "Test complete", "ٹیسٹ مکمل", "Test mukammal"],
  ["View Full Results", "View Full Results", "مکمل نتائج دیکھیں", "Mukammal nataij dekhein"],
  ["New Test", "New Test", "نیا ٹیسٹ", "Naya test"],
  ["Try Again", "Try Again", "دوبارہ کوشش کریں", "Dobara koshish karein"],
  ["Try again", "Try again", "دوبارہ کوشش کریں", "Dobara koshish karein"],
  ["Start", "Start", "شروع کریں", "Shuru karein"],
  ["Start Learning", "Start Learning", "سیکھنا شروع کریں", "Seekhna shuru karein"],
  ["Go to Profile", "Go to Profile", "پروفائل پر جائیں", "Profile par jayein"],
  ["Go to Tests", "Go to Tests", "ٹیسٹس پر جائیں", "Tests par jayein"],
  ["Profile", "Profile", "پروفائل", "Profile"],
  ["Avatar", "Avatar", "اوتار", "Avatar"],
  ["Create Profile", "Create Profile", "پروفائل بنائیں", "Profile banayein"],
  ["Create profile", "Create profile", "پروفائل بنائیں", "Profile banayein"],
  ["Create new profile", "Create new profile", "نیا پروفائل بنائیں", "Naya profile banayein"],
  ["Create one", "Create one", "ایک بنائیں", "Aik banayein"],
  ["Switch profile", "Switch profile", "پروفائل تبدیل کریں", "Profile badlein"],
  ["Edit", "Edit", "ترمیم", "Edit"],
  ["Edit profile", "Edit profile", "پروفائل میں ترمیم", "Profile mein tarmeem"],
  ["Delete", "Delete", "حذف کریں", "Delete karein"],
  ["Delete profile", "Delete profile", "پروفائل حذف کریں", "Profile delete karein"],
  ["Cancel", "Cancel", "منسوخ کریں", "Mansookh karein"],
  ["Close", "Close", "بند کریں", "Band karein"],
  ["Settings", "Settings", "ترتیبات", "Tarteebat"],
  ["Appearance", "Appearance", "ظاہری شکل", "Appearance"],
  ["Theme", "Theme", "تھیم", "Theme"],
  ["Typing", "Typing", "ٹائپنگ", "Typing"],
  ["Typing sounds", "Typing sounds", "ٹائپنگ کی آوازیں", "Typing sounds"],
  ["Learning", "Learning", "سیکھنا", "Learning"],
  ["Progress", "Progress", "پیش رفت", "Progress"],
  ["Your Learning Progress", "Your Learning Progress", "آپ کی سیکھنے کی پیش رفت", "Aapki learning progress"],
  ["Overall Course Progress", "Overall Course Progress", "مجموعی کورس پیش رفت", "Course ki kul progress"],
  ["Current Lesson", "Current Lesson", "موجودہ سبق", "Mojooda lesson"],
  ["Performance", "Performance", "کارکردگی", "Performance"],
  ["Detailed Statistics", "Detailed Statistics", "تفصیلی اعداد و شمار", "Detailed statistics"],
  ["Mistake Review", "Mistake Review", "غلطیوں کا جائزہ", "Ghaltiyon ka jaiza"],
  ["New Personal Best", "New Personal Best", "نیا ذاتی بہترین", "Naya zaati behtareen"],
  ["Practice session", "Practice session", "مشق کا سیشن", "Practice session"],
  ["Biography", "Biography", "سوانح", "Sawanih"],
  ["Biographies & Islamic History", "Biographies & Islamic History", "سوانح اور اسلامی تاریخ", "Sawanih aur Islami tareekh"],
  ["Biography Library", "Biography Library", "سوانح کتب خانہ", "Sawanih Library"],
  ["Biography Quiz", "Biography Quiz", "سوانح کوئز", "Sawanih Quiz"],
  ["Writing Practice", "Writing Practice", "تحریری مشق", "Writing practice"],
  ["Start Writing Practice", "Start Writing Practice", "تحریری مشق شروع کریں", "Writing practice shuru karein"],
  ["No Limit", "No Limit", "کوئی حد نہیں", "Koi hadd nahi"],
  ["Done", "Done", "مکمل", "Mukammal"],
  ["Restart", "Restart", "دوبارہ شروع کریں", "Dobara shuru karein"],
  ["Library", "Library", "کتب خانہ", "Library"],
  ["Read", "Read", "پڑھیں", "Parhein"],
  ["Type It", "Type It", "ٹائپ کریں", "Type karein"],
  ["Listen", "Listen", "سنیں", "Sunein"],
  ["Word Library", "Word Library", "الفاظ کا کتب خانہ", "Alfaz ki library"],
  ["Search Urdu words", "Search Urdu words", "اردو الفاظ تلاش کریں", "Urdu alfaaz talash karein"],
  ["Filter", "Filter", "فلٹر", "Filter"],
  ["All categories", "All categories", "تمام زمرے", "Tamam categories"],
  ["Every level", "Every level", "ہر سطح", "Har satah"],
  ["Beginner", "Beginner", "ابتدائی", "Beginner"],
  ["Intermediate", "Intermediate", "درمیانی", "Intermediate"],
  ["Advanced", "Advanced", "اعلیٰ", "Advanced"],
  ["Expert", "Expert", "ماہر", "Expert"],
  ["Professional", "Professional", "پیشہ ورانہ", "Professional"],
  ["Current:", "Current:", "موجودہ:", "Current:"],
  ["Loading...", "Loading...", "لوڈ ہو رہا ہے…", "Loading..."],
  ["Error", "Error", "خرابی", "Error"],
  ["Success", "Success", "کامیابی", "Success"],
  ["Time's up", "Time's up", "وقت ختم ہوگیا", "Waqt khatam ho gaya"],
  ["Time Up", "Time Up", "وقت ختم ہوگیا", "Waqt khatam ho gaya"],
  ["Completed", "Completed", "مکمل", "Mukammal"],
  ["No lessons in this track yet", "No lessons in this track yet", "اس راستے میں ابھی کوئی سبق نہیں", "Is track mein abhi koi lesson nahi"],
  ["Choose another track from the sidebar.", "Choose another track from the sidebar.", "سائیڈبار سے کوئی دوسرا راستہ منتخب کریں۔", "Sidebar se doosra track select karein."],
  ["Choose a profile to start learning", "Choose a profile to start learning", "سیکھنا شروع کرنے کے لیے پروفائل منتخب کریں", "Seekhna shuru karne ke liye profile select karein"],
  ["Choose a profile to see your progress", "Choose a profile to see your progress", "اپنی پیش رفت دیکھنے کے لیے پروفائل منتخب کریں", "Apni progress dekhne ke liye profile select karein"],
  ["Your progress will appear here", "Your progress will appear here", "آپ کی پیش رفت یہاں نظر آئے گی", "Aapki progress yahan nazar aayegi"],
  ["Complete your first lesson to start tracking speed and accuracy.", "Complete your first lesson to start tracking speed and accuracy.", "رفتار اور درستگی ٹریک کرنے کے لیے اپنا پہلا سبق مکمل کریں۔", "Speed aur accuracy track karne ke liye apna pehla lesson complete karein."],
  ["Choose a local profile to continue.", "Choose a local profile to continue.", "جاری رکھنے کے لیے مقامی پروفائل منتخب کریں۔", "Jari rakhne ke liye local profile select karein."],
  ["No local profile is selected yet.", "No local profile is selected yet.", "ابھی کوئی مقامی پروفائل منتخب نہیں کیا گیا۔", "Abhi koi local profile select nahi kiya gaya."],
  ["Display name", "Display name", "نمائشی نام", "Display name"],
  ["e.g. Ali", "e.g. Ali", "مثلاً علی", "misal ke taur par Ali"],
  ["No account required — this stays on your device.", "No account required — this stays on your device.", "اکاؤنٹ کی ضرورت نہیں — یہ آپ کے ڈیوائس پر ہی رہتا ہے۔", "Account ki zaroorat nahi — yeh aapke device par rehta hai."],
  ["Stored locally in this browser. Not sent to any server.", "Stored locally in this browser. Not sent to any server.", "یہ اسی براؤزر میں محفوظ ہے اور کسی سرور کو نہیں بھیجا جاتا۔", "Isi browser mein mehfooz hai aur kisi server ko nahi bheja jata."],
  ["Learn About Phonetic Keyboard", "Learn About Phonetic Keyboard", "فونیٹک کی بورڈ سیکھیں", "Phonetic keyboard ke baare mein seekhein"],
  ["Reading course progress", "Reading course progress", "مطالعے کے کورس کی پیش رفت", "Reading course progress"],
  ["Finish reading", "Finish reading", "مطالعہ مکمل کریں", "Reading mukammal karein"],
  ["Previous chapter", "Previous chapter", "پچھلا باب", "Pichla bab"],
  ["Next chapter", "Next chapter", "اگلا باب", "Agla bab"],
  ["A useful tip", "A useful tip", "اہم بات", "Ahm baat"],
  ["Did you know?", "Did you know?", "کیا آپ جانتے ہیں؟", "Kya aap jantay hain?"],
  ["Urdu Typing Tutorial — Learn Urdu Typing Online Free", "Urdu Typing Tutorial — Learn Urdu Typing Online Free", "اردو ٹائپنگ ٹیوٹوریل — مفت آن لائن اردو ٹائپنگ سیکھیں", "Urdu Typing Tutorial — muft online Urdu typing seekhein"],
  ["Urdu Typing Test — Check Your Speed & Accuracy", "Urdu Typing Test — Check Your Speed & Accuracy", "اردو ٹائپنگ ٹیسٹ — اپنی رفتار اور درستگی جانیں", "Urdu typing test — apni raftaar aur durustgi jaanchein"],
  ["Learn Urdu Typing — Phonetic Keyboard Lessons", "Learn Urdu Typing — Phonetic Keyboard Lessons", "اردو ٹائپنگ سیکھیں — فونیٹک کی بورڈ اسباق", "Urdu typing seekhein — phonetic keyboard lessons"],
  ["Practice", "Practice", "مشق", "Practice"],
  ["Your Typing Results", "Your Typing Results", "آپ کے ٹائپنگ نتائج", "Aapke typing nataij"],
  ["Your Learning Progress", "Your Learning Progress", "آپ کی سیکھنے کی پیش رفت", "Aapki learning progress"],
  ["Your local profile stays on this device — no account required.", "Your local profile stays on this device — no account required.", "آپ کا مقامی پروفائل اسی ڈیوائس پر رہتا ہے — اکاؤنٹ کی ضرورت نہیں۔", "Aapka local profile isi device par rehta hai — account ki zaroorat nahi."],
  ["Manage your local profile on this device.", "Manage your local profile on this device.", "اس ڈیوائس پر اپنے مقامی پروفائل کا انتظام کریں۔", "Is device par apne local profile ka intizam karein."],
  ["Profile", "Profile", "پروفائل", "Profile"],
  ["Welcome to Urdu Typing Tutorial", "Welcome to Urdu Typing Tutorial", "اردو ٹائپنگ ٹیوٹوریل میں خوش آمدید", "Urdu Typing Tutorial mein khush aamdeed"],
  ["Typing Test", "Typing Test", "ٹائپنگ ٹیسٹ", "Typing Test"],
  ["Practice session", "Practice session", "مشق کا سیشن", "Practice session"],
  ["Performance Summary", "Performance Summary", "کارکردگی کا خلاصہ", "Performance ka khulasa"],
  ["Correct Characters", "Correct Characters", "درست حروف", "Durust huruf"],
  ["Errors", "Errors", "غلطیاں", "Ghaltiyan"],
  ["Lesson", "Lesson", "سبق", "Lesson"],
  ["Lesson not found", "Lesson not found", "سبق نہیں ملا", "Lesson nahi mila"],
  ["We could not find this lesson.", "We could not find this lesson.", "یہ سبق نہیں مل سکا۔", "Yeh lesson nahi mil saka."],
  ["This lesson is designed to build a usable typing habit, not just recognition.", "This lesson is designed to build a usable typing habit, not just recognition.", "یہ سبق صرف پہچان نہیں بلکہ قابلِ استعمال ٹائپنگ عادت بنانے کے لیے تیار کیا گیا ہے۔", "Yeh lesson sirf pehchan nahi balkay qabil-e-istemal typing aadat banane ke liye tayyar kiya gaya hai."],
  ["Back to Learning", "Back to Learning", "سیکھنے کی طرف واپس", "Seekhne ki taraf wapas"],
  ["Start Practicing", "Start Practicing", "مشق شروع کریں", "Practice shuru karein"],
  ["Continue", "Continue", "جاری رکھیں", "Jari rakhein"],
  ["Next Lesson", "Next Lesson", "اگلا سبق", "Agla lesson"],
  ["Try Again", "Try Again", "دوبارہ کوشش کریں", "Dobara koshish karein"],
  ["This lesson has no learning steps yet.", "This lesson has no learning steps yet.", "اس سبق میں ابھی سیکھنے کے مراحل موجود نہیں۔", "Is lesson mein abhi learning steps maujood nahi."],
  ["A final mixed lesson combining letters, words, punctuation, and fluent Urdu typing.", "A final mixed lesson combining letters, words, punctuation, and fluent Urdu typing.", "حروف، الفاظ، رموزِ اوقاف اور رواں اردو ٹائپنگ کو ملانے والا آخری سبق۔", "Huruf, alfaaz, ramooz-e-auqaaf aur rawan Urdu typing ko milane wala aakhri lesson."],
  ["Basic", "Basic", "بنیادی", "Basic"],
  ["Intermediate", "Intermediate", "درمیانی", "Darmiyani"],
  ["Expert", "Expert", "ماہر", "Mahir"],
  ["Typing Tutorial", "Typing Tutorial", "ٹائپنگ ٹیوٹوریل", "Typing Tutorial"],
  ["Learn About Phonetic Keyboard", "Learn About Phonetic Keyboard", "فونیٹک کی بورڈ سیکھیں", "Phonetic keyboard ke baare mein seekhein"],
  ["Biographies & Islamic History", "Biographies & Islamic History", "سوانح اور اسلامی تاریخ", "Sawanih aur Islami tareekh"],
  ["Overview", "Overview", "جائزہ", "Jaiza"],
  ["حضرت محمد ﷺ — The Greatest Man in History", "Prophet Muhammad ﷺ — The Greatest Man in History", "حضرت محمد ﷺ — تاریخ کی عظیم ترین شخصیت", "Hazrat Muhammad ﷺ — Tareekh ki azeem tareen shakhsiyat"],
  ["All biographies / search", "All biographies / search", "تمام سوانح / تلاش", "Tamam sawanih / talash"],
  ["صحیح اردو", "Correct Urdu", "صحیح اردو", "Sahi Urdu"],
  ["صحیح الفاظ", "Correct Words", "صحیح الفاظ", "Sahi alfaaz"],
  ["غلط العام", "Commonly Mistaken", "غلط العام", "Ghalat-ul-aam"],
  ["تلفظ", "Pronunciation", "تلفظ", "Talafuz"],
  ["املا", "Spelling", "املا", "Imla"],
  ["اعراب", "Diacritics", "اعراب", "Aeraab"],
  ["الفاظ کی مشق", "Word Practice", "الفاظ کی مشق", "Alfaaz ki practice"],
  ["کوئز", "Quiz", "کوئز", "Quiz"],
  ["میری پیش رفت", "My Progress", "میری پیش رفت", "Meri progress"],
  ["کوئی سوانح نہیں ملی", "No biographies found", "کوئی سوانح نہیں ملی", "Koi sawanih nahi mili"],
  ["لفظ نہیں ملا", "Word not found", "لفظ نہیں ملا", "Lafz nahi mila"],
  ["کوئی لفظ نہیں ملا", "No word found", "کوئی لفظ نہیں ملا", "Koi lafz nahi mila"],
  ["تلاش یا filters بدل کر دوبارہ کوشش کریں۔", "Change the search or filters and try again.", "تلاش یا فلٹرز بدل کر دوبارہ کوشش کریں۔", "Talash ya filters badal kar dobara koshish karein."],
  ["عام غلط صورت", "Common wrong form", "عام غلط صورت", "Aam ghalat surat"],
  ["غلط", "Wrong", "غلط", "Ghalat"],
  ["صحیح جواب", "Correct answer", "صحیح جواب", "Sahi jawab"],
  ["دوبارہ مشق کی ضرورت ہے", "More practice is needed", "دوبارہ مشق کی ضرورت ہے", "Dobara practice ki zaroorat hai"],
  ["نیا کوئز", "New quiz", "نیا کوئز", "Naya quiz"],
  ["اگلا سوال", "Next question", "اگلا سوال", "Agla sawal"],
  ["مزید سوانح", "More biographies", "مزید سوانح", "Mazeed sawanih"],
  ["لفظ کی تفصیل word detail میں دیکھیں۔", "See the word detail for more information.", "لفظ کی تفصیل word detail میں دیکھیں۔", "Lafz ki tafseel word detail mein dekhein."],
  ["صحیح ضبط منتخب کریں", "Choose the correct diacritic form", "صحیح ضبط منتخب کریں", "Sahi zabt muntakhib karein"],
  ["صحیح صورت منتخب کریں", "Choose the correct form", "صحیح صورت منتخب کریں", "Sahi surat muntakhib karein"],
  ["متبادل / عام صورتیں", "Alternative / common forms", "متبادل / عام صورتیں", "Mutabadil / aam sooratein"],
  ["اعراب کے ساتھ", "With diacritics", "اعراب کے ساتھ", "Aeraab ke saath"],
  ["یہ لفظ کیسے سیکھیں؟", "How to learn this word", "یہ لفظ کیسے سیکھیں؟", "Yeh lafz kaise seekhein?"],
  ["اب یہ لفظ ٹائپ کریں", "Type this word now", "اب یہ لفظ ٹائپ کریں", "Ab yeh lafz type karein"],
  ["مشق مکمل!", "Practice complete!", "مشق مکمل!", "Practice mukammal!"],
  ["دوبارہ", "Again", "دوبارہ", "Dobara"],
  ["سنیں", "Listen", "سنیں", "Sunein"],
  ["ٹائپنگ شروع کریں", "Start typing", "ٹائپنگ شروع کریں", "Typing shuru karein"],
  ["پچھلا", "Previous", "پچھلا", "Pichla"],
  ["اگلا", "Next", "اگلا", "Agla"],
  ["Unicode character", "Unicode character", "یونیکوڈ حرف", "Unicode harf"],
  ["صحیح اعراب ٹائپ کریں", "Type the correct diacritic", "صحیح اعراب ٹائپ کریں", "Sahi aeraab type karein"],
  ["درست! یہ Unicode اعراب رجسٹر ہو گیا۔", "Correct! This Unicode diacritic was registered.", "درست! یہ Unicode اعراب رجسٹر ہو گیا۔", "Durust! Yeh Unicode diacritic register ho gaya."],
  ["Streak", "Streak", "مسلسل سلسلہ", "Streak"],
  ["Mastered", "Mastered", "مہارت حاصل", "Mahir"],
  ["حال ہی میں پڑھے گئے الفاظ", "Recently viewed words", "حال ہی میں پڑھے گئے الفاظ", "Haal hi mein parhe gaye alfaaz"],
  ["ابھی کوئی لفظ شروع نہیں کیا۔", "No word started yet.", "ابھی کوئی لفظ شروع نہیں کیا۔", "Abhi koi lafz shuru nahi kiya."],
  ["Difficulty", "Difficulty", "مشکل کی سطح", "Mushkil ki satah"],
  ["Timer", "Timer", "ٹائمر", "Timer"],
  ["Completed", "Completed", "مکمل", "Mukammal"],
  ["Time Up", "Time Up", "وقت ختم ہوگیا", "Waqt khatam ho gaya"],
  ["Biography progress", "Biography progress", "سوانح کی پیش رفت", "Sawanih ki progress"],
  ["Restart Practice", "Restart Practice", "مشق دوبارہ شروع کریں", "Practice dobara shuru karein"],
  ["Learner level", "Learner level", "سیکھنے کی سطح", "Learner level"],
  ["Chapter", "Chapter", "باب", "Bab"],
  ["Start Writing Practice", "Start Writing Practice", "تحریری مشق شروع کریں", "Tehreeri practice shuru karein"],
  ["Read → Type Practice", "Read → Type Practice", "پڑھیں → ٹائپنگ مشق", "Parhein → typing practice"],
  ["Quiz", "Quiz", "کوئز", "Quiz"],
  ["Score", "Score", "اسکور", "Score"],
  ["Question", "Question", "سوال", "Sawal"],
  ["Total words", "Total words", "کل الفاظ", "Kul alfaaz"],
  ["Learn Alif", "Learn Alif", "الف سیکھیں", "Alif seekhein"],
  ["Press A", "Press A", "A دبائیں", "A dabaein"],
  ["Say: Alif", "Say: Alif", "کہیں: الف", "Kahein: Alif"],
  ["Focus on accuracy first, then gradually increase speed.", "Focus on accuracy first, then gradually increase speed.", "پہلے درستگی پر توجہ دیں، پھر آہستہ آہستہ رفتار بڑھائیں۔", "Pehle durustgi par tawajjo dein, phir ahista ahista raftaar barhaein."],
  ["New personal best! Keep this up.", "New personal best! Keep this up.", "نیا ذاتی بہترین نتیجہ! اسی طرح جاری رکھیں۔", "Naya zaati behtareen nateeja! Isi tarah jari rakhein."],
  ["Excellent accuracy!", "Excellent accuracy!", "بہترین درستگی!", "Behtareen durustgi!"],
  ["Great typing speed!", "Great typing speed!", "ٹائپنگ کی رفتار بہت اچھی ہے!", "Typing ki raftaar bohat achi hai!"],
  ["Solid run — keep practicing to sharpen both speed and accuracy.", "Solid run — keep practicing to sharpen both speed and accuracy.", "اچھی کوشش — رفتار اور درستگی دونوں بہتر کرنے کے لیے مشق جاری رکھیں۔", "Achi koshish — raftaar aur durustgi dono behtar karne ke liye practice jari rakhein."],
];

const catalog = new Map<string, Record<AppLanguage, string>>();
for (const [source, en, ur, roman] of entries) {
  catalog.set(source, { en, ur, roman });
}

// Seed the same catalog with the project's structured translation object.
// Paths are paired across locales so reordering one translation object cannot
// accidentally associate an English string with the wrong Urdu string.
function collectLocalePaths(value: unknown, path: string[] = [], out = new Map<string, string>()): Map<string, string> {
  if (typeof value === "string") { out.set(path.join("."), value); return out; }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLocalePaths(item, [...path, String(index)], out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) collectLocalePaths(child, [...path, key], out);
  }
  return out;
}
const localePaths = [collectLocalePaths(ui.en), collectLocalePaths(ui.ur), collectLocalePaths(ui.roman)];
for (const [path, en] of localePaths[0]) {
  const ur = localePaths[1].get(path);
  const roman = localePaths[2].get(path);
  if (en && ur && roman && !catalog.has(en)) catalog.set(en, { en, ur, roman });
}

// Also accept an exact value from any locale as the source when a component
// already contains the translated value. This makes switching back and forth
// stable without a second state store.
const reverse = new Map<string, string>();
for (const [source, values] of catalog) {
  for (const value of Object.values(values)) reverse.set(value, source);
}

function interpolate(value: string, vars?: Record<string, string | number>) {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

const lessonNames: Record<string, Record<AppLanguage, string>> = {
  Alif: { en: "Alif", ur: "الف", roman: "Alif" }, Bay: { en: "Bay", ur: "بے", roman: "Bay" }, Pay: { en: "Pay", ur: "پے", roman: "Pay" },
  Tay: { en: "Tay", ur: "تے", roman: "Tay" }, "Ṭay": { en: "Ṭay", ur: "ٹے", roman: "Ṭay" }, Say: { en: "Say", ur: "ثے", roman: "Say" },
  Jeem: { en: "Jeem", ur: "جیم", roman: "Jeem" }, Chay: { en: "Chay", ur: "چے", roman: "Chay" }, Hay: { en: "Hay", ur: "حے", roman: "Hay" },
  Khay: { en: "Khay", ur: "خے", roman: "Khay" }, Daal: { en: "Daal", ur: "دال", roman: "Daal" }, "Ḍaal": { en: "Ḍaal", ur: "ڈال", roman: "Ḍaal" },
  Zaal: { en: "Zaal", ur: "ذال", roman: "Zaal" }, Ray: { en: "Ray", ur: "رے", roman: "Ray" }, Rray: { en: "Rray", ur: "ڑرے", roman: "Rray" },
  Zay: { en: "Zay", ur: "زے", roman: "Zay" }, Zhay: { en: "Zhay", ur: "ژے", roman: "Zhay" }, Seen: { en: "Seen", ur: "سین", roman: "Seen" },
  Sheen: { en: "Sheen", ur: "شین", roman: "Sheen" }, Suaad: { en: "Suaad", ur: "صاد", roman: "Suaad" }, Zuaad: { en: "Zuaad", ur: "ضاد", roman: "Zuaad" },
  Tuae: { en: "Tuae", ur: "طوے", roman: "Tuae" }, Zoae: { en: "Zoae", ur: "ظوے", roman: "Zoae" }, Ain: { en: "Ain", ur: "عین", roman: "Ain" },
  Ghain: { en: "Ghain", ur: "غین", roman: "Ghain" }, Fay: { en: "Fay", ur: "فے", roman: "Fay" }, Qaaf: { en: "Qaaf", ur: "قاف", roman: "Qaaf" },
  Kaaf: { en: "Kaaf", ur: "کاف", roman: "Kaaf" }, Gaaf: { en: "Gaaf", ur: "گاف", roman: "Gaaf" }, Laam: { en: "Laam", ur: "لام", roman: "Laam" },
  Meem: { en: "Meem", ur: "میم", roman: "Meem" }, Noon: { en: "Noon", ur: "نون", roman: "Noon" }, "Noon Ghunna": { en: "Noon Ghunna", ur: "نون غنہ", roman: "Noon Ghunna" },
  Wow: { en: "Wow", ur: "واو", roman: "Wow" }, "Wao Hamza": { en: "Wao Hamza", ur: "واو ہمزہ", roman: "Wao Hamza" }, "Gol Hay": { en: "Gol Hay", ur: "گول ہے", roman: "Gol Hay" },
  "Do-Chashmi Hay": { en: "Do-Chashmi Hay", ur: "دو چشمی ہے", roman: "Do-Chashmi Hay" }, Hamza: { en: "Hamza", ur: "ہمزہ", roman: "Hamza" },
  "Hamza on Yay": { en: "Hamza on Yay", ur: "ہمزہ یے", roman: "Hamza on Yay" }, "Choti Yay": { en: "Choti Yay", ur: "چھوٹی یے", roman: "Choti Yay" }, "Bari Yay": { en: "Bari Yay", ur: "بڑی یے", roman: "Bari Yay" },
  "Alif Madd": { en: "Alif Madd", ur: "الف مد", roman: "Alif Madd" },
};

function pattern(source: string, language: AppLanguage): string | undefined {
  let m = source.match(/^Learn (.+)$/);
  if (m) return `${language === "ur" ? "سیکھیں" : language === "roman" ? "Seekhein" : "Learn"} ${lessonNames[m[1]]?.[language] ?? m[1]}`;
  m = source.match(/^Learn (.+), the (.+) key, its phonetic sound, finger position, and real Urdu usage\.$/);
  if (m) {
    const name = lessonNames[m[1]]?.[language] ?? m[1];
    if (language === "ur") return `${name}، اس کی ${m[2]} key، صوتی آواز، انگلی کی پوزیشن اور حقیقی اردو استعمال سیکھیں۔`;
    if (language === "roman") return `${name}, is ki ${m[2]} key, phonetic sound, finger position aur real Urdu usage seekhein.`;
  }
  m = source.match(/^Learn (.+) through Yay one character at a time, with the correct key and finger\.$/);
  if (m) return language === "ur" ? `الف سے ے تک ہر حرف کو درست key اور انگلی کے ساتھ ایک ایک کر کے سیکھیں۔` : language === "roman" ? `Alif se Yay tak har harf ko durust key aur ungli ke saath aik aik kar ke seekhein.` : source;
  m = source.match(/^Learn (.+), the (.+) key, its phonetic sound, finger position, and real Urdu usage\.$/);
  if (m) {
    const name = lessonNames[m[1]]?.[language] ?? m[1];
    if (language === "ur") return `${name}، اس کی ${m[2]} key، صوتی آواز، انگلی کی پوزیشن اور حقیقی اردو استعمال سیکھیں۔`;
    if (language === "roman") return `${name}, is ki ${m[2]} key, phonetic sound, finger position aur real Urdu usage seekhein.`;
  }
  m = source.match(/^Turn learned letters into connected Urdu shapes and short patterns\.$/);
  if (m) return language === "ur" ? "سیکھے ہوئے حروف کو جڑی ہوئی اردو شکلوں اور مختصر پیٹرنز میں استعمال کریں۔" : language === "roman" ? "Seekhay huay huruf ko juri hui Urdu shaklon aur mukhtasar patterns mein istemal karein." : source;
  m = source.match(/^Build real Urdu typing fluency with a carefully staged word set\.$/);
  if (m) return language === "ur" ? "ترتیب سے منتخب الفاظ کے مجموعے کے ذریعے اردو ٹائپنگ میں روانی پیدا کریں۔" : language === "roman" ? "Tarteeb se muntakhib alfaaz ke majmuay ke zariye Urdu typing mein rawani paida karein." : source;
  m = source.match(/^Turn familiar words into complete Urdu sentences with punctuation\.$/);
  if (m) return language === "ur" ? "مانوس الفاظ کو رموزِ اوقاف کے ساتھ مکمل اردو جملوں میں استعمال کریں۔" : language === "roman" ? "Manoos alfaaz ko ramooz-e-auqaaf ke saath mukammal Urdu jumlon mein istemal karein." : source;
  m = source.match(/^Sustain accurate Urdu typing across several connected sentences\.$/);
  if (m) return language === "ur" ? "کئی جڑے ہوئے جملوں میں درست اردو ٹائپنگ برقرار رکھیں۔" : language === "roman" ? "Kai juray huay jumlon mein durust Urdu typing barqarar rakhein." : source;
  m = source.match(/^Practice formal Urdu suitable for school, office, and professional communication\.$/);
  if (m) return language === "ur" ? "اسکول، دفتر اور پیشہ ورانہ رابطے کے لیے موزوں رسمی اردو کی مشق کریں۔" : language === "roman" ? "School, daftar aur professional rabtay ke liye mozoon rasmi Urdu ki practice karein." : source;
  m = source.match(/^A final mixed lesson combining letters, words, punctuation, and fluent Urdu typing\.$/);
  if (m) return language === "ur" ? "حروف، الفاظ، رموزِ اوقاف اور رواں اردو ٹائپنگ کو ملانے والا آخری سبق۔" : language === "roman" ? "Huruf, alfaaz, ramooz-e-auqaaf aur rawan Urdu typing ko milane wala aakhri lesson." : source;
  m = source.match(/^Recognize (.+) as (.+)\.$/);
  if (m) return language === "ur" ? `${m[2]} کو ${m[1]} کے طور پر پہچانیں۔` : language === "roman" ? `${m[2]} ko ${m[1]} ke taur par pehchanain.` : source;
  m = source.match(/^Use the correct phonetic key \((.+)\)\.$/);
  if (m) return language === "ur" ? `درست فونیٹک key (${m[1]}) استعمال کریں۔` : language === "roman" ? `Durust phonetic key (${m[1]}) istemal karein.` : source;
  m = source.match(/^Build accuracy before speed with combinations and real words\.$/);
  if (m) return language === "ur" ? "امتزاج اور حقیقی الفاظ کے ساتھ رفتار سے پہلے درستگی بنائیں۔" : language === "roman" ? "Imtizaj aur haqeeqi alfaaz ke saath speed se pehle durustgi banayein." : source;
  m = source.match(/^Combine known letters without losing accuracy\.$/);
  if (m) return language === "ur" ? "درستگی برقرار رکھتے ہوئے معلوم حروف کو ملائیں۔" : language === "roman" ? "Durustgi barqarar rakhte huay maloom huruf ko milaen." : source;
  m = source.match(/^Keep the correct finger habit while moving between keys\.$/);
  if (m) return language === "ur" ? "keys کے درمیان حرکت کرتے ہوئے انگلی کی درست عادت برقرار رکھیں۔" : language === "roman" ? "Keys ke darmiyan harkat karte huay ungli ki durust aadat barqarar rakhein." : source;
  m = source.match(/^Type real Urdu vocabulary instead of random character strings\.$/);
  if (m) return language === "ur" ? "بے ترتیب حروف کے بجائے حقیقی اردو الفاظ ٹائپ کریں۔" : language === "roman" ? "Be-tarteeb huruf ke bajaye haqeeqi Urdu alfaaz type karein." : source;
  m = source.match(/^Keep accuracy high while moving from word to word\.$/);
  if (m) return language === "ur" ? "لفظ بہ لفظ آگے بڑھتے ہوئے درستگی بلند رکھیں۔" : language === "roman" ? "Lafz ba lafz aage barhtay huay durustgi buland rakhein." : source;
  m = source.match(/^Type complete sentences with spaces and Urdu punctuation\.$/);
  if (m) return language === "ur" ? "spaces اور اردو رموزِ اوقاف کے ساتھ مکمل جملے ٹائپ کریں۔" : language === "roman" ? "Spaces aur Urdu punctuation ke saath mukammal jumlay type karein." : source;
  m = source.match(/^Keep rhythm steady across multiple words\.$/);
  if (m) return language === "ur" ? "متعدد الفاظ میں رفتار کا تسلسل برقرار رکھیں۔" : language === "roman" ? "Mutaddid alfaaz mein rhythm barqarar rakhein." : source;
  m = source.match(/^Maintain accuracy across a longer target\.$/);
  if (m) return language === "ur" ? "طویل ہدف میں درستگی برقرار رکھیں۔" : language === "roman" ? "Taweel target mein durustgi barqarar rakhein." : source;
  m = source.match(/^Recover calmly from mistakes without losing rhythm\.$/);
  if (m) return language === "ur" ? "رفتار کا تسلسل کھوئے بغیر غلطیوں سے پرسکون انداز میں سنبھلیں۔" : language === "roman" ? "Raftaar ka tasalsul khoye baghair ghaltiyon se pursukoon andaaz mein sambhlein." : source;
  m = source.match(/^Maintain accuracy in formal Urdu vocabulary\.$/);
  if (m) return language === "ur" ? "رسمی اردو الفاظ میں درستگی برقرار رکھیں۔" : language === "roman" ? "Rasmi Urdu alfaaz mein durustgi barqarar rakhein." : source;
  m = source.match(/^Type longer sentences with professional punctuation and spacing\.$/);
  if (m) return language === "ur" ? "پیشہ ورانہ رموزِ اوقاف اور spaces کے ساتھ طویل جملے ٹائپ کریں۔" : language === "roman" ? "Professional punctuation aur spaces ke saath taweel jumlay type karein." : source;
  m = source.match(/^Demonstrate reliable Urdu phonetic typing across mixed content\.$/);
  if (m) return language === "ur" ? "مخلوط مواد میں قابلِ اعتماد اردو فونیٹک ٹائپنگ دکھائیں۔" : language === "roman" ? "Makhlut mawad mein qabil-e-aitemad Urdu phonetic typing dikhayein." : source;
  m = source.match(/^Prepare for independent practice and timed tests\.$/);
  if (m) return language === "ur" ? "آزاد مشق اور وقت والے ٹیسٹ کے لیے تیار ہوں۔" : language === "roman" ? "Azad practice aur waqt walay tests ke liye tayyar hon." : source;
  m = source.match(/^Word Practice (\d+): (.+)$/);
  if (m) {
    const names: Record<string, Record<AppLanguage, string>> = {
      "First real words": { en: "First real words", ur: "پہلے حقیقی الفاظ", roman: "Pehle haqeeqi alfaaz" },
      "Short everyday words": { en: "Short everyday words", ur: "مختصر روزمرہ الفاظ", roman: "Mukhtasar rozmarrah alfaaz" },
      "Family and school": { en: "Family and school", ur: "خاندان اور اسکول", roman: "Khandan aur school" },
      "Home and routine": { en: "Home and routine", ur: "گھر اور معمول", roman: "Ghar aur mamool" },
      "Common verbs": { en: "Common verbs", ur: "عام افعال", roman: "Aam afaal" },
      "Daily vocabulary": { en: "Daily vocabulary", ur: "روزمرہ الفاظ", roman: "Rozmarrah alfaaz" },
      "Places and people": { en: "Places and people", ur: "جگہیں اور لوگ", roman: "Jaghein aur log" },
      "Faith and values": { en: "Faith and values", ur: "ایمان اور اقدار", roman: "Imaan aur aqdaar" },
      "Longer words": { en: "Longer words", ur: "طویل الفاظ", roman: "Taveel alfaaz" },
      "Mixed review": { en: "Mixed review", ur: "مخلوط جائزہ", roman: "Makhlut jaiza" },
      "Names in Urdu": { en: "Names in Urdu", ur: "اردو میں نام", roman: "Urdu mein naam" },
      "Useful phrases": { en: "Useful phrases", ur: "کارآمد جملے", roman: "Kaaramad jumlay" },
      "Accuracy builder": { en: "Accuracy builder", ur: "درستگی کی مشق", roman: "Durustgi ki practice" },
      "Fluency builder": { en: "Fluency builder", ur: "روانی کی مشق", roman: "Rawani ki practice" },
      "Word review 1": { en: "Word review 1", ur: "الفاظ کا جائزہ 1", roman: "Alfaaz ka jaiza 1" },
      "Word review 2": { en: "Word review 2", ur: "الفاظ کا جائزہ 2", roman: "Alfaaz ka jaiza 2" },
      "Word review 3": { en: "Word review 3", ur: "الفاظ کا جائزہ 3", roman: "Alfaaz ka jaiza 3" },
      "Word review 4": { en: "Word review 4", ur: "الفاظ کا جائزہ 4", roman: "Alfaaz ka jaiza 4" },
      "Word review 5": { en: "Word review 5", ur: "الفاظ کا جائزہ 5", roman: "Alfaaz ka jaiza 5" },
      "Word review 6": { en: "Word review 6", ur: "الفاظ کا جائزہ 6", roman: "Alfaaz ka jaiza 6" },
      "Word review 7": { en: "Word review 7", ur: "الفاظ کا جائزہ 7", roman: "Alfaaz ka jaiza 7" },
    };
    return language === "ur" ? `الفاظ کی مشق ${m[1]}: ${names[m[2]]?.ur ?? m[2]}` : language === "roman" ? `Word practice ${m[1]}: ${names[m[2]]?.roman ?? m[2]}` : source;
  }
  m = source.match(/^(Sentence Practice|Fluency Passage|Professional Writing) (\d+)$/);
  if (m) {
    const ur = { "Sentence Practice": "جملوں کی مشق", "Fluency Passage": "روانی کا متن", "Professional Writing": "پیشہ ورانہ تحریر" } as Record<string, string>;
    const roman = { "Sentence Practice": "Jumlon ki practice", "Fluency Passage": "Rawani ka matn", "Professional Writing": "Peshawaranaa tehreer" } as Record<string, string>;
    return language === "ur" ? `${ur[m[1]]} ${m[2]}` : language === "roman" ? `${roman[m[1]]} ${m[2]}` : source;
  }
  m = source.match(/^Combination Set (\d+)$/);
  if (m) return language === "ur" ? `امتزاج سیٹ ${m[1]}` : language === "roman" ? `Imtizaj set ${m[1]}` : source;
  m = source.match(/^Review (\d+)$/);
  if (m) return language === "ur" ? `جائزہ ${m[1]}` : language === "roman" ? `Jaiza ${m[1]}` : source;
  m = source.match(/^Say: (.+)$/);
  if (m) return `${language === "ur" ? "کہیں" : language === "roman" ? "Kahein" : "Say"}: ${lessonNames[m[1]]?.[language] ?? m[1]}`;
  m = source.match(/^Press (.+)$/);
  if (m) return `${language === "ur" ? "دبائیں" : language === "roman" ? "Dabaein" : "Press"} ${m[1]}`;
  m = source.match(/^Type (.+) six times\.$/);
  if (m) return language === "ur" ? `${m[1]} کو چھ بار ٹائپ کریں۔` : language === "roman" ? `${m[1]} ko chhe baar type karein.` : `Type ${m[1]} six times.`;
  m = source.match(/^Now combine (.+) with letters you already know\.$/);
  if (m) return language === "ur" ? `اب ${m[1]} کو پہلے سے سیکھے ہوئے حروف کے ساتھ ملائیں۔` : language === "roman" ? `Ab ${m[1]} ko pehle se seekhe huay huruf ke saath milaein.` : source;
  m = source.match(/^Use (.+) inside real Urdu words\.$/);
  if (m) return language === "ur" ? `حقیقی اردو الفاظ میں ${m[1]} استعمال کریں۔` : language === "roman" ? `Haqeeqi Urdu alfaaz mein ${m[1]} istemal karein.` : source;
  m = source.match(/^Finish with one short review using (.+) and earlier letters\.$/);
  if (m) return language === "ur" ? `${m[1]} اور پہلے سیکھے حروف کے ساتھ مختصر جائزہ مکمل کریں۔` : language === "roman" ? `${m[1]} aur pehle seekhe huruf ke saath mukhtasar jaiza mukammal karein.` : source;
  m = source.match(/^Free Urdu typing lesson (\d+) of (\d+) on PAKURDU\.$/);
  if (m) return language === "ur" ? `PAKURDU پر مفت اردو ٹائپنگ کا سبق ${m[1]} از ${m[2]}.` : language === "roman" ? `PAKURDU par muft Urdu typing ka lesson ${m[1]} / ${m[2]}.` : source;
  m = source.match(/^Lesson (\d+) of (\d+)$/);
  if (m) return language === "ur" ? `سبق ${m[1]} از ${m[2]}` : language === "roman" ? `Lesson ${m[1]} / ${m[2]}` : source;
  m = source.match(/^(Left|Right) (Pinky|Ring|Middle|Index|Thumb) finger$/);
  if (m) {
    const hand = language === "ur" ? (m[1] === "Left" ? "بائیں" : "دائیں") : m[1];
    const fingerMap: Record<string, string> = language === "ur" ? { Pinky: "چھوٹی انگلی", Ring: "انگوٹھی والی انگلی", Middle: "درمیانی انگلی", Index: "شہادت کی انگلی", Thumb: "انگوٹھا" } : { Pinky: "Pinky", Ring: "Ring", Middle: "Middle", Index: "Index", Thumb: "Thumb" };
    return language === "ur" ? `${hand} ${fingerMap[m[2]]}` : `${hand} ${fingerMap[m[2]]} finger`;
  }
  m = source.match(/^(Left|Right) hand (Pinky|Ring|Middle|Index|Thumb) finger$/);
  if (m) {
    const hand = language === "ur" ? (m[1] === "Left" ? "بائیں" : "دائیں") : m[1];
    const fingerMap: Record<string, string> = language === "ur" ? { Pinky: "چھوٹی انگلی", Ring: "انگوٹھی والی انگلی", Middle: "درمیانی انگلی", Index: "شہادت کی انگلی", Thumb: "انگوٹھا" } : language === "roman" ? { Pinky: "Pinky", Ring: "Ring", Middle: "Middle", Index: "Index", Thumb: "Thumb" } : { Pinky: "Pinky", Ring: "Ring", Middle: "Middle", Index: "Index", Thumb: "Thumb" };
    return language === "ur" ? `${hand} ہاتھ، ${fingerMap[m[2]]}` : `${hand} hand ${fingerMap[m[2]]} finger`;
  }
  m = source.match(/^Step (\d+) of (\d+) · (\d+)%$/);
  if (m) return language === "ur" ? `مرحلہ ${m[1]} از ${m[2]} · ${m[3]}%` : language === "roman" ? `Marhala ${m[1]} / ${m[2]} · ${m[3]}%` : source;
  m = source.match(/^Lesson progress: (\d+) of (\d+) steps complete$/);
  if (m) return language === "ur" ? `سبق کی پیش رفت: ${m[2]} میں سے ${m[1]} مراحل مکمل` : language === "roman" ? `Lesson progress: ${m[1]} mein se ${m[2]} marahil mukammal` : source;
  m = source.match(/^Current: /);
  if (m) return language === "ur" ? source.replace(/^Current: /, "موجودہ: ") : language === "roman" ? source.replace(/^Current: /, "Current: ") : source;
  m = source.match(/^موجودہ: /);
  if (m) return language === "en" ? source.replace(/^موجودہ: /, "Current: ") : language === "roman" ? source.replace(/^موجودہ: /, "Current: ") : source;
  m = source.match(/^Accuracy (\d+)%$/);
  if (m) return language === "ur" ? `درستگی ${m[1]}%` : language === "roman" ? `Durustgi ${m[1]}%` : source;
  m = source.match(/^Profile menu — (.+)$/);
  if (m) return language === "ur" ? `پروفائل مینو — ${m[1]}` : language === "roman" ? `Profile menu — ${m[1]}` : source;
  m = source.match(/^(\d+) biographies$/);
  if (m) return language === "ur" ? `${m[1]} سوانح` : language === "roman" ? `${m[1]} sawanih` : source;
  m = source.match(/^Saved IDs: (\d+)$/);
  if (m) return language === "ur" ? `محفوظ شناختیں: ${m[1]}` : language === "roman" ? `Mehfooz IDs: ${m[1]}` : source;
  m = source.match(/^Chapter (\d+)\/(\d+)$/);
  if (m) return language === "ur" ? `باب ${m[1]}/${m[2]}` : language === "roman" ? `Bab ${m[1]}/${m[2]}` : source;
  m = source.match(/^Chapter (\d+) \/ (\d+)$/);
  if (m) return language === "ur" ? `باب ${m[1]} از ${m[2]}` : language === "roman" ? `Bab ${m[1]} / ${m[2]}` : source;
  m = source.match(/^Biography progress$/);
  if (m) return language === "ur" ? "سوانح کی پیش رفت" : language === "roman" ? "Sawanih ki progress" : source;
  m = source.match(/^Best: (\d+)$/);
  if (m) return language === "ur" ? `بہترین: ${m[1]}` : language === "roman" ? `Behtareen: ${m[1]}` : source;
  m = source.match(/^(\d+)% incl\. corrections$/);
  if (m) return language === "ur" ? `${m[1]}% (درست کی گئی غلطیوں سمیت)` : language === "roman" ? `${m[1]}% (corrections samait)` : source;
  m = source.match(/^(\d+)% target accuracy$/);
  if (m) return language === "ur" ? `${m[1]}% مطلوبہ درستگی` : language === "roman" ? `${m[1]}% target durustgi` : source;
  m = source.match(/^\+(\d+) XP$/);
  if (m) return source;
  m = source.match(/^لفظ (\d+) از (\d+)$/);
  if (m) return language === "en" ? `Word ${m[1]} of ${m[2]}` : language === "roman" ? `Lafz ${m[1]} / ${m[2]}` : source;
  m = source.match(/^Word (\d+) of (\d+)$/);
  if (m) return language === "ur" ? `لفظ ${m[1]} از ${m[2]}` : language === "roman" ? `Lafz ${m[1]} / ${m[2]}` : source;
  m = source.match(/^سوال (\d+) \/ (\d+)$/);
  if (m) return language === "en" ? `Question ${m[1]} / ${m[2]}` : language === "roman" ? `Sawal ${m[1]} / ${m[2]}` : source;
  m = source.match(/^صحیح صورت منتخب کریں: (.+)$/);
  if (m) return language === "en" ? `Choose the correct form: ${m[1]}` : language === "roman" ? `Sahi surat muntakhib karein: ${m[1]}` : source;
  m = source.match(/^صحیح ضبط منتخب کریں: (.+)$/);
  if (m) return language === "en" ? `Choose the correct diacritic form: ${m[1]}` : language === "roman" ? `Sahi zabt muntakhib karein: ${m[1]}` : source;
  m = source.match(/^Score (\d+)$/);
  if (m) return language === "ur" ? `اسکور ${m[1]}` : language === "roman" ? `Score ${m[1]}` : source;
  m = source.match(/^(\d+) درست، (\d+) میں سے۔$/);
  if (m) return language === "en" ? `${m[1]} correct of ${m[2]}.` : language === "roman" ? `${m[1]} durust mein se ${m[2]}.` : source;
  m = source.match(/^(\d+) الفاظ دکھائے جا رہے ہیں$/);
  if (m) return language === "en" ? `${m[1]} words shown` : language === "roman" ? `${m[1]} alfaaz dikhaye ja rahe hain` : source;
  m = source.match(/^(\d+) مشق$/);
  if (m) return language === "en" ? `${m[1]} practices` : language === "roman" ? `${m[1]} practice` : source;
  return undefined;
}

export function localizeText(sourceText: string, language: AppLanguage, vars?: Record<string, string | number>): string {
  const source = reverse.get(sourceText.trim()) ?? sourceText.trim();
  const exact = catalog.get(source);
  const result = exact?.[language] ?? pattern(source, language) ?? sourceText;
  const leading = sourceText.match(/^\s*/)?.[0] ?? "";
  const trailing = sourceText.match(/\s*$/)?.[0] ?? "";
  return `${leading}${interpolate(result, vars)}${trailing}`;
}

export function isKnownLocalizedText(sourceText: string): boolean {
  return reverse.has(sourceText.trim()) || catalog.has(sourceText.trim()) || Boolean(pattern(sourceText.trim(), "ur"));
}
