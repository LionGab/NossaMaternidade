# 🧩 Component Usage Guide - Nossa Maternidade

**Last Updated:** December 9, 2025
**Purpose:** Definitive guide on WHICH component to use (we have duplicates!)

---

## ⚠️ CRITICAL: Component Duplication Problem

We have **TWO folders** with similar components:
- `/src/components/atoms/` - 28 components ✅ **USE THIS**
- `/src/components/primitives/` - 19 components ⚠️ **DEPRECATED** (use atoms instead)

**Why?** Historical reasons. We're consolidating to `atoms/`.

---

## 🔘 BUTTONS (10 variants found!)

### ✅ PRIMARY: Use atoms/Button.tsx

**File:** `/src/components/atoms/Button.tsx`

**When to use:** 99% of the time - this is your main button component

**Features:**
- ✅ Theme-aware (light/dark mode)
- ✅ Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
- ✅ Sizes: `sm`, `md`, `lg`
- ✅ Loading states
- ✅ Disabled states
- ✅ Haptic feedback
- ✅ Full accessibility support
- ✅ TypeScript support

**Example:**
```tsx
import { Button } from '@/components/atoms/Button';

<Button variant="primary" size="md" onPress={handlePress}>
  Click Me
</Button>
```

---

### 🚫 DEPRECATED Buttons

#### ❌ /src/components/primitives/Button.tsx
**Status:** DEPRECATED
**Migration:** Use `/src/components/atoms/Button.tsx` instead
**Action:** Search codebase and replace imports

#### ❌ /src/components/primitives/WellnessButton.tsx
**Status:** DEPRECATED (never used!)
**Migration:** Use `/src/components/atoms/Button.tsx` instead
**Action:** Can be safely deleted

#### ❌ /src/components/Button.tsx (root)
**Status:** LEGACY
**Migration:** Use `/src/components/atoms/Button.tsx` instead

---

### ✅ SPECIALIZED Buttons (Keep These)

These are specialized and should NOT be replaced:

#### /src/components/atoms/IconButton.tsx
**When to use:** Icon-only buttons (no text)

```tsx
import { IconButton } from '@/components/atoms/IconButton';

<IconButton icon="heart" onPress={handleLike} />
```

#### /src/components/atoms/PillButton.tsx
**When to use:** Pill-shaped buttons (fully rounded)

```tsx
import { PillButton } from '@/components/atoms/PillButton';

<PillButton>Follow</PillButton>
```

#### /src/components/atoms/HapticButton.tsx
**When to use:** Buttons with strong haptic feedback

#### /src/components/premium/PremiumButton.tsx
**When to use:** Premium feature CTAs (gradient, special styling)

#### /src/components/voice/VoiceInputButton.tsx
**When to use:** Voice recording functionality

#### /src/components/sos/SOSMaeFloatingButton.tsx
**When to use:** Emergency FAB (Floating Action Button)

---

## 🃏 CARDS (39 variants found!)

### ✅ PRIMARY: Use atoms/Card.tsx

**File:** `/src/components/atoms/Card.tsx`

**When to use:** General-purpose cards

**Features:**
- ✅ Theme-aware
- ✅ Variants: `default`, `outlined`, `elevated`
- ✅ Proper shadows
- ✅ Border radius from design system

**Example:**
```tsx
import { Card } from '@/components/atoms/Card';

<Card variant="elevated">
  <Text>Card content</Text>
</Card>
```

**Subcomponents:**
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/primitives/Card'; // Use primitives for these

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

---

### 🚫 DEPRECATED Cards

#### ❌ /src/components/primitives/Card.tsx
**Status:** Has useful subcomponents, but main Card is duplicate
**Migration:** Use atoms/Card for main card, keep primitives for CardHeader/CardContent/etc

#### ❌ /src/components/Card.tsx (root)
**Status:** LEGACY
**Migration:** Use atoms/Card

---

### ✅ SPECIALIZED Cards (Keep These)

#### /src/components/atoms/EmotionalCard.tsx
**When to use:** Mood/emotion tracking cards

#### /src/components/GlassCard.tsx
**When to use:** Glassmorphism effect cards

#### /src/components/ContentCard.tsx
**When to use:** Content displays (articles, videos)

```tsx
import { ContentCard } from '@/components/ContentCard';

<ContentCard
  title="Article Title"
  description="Description"
  imageUrl="https://..."
  onPress={handlePress}
/>
```

#### /src/components/BabyTrackerCard.tsx
**When to use:** Baby tracking metrics

