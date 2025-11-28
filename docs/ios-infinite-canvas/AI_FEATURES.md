# 🤖 AI Features & Future Enhancements

> Vision for AI-powered capabilities and platform expansion

## AI Feature Strategy

### Philosophy

Our AI features should be:

1. **Invisible** — Enhance workflow without requiring learning
2. **Optional** — Never forced, always opt-in
3. **Local-first** — On-device when possible (privacy)
4. **Fast** — Sub-second response times
5. **Useful** — Solve real problems, not tech demos

---

## Phase 1: Core AI Features (V4.0)

### 1. Handwriting Recognition

**What:** Convert handwritten text to typed text objects.

**How:**
- Use Apple's Vision framework for on-device recognition
- Fallback to GPT-4 for complex/cursive handwriting

**Implementation:**

```swift
// HandwritingRecognizer.swift
import Vision
import PencilKit

class HandwritingRecognizer {
    func recognize(drawing: PKDrawing) async throws -> String {
        let image = drawing.image(from: drawing.bounds, scale: 2.0)
        
        // Vision framework recognition
        let request = VNRecognizeTextRequest { request, error in
            // Handle results
        }
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        
        let handler = VNImageRequestHandler(cgImage: image.cgImage!)
        try handler.perform([request])
        
        // Extract text from observations
        guard let observations = request.results else { return "" }
        return observations.compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
    }
    
    // Fallback to GPT-4 for difficult handwriting
    func recognizeWithAI(image: UIImage) async throws -> String {
        let base64 = image.jpegData(compressionQuality: 0.8)?.base64EncodedString() ?? ""
        
        let response = try await openAI.createChatCompletion(
            model: "gpt-4-vision-preview",
            messages: [
                .system("You are a handwriting recognition expert. Transcribe the handwritten text in the image accurately."),
                .user([
                    .text("Transcribe this handwriting:"),
                    .imageURL(url: "data:image/jpeg;base64,\(base64)")
                ])
            ]
        )
        
        return response.choices.first?.message.content ?? ""
    }
}
```

**UX Flow:**

1. User selects handwritten strokes
2. Context menu shows "Convert to Text"
3. Loading indicator (< 1 second)
4. Text object replaces strokes
5. Original strokes saved in undo stack

---

### 2. Smart Shapes

**What:** Draw rough shapes, auto-perfect them.

**How:**
- Core ML model for shape classification
- On-device, instant recognition

**Supported Shapes:**
- Rectangle, Square
- Circle, Ellipse
- Triangle
- Arrow
- Line (straight)
- Star

**Implementation:**

```swift
// SmartShapeRecognizer.swift
import CoreML
import PencilKit

class SmartShapeRecognizer {
    private let model: ShapeClassifier // Core ML model
    
    func recognize(stroke: PKStroke) -> RecognizedShape? {
        // Extract features from stroke
        let features = extractFeatures(stroke)
        
        // Classify shape
        guard let prediction = try? model.prediction(features: features) else {
            return nil
        }
        
        // Only accept high-confidence predictions
        guard prediction.confidence > 0.85 else { return nil }
        
        return RecognizedShape(
            type: prediction.shapeType,
            bounds: stroke.renderBounds,
            confidence: prediction.confidence
        )
    }
    
    private func extractFeatures(_ stroke: PKStroke) -> MLMultiArray {
        // Convert stroke points to feature vector
        let points = stroke.path.map { $0.location }
        
        // Features: normalized point sequence, aspect ratio, closure, etc.
        // ...
    }
    
    func perfectShape(_ shape: RecognizedShape) -> ShapeObject {
        switch shape.type {
        case .rectangle:
            return ShapeObject(type: .rectangle, at: shape.bounds.origin, size: shape.bounds.size)
        case .circle:
            let size = max(shape.bounds.width, shape.bounds.height)
            return ShapeObject(type: .circle, at: shape.bounds.origin, size: CGSize(width: size, height: size))
        case .arrow:
            // Calculate start/end points from bounds
            return ShapeObject(type: .arrow, at: shape.bounds.origin, size: shape.bounds.size)
        // ...
        }
    }
}
```

**UX Flow:**

1. User draws rough shape quickly
2. Small "magic wand" hint appears
3. Tap to accept perfect shape (or ignore)
4. Or: automatic after brief pause

