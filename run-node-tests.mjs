/**
 * Node CLI Test Runner for Travel Destination Explorer
 * Polyfills minimal browser globals and executes the test suite.
 */

// Minimal DOM & Storage Polyfills for Node environment
global.window = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  matchMedia: () => ({ matches: false })
};

class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.className = '';
    this._innerHTML = '';
    this.textContent = '';
    this.style = {};
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(html) {
    this._innerHTML = html;
  }

  querySelector(selector) {
    const classMatch = selector.startsWith('.') && this._innerHTML.includes(selector.slice(1));
    const tagMatch = this._innerHTML.includes(`<${selector}`);
    if (classMatch || tagMatch) {
      return new MockElement('div');
    }
    return null;
  }

  querySelectorAll(selector) {
    const match = this.querySelector(selector);
    return match ? [match] : [];
  }

  appendChild() {}
  removeChild() {}
  addEventListener() {}
  dispatchEvent() {}
}

global.document = {
  documentElement: {
    setAttribute() {},
    getAttribute() { return 'light'; }
  },
  createElement(tag) {
    return new MockElement(tag);
  }
};

import { TestRunner } from './test-suite.js';

console.log('🧪 Starting Travel Destination Explorer Automated Test Battery...\n');

const runner = new TestRunner((result) => {
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${result.description}`);
  if (!result.passed && result.details) {
    console.error(`   Error details: ${result.details}`);
  }
});

const summary = await runner.runAll();

console.log('\n======================================================');
console.log(`Results: ${summary.passed} Passed, ${summary.failed} Failed (Total: ${summary.total})`);
console.log('======================================================\n');

if (!summary.allPassed) {
  process.exit(1);
} else {
  console.log('🎉 ALL ASSERTIONS PASSED WITH ZERO ERRORS.\n');
}
