---
name: shadcn-editor
description: Build rich text editors with shadcn-editor, a production-ready Lexical-based component library. Use when creating editor components, customizing toolbars, implementing markdown support, adding plugins, managing editor state, or styling text editors in Next.js applications with React 19 and shadcn/ui.
---

# Shadcn Editor Skill

Hướng dẫn toàn diện để xây dựng và tùy chỉnh rich text editors sử dụng shadcn-editor - một thư viện component dựa trên Lexical của Meta, tích hợp hoàn hảo với shadcn/ui và Next.js.

## Quick Start

### 1. Cài đặt Editor Component

```bash
npx shadcn@latest add @shadcn-editor/editor-x
```

### 2. Sử dụng trong Component

```tsx
'use client';

import { Editor } from '@/registry/default/block/editor-x';

export function MyEditor() {
  return <Editor />;
}
```

### 3. Đặt Initial Content

```tsx
import { Editor } from '@/registry/default/block/editor-x';

const initialState = {
  root: {
    children: [
      {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

export function MyEditor() {
  return <Editor initialState={JSON.stringify(initialState)} />;
}
```

## Architecture

### Component Structure

shadcn-editor bao gồm 3 phiên bản chính:
- **editor-x**: Full-featured editor với tất cả plugins
- **editor-md**: Markdown-focused editor  
- **editor-00**: Minimal editor setup

### Plugin System

Editor được xây dựng trên plugin architecture của Lexical:

```tsx
// Custom plugin
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function MyPlugin() {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    // Thêm plugin logic
  }, [editor]);
  
  return null;
}
```

### Node Types

shadcn-editor hỗ trợ 20+ node types:
- **Text**: Heading, Paragraph, Quote
- **Media**: Image, Video, Audio
- **Table**: Table, TableRow, TableCell
- **Code**: Code, CodeBlock
- **Custom**: Link, List, ListItem
- **Format**: Bold, Italic, Strikethrough, Code, Subscript, Superscript

## Plugins & Features

### 1. Toolbar Plugin

Tạo toolbar với formatting controls:

```tsx
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar-plugin';

function MyEditor() {
  return (
    <div>
      <ToolbarPlugin />
      <LexicalComposer initialConfig={config}>
        {/* editor content */}
      </LexicalComposer>
    </div>
  );
}
```

**Formatting Options**:
- Text formatting: Bold, Italic, Underline, Strikethrough
- List: Bullet List, Numbered List
- Alignment: Left, Center, Right, Justify
- Headings: H1-H6
- Block types: Quote, Code Block

### 2. Image Plugin

```tsx
import { useImageUpload } from '@/hooks/use-image-upload';

function ImagePlugin() {
  const { uploadImage } = useImageUpload();
  
  const insertImage = async (file: File) => {
    const url = await uploadImage(file);
    // Insert image node into editor
  };
  
  return (
    <button onClick={() => inputRef.current?.click()}>
      Insert Image
    </button>
  );
}
```

### 3. Font Color Plugin

```tsx
import { ColorPickerPlugin } from '@/components/editor/plugins/color-picker';

// Thêm vào editor config
const config = {
  // ... other config
  plugins: [
    // ...
    <ColorPickerPlugin key="color-picker" />,
  ],
};
```

### 4. Markdown Support

```tsx
// Convert Lexical JSON to Markdown
import { lexicalToMarkdown } from '@/lib/markdown';

function exportMarkdown(editorState: SerializedEditorState) {
  const markdown = lexicalToMarkdown(editorState);
  downloadFile(markdown, 'document.md');
}

// Convert Markdown to Lexical JSON
import { markdownToLexical } from '@/lib/markdown';

function importMarkdown(markdownContent: string) {
  const editorState = markdownToLexical(markdownContent);
  editor.setEditorState(editor.parseEditorState(editorState));
}
```

### 5. Component Picker Menu (Slash Commands)

```tsx
import { ComponentPickerPlugin } from '@/components/editor/plugins/component-picker';

const components = [
  {
    icon: '💬',
    label: 'Quote',
    command: '/quote',
    handler: insertQuoteBlock,
  },
  {
    icon: '📸',
    label: 'Image',
    command: '/image',
    handler: insertImageBlock,
  },
  {
    icon: '📹',
    label: 'Video',
    command: '/video',
    handler: insertVideoBlock,
  },
];
```

### 6. Import/Export Plugin

```tsx
// Export editor state as JSON
function exportJSON(editorState: SerializedEditorState) {
  const json = JSON.stringify(editorState);
  downloadFile(json, 'document.json');
}

// Import from JSON
function importJSON(jsonString: string) {
  const editorState = JSON.parse(jsonString);
  editor.setEditorState(editor.parseEditorState(editorState));
}
```

### 7. Action Plugins

Thêm actions vào editor footer:

```tsx
import { ActionPlugin } from '@/components/editor/plugins/action-plugin';

function MyActionPlugin() {
  return (
    <ActionPlugin>
      <button onClick={handleSave}>Save</button>
      <button onClick={handlePublish}>Publish</button>
      <button onClick={handlePreview}>Preview</button>
    </ActionPlugin>
  );
}
```

## State Management

### Controlled Component

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@/registry/default/block/editor-x';
import { SerializedEditorState } from 'lexical';

export function MyEditor() {
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(null);
  
  const handleEditorChange = (state: SerializedEditorState) => {
    setEditorState(state);
    // Có thể lưu vào database
    saveEditorState(state);
  };
  
  return (
    <Editor 
      initialState={editorState ? JSON.stringify(editorState) : undefined}
      onChange={handleEditorChange}
    />
  );
}
```

### Integration with react-hook-form

```tsx
import { useForm } from 'react-hook-form';
import { Editor } from '@/registry/default/block/editor-x';

export function ArticleForm() {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      content: null,
    },
  });
  
  const content = watch('content');
  
  return (
    <form>
      <Editor
        initialState={content ? JSON.stringify(content) : undefined}
        onChange={(state) => setValue('content', state)}
      />
    </form>
  );
}
```

## Styling & Customization

### Theme Configuration

```tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';

const theme = {
  root: 'editor-root',
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-ol',
    ul: 'editor-ul',
    listitem: 'editor-listitem',
  },
  quote: 'editor-quote',
  code: 'editor-code',
  codeHighlight: {
    aml: 'editor-code-aml',
    bash: 'editor-code-bash',
    html: 'editor-code-html',
    json: 'editor-code-json',
    tsx: 'editor-code-tsx',
  },
};

const config = {
  theme,
  nodes: [/* ... */],
};
```

### Tailwind CSS Styling

```css
/* styles/editor.css */
.editor-root {
  @apply border border-gray-300 rounded-lg p-4 min-h-64 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.editor-paragraph {
  @apply text-base leading-relaxed m-0;
}

.editor-h1 {
  @apply text-3xl font-bold my-4;
}

.editor-h2 {
  @apply text-2xl font-bold my-3;
}

.editor-quote {
  @apply border-l-4 border-gray-300 bg-gray-50 p-4 my-4;
}

.editor-code {
  @apply bg-gray-100 rounded px-1.5 py-0.5 font-mono text-sm;
}
```

## Read-Only Mode

```tsx
function ReadOnlyEditor({ content }: { content: string }) {
  return (
    <div className="editor-readonly">
      <Editor 
        initialState={content}
        readOnly={true}
        hideToolbar={true}
      />
    </div>
  );
}
```

## Data Persistence

### Save to Database

```tsx
import { useCallback } from 'react';
import { SerializedEditorState } from 'lexical';

export function useSaveEditor() {
  const saveEditorState = useCallback(async (
    state: SerializedEditorState,
    documentId: string
  ) => {
    const response = await fetch('/api/documents/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: documentId,
        content: state,
        updatedAt: new Date(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save document');
    }
    
    return response.json();
  }, []);
  
  return { saveEditorState };
}
```

### Load from Database

```tsx
export function useLoadEditor() {
  const loadEditorState = useCallback(async (documentId: string) => {
    const response = await fetch(`/api/documents/${documentId}`);
    const { content } = await response.json();
    return content as SerializedEditorState;
  }, []);
  
  return { loadEditorState };
}
```

## Common Patterns

### Auto-Save

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    if (editorState) {
      saveEditorState(editorState, documentId);
    }
  }, 3000); // Auto-save sau 3 giây
  
  return () => clearTimeout(timer);
}, [editorState]);
```

### Character Count

```tsx
function getCharacterCount(editorState: SerializedEditorState): number {
  let count = 0;
  
  function traverse(node: any) {
    if (node.type === 'text') {
      count += node.text.length;
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(editorState.root);
  return count;
}
```

### Content Validation

```tsx
function validateEditorContent(editorState: SerializedEditorState): boolean {
  const text = extractText(editorState);
  return text.trim().length > 0;
}

function extractText(editorState: SerializedEditorState): string {
  let text = '';
  
  function traverse(node: any) {
    if (node.type === 'text') {
      text += node.text;
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(editorState.root);
  return text;
}
```

## Best Practices

1. **State Management**:
   - Sử dụng `useState` cho simple cases
   - Dùng react-hook-form khi cần validation
   - Implement auto-save để tránh mất dữ liệu

2. **Performance**:
   - Memoize editor callbacks để tránh re-render
   - Lazy-load plugins khi cần
   - Debounce auto-save operations

3. **Accessibility**:
   - Cung cấp keyboard shortcuts
   - Ensure screen reader support
   - Test với accessibility tools

4. **Plugin Development**:
   - Keep plugins focused on single responsibility
   - Use Lexical's context API properly
   - Handle errors gracefully

5. **Styling**:
   - Sử dụng Tailwind CSS themes
   - Support dark mode
   - Maintain consistent spacing và typography

## Limitations & Caveats

- **SSR Rendering**: Editor component phải là `'use client'`
- **Bundle Size**: Full editor-x khá nặng, dùng editor-00 nếu chỉ cần tính năng cơ bản
- **Browser Support**: Cần modern browser hỗ trợ contentEditable API
- **Collaboration**: Yêu cầu setup backend nếu dùng real-time features

## Advanced Usage

Xem [reference.md](./reference.md) để tìm hiểu:
- Custom node types
- Advanced plugin architecture
- Real-time collaboration setup
- Performance optimization
- TypeScript types reference

## Resources

- [shadcn-editor GitHub](https://github.com/htmujahid/shadcn-editor)
- [Live Demo](https://shadcn-editor.vercel.app)
- [Lexical Documentation](https://lexical.dev)
- [shadcn/ui](https://ui.shadcn.com)

## Support

Khi gặp vấn đề:
1. Kiểm tra [GitHub Issues](https://github.com/htmujahid/shadcn-editor/issues)
2. Xem advanced guide tại [reference.md](./reference.md)
3. Inspect console errors để debug
4. Kiểm tra Lexical version compatibility
