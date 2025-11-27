# 🎨 iOS Infinite Canvas App — Architecture Blueprint

> **CTO Strategic Analysis & Technical Architecture**  
> Version: 1.0.0 | Created: November 2025

## 📋 Executive Summary

This document outlines the technical architecture, strategic decisions, and implementation roadmap for building a **native iOS infinite canvas app** — a creative workspace for drawing, writing, shapes, images, and infinite pan/zoom.

**Mission:** Create the fastest, most fluid infinite canvas experience possible on iOS.

**Target:** PencilKit + Freeform + Miro hybrid, but simpler, faster, and offline-first.

---

## 🔥 Strategic Analysis

### Market Position

| Competitor | Strengths | Weaknesses | Our Opportunity |
|------------|-----------|------------|-----------------|
| **Apple Freeform** | Native, Apple Pencil optimized | Heavy, slow with many objects, limited customization | Lighter, faster, more customizable |
| **Miro** | Collaboration, templates | Not native, web-based, requires internet | Native performance, offline-first |
| **Concepts** | Vector-based, infinite canvas | Steep learning curve, expensive | Simpler UX, accessible pricing |
| **GoodNotes 6** | Note-taking focused | Not a true freeform canvas | True infinite workspace |

### Competitive Moat

1. **Performance First** — Metal rendering, 120 FPS on ProMotion displays
2. **Offline-First** — Full functionality without internet
3. **Apple Pencil Excellence** — Low latency, pressure/tilt sensitivity
4. **Simplicity** — Fewer features, better execution

---

## 🏗️ Technical Architecture

### Why Native iOS (Swift + SwiftUI)?

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **SwiftUI + UIKit Hybrid** | Modern declarative UI, UIKit for performance-critical views | Learning curve | ✅ **CHOSEN** |
| **Pure UIKit** | Maximum control, proven performance | Verbose, harder to maintain | ❌ Legacy approach |
| **React Native** | Cross-platform | Not suitable for high-performance graphics | ❌ Wrong tool |
| **Flutter** | Cross-platform, good performance | Not native, Apple Pencil support limited | ❌ Not optimal |

### Architecture Decision: SwiftUI + UIKit + Metal Hybrid

```
┌─────────────────────────────────────────────────────────────────┐
│                      📱 APP LAYER                                │
│                     SwiftUI (Navigation, State)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │   Home Screen    │  │   Canvas View    │  │   Settings     │ │
│  │   (SwiftUI)      │  │   (UIKit)        │  │   (SwiftUI)    │ │
│  │                  │  │                  │  │                │ │
│  │  • Board List    │  │  • Metal Render  │  │  • Preferences │ │
│  │  • Search        │  │  • PencilKit     │  │  • Export      │ │
│  │  • Create New    │  │  • Gestures      │  │  • Account     │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬────────┘ │
│           │                     │                     │          │
│           └─────────────────────┴─────────────────────┘          │
│                                 │                                │
├─────────────────────────────────┼────────────────────────────────┤
│                      🔧 SERVICE LAYER                            │
│                                 │                                │
│  ┌──────────────────────────────┼──────────────────────────────┐ │
│  │                    Canvas Engine                             │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │ Spatial     │  │ Render      │  │ Input Handler       │  │ │
│  │  │ Index       │  │ Pipeline    │  │                     │  │ │
│  │  │ (R-Tree)    │  │ (Metal)     │  │ • Touch/Gestures    │  │ │
│  │  │             │  │             │  │ • Apple Pencil      │  │ │
│  │  │ • Query     │  │ • Tiles     │  │ • Keyboard          │  │ │
│  │  │ • Insert    │  │ • LOD       │  │                     │  │ │
│  │  │ • Delete    │  │ • Culling   │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │                 Object Manager                          ││ │
│  │  │                                                         ││ │
│  │  │  • Shapes (Rect, Circle, Arrow, Sticky)                 ││ │
│  │  │  • Drawings (PencilKit strokes)                         ││ │
│  │  │  • Text (AttributedString)                              ││ │
│  │  │  • Images (UIImage/CGImage)                             ││ │
│  │  │  • Groups (Container objects)                           ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                      💾 DATA LAYER                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    SwiftData                              │   │
│  │                                                           │   │
│  │  @Model Board { id, title, thumbnail, objects, ... }     │   │
│  │  @Model CanvasObject { type, position, size, data, ... } │   │
│  │  @Model Stroke { points, brush, color, ... }             │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              File-Based Serialization                     │   │
│  │                                                           │   │
│  │  ~/Documents/Boards/{boardId}/                            │   │
│  │    ├── board.json       (metadata)                        │   │
│  │    ├── objects.bin      (canvas objects, binary)          │   │
│  │    ├── strokes.bin      (PencilKit strokes)               │   │
│  │    ├── images/          (referenced images)               │   │
│  │    └── thumbnail.png    (preview)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Capabilities

### 1. Canvas Engine (Critical Path)

The canvas engine is the heart of the app. It must be **blazing fast**.

#### Rendering Strategy: Tile-Based Metal Renderer

```swift
// CanvasRenderer.swift
class CanvasRenderer {
    // Tile-based rendering for infinite canvas
    private var tileCache: [TileCoordinate: MTLTexture] = [:]
    private let tileSize: CGFloat = 512  // Optimal for Metal
    