**Settings:**
- Enable/disable smart shapes
- Auto-correct vs. tap-to-confirm
- Sensitivity slider

---

### 3. Auto-Layout

**What:** Automatically arrange scattered objects aesthetically.

**How:**
- Force-directed graph algorithm for spacing
- Alignment detection and snapping
- Optional AI suggestions for grouping

**Layout Algorithms:**

```swift
// AutoLayout.swift
class AutoLayoutEngine {
    
    // Distribute objects evenly
    func distributeHorizontally(_ objects: [any CanvasObject]) -> [CGPoint] {
        guard objects.count > 1 else { return objects.map { $0.position } }
        
        let sorted = objects.sorted { $0.position.x < $1.position.x }
        let totalWidth = sorted.last!.bounds.maxX - sorted.first!.position.x
        let spacing = totalWidth / CGFloat(objects.count - 1)
        
        return sorted.enumerated().map { index, obj in
            CGPoint(x: sorted.first!.position.x + CGFloat(index) * spacing, y: obj.position.y)
        }
    }
    
    // Align objects to common edge
    func alignLeft(_ objects: [any CanvasObject]) -> [CGPoint] {
        let minX = objects.map { $0.position.x }.min() ?? 0
        return objects.map { CGPoint(x: minX, y: $0.position.y) }
    }
    
    // Smart arrange using force-directed algorithm
    func smartArrange(_ objects: [any CanvasObject]) -> [CGPoint] {
        var positions = objects.map { $0.center }
        let idealSpacing: CGFloat = 50
        
        // Iterate to find equilibrium
        for _ in 0..<100 {
            var forces = [CGVector](repeating: .zero, count: objects.count)
            
            for i in 0..<objects.count {
                for j in (i+1)..<objects.count {
                    let delta = CGVector(
                        dx: positions[j].x - positions[i].x,
                        dy: positions[j].y - positions[i].y
                    )
                    let distance = sqrt(delta.dx * delta.dx + delta.dy * delta.dy)
                    
                    if distance < idealSpacing {
                        // Repulsion force
                        let force = (idealSpacing - distance) / idealSpacing
                        forces[i].dx -= delta.dx * force * 0.1
                        forces[i].dy -= delta.dy * force * 0.1
                        forces[j].dx += delta.dx * force * 0.1
                        forces[j].dy += delta.dy * force * 0.1
                    }
                }
            }
            
            // Apply forces
            for i in 0..<objects.count {
                positions[i].x += forces[i].dx
                positions[i].y += forces[i].dy
            }
        }
        
        return positions
    }
    
    // AI-powered grouping suggestions
    func suggestGroups(_ objects: [any CanvasObject]) async -> [[ObjectID]] {
        // Cluster objects by proximity
        // Optionally use GPT-4 to understand semantic grouping
        // ...
    }
}
```

**UX:**

- Select objects → "Auto Arrange" button
- Or: "Tidy Up" suggestion appears when objects overlap
- Animated transition to new positions

---

### 4. Image to Sticky Notes

**What:** Extract text from images and create sticky notes.

**How:**
- OCR for text extraction (Vision framework)
- GPT-4 Vision for understanding context

**Implementation:**

```swift
// ImageToStickies.swift
class ImageToStickies {
    
    func extractStickyNotes(from image: UIImage) async throws -> [StickyNoteData] {
        // First, try Vision OCR for simple text
        let visionText = try await recognizeText(in: image)
        
        // Use GPT-4 Vision for semantic understanding
        let analysis = try await analyzeWithGPT4(image: image, ocrText: visionText)
        
        return analysis.stickyNotes
    }
    
    private func analyzeWithGPT4(image: UIImage, ocrText: String) async throws -> ImageAnalysis {
        let base64 = image.jpegData(compressionQuality: 0.8)?.base64EncodedString() ?? ""
        
        let prompt = """
        Analyze this image and extract key points as sticky notes.
        OCR text found: \(ocrText)
        
        For each sticky note, provide:
        1. Title (short)
        2. Content (brief description)
        3. Suggested color (yellow, pink, blue, green, orange)
        4. Approximate position (top-left, top-right, center, etc.)
        
        Return as JSON array.
        """
        
        let response = try await openAI.createChatCompletion(
            model: "gpt-4-vision-preview",
            messages: [
                .user([
                    .text(prompt),
                    .imageURL(url: "data:image/jpeg;base64,\(base64)")
                ])
            ]
        )
        
        // Parse JSON response
        return try JSONDecoder().decode(ImageAnalysis.self, from: response.content.data(using: .utf8)!)
    }
}

struct StickyNoteData {
    let title: String
    let content: String
    let color: UIColor
    let position: CGPoint
}
```