#### /src/components/StatCard.tsx
**When to use:** Statistics displays

#### /src/components/features/home/EmpatheticNathIACard.tsx
**When to use:** NathIA chat CTA on home screen (specific to home)

#### /src/components/features/home/EmpatheticNathIACardV2.tsx
**When to use:** Newer version of NathIA card (prefer V2)

---

## 📝 TEXT

### ✅ PRIMARY: Use primitives/Text.tsx

**File:** `/src/components/primitives/Text.tsx`

**Features:**
- ✅ Semantic variants: `display`, `heading`, `body`, `label`, `caption`
- ✅ Multiple sizes per variant
- ✅ Theme-aware colors
- ✅ TypeScript support

**Example:**
```tsx
import { Text, H1, H2, H3, P, Small, Muted } from '@/components/primitives/Text';

<H1>Page Title</H1>
<H2>Section Title</H2>
<P>Paragraph text</P>
<Small>Small text</Small>
<Muted>Muted text</Muted>
```

**Full variant list:**
```tsx
<Text variant="display" size="large">Hero</Text>
<Text variant="heading" size="medium">Section</Text>
<Text variant="body" size="medium">Paragraph</Text>
<Text variant="label" size="large">Button</Text>
<Text variant="caption" size="small">Metadata</Text>
```

---

## 📦 LAYOUT

### Box
**File:** `/src/components/primitives/Box.tsx`

**When to use:** Flex containers, wrappers

```tsx
import { Box } from '@/components/primitives/Box';

<Box flex={1} padding={4} gap={2}>
  {children}
</Box>
```

### GradientBox
**File:** `/src/components/primitives/GradientBox.tsx`

**When to use:** Gradient backgrounds

```tsx
import { GradientBox, MaternalGradient } from '@/components/primitives/GradientBox';

<GradientBox colors={['#E91E63', '#9C27B0']}>
  {children}
</GradientBox>

// Or use presets
<MaternalGradient>
  {children}
</MaternalGradient>
```

---

## 📋 FORM CONTROLS

### Input
**File:** `/src/components/primitives/Input.tsx`

```tsx
import { Input } from '@/components/primitives/Input';

<Input
  placeholder="Enter text"
  value={text}
  onChangeText={setText}
/>
```

### Switch
**File:** `/src/components/primitives/Switch.tsx`

```tsx
import { Switch } from '@/components/primitives/Switch';

<Switch value={enabled} onValueChange={setEnabled} />
```

### Chip
**File:** `/src/components/primitives/Chip.tsx`

```tsx
import { Chip, ChipGroup } from '@/components/primitives/Chip';

<ChipGroup>
  <Chip selected={selected} onPress={handlePress}>
    Option 1
  </Chip>
  <Chip>Option 2</Chip>
</ChipGroup>
```

---

## 🎨 DISPLAY COMPONENTS

### Badge
**File:** `/src/components/primitives/Badge.tsx`

```tsx
import { Badge } from '@/components/primitives/Badge';

<Badge variant="success">New</Badge>
<Badge variant="warning">Premium</Badge>
<Badge variant="error">Alert</Badge>
```

### Avatar
**File:** `/src/components/primitives/Avatar.tsx`

```tsx
import { Avatar, AvatarGroup } from '@/components/primitives/Avatar';

<Avatar source={{ uri: imageUrl }} size="md" />

<AvatarGroup max={3}>
  <Avatar source={{ uri: user1 }} />
  <Avatar source={{ uri: user2 }} />
  <Avatar source={{ uri: user3 }} />
</AvatarGroup>
```

### Skeleton
**File:** `/src/components/primitives/Skeleton.tsx`

**When to use:** Loading states

```tsx
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard
} from '@/components/primitives/Skeleton';

<SkeletonCard />
<SkeletonText lines={3} />
<SkeletonAvatar />
```

---

## 🚦 NAVIGATION

### Tabs
**File:** `/src/components/primitives/Tabs.tsx`

```tsx
import { Tabs } from '@/components/primitives/Tabs';

<Tabs
  tabs={[
    { key: 'overview', label: 'Overview' },
    { key: 'details', label: 'Details' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

---

## 💬 FEEDBACK

### Progress
**File:** `/src/components/primitives/Progress.tsx`

```tsx
import { Progress, CircularProgress } from '@/components/primitives/Progress';

<Progress value={75} />
<CircularProgress value={75} size={100} />
```

### Toast
**File:** `/src/components/primitives/Toast.tsx`

```tsx
import { useToast } from '@/components/primitives/Toast';

