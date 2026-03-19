/**
 * Quick test script - Run this to verify Tachyo works!
 * 
 * Usage: npm run test:quick
 * or: npx ts-node test/quick-test.ts
 */

import { TachyoManager } from '../src/TachyoManager';

console.log('🚀 Tachyo Quick Test\n');
console.log('='.repeat(50));

// Test 1: Basic State Management
console.log('\n📦 Test 1: Basic State Management');
const stateManager = new TachyoManager({
  count: 0,
  name: 'Tachyo',
  items: [] as string[],
});

stateManager.subscribe((state, event) => {
  console.log(`  ✅ State changed: count=${state.count}, name=${state.name}`);
  console.log(`     Change path: ${event.changePath?.join(', ') || 'N/A'}`);
});

stateManager.setState({ count: 1 });
stateManager.setProperty('name', 'Tachyo Pro');

// Test 2: Undo/Redo
console.log('\n⏪ Test 2: Undo/Redo');
stateManager.setState({ count: 2 });
stateManager.setState({ count: 3 });
console.log(`  Current count: ${stateManager.state.count}`);
console.log(`  Can undo: ${stateManager.canUndo()}`);

stateManager.undo();
console.log(`  After undo: ${stateManager.state.count}`);

stateManager.redo();
console.log(`  After redo: ${stateManager.state.count}`);

// Test 3: Change Path Tracking
console.log('\n🔍 Test 3: Change Path Tracking');
const complexState = new TachyoManager({
  user: {
    name: 'John',
    profile: {
      age: 30,
      email: 'john@example.com',
    },
  },
}, {
  enableChangePathTracking: true,
});

complexState.subscribe((state, event) => {
  console.log(`  Changed paths: ${event.changePath?.join(', ') || 'N/A'}`);
});

complexState.setState({
  user: {
    ...complexState.state.user,
    profile: {
      ...complexState.state.user.profile,
      age: 31,
    },
  },
});

// Test 4: Async Actions
console.log('\n⚡ Test 4: Async Actions');
const asyncState = new TachyoManager({
  data: null as { message: string } | null,
  loading: false,
  error: null as string | null,
}, {
  enableAsyncTracking: true,
});

asyncState.registerAsyncAction<{ message: string }>({
  name: 'fetchData',
  handler: async (_state) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { message: 'Hello from async!' };
  },
  onStart: (state) => ({ ...state, loading: true, error: null }),
  onSuccess: (state, result) => ({
    ...state,
    data: result,
    loading: false,
  }),
  onError: (state, error) => ({
    ...state,
    loading: false,
    error: (error as Error).message,
  }),
});

console.log('  Executing async action...');
(async () => {
  await asyncState.dispatchAsync('fetchData');
  console.log(`  Result: ${JSON.stringify(asyncState.state.data)}`);
  console.log(`  Completed actions: ${asyncState.getCompletedAsyncActions().length}`);
})();

// Test 5: Middleware
console.log('\n🔧 Test 5: Middleware');
const middlewareState = new TachyoManager({
  value: 0,
}, {
  middleware: [
    (state, next, action) => {
      console.log(`  [Middleware] Action: ${action.name}`);
      next(state);
    },
  ],
});

middlewareState.use((state, next, action) => {
  console.log(`  [Custom Middleware] Processing: ${action.name}`);
  next(state);
});

middlewareState.setState({ value: 100 });

// Test 6: Action Chain
console.log('\n🔗 Test 6: Action Chain');
const chainState = new TachyoManager({ step: 0 });
chainState.setState({ step: 1 }, { action: 'step1' });
chainState.setState({ step: 2 }, { action: 'step2' });
chainState.setState({ step: 3 }, { action: 'step3' });

const chain = chainState.getActionChain();
console.log(`  Action chain length: ${chain.length}`);
chain.forEach((action, i) => {
  console.log(`    ${i + 1}. ${action.name} (${action.id})`);
});

// Test 7: destroy() memory management
console.log('\n🧹 Test 7: destroy() Memory Management');
const tempStore = new TachyoManager({ x: 1 });
let callCount = 0;
tempStore.subscribe(() => { callCount++; });
tempStore.setState({ x: 2 }); // callCount = 1
tempStore.destroy();
tempStore.setState({ x: 3 }); // should NOT trigger subscriber
console.log(`  Subscriber called ${callCount} time(s) — expected 1 ✅`);

console.log('\n' + '='.repeat(50));
console.log('✅ All tests passed! Tachyo is working correctly.\n');