**UX Flow:**

1. User imports image
2. "Extract Notes" button appears
3. AI analyzes image (2-3 seconds)
4. Sticky notes appear arranged around image
5. User can edit/delete/rearrange

---

### 5. Board Summarization

**What:** Generate a text summary of board contents.

**How:**
- Extract all text from board (OCR + text objects)
- Send to GPT-4 for summarization

```swift
// BoardSummarizer.swift
class BoardSummarizer {
    
    func summarize(board: Board) async throws -> String {
        // Collect all text content
        var texts: [String] = []
        
        for object in board.objects {
            if let textObj = object as? TextObject {
                texts.append(textObj.text)
            } else if let sticky = object as? ShapeObject, sticky.shapeType == .stickyNote {
                texts.append(sticky.text)
            } else if let drawing = object as? DrawingObject {
                // OCR drawings
                let recognized = try await handwritingRecognizer.recognize(drawing: drawing.drawing)
                texts.append(recognized)
            }
        }
        
        let allText = texts.joined(separator: "\n\n")
        
        // Summarize with GPT-4
        let response = try await openAI.createChatCompletion(
            model: "gpt-4",
            messages: [
                .system("Summarize the following content from a visual board. Be concise but comprehensive."),
                .user(allText)
            ]
        )
        
        return response.choices.first?.message.content ?? ""
    }
}
```

**Use Cases:**

- Share board summary via text/email
- Create meeting notes from whiteboard
- Export as executive summary

---

### 6. Idea Generation

**What:** AI suggests related ideas based on board content.

```swift
// IdeaGenerator.swift
class IdeaGenerator {
    
    func generateIdeas(for board: Board) async throws -> [Idea] {
        let content = try await extractBoardContent(board)
        
        let response = try await openAI.createChatCompletion(
            model: "gpt-4",
            messages: [
                .system("""
                You are a creative brainstorming partner. Given the content of a visual board, 
                suggest 5 related ideas that could expand or complement the existing content.
                
                For each idea:
                1. Title (short, catchy)
                2. Description (1-2 sentences)
                3. Suggested sticky note color
                """),
                .user(content)
            ]
        )
        
        return parseIdeas(response)
    }
}
```

**UX:**

- "Brainstorm" button in toolbar
- Ideas appear as semi-transparent sticky notes
- User drags to accept, or dismisses

---

## Phase 2: Advanced AI (V5.0+)

### Voice-to-Canvas

**What:** Speak ideas, AI creates visual representation.

**Example:**

> "Create a flowchart with three boxes: Input, Process, Output, connected with arrows"

**Result:** Three labeled rectangles with connecting arrows.

### Diagram Generation

**What:** Generate diagrams from natural language.

**Types:**
- Flowcharts
- Mind maps
- Org charts
- Timelines
- Kanban boards

### Style Transfer

**What:** Apply visual styles to entire board.

**Styles:**
- Minimalist (thin lines, monochrome)
- Colorful (rainbow palette, thick strokes)
- Corporate (clean, professional colors)
- Playful (hand-drawn, emoji)
- Dark mode (inverted colors)

### Content Search

**What:** Search across all boards using natural language.

**Example:**

> "Find boards about product launch"

**Implementation:**

- Index all board content (embeddings)
- Semantic search with vector database
- Results ranked by relevance

---

## Platform Expansion

### Vision Pro (visionOS)

**Unique Capabilities:**

| Feature | Description |
|---------|-------------|
| **3D Canvas** | Objects exist in 3D space |
| **Hand Tracking** | Pinch to select, drag to move |
| **Eye Tracking** | Look at object to highlight |
| **Spatial Audio** | Sound attached to objects |
| **Passthrough** | Draw on real-world surfaces |
| **Mac Virtual Display** | Use alongside Mac apps |

**Implementation Approach:**