const { showToast } = useToast();

showToast({
  type: 'success',
  message: 'Operation completed',
});
```

### Accordion
**File:** `/src/components/primitives/Accordion.tsx`

```tsx
import { Accordion } from '@/components/primitives/Accordion';

<Accordion
  items={[
    { title: 'Section 1', content: <Text>Content 1</Text> },
    { title: 'Section 2', content: <Text>Content 2</Text> },
  ]}
/>
```

---

## 🔝 OVERLAYS

### Sheet (Bottom Sheet)
**File:** `/src/components/primitives/Sheet.tsx`

```tsx
import { Sheet } from '@/components/primitives/Sheet';

<Sheet visible={visible} onClose={handleClose}>
  <Text>Sheet content</Text>
</Sheet>
```

### Dialog / Alert
**File:** `/src/components/primitives/Dialog.tsx`

```tsx
import { Dialog, AlertDialog } from '@/components/primitives/Dialog';

<Dialog visible={visible} onClose={handleClose}>
  <Text>Dialog content</Text>
</Dialog>

<AlertDialog
  visible={visible}
  title="Confirm"
  message="Are you sure?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

---

## 🎯 FEATURE-SPECIFIC COMPONENTS

### EmpatheticMoodChips
**File:** `/src/components/features/home/EmpatheticMoodChips.tsx`

**When to use:** Home screen mood selection

```tsx
import { EmpatheticMoodChips } from '@/components/features/home/EmpatheticMoodChips';

<EmpatheticMoodChips
  selectedMood={mood}
  onMoodSelect={setMood}
/>
```

### EmpatheticHighlights
**File:** `/src/components/features/home/EmpatheticHighlights.tsx`

**When to use:** Home screen content highlights

---

## 📱 SCREENS vs COMPONENTS

### When to create a Screen:
- Standalone navigation destination
- Has its own route
- Full-screen view

**Location:** `/src/screens/`

### When to create a Component:
- Reusable piece of UI
- Used in multiple places
- Can be composed

**Location:** `/src/components/`

---

## 🔄 Migration Checklist

Migrating from deprecated components:

### Button Migration
```bash
# Find all uses of deprecated buttons
grep -r "from '@/components/primitives/Button'" src/

# Replace with:
# from '@/components/atoms/Button'
```

### Card Migration
```bash
# Find all uses of deprecated cards
grep -r "from '@/components/primitives/Card'" src/

# For main Card component, replace with atoms/Card
# For CardHeader/CardContent/etc, keep primitives import
```

---

## ✅ Component Selection Flowchart

```
Need a component?
│
├─ Is it a button?
│  ├─ General purpose? → atoms/Button ✅
│  ├─ Icon only? → atoms/IconButton ✅
│  ├─ Pill shape? → atoms/PillButton ✅
│  └─ Voice input? → voice/VoiceInputButton ✅
│
├─ Is it a card?
│  ├─ General purpose? → atoms/Card ✅
│  ├─ Content display? → ContentCard ✅
│  ├─ Emotion tracking? → atoms/EmotionalCard ✅
│  └─ Glass effect? → GlassCard ✅
│
├─ Is it text?
│  └─ Always use primitives/Text ✅
│
├─ Is it a form control?
│  ├─ Text input? → primitives/Input ✅
│  ├─ Toggle? → primitives/Switch ✅
│  └─ Selection? → primitives/Chip ✅
│
└─ Is it for layout?
   ├─ Container? → primitives/Box ✅
   └─ Gradient? → primitives/GradientBox ✅
```

---

## 🚨 RED FLAGS

If you see these in code reviews, flag them:

- ❌ Importing from `@/components/primitives/Button` (use atoms)
- ❌ Importing from `@/components/primitives/WellnessButton` (deleted)
- ❌ Creating new button variants (use atoms/Button variants)
- ❌ Creating new card types without justification
- ❌ Hardcoded styles that should use design tokens
- ❌ Not using `useTheme()` for theme awareness

---

## 📚 Related Guides

- **Design System:** `DESIGN_SYSTEM.md` - Color, spacing, typography tokens
- **Accessibility:** `ACCESSIBILITY.md` - WCAG compliance guide
- **Dark Mode:** `DARK_MODE_GUIDE.md` - Theme implementation

---

**Questions?** Ask in #frontend channel or check the docs.

**Found a bug?** File an issue with component name and file path.

**Want to add a component?** Check if it can be a variant of existing component first!
