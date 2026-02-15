import '@testing-library/jest-dom';
import { vi } from 'vitest';

if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: { randomUUID: () => 'test-global-cripto-random-uuid' },
  });
} else if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => 'test-global-cripto-random-uuid';
}

window.HTMLElement.prototype.scrollIntoView = vi.fn();
