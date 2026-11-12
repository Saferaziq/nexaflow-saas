// src/polyfills.js
// Polyfill untuk fitur yang hilang di Safari 15
import 'core-js/features/array/at';
import 'core-js/features/object/has-own';
import 'core-js/features/string/replace-all';
import 'core-js/features/promise/all-settled';

// Polyfill untuk structuredClone
if (typeof window !== 'undefined' && !window.structuredClone) {
  window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}