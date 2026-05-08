const assert = require("node:assert/strict");
const {describe, it} = require("node:test");

const IconHelpers = require("../lib/icon-helpers.js");

describe("normalizeIconName", () => {
  it("returns modern format unchanged", () => {
    assert.equal(IconHelpers.normalizeIconName("mdi:home"), "mdi:home");
  });

  it("converts legacy format prefix-name to prefix:name", () => {
    assert.equal(IconHelpers.normalizeIconName("mdi-home"), "mdi:home");
  });

  it("handles multiple dashes, converting only first to colon", () => {
    assert.equal(IconHelpers.normalizeIconName("mdi-home-outline"), "mdi:home-outline");
  });

  it("returns name unchanged if no dash present", () => {
    assert.equal(IconHelpers.normalizeIconName("home"), "home");
  });

  it("handles single-char prefix", () => {
    assert.equal(IconHelpers.normalizeIconName("i-check"), "i:check");
  });

  it("warns to console on legacy format conversion", () => {
    const messages = [];
    // eslint-disable-next-line no-console
    const originalWarn = console.warn;
    // eslint-disable-next-line no-console
    console.warn = (msg) => messages.push(msg);

    IconHelpers.normalizeIconName("mdi-home");

    // eslint-disable-next-line no-console
    console.warn = originalWarn;
    assert.equal(messages.length, 1);
    assert.match(messages[0], /Deprecated icon name format/u);
  });

  it("does not warn on modern format", () => {
    const messages = [];
    // eslint-disable-next-line no-console
    const originalWarn = console.warn;
    // eslint-disable-next-line no-console
    console.warn = (msg) => messages.push(msg);

    IconHelpers.normalizeIconName("mdi:home");

    // eslint-disable-next-line no-console
    console.warn = originalWarn;
    assert.equal(messages.length, 0);
  });
});
