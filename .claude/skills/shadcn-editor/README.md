# Shadcn Editor Skill

Skill này cung cấp hướng dẫn toàn diện để xây dựng rich text editors sử dụng **shadcn-editor**, một thư viện component dựa trên Meta's Lexical framework, được thiết kế cho các ứng dụng Next.js 15+ với React 19 và TypeScript.

## 📁 Cấu trúc Skill

```
shadcn-editor/
├── SKILL.md           # Quick start & cơ bản
├── reference.md       # API reference & advanced topics
├── examples.md        # Real-world examples (5+ use cases)
└── README.md          # File này
```

## 🎯 Khi nào sử dụng Skill này

Sử dụng skill này khi bạn:
- Xây dựng rich text editor trong Next.js
- Cần tùy chỉnh Lexical editor với shadcn/ui
- Muốn implement markdown support
- Cần state management cho editor
- Tạo plugins hoặc custom node types
- Cần integration với forms (react-hook-form, Zod)
- Muốn export/import content (JSON, Markdown, HTML)

## 🚀 Quick Reference

### Installation
```bash
npx shadcn@latest add @shadcn-editor/editor-x
```

### Basic Usage
```tsx
import { Editor } from '@/registry/default/block/editor-x';

export function MyEditor() {
  return <Editor />;
}
```

### With State Management
```tsx
const [content, setContent] = useState(null);
<Editor onChange={setContent} />
```

## 📚 File Guide

### SKILL.md
- **Best for**: Quick start, setup, plugins overview, styling
- **Contains**:
  - Installation steps
  - Basic usage patterns
  - All major plugins (Toolbar, Image, Color, Markdown, etc.)
  - State management examples
  - Theme configuration
  - Best practices & limitations

**Use when**: You need a quick answer or basic guidance

### reference.md
- **Best for**: Advanced topics, deep-dive, TypeScript types, troubleshooting
- **Contains**:
  - Custom node types creation
  - Plugin lifecycle & architecture
  - Real-time collaboration setup
  - Performance optimization
  - TypeScript interfaces
  - Form integration patterns
  - Error handling
  - Testing setup
  - Debugging tips

**Use when**: You need to understand internals or solve complex problems

### examples.md
- **Best for**: Copy-paste solutions, implementation patterns
- **Contains**:
  1. Blog Post Editor (title + excerpt + content)
  2. Document Management System (auto-save, versioning)
  3. Comment/Note System (lightweight editor)
  4. Email Template Builder (variables, preview)
  5. Markdown + Visual Editor Tabs (format conversion)

**Use when**: You need a working example to adapt

## 🔧 Common Tasks

### "I want to build a simple editor"
→ Read SKILL.md → Quick Start section → use editor-00 for minimal setup

### "I need markdown support"
→ Read SKILL.md → Markdown Support section
→ Check examples.md → Example 5

### "How do I save editor content?"
→ Read SKILL.md → State Management section
→ See examples.md for auto-save, form integration

### "I need to add custom features"
→ Read reference.md → Plugin Architecture
→ Review examples for integration patterns

### "How do I optimize performance?"
→ Read reference.md → Performance Optimization
→ Use memoization, debouncing, lazy-loading

### "I'm getting errors"
→ Read reference.md → Error Handling & Troubleshooting
→ Check browser console, validate node types

## 📖 Reading Path by Goal

### Goal: Build a simple editor
1. SKILL.md: Quick Start
2. SKILL.md: Basic Usage
3. SKILL.md: Styling & Customization

### Goal: Add to existing form
1. SKILL.md: State Management
2. reference.md: Form Integration Examples
3. examples.md: Example 1 or Example 5

### Goal: Build content management system
1. SKILL.md: All sections
2. examples.md: Example 2 (Document Management)
3. reference.md: Performance, Error Handling

### Goal: Advanced customization
1. SKILL.md: Architecture section
2. reference.md: Custom Node Types
3. reference.md: Plugin Architecture
4. examples.md: Integration patterns

## 💡 Key Concepts

### Plugin System
shadcn-editor uses Lexical's plugin architecture. Each feature (toolbar, image, color) is a plugin that can be:
- Enabled/disabled
- Customized
- Created as custom plugin

### Node Types
The editor supports text, media, tables, code, links, lists, and custom nodes. You can create custom node types for domain-specific content.

### State Management
Editor state is a SerializedEditorState (JSON). You can:
- Store in React state
- Persist to database
- Convert to Markdown/HTML
- Validate with Zod

### Integration Pattern
shadcn-editor follows the shadcn philosophy:
- Components are copy-paste, not dependencies
- You own all the code
- Full TypeScript support
- Works with Next.js Server Components

## 🎓 Learning Resources

### Official
- [shadcn-editor GitHub](https://github.com/htmujahid/shadcn-editor)
- [Live Demo](https://shadcn-editor.vercel.app)
- [Lexical Docs](https://lexical.dev)

### In This Skill
- **Beginners**: Start with SKILL.md Quick Start
- **Intermediate**: Explore examples.md real-world patterns
- **Advanced**: Deep-dive into reference.md

## ⚠️ Important Notes

1. **Client-side only**: Always add `'use client'` directive
2. **Bundle size**: Full editor is ~100KB. Use editor-00 for lighter version
3. **Browser support**: Requires modern browser (contentEditable API)
4. **Versions**: Built for Next.js 13+, React 18+, Lexical 0.30+

## 🔍 Troubleshooting

**Editor won't render**
→ Check `'use client'` directive
→ Verify Lexical version compatibility

**Plugin not working**
→ Ensure plugin is registered in nodes array
→ Check browser console for errors

**Performance issues**
→ Implement debouncing for updates
→ Lazy-load plugins
→ Use memoization

**Type errors**
→ Check reference.md TypeScript Types section
→ Verify SerializedEditorState structure

## 🤝 Contributing to This Skill

If you find improvements, missing examples, or errors:
1. Test the code
2. Document your findings
3. Update relevant sections
4. Share with the team

## 📝 Version Info

- **Created**: December 2025
- **For**: shadcn-editor + Next.js 15+
- **Status**: Production-ready
- **Last Updated**: 2025-12-04

---

**Quick Start**: Open SKILL.md for immediate guidance
**Deep Dive**: See reference.md for advanced topics
**See It Work**: Check examples.md for real-world code