    // Only render visible tiles + 1-tile buffer
    func render(viewport: CGRect, scale: CGFloat) {
        let visibleTiles = calculateVisibleTiles(viewport, scale)
        
        // Parallel tile rendering
        visibleTiles.parallelForEach { tile in
            if let cached = tileCache[tile] {
                drawTile(cached, at: tile.position)
            } else {
                let texture = renderTile(tile)
                tileCache[tile] = texture
                drawTile(texture, at: tile.position)
            }
        }
    }
}
```

#### Spatial Indexing: R-Tree

For efficient object queries (selection, hit-testing, visible objects):

```swift
// SpatialIndex.swift
class SpatialIndex<T: Identifiable> {
    private var rtree = RTree<T>()
    
    func query(rect: CGRect) -> [T] {
        return rtree.search(boundingBox: rect)
    }
    
    func insert(_ object: T, bounds: CGRect) {
        rtree.insert(object, boundingBox: bounds)
    }
    
    func remove(_ object: T) {
        rtree.remove(object)
    }
}
```

#### Level of Detail (LOD)

Objects simplify at lower zoom levels for performance:

```swift
enum LODLevel: Int {
    case full = 0      // zoom > 50%: full detail
    case medium = 1    // zoom 25-50%: simplified shapes
    case low = 2       // zoom 10-25%: basic shapes
    case thumbnail = 3 // zoom < 10%: colored rectangles
}

func lodLevel(for zoom: CGFloat) -> LODLevel {
    switch zoom {
    case 0.5...: return .full
    case 0.25..<0.5: return .medium
    case 0.10..<0.25: return .low
    default: return .thumbnail
    }
}
```

---

### 2. Drawing (PencilKit Integration)

```swift
// DrawingLayer.swift
import PencilKit

class DrawingLayer: UIView {
    private let canvasView = PKCanvasView()
    private let toolPicker = PKToolPicker()
    
    // Brush types
    enum BrushType {
        case pen, marker, highlighter, eraser
        
        var pkTool: PKTool {
            switch self {
            case .pen: return PKInkingTool(.pen, color: .black, width: 5)
            case .marker: return PKInkingTool(.marker, color: .black, width: 15)
            case .highlighter: return PKInkingTool(.marker, color: .yellow.withAlphaComponent(0.3), width: 30)
            case .eraser: return PKEraserTool(.vector)
            }
        }
    }
    
    func setBrush(_ type: BrushType, color: UIColor, width: CGFloat) {
        switch type {
        case .pen:
            canvasView.tool = PKInkingTool(.pen, color: color, width: width)
        case .marker:
            canvasView.tool = PKInkingTool(.marker, color: color, width: width)
        case .highlighter:
            canvasView.tool = PKInkingTool(.marker, color: color.withAlphaComponent(0.3), width: width)
        case .eraser:
            canvasView.tool = PKEraserTool(.vector)
        }
    }
}
```

---

### 3. Shapes

```swift
// Shape.swift
protocol CanvasShape: CanvasObject {
    var path: CGPath { get }
    var fillColor: CGColor? { get set }
    var strokeColor: CGColor { get set }
    var strokeWidth: CGFloat { get set }
}

class RectangleShape: CanvasShape {
    var cornerRadius: CGFloat = 0
    
    var path: CGPath {
        return CGPath(roundedRect: bounds, cornerWidth: cornerRadius, cornerHeight: cornerRadius, transform: nil)
    }
}

class CircleShape: CanvasShape {
    var path: CGPath {
        return CGPath(ellipseIn: bounds, transform: nil)
    }
}

