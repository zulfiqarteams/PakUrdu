import{c as o}from"./index-DUeJuPbl.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("BookmarkCheck",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=o("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]),s="pakurdu_bookmarks_v1",c="pakurdu_saved_later_v1";function n(t){try{const a=window.localStorage.getItem(t);if(!a)return[];const e=JSON.parse(a);return Array.isArray(e)?e.filter(r=>typeof r=="string"):[]}catch{return[]}}function i(t,a){try{window.localStorage.setItem(t,JSON.stringify([...new Set(a)]))}catch{}}function u(t,a){const e=n(t),r=e.includes(a)?e.filter(d=>d!==a):[...e,a];return i(t,r),r.includes(a)}function k(){return n(s)}function g(t){return k().includes(t)}function m(t){return u(s,t)}function l(){return n(c)}function h(t){return l().includes(t)}function v(t){return u(c,t)}export{p as B,S,h as a,v as b,l as c,g as i,k as l,m as t};
