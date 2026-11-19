// src/polyfills.js
// Polyfill untuk fitur yang hilang di Safari 15 / iOS 15
import 'core-js/features/array/at';
import 'core-js/features/array/to-sorted';
import 'core-js/features/array/to-reversed';
import 'core-js/features/array/find-last';
import 'core-js/features/array/find-last-index';
import 'core-js/features/object/has-own';
import 'core-js/features/object/group-by';
import 'core-js/features/string/replace-all';
import 'core-js/features/promise/all-settled';
import 'core-js/features/promise/with-resolvers';

// Polyfill untuk structuredClone
if (typeof window !== 'undefined' && !window.structuredClone) {
  window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Fallback crypto.randomUUID untuk Safari 15 jika konteks non-secure atau belum tersedia
if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
  window.crypto.randomUUID = function () {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
      (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };
}