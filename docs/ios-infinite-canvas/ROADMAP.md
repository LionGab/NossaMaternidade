# 🚀 Product Roadmap — iOS Infinite Canvas

> Strategic roadmap from MVP to enterprise-ready product

## Timeline Overview

```
2025 Q1                   2025 Q2                   2025 Q3                   2025 Q4
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    MVP v1.0     │ ──▶  │    V2.0         │ ──▶  │    V3.0         │ ──▶  │    V4.0         │
│                 │      │                 │      │                 │      │                 │
│ • Core canvas   │      │ • Full toolkit  │      │ • Platform      │      │ • Collaboration │
│ • Basic drawing │      │ • Text + Images │      │   expansion     │      │ • AI features   │
│ • Local storage │      │ • Undo/redo     │      │ • iCloud sync   │      │ • Enterprise    │
│                 │      │ • Export        │      │ • macOS app     │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
     6 weeks                  4 weeks                  6 weeks                  8 weeks
```

---

## MVP v1.0 — Foundation

**Goal:** Ship a functional infinite canvas with core drawing and shapes.

**Timeline:** 6 weeks

### Week 1-2: Canvas Engine

| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Project setup (Xcode, SwiftData) | P0 | ⬜ | iOS 17+, iPad Universal |
| Infinite pan gesture | P0 | ⬜ | 2-finger pan |
| Pinch-to-zoom | P0 | ⬜ | 0.1x to 10x range |
| Metal tile renderer (basic) | P0 | ⬜ | 512x512 tiles |
| Spatial index (grid-based) | P0 | ⬜ | For hit-testing |
| Viewport culling | P1 | ⬜ | Only render visible objects |

### Week 3: Drawing

| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| PencilKit integration | P0 | ⬜ | PKCanvasView |
| Pen brush | P0 | ⬜ | Default tool |
| Marker brush | P0 | ⬜ | Wider stroke |
| Eraser tool | P0 | ⬜ | Vector eraser |
| Color picker (basic) | P1 | ⬜ | 12 preset colors |
| Stroke width slider | P1 | ⬜ | 1-20 pt range |

### Week 4: Shapes

| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Rectangle shape | P0 | ⬜ | Tap-drag to create |
| Circle shape | P0 | ⬜ | Tap-drag to create |
| Sticky note | P0 | ⬜ | 200x200 yellow square |
| Fill color | P1 | ⬜ | Solid color only |
| Stroke color | P1 | ⬜ | Border color |

### Week 5: Selection & Transform

| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| Tap to select | P0 | ⬜ | Single object |
| Drag to move | P0 | ⬜ | Selected objects |
| Resize handles | P0 | ⬜ | Corner handles |
| Delete (trash icon) | P0 | ⬜ | Delete selected |
| Multi-select (box select) | P1 | ⬜ | Drag rectangle |

### Week 6: Storage & Home Screen

| Task | Priority | Status | Notes |
|------|----------|--------|-------|
| SwiftData Board model | P0 | ⬜ | id, title, objects |
| Serialize canvas objects | P0 | ⬜ | Codable |
| Autosave (2s debounce) | P0 | ⬜ | Background save |
| Board list (home screen) | P0 | ⬜ | Grid of thumbnails |
| Create new board | P0 | ⬜ | + button |
| Delete board | P1 | ⬜ | Swipe to delete |

### MVP Deliverables

- ✅ Infinite canvas with smooth pan/zoom
- ✅ Drawing: pen, marker, eraser
- ✅ Shapes: rectangle, circle, sticky note
- ✅ Selection and move/resize
- ✅ Local storage with autosave
- ✅ Multi-board support

---

## V2.0 — Creative Toolkit

**Goal:** Complete the creative toolkit for serious use.

**Timeline:** 4 weeks (after MVP launch)

### Week 7-8: Core Additions

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Arrow shape | P0 | 2d | Directional arrow |
| Line shape | P0 | 1d | Simple line |
| Text tool | P0 | 3d | Editable text box |
| Image import | P0 | 2d | From Photos/Files |
| Highlighter brush | P1 | 1d | Transparent stroke |

