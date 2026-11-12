import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = IntersectionObserverMock;

Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true });
Element.prototype.scrollIntoView = () => {};