1. Start with 2D board floating in space
2. Add Z-axis for layering
3. Gesture recognition for manipulation
4. Gradual 3D feature additions

**SwiftUI for visionOS:**

```swift
// VisionCanvasView.swift
import SwiftUI

struct VisionCanvasView: View {
    @State private var objects: [CanvasObject] = []
    
    var body: some View {
        RealityView { content in
            // Add 3D anchor for canvas
            let anchor = AnchorEntity(.plane(.horizontal, classification: .table, minimumBounds: [0.5, 0.5]))
            content.add(anchor)
            
            // Add canvas plane
            let canvas = ModelEntity(mesh: .generatePlane(width: 2, depth: 1.5))
            canvas.components.set(CollisionComponent(shapes: [.generateBox(width: 2, height: 0.01, depth: 1.5)]))
            anchor.addChild(canvas)
        }
        .gesture(
            SpatialTapGesture()
                .targetedToAnyEntity()
                .onEnded { value in
                    // Handle spatial tap
                }
        )
    }
}
```

### macOS App

**Approach: Mac Catalyst First**

**Catalyst Adaptations:**

| iOS Feature | macOS Adaptation |
|-------------|------------------|
| Touch gestures | Trackpad/mouse |
| Apple Pencil | Mouse drawing (optional tablet) |
| Toolbar | Menu bar + toolbar |
| Context menu | Right-click menu |
| Keyboard | Full keyboard shortcuts |

**Native Features to Add:**

- Window management
- Menu bar menus
- Touch Bar support (legacy)
- Cursor customization
- File → Open/Save dialogs

**macOS-Only Features:**

```swift
#if targetEnvironment(macCatalyst)
// Mac-specific code
extension CanvasViewController {
    func setupMacToolbar() {
        navigationController?.isToolbarHidden = false
        
        let items = [
            UIBarButtonItem(systemItem: .add),
            UIBarButtonItem.flexibleSpace(),
            // ...
        ]
        
        toolbarItems = items
    }
    
    override func buildMenu(with builder: UIMenuBuilder) {
        super.buildMenu(with: builder)
        
        // Add custom menus
        let canvasMenu = UIMenu(title: "Canvas", children: [
            UIKeyCommand(title: "New Board", action: #selector(newBoard), input: "n", modifierFlags: .command),
            UIKeyCommand(title: "Zoom In", action: #selector(zoomIn), input: "+", modifierFlags: .command),
            UIKeyCommand(title: "Zoom Out", action: #selector(zoomOut), input: "-", modifierFlags: .command),
        ])
        
        builder.insertSibling(canvasMenu, afterMenu: .file)
    }
}
#endif
```

### Web Viewer

**Purpose:** Share boards without requiring app installation.

**Tech Stack:**

- React + TypeScript
- Canvas API / Fabric.js for rendering
- Read-only mode only (no editing)
- Shareable links

**Features:**

- View boards
- Pan and zoom
- Add comments (linked to Supabase)
- Export to PDF/PNG
- Embed in websites

**Architecture:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   iOS App   │────▶│  Supabase   │◀────│  Web Viewer │
│             │     │             │     │   (React)   │
│  (Create)   │     │  (Storage)  │     │   (View)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Real-Time Collaboration

### Architecture

**Sync Protocol:** CRDT (Conflict-free Replicated Data Types)

**Library:** Yjs (JavaScript) / Swift port

**Transport:** WebSocket via Supabase Realtime

**Conflict Resolution:**

| Conflict Type | Resolution |
|---------------|------------|
| Same object moved by 2 users | LWW (Last Write Wins) |
| Object deleted while being edited | Deletion wins |
| Concurrent text edits | Character-level merge (Yjs) |

### Implementation