### Week 9: Editing Features

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Undo/Redo (50 steps) | P0 | 3d | Command pattern |
| Rotation handle | P0 | 2d | Rotate objects |
| Corner radius (shapes) | P1 | 1d | Rounded rectangles |
| Opacity slider | P1 | 1d | Object transparency |
| Duplicate object | P1 | 0.5d | Copy + paste offset |

### Week 10: Export & Polish

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Export to PNG | P0 | 1d | Full board |
| Export to PDF | P0 | 2d | Vector export |
| Share sheet | P0 | 0.5d | iOS share |
| Keyboard shortcuts | P1 | 1d | Delete, undo, etc. |
| Apple Pencil double-tap | P2 | 0.5d | Switch tool |
| Haptic feedback | P2 | 0.5d | Selection, snap |

### V2.0 Deliverables

- ✅ Full shape library (arrow, line, all basics)
- ✅ Text tool with font/size/color
- ✅ Image import and manipulation
- ✅ Undo/redo system
- ✅ Rotation and advanced transforms
- ✅ Export to PNG/PDF

---

## V3.0 — Platform Expansion

**Goal:** Multi-platform presence and power user features.

**Timeline:** 6 weeks

### iCloud Sync

| Task | Notes |
|------|-------|
| CloudKit integration | NSPersistentCloudKitContainer |
| Conflict resolution | Last-write-wins for MVP |
| Sync status indicator | Cloud icon with status |
| Offline mode | Full functionality offline |
| Sync preferences | Enable/disable per board |

### macOS App

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| Mac Catalyst | Minimal code changes | Limited Mac features | ✅ Phase 1 |
| Native AppKit | Full Mac experience | Duplicate code | Phase 2 |
| SwiftUI cross-platform | Single codebase | Platform quirks | Consider later |

### Power Features

| Feature | Description |
|---------|-------------|
| **Snap to grid** | Toggle grid, objects snap to grid lines |
| **Object grouping** | Group multiple objects as one |
| **Layers panel** | Show/hide/reorder layers |
| **Templates** | Pre-made board templates |
| **Board search** | Search boards by title/content |
| **Tags/folders** | Organize boards |

### iPadOS Enhancements

| Feature | Notes |
|---------|-------|
| Stage Manager support | Multi-window |
| Split View | Side-by-side with other apps |
| Drag and drop | From Files, Photos, Safari |
| Scribble | Handwriting in text fields |
| Shortcuts app | Automate canvas actions |

---

## V4.0 — Collaboration & AI

**Goal:** Real-time collaboration and AI-powered features.

**Timeline:** 8 weeks

### Real-Time Collaboration

| Component | Technology | Notes |
|-----------|------------|-------|
| **Transport** | WebSocket | Low latency |
| **Sync Protocol** | CRDT (Yjs) | Conflict-free |
| **Backend** | CloudKit + custom server | Hybrid approach |
| **Presence** | Cursor positions | See collaborators |
| **Permissions** | View/Edit/Admin | Role-based access |

### AI Features

| Feature | API | Description |
|---------|-----|-------------|
| **Handwriting to text** | Vision + GPT-4 | Convert handwriting to text objects |
| **Smart shapes** | Core ML | Draw rough → perfect shape |
| **Auto-layout** | Custom model | Arrange objects aesthetically |
| **Image to sticky notes** | GPT-4 Vision | Extract text from images |
| **Summarize board** | GPT-4 | AI summary of board content |
| **Generate ideas** | GPT-4 | Brainstorm related concepts |

### Enterprise Features

| Feature | Description |
|---------|-------------|
| **Team workspaces** | Shared folders for teams |
| **Admin console** | Manage users, permissions |
| **SSO** | SAML, OAuth |
| **Audit log** | Track changes |
| **Custom branding** | Company logo, colors |

---

## V5.0+ — Vision