class ArrowShape: CanvasShape {
    var startPoint: CGPoint
    var endPoint: CGPoint
    var arrowHeadSize: CGFloat = 15
    
    var path: CGPath {
        // Arrow path calculation
        let path = CGMutablePath()
        path.move(to: startPoint)
        path.addLine(to: endPoint)
        // Add arrowhead...
        return path
    }
}

class StickyNote: CanvasShape {
    var text: String = ""
    var backgroundColor: CGColor = UIColor.systemYellow.cgColor
    
    // 200x200 default size
    override var size: CGSize { CGSize(width: 200, height: 200) }
}
```

---

### 4. Text Tool

```swift
// TextBox.swift
class TextBox: CanvasObject, UITextViewDelegate {
    private let textView = UITextView()
    
    var text: String {
        get { textView.text }
        set { textView.text = newValue; updateSize() }
    }
    
    var font: UIFont = .systemFont(ofSize: 16) {
        didSet { textView.font = font; updateSize() }
    }
    
    var textColor: UIColor = .label {
        didSet { textView.textColor = textColor }
    }
    
    // Auto-resize to fit content
    private func updateSize() {
        let maxWidth: CGFloat = 300
        let size = textView.sizeThatFits(CGSize(width: maxWidth, height: .infinity))
        self.size = CGSize(width: max(100, size.width), height: max(40, size.height))
    }
}
```

---

### 5. Images

```swift
// ImageObject.swift
class ImageObject: CanvasObject {
    let originalImage: UIImage
    private var cachedRenderedImage: UIImage?
    
    var cropRect: CGRect = .zero  // Relative to original
    var rotation: CGFloat = 0
    
    var renderedImage: UIImage {
        if let cached = cachedRenderedImage {
            return cached
        }
        
        // Apply crop and scale
        let cropped = cropImage(originalImage, to: cropRect)
        cachedRenderedImage = cropped
        return cropped
    }
    
    // Import from Photos, Files, or drag-and-drop
    static func importFrom(url: URL) async throws -> ImageObject {
        let data = try Data(contentsOf: url)
        guard let image = UIImage(data: data) else {
            throw ImageError.invalidFormat
        }
        return ImageObject(image: image)
    }
}
```

---

### 6. Selection & Transform

```swift
// SelectionManager.swift
class SelectionManager {
    var selectedObjects: Set<CanvasObject> = []
    
    // Multi-select with bounding box
    func selectObjects(in rect: CGRect, canvas: CanvasEngine) {
        selectedObjects = Set(canvas.spatialIndex.query(rect: rect))
        showTransformHandles()
    }
    
    // Transform operations
    func move(by delta: CGVector) {
        selectedObjects.forEach { $0.position += delta }
    }
    
    func scale(by factor: CGFloat, anchor: CGPoint) {
        selectedObjects.forEach { object in
            let relativePos = object.center - anchor
            object.center = anchor + relativePos * factor
            object.size *= factor
        }
    }
    
    func rotate(by angle: CGFloat, around center: CGPoint) {
        selectedObjects.forEach { object in
            object.rotation += angle
            // Rotate position around center
            let rotated = rotatePoint(object.center, around: center, by: angle)
            object.center = rotated
        }
    }
    
    // Z-order
    func bringToFront() {
        selectedObjects.forEach { $0.zIndex = canvas.maxZIndex + 1 }
    }
    
    func sendToBack() {
        selectedObjects.forEach { $0.zIndex = canvas.minZIndex - 1 }
    }
}
```

---

### 7. Local-First Storage

```swift
// BoardStorage.swift
@Model
class Board {
    @Attribute(.unique) var id: UUID
    var title: String
    var createdAt: Date
    var updatedAt: Date
    var thumbnailData: Data?
    
    // Relationships
    @Relationship(deleteRule: .cascade)
    var objects: [CanvasObjectModel] = []
}

@Model
class CanvasObjectModel {
    var id: UUID
    var type: String  // "shape", "drawing", "text", "image"
    var x: Double
    var y: Double
    var width: Double
    var height: Double
    var rotation: Double
    var zIndex: Int
    var data: Data  // Serialized type-specific data
}

// BoardManager.swift
class BoardManager {
    private let modelContext: ModelContext
    
    func save(_ board: Board) async throws {
        board.updatedAt = Date()
        try modelContext.save()
        
        // Generate thumbnail async
        Task {
            let thumbnail = await generateThumbnail(for: board)
            board.thumbnailData = thumbnail.pngData()
            try? modelContext.save()
        }
    }
    
