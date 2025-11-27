---
name: React Native Optimizer
description: Ensures React Native best practices for performance, memory efficiency, and optimal user experience
version: 1.0.0
author: Lion
created: 2025-11-27
tags: [react-native, performance, optimization, best-practices]
---

# React Native Optimizer Skill

## 🎯 Purpose

Automatically identifies and fixes React Native performance issues, ensures best practices, and optimizes components for production-ready performance.

**Target:** Achieve 60fps, reduce memory usage, eliminate unnecessary re-renders  
**Impact:** Smooth user experience, reduced crashes, better app store ratings

## 🔍 When to Use This Skill

Trigger this skill when:
- User asks to "optimize React Native performance"
- Analyzing component rendering issues
- Detecting FlatList without optimization props
- Finding missing React.memo or useMemo
- Identifying expensive operations in render
- Before production deployment

## ⚡ Optimization Rules

### 1. FlatList Optimization

```typescript
// ❌ BAD - Missing optimization props
<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
/>

// ✅ GOOD - Fully optimized
<FlatList
  data={items}
  renderItem={renderItem}  // Extracted function
  keyExtractor={keyExtractor}  // Stable keys
  getItemLayout={getItemLayout}  // Pre-computed heights
  removeClippedSubviews={true}  // Memory optimization
  maxToRenderPerBatch={10}  // Batch rendering
  updateCellsBatchingPeriod={50}  // Update frequency
  initialNumToRender={10}  // Initial render count
  windowSize={5}  // Viewport multiplier
/>
```

### 2. Component Memoization

```typescript
// ❌ BAD - Re-renders on every parent update
const ListItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{item.title}</Text>
  </TouchableOpacity>
);

// ✅ GOOD - Memoized with proper comparison
const ListItem = React.memo(
  ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  ),
  (prevProps, nextProps) => 
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title
);
```

### 3. Callback Optimization

```typescript
// ❌ BAD - New function on every render
<Button onPress={() => handlePress(item.id)} />

// ✅ GOOD - Memoized callback
const handlePress = useCallback(() => {
  doSomething(item.id);
}, [item.id]);

<Button onPress={handlePress} />
```

### 4. Image Optimization

```typescript
// ❌ BAD - No caching or sizing
<Image source={{ uri: imageUrl }} />

// ✅ GOOD - Optimized with FastImage
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.image}
  resizeMode="cover"
/>
```

### 5. Conditional Rendering

```typescript
// ❌ BAD - Always renders invisible elements
{isVisible && <HeavyComponent />}
{!isVisible && null}

// ✅ GOOD - True conditional rendering
{isVisible ? <HeavyComponent /> : null}

// ✅ BETTER - With React.lazy for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

{isVisible && (
  <Suspense fallback={<ActivityIndicator />}>
    <HeavyComponent />
  </Suspense>
)}
```

## 📋 Optimization Checklist

### Performance Checklist

- [ ] All FlatLists have `keyExtractor`
- [ ] All FlatLists use `renderItem` as extracted function
- [ ] Heavy components wrapped in `React.memo`
- [ ] Callbacks wrapped in `useCallback`
- [ ] Expensive calculations wrapped in `useMemo`
- [ ] Images use FastImage or have caching
- [ ] No inline functions in render
- [ ] No inline object/array creation in props
- [ ] Animations use `useNativeDriver: true`
- [ ] Large lists use `windowSize` optimization

### Memory Checklist

- [ ] FlatList has `removeClippedSubviews={true}`
- [ ] Images have proper `resizeMode`
- [ ] No memory leaks in useEffect cleanup
- [ ] Timers cleared on unmount
- [ ] Event listeners removed on unmount
- [ ] Large data structures not stored in state unnecessarily

### Bundle Size Checklist

- [ ] Lodash functions imported individually
- [ ] Heavy libraries lazy-loaded
- [ ] Icon libraries tree-shaken
- [ ] Dev dependencies not in production bundle

## 🛠️ Auto-Fix Patterns

### Pattern 1: Optimize FlatList

```typescript
// Auto-detect
if (component.includes('<FlatList') && !component.includes('keyExtractor')) {
  addFlatListOptimizations();
}

// Apply fix
const renderItem = useCallback(({ item }) => (
  <ItemComponent item={item} />
), []);

const keyExtractor = useCallback((item) => item.id, []);

<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Pattern 2: Add React.memo

```typescript
// Auto-detect
if (isComponent && !hasReactMemo && hasProps) {
  wrapWithReactMemo();
}

// Apply fix
export default React.memo(ComponentName);
```

### Pattern 3: Extract Inline Functions

```typescript
// Auto-detect inline functions
onPress={() => doSomething(id)}

// Replace with useCallback
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);

onPress={handlePress}
```

## 📊 Performance Metrics

Track these metrics after optimization:

```typescript
// Use React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="ComponentName" onRender={onRenderCallback}>
  <Component />
</Profiler>

// Target metrics:
// - Initial render: < 16ms (60fps)
// - Re-render: < 8ms
// - Memory usage: < 100MB for list screens
// - FPS: 60fps during scrolling
// - TTI (Time to Interactive): < 2s
```

## 🎓 Best Practices

1. **Always profile before optimizing** - Don't guess, measure
2. **Optimize FlatList first** - Biggest impact for list-heavy apps
3. **Memoize expensive operations** - But don't over-memoize
4. **Use native animations** - `useNativeDriver: true`
5. **Lazy load heavy screens** - Use React.lazy + Suspense
6. **Test on low-end devices** - Performance matters most there

## 🔗 Integration with MCPs

Works with:
- **@mobile-optimization MCP** - Validates optimizations
- **@code-quality MCP** - Checks code standards

**Workflow:**
```bash
# 1. Analyze performance
@mobile-optimization analyze src/components/List.tsx

# 2. Apply optimizations with this skill
Claude: "Optimize React Native performance in List.tsx"

# 3. Validate
@mobile-optimization validate src/components/List.tsx

# 4. Profile on device
npm run profile:android
```

---

*Last Updated: 2025-11-27*  
*Maintained by: Lion (@LionGab)*

