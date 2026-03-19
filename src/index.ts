/**
 * Tachyo - Type-safe state management with undo/redo and event tracking
 *
 * A powerful state management library featuring automatic undo/redo,
 * event tracking, async debugging, and React integration.
 */

// Named exports for better tree-shaking
export { TachyoManager } from './TachyoManager';

// Type exports (no runtime code)
export type {
  TachyoOptions,
  TachyoStateEvent,
  TachyoSubscription,
  TachyoUpdateMetadata,
  CollectionChangedEvent,
  CollectionAction,
  HistoryEntry,
  SnapshotMetadata,
  PropertyChangeCallback,
  ActionContext,
  Middleware,
  AsyncAction,
  StateDiff,
} from './types';

// Utils are optional - only import if needed
export { deepEqual } from './utils/deepEqual';
export { calculateChangePath, formatChangePath } from './utils/changeTracker';
export { AsyncActionTracker } from './utils/asyncTracker';

// React integration (separate bundle)
export { useTachyo, useTachyoProperty } from './react/useTachyo';

// DevTools
export { devTools, TachyoDevTools } from './utils/devtools';
export type { DevToolsMessage } from './utils/devtools';
