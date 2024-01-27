/**
 * Configuration of vitest and React Test library
 */

import { expect, afterEach, vi, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
// import mockServer from "../mocks/server";

// const server = await mockServer();

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

import "@testing-library/jest-dom/vitest";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  // server.resetHandlers();
});

// Establish API mocking before all tests.
beforeAll(() => {
  // server.start();
});

// Clean up after the tests are finished.
afterAll(() => {
  // await server.stop();
});

/**
 * Declare variables that are declared in window
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "API_URL", {
  writable: true,
  value: "/api",
});