    func autosave(_ board: Board) {
        // Debounced autosave every 2 seconds
        autosaveDebouncer.call {
            try? await self.save(board)
        }
    }
}
```

---

## 🚀 Roadmap

### MVP (v1.0) — 6 weeks

**Goal:** Minimal viable canvas with core drawing and shapes.

| Week | Deliverable |
|------|-------------|
| 1-2 | Canvas engine: infinite pan/zoom, Metal tile renderer |
| 3 | PencilKit integration, basic brushes |
| 4 | Shapes: rectangle, circle, sticky note |
| 5 | Selection, move, resize, delete |
| 6 | Local storage (SwiftData), board list, autosave |

**MVP Features:**
- ✅ Infinite pan & zoom (2-finger gesture)
- ✅ Drawing: pen, marker, eraser
- ✅ Shapes: rectangle, circle, sticky note
- ✅ Selection & transform (move, resize)
- ✅ Local storage, multi-board
- ✅ Home screen with board list

---

### V2.0 — 4 weeks (after MVP launch)

**Goal:** Complete creative toolkit.

| Feature | Priority | Effort |
|---------|----------|--------|
| Arrow shape | High | 2d |
| Text tool | High | 3d |
| Image import | High | 3d |
| Rotation handles | Medium | 2d |
| Color picker + opacity | Medium | 2d |
| Undo/redo (50 steps) | High | 3d |
| Export: PNG, PDF | Medium | 2d |
| Keyboard shortcuts | Medium | 1d |
| Apple Pencil double-tap | Low | 1d |

---

### V3.0 — 6 weeks

**Goal:** Power user features + platform expansion.

| Feature | Description |
|---------|-------------|
| **Snap to grid** | Optional grid overlay, objects snap to grid |
| **Object grouping** | Group multiple objects, edit as one |
| **Layers panel** | Show/hide layers, reorder |
| **Templates** | Pre-made board templates |
| **iCloud sync** | Sync boards across devices |
| **macOS app** | Catalyst or native AppKit |
| **iPadOS optimization** | Split view, Stage Manager |

---

### V4.0+ (Future)

| Feature | Type |
|---------|------|
| **Real-time collaboration** | WebSocket + CRDT |
| **AI features** | Handwriting-to-text, auto-layout, image-to-sticky |
| **Vision Pro** | 3D infinite canvas in spatial computing |
| **Web viewer** | Share boards as web links |

---

## ⚡ Performance Bottlenecks & Solutions

### 1. Too Many Objects (>10,000)

**Problem:** Iterating all objects for rendering/hit-testing is O(n).

**Solution:**
- R-Tree spatial index for O(log n) queries
- LOD system to simplify distant objects
- Object pooling for frequently created/destroyed objects

### 2. Large Images

**Problem:** High-res images consume memory.

**Solution:**
- Progressive loading (thumbnail → full)
- Memory-mapped files for large images
- Automatic downsampling at zoom < 25%

### 3. Complex Drawings

**Problem:** PencilKit strokes with thousands of points.

**Solution:**
- Rasterize strokes to texture when not editing
- Stroke simplification (Douglas-Peucker algorithm)
- Lazy loading of drawing data

### 4. Smooth Zooming

**Problem:** Jittery zoom, especially on older devices.

**Solution:**
- Predictive tile loading (pre-render adjacent tiles)
- Scale texture first, then re-render at new resolution
- Target 120 FPS on ProMotion, 60 FPS minimum

---

## 💡 Differentiation Ideas

### What Makes This App Special?

1. **Instant Load** — Board opens in < 500ms, always
2. **Butter Smooth** — 120 FPS pan/zoom, zero dropped frames
3. **Focus Mode** — Hide UI, just canvas (like Zen Mode in VSCode)
4. **Quick Capture** — Widget to create new board instantly
5. **Handwriting Recognition** — Convert handwriting to text blocks (Vision API)
6. **Smart Shapes** — Draw rough shape, auto-perfect (rectangle → perfect rectangle)
7. **Infinite Branches** — Link boards together, create mindmap-like structures
8. **Daily Canvas** — Automatically create dated boards for journaling

---

## 💰 Monetization Strategy

### Freemium Model

**Free Tier:**
- 3 boards maximum
- Basic brushes (pen, marker, eraser)
- Basic shapes (rectangle, circle)
- Local storage only

**Pro ($4.99/month or $39.99/year):**
- Unlimited boards
- All brushes + custom brushes
- All shapes + arrows + sticky notes
- Image import
- iCloud sync
- Export to PDF/PNG
- Priority support

**Pro+ ($9.99/month) — Future:**
- Real-time collaboration
- AI features (handwriting-to-text, smart shapes)
- Templates marketplace
- 1TB cloud storage

### Pricing Rationale

- GoodNotes: $9.99 one-time
- Freeform: Free (bundled)
- Concepts: $9.99/month
- Miro: $8/month

**Our positioning:** Cheaper than Concepts, more features than Freeform.

---

## 🛠️ Tech Stack Summary

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **UI Framework** | SwiftUI + UIKit | Best of both: SwiftUI for declarative, UIKit for performance |
| **Rendering** | Metal | 120 FPS requirement, custom tile renderer |
| **Drawing** | PencilKit | Apple's optimized drawing framework |
| **Storage** | SwiftData | Modern, Swift-native persistence |
| **File Format** | Custom binary + JSON | Fast serialization, human-readable metadata |
| **Spatial Index** | R-Tree (custom) | O(log n) spatial queries |
| **Architecture** | MVVM + Coordinator | Separation of concerns, testability |

---

## 📁 Project Structure

```
InfiniteCanvas/
├── App/
│   ├── InfiniteCanvasApp.swift
│   ├── AppDelegate.swift
│   └── SceneDelegate.swift
├── Features/
│   ├── Home/
│   │   ├── HomeView.swift
│   │   ├── HomeViewModel.swift
│   │   └── BoardCardView.swift
│   ├── Canvas/
│   │   ├── CanvasView.swift (UIViewRepresentable)
│   │   ├── CanvasViewController.swift
│   │   ├── CanvasViewModel.swift
│   │   └── Components/
│   │       ├── Toolbar.swift
│   │       ├── Inspector.swift
│   │       └── ColorPicker.swift
│   └── Settings/
│       └── SettingsView.swift
├── Canvas/
│   ├── Engine/
│   │   ├── CanvasEngine.swift
│   │   ├── RenderPipeline.swift
│   │   ├── TileRenderer.swift
│   │   └── SpatialIndex.swift
│   ├── Objects/
│   │   ├── CanvasObject.swift
│   │   ├── ShapeObject.swift
│   │   ├── DrawingObject.swift
│   │   ├── TextObject.swift
│   │   └── ImageObject.swift
│   ├── Tools/
│   │   ├── Tool.swift
│   │   ├── SelectTool.swift
│   │   ├── DrawTool.swift
│   │   ├── ShapeTool.swift
│   │   └── TextTool.swift
│   └── Gestures/
│       ├── GestureHandler.swift
│       ├── PanGesture.swift
│       ├── PinchGesture.swift
│       └── PencilGesture.swift
├── Data/
│   ├── Models/
│   │   ├── Board.swift
│   │   └── CanvasObjectModel.swift
│   ├── Storage/
│   │   ├── BoardStorage.swift
│   │   └── FileManager+Extensions.swift
│   └── Serialization/
│       ├── BoardSerializer.swift
│       └── ObjectSerializer.swift
├── Design/
│   ├── Colors.swift
│   ├── Typography.swift
│   └── Theme.swift
├── Resources/
│   ├── Assets.xcassets
│   ├── Shaders/
│   │   └── TileRenderer.metal
│   └── Localizable.strings
└── Tests/
    ├── CanvasEngineTests.swift
    ├── SpatialIndexTests.swift
    └── SerializationTests.swift
```

---

## 🎬 Next Steps

### Immediate (This Week)

1. **Create Xcode project** with SwiftUI lifecycle
2. **Implement basic canvas view** with pan/zoom gestures
3. **Add Metal tile renderer** (basic version)
4. **Integrate PencilKit** for drawing

### Week 2

5. **Implement spatial index** (R-Tree)
6. **Add shape tools** (rectangle, circle)
7. **Selection and transform**

### Week 3

8. **SwiftData models** for persistence
9. **Board list screen**
10. **Autosave logic**

---

## 📞 Questions to Resolve

1. **Target iOS version?** iOS 17+ (SwiftData) vs iOS 16+ (Core Data)
2. **Universal app?** iPhone + iPad or iPad-only MVP?
3. **App Store vs TestFlight first?**
4. **Name?** "Infinite Canvas", "Freeflow", "Thoughtspace"?

---

**Document prepared by:** CTO/Senior iOS Architect  
**Status:** Ready for implementation  
**Next review:** After MVP completion