```swift
// CollaborationManager.swift
import Foundation

class CollaborationManager {
    private var websocket: WebSocketClient?
    private var document: YDocument // Yjs document
    private var awareness: Awareness // User presence
    
    func connect(boardId: String, userId: String) {
        websocket = WebSocketClient(url: "wss://api.example.com/collab/\(boardId)")
        
        websocket?.onMessage = { [weak self] message in
            self?.handleMessage(message)
        }
        
        // Set up awareness (cursor, name, color)
        awareness.setLocalState([
            "user": userId,
            "cursor": ["x": 0, "y": 0],
            "color": randomColor()
        ])
    }
    
    func applyLocalChange(_ change: CanvasChange) {
        // Apply to local Yjs document
        document.transact { txn in
            switch change {
            case .objectAdded(let object):
                let ymap = txn.getMap("objects")
                ymap.set(object.id.uuidString, value: object.toYValue())
            case .objectMoved(let id, let position):
                let ymap = txn.getMap("objects")
                if var obj = ymap.get(id.uuidString) as? [String: Any] {
                    obj["x"] = position.x
                    obj["y"] = position.y
                    ymap.set(id.uuidString, value: obj)
                }
            // ...
            }
        }
        
        // Sync to server
        let update = document.encodeStateAsUpdate()
        websocket?.send(update)
    }
    
    private func handleMessage(_ data: Data) {
        // Apply remote changes
        document.applyUpdate(data)
        
        // Notify UI of changes
        NotificationCenter.default.post(name: .canvasDidChange, object: nil)
    }
    
    func updateCursorPosition(_ position: CGPoint) {
        awareness.setLocalStateField("cursor", value: ["x": position.x, "y": position.y])
    }
}
```

### Presence UI

```swift
// CollaboratorsView.swift
struct CollaboratorsView: View {
    @ObservedObject var collaboration: CollaborationManager
    
    var body: some View {
        ZStack {
            // Remote cursors
            ForEach(collaboration.remoteCursors) { cursor in
                CursorView(
                    position: cursor.position,
                    name: cursor.userName,
                    color: cursor.color
                )
            }
            
            // Avatars in corner
            HStack(spacing: -8) {
                ForEach(collaboration.activeUsers.prefix(4)) { user in
                    AsyncImage(url: user.avatarURL) { image in
                        image.resizable()
                    } placeholder: {
                        Circle().fill(user.color)
                    }
                    .frame(width: 32, height: 32)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(.white, lineWidth: 2))
                }
                
                if collaboration.activeUsers.count > 4 {
                    Text("+\(collaboration.activeUsers.count - 4)")
                        .font(.caption)
                        .padding(6)
                        .background(.ultraThinMaterial)
                        .clipShape(Circle())
                }
            }
        }
    }
}

struct CursorView: View {
    let position: CGPoint
    let name: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Image(systemName: "arrow.up.left")
                .foregroundColor(color)
            Text(name)
                .font(.caption2)
                .padding(.horizontal, 4)
                .padding(.vertical, 2)
                .background(color)
                .foregroundColor(.white)
                .cornerRadius(4)
        }
        .position(position)
    }
}
```

---

## Monetization Strategy

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 boards, basic tools, local only |
| **Pro** | $4.99/mo or $39.99/yr | Unlimited boards, all tools, iCloud sync, export |
| **Pro+** | $9.99/mo or $79.99/yr | + Collaboration, AI features, priority support |
| **Team** | $12/user/mo | + Admin, shared workspace, SSO |
| **Enterprise** | Custom | + On-premise, custom integrations, SLA |

### Conversion Strategy

1. **Generous free tier** → Habit formation
2. **Board limit friction** → Upgrade trigger
3. **AI feature teaser** → Premium appeal
4. **Collaboration need** → Team/Enterprise

### Revenue Projections (Year 1)

| Quarter | MAU | Conversion | MRR |
|---------|-----|------------|-----|
| Q1 | 5,000 | 3% | $750 |
| Q2 | 20,000 | 4% | $4,000 |
| Q3 | 50,000 | 5% | $12,500 |
| Q4 | 100,000 | 6% | $30,000 |

---

## Competitive Differentiation

### What Makes Us Special

| Differentiator | How |
|----------------|-----|
| **Performance** | Metal rendering, 120 FPS always |
| **Simplicity** | 80% of features users actually need |
| **Offline-first** | Works without internet |
| **Apple Pencil** | Best-in-class latency and feel |
| **AI integration** | Smart, invisible, helpful |
| **Fair pricing** | Cheaper than alternatives |

### Positioning Statement

> "The fastest, simplest infinite canvas for visual thinking on iOS. Built for Apple Pencil. Powered by AI when you need it."

---

**Document prepared by:** CTO / Product Strategist  
**Version:** 1.0  
**Last updated:** November 2025
