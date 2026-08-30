/**
 * Authoritative keyboard data for the PakUrdu typing engine and virtual keyboard.
 *
 * Baseline:
 * - CRULP Urdu Phonetic Keyboard Layout v1.1 (CLE/CRULP, 2007): Base + AltGr.
 * - CLE Urdu Phonetic Keyboard Layout v1.2 (2019): updated Shift face.
 * - Keyman Urdu Phonetic (CRULP) documentation used as a secondary cross-check.
 *
 * Sources:
 * https://cle.org.pk/software/localization/keyboards/CRULPphonetickbv1.1.html
 * https://cle.org.pk/software/localization/keyboards/CLEphonetickbv1.2.html
 * https://help.keyman.com/keyboard/urdu_phonetic_crulp/1.2.2/urdu_phonetic_crulp
 *
 * The Base face is shared by the CRULP/CLE versions used here. The Shift
 * face follows CLE v1.2 where it differs, while the extended AltGr face
 * remains the CRULP v1.1 reference layer. The same data drives physical
 * input, virtual-key labels and expected-key/finger guidance.
 */
export const phoneticMap: Record<string, string> = {
  "1":"۱","2":"۲","3":"۳","4":"۴","5":"۵","6":"۶","7":"۷","8":"۸","9":"۹","0":"۰","-":"-","=":"=",
  q:"ق",w:"و",e:"ع",r:"ر",t:"ت",y:"ے",u:"ء",i:"ی",o:"ہ",p:"پ",a:"ا",s:"س",d:"د",f:"ف",g:"گ",h:"ھ",j:"ج",k:"ک",l:"ل",m:"م",n:"ن",b:"ب",c:"چ",v:"ط",x:"ش",z:"ز",
  ";":"؛","'":"’",",":"،",".":"۔","/":"/",
};
export const shiftPhoneticMap: Record<string, string> = {
  "1":"!","2":"ؤ","3":"ٔ","4":"ئ","5":"ۂ","6":"ّ","7":"ٔ","8":"ؒ","9":")","0":"(","-":"ﷲ","=":"ٓ",
  q:"ﷺ",w:"ؐ",e:"ؑ",r:"ڑ",t:"ٹ",y:"َ",u:"ِ",i:"ٰ",o:"ۃ",p:"ُ",a:"آ",s:"ص",d:"ڈ",f:"ٖ",g:"غ",h:"ح",j:"ض",k:"خ",l:"ؒ",m:"ً",n:"ں",b:"ؓ",c:"ث",v:"ظ",x:"ژ",z:"ذ",
  ";":":","'":"”",",":"<",".":">","/":"؟",
};
const physicalCodeToKey: Record<string, string> = {
  Digit1:"1",Digit2:"2",Digit3:"3",Digit4:"4",Digit5:"5",Digit6:"6",Digit7:"7",Digit8:"8",Digit9:"9",Digit0:"0",Minus:"-",Equal:"=",
  KeyQ:"q",KeyW:"w",KeyE:"e",KeyR:"r",KeyT:"t",KeyY:"y",KeyU:"u",KeyI:"i",KeyO:"o",KeyP:"p",KeyA:"a",KeyS:"s",KeyD:"d",KeyF:"f",KeyG:"g",KeyH:"h",KeyJ:"j",KeyK:"k",KeyL:"l",KeyM:"m",KeyN:"n",KeyB:"b",KeyC:"c",KeyV:"v",KeyX:"x",KeyZ:"z",Semicolon:";",Quote:"'",Comma:",",Period:".",Slash:"/",
};
export function getUrduForPhysicalKey(code: string, shift = false): string | undefined { const key=physicalCodeToKey[code]; return key ? (shift ? shiftPhoneticMap[key] : phoneticMap[key]) : undefined; }
export function getPhysicalKeyLabel(code: string): string | undefined { return physicalCodeToKey[code]; }
export function getUrduForKey(key: string): string | undefined { const lower=key.toLowerCase(); return key.length===1 && key!==lower ? shiftPhoneticMap[lower] : phoneticMap[lower]; }
export interface ExpectedKey { key: string; shift: boolean; }
function buildReverseMap(map: Record<string, string>): Record<string, string> {
  const reverse: Record<string, string> = {};
  for (const [key, value] of Object.entries(map)) {
    if (reverse[value] === undefined) reverse[value] = key;
  }
  return reverse;
}
const reversePhoneticMap = buildReverseMap(phoneticMap);
const reverseShiftPhoneticMap = buildReverseMap(shiftPhoneticMap);
export function getExpectedKey(char: string | undefined): ExpectedKey | undefined { if(!char)return undefined; if(char===" ")return {key:"space",shift:false}; const base=reversePhoneticMap[char]; if(base)return {key:base,shift:false}; const shifted=reverseShiftPhoneticMap[char]; return shifted ? {key:shifted,shift:true} : undefined; }

/**
 * Full US-QWERTY physical layout used to lay out
 * `VirtualKeyboard`, with the common bottom-row punctuation keys
 * (`,` `.` `/`) included since Urdu punctuation is a normal part of
 * lesson/exercise target text (see Part 7 requirement 14).
 */
export const keyboardRows: string[][] = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];