### Vision Pro (visionOS)

- **3D infinite canvas** — Objects float in space
- **Hand tracking** — Pinch to select, drag to move
- **Spatial audio** — Sound tied to object positions
- **Personas** — See collaborators in space
- **Mac Virtual Display** — Use alongside Mac

### Web Viewer

- **Share links** — Anyone can view without app
- **Embed boards** — In websites, Notion, etc.
- **Comment mode** — Viewers can add comments
- **PDF export** — From web

### Advanced Drawing

- **Brush library** — Community brushes
- **Vector drawing** — Bezier curves, pen tool
- **Pressure mapping** — Custom pressure curves
- **Tilt shading** — Use Pencil tilt for shading
- **Layers** — Full layer system like Photoshop

---

## Success Metrics

### MVP (v1.0)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to first board** | < 10 seconds | Analytics |
| **Crash-free rate** | > 99% | Crashlytics |
| **App Store rating** | > 4.5 | App Store |
| **Day 1 retention** | > 50% | Analytics |
| **Day 7 retention** | > 25% | Analytics |

### V2.0

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Boards per user (avg)** | > 5 | Analytics |
| **Session length** | > 10 min | Analytics |
| **Feature adoption** | > 30% text tool | Analytics |
| **Export usage** | > 20% users | Analytics |

### V3.0

| Metric | Target | Measurement |
|--------|--------|-------------|
| **iCloud sync enabled** | > 60% | Analytics |
| **macOS MAU** | > 10% of iOS | Analytics |
| **Pro conversion** | > 5% | Revenue |

### V4.0

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Collaborative boards** | > 20% | Analytics |
| **AI feature usage** | > 40% | Analytics |
| **Enterprise customers** | > 10 | Sales |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Performance issues** | Medium | High | Early Metal optimization, testing on older devices |
| **PencilKit limitations** | Low | Medium | Custom drawing fallback if needed |
| **SwiftData bugs** | Medium | Medium | Core Data fallback plan |
| **App Store rejection** | Low | High | Follow guidelines strictly |
| **Competitor copies** | High | Medium | Move fast, focus on UX quality |
| **Scope creep** | High | High | Strict MVP scope, defer features |

---

## Resource Requirements

### MVP Team

| Role | Count | Notes |
|------|-------|-------|
| iOS Engineer | 2 | SwiftUI + UIKit expertise |
| Designer | 1 | Part-time, UI/UX |
| QA | 0.5 | Part-time testing |

### V2-V3 Team

| Role | Count | Notes |
|------|-------|-------|
| iOS Engineer | 3 | Add macOS expertise |
| Designer | 1 | Full-time |
| Backend Engineer | 1 | For sync/collab |
| QA | 1 | Full-time |

### V4+ Team

| Role | Count | Notes |
|------|-------|-------|
| iOS Engineers | 4 | Platform specialists |
| Backend Engineers | 2 | Sync, AI, enterprise |
| ML Engineer | 1 | AI features |
| Designer | 2 | Product + brand |
| Product Manager | 1 | Coordination |
| QA | 2 | Manual + automation |

---

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|-------------------------|
| Nov 2025 | SwiftUI + UIKit hybrid | Best of both worlds | Pure SwiftUI (too limiting), Pure UIKit (verbose) |
| Nov 2025 | SwiftData for persistence | Modern, Swift-native | Core Data (legacy), Realm (3rd party) |
| Nov 2025 | iOS 17+ minimum | SwiftData requirement | iOS 16 with Core Data (more work) |
| Nov 2025 | Metal for rendering | 120 FPS requirement | Core Graphics (too slow), SpriteKit (wrong abstraction) |
| Nov 2025 | Tile-based rendering | Infinite canvas scale | Full-canvas rendering (memory issues) |
| Nov 2025 | Freemium model | Market standard | One-time purchase (less revenue), Subscription only (high barrier) |

---

**Document version:** 1.0  
**Last updated:** November 2025  
**Next review:** After MVP completion
