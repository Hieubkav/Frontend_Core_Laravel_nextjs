# Shadcn Editor - Advanced Reference

## Custom Node Types

### Creating Custom Node

```tsx
import { ElementNode, LexicalNode, SerializedElementNode } from 'lexical';

export class CustomBlockNode extends ElementNode {
  static getType(): string {
    return 'custom-block';
  }

  static clone(node: CustomBlockNode): CustomBlockNode {
    return new CustomBlockNode(node.__key);
  }

  static importJSON(serializedNode: SerializedElementNode): CustomBlockNode {
    return new CustomBlockNode();
  }

  exportJSON(): SerializedElementNode {
    return {
      type: 'custom-block',
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'custom-block';
    return el;
  }

  updateDOM(): boolean {
    return false;
  }
}
```

### Registering Custom Node

```tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { CustomBlockNode } from './custom-block-node';

const config = {
  nodes: [
    CustomBlockNode,
    // ... other nodes
  ],
  theme: {},
};

function MyEditor() {
  return (
    <LexicalComposer initialConfig={config}>
      {/* editor */}
    </LexicalComposer>
  );
}
```

## Advanced Plugin Architecture

### Plugin Lifecycle

```tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

function MyAdvancedPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register command handler
    return editor.registerCommand(
      MY_CUSTOM_COMMAND,
      (payload) => {
        console.log('Command received:', payload);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
```

### Command Priority Levels

```tsx
import {
  COMMAND_PRIORITY_CRITICAL,  // 5
  COMMAND_PRIORITY_HIGH,      // 4
  COMMAND_PRIORITY_NORMAL,    // 3
  COMMAND_PRIORITY_LOW,       // 2
  COMMAND_PRIORITY_EDITOR,    // 1
} from 'lexical';
```

## Real-Time Collaboration

### Using Lexical Collaboration

```tsx
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';

function CollaborativeEditor({ roomId, userName, userId }: Props) {
  return (
    <CollaborationPlugin
      id={roomId}
      providerFactory={(key, yjsDocMap) => {
        // WebSocket provider setup
        return new WebsocketProvider(
          'ws://localhost:1234',
          key,
          yjsDocMap.get(key),
          {
            awareness: yjsDocMap.get('awareness'),
            connect: false,
          }
        );
      }}
      shouldBootstrap={true}
      username={userName}
      userId={userId}
    />
  );
}
```

### Awareness (User Cursors)

```tsx
import { useEffect } from 'react';

function AwarenessPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Broadcast cursor position
      awareness.setLocalState({
        user: {
          name: currentUserName,
          color: userColor,
        },
        cursor: {
          line: editorState.getRoot().getChildrenSize(),
        },
      });
    });
  }, [editor]);

  return null;
}
```

## Performance Optimization

### Memoization

```tsx
import { useMemo, useCallback } from 'react';

function OptimizedEditor() {
  const config = useMemo(() => ({
    namespace: 'MyEditor',
    nodes: [/* ... */],
    theme: {},
  }), []);

  const handleEditorChange = useCallback((editorState) => {
    // Handle change
  }, []);

  return <Editor initialConfig={config} onChange={handleEditorChange} />;
}
```

### Lazy Loading Plugins

```tsx
import dynamic from 'next/dynamic';

const ImagePlugin = dynamic(
  () => import('./plugins/image-plugin'),
  { ssr: false }
);

const CodeBlockPlugin = dynamic(
  () => import('./plugins/code-block-plugin'),
  { ssr: false }
);

export function Editor() {
  return (
    <LexicalComposer>
      <ImagePlugin />
      <CodeBlockPlugin />
    </LexicalComposer>
  );
}
```

### Debouncing Updates

```tsx
import { debounce } from 'lodash-es';

function DebouncedAutoSave() {
  const [editor] = useLexicalComposerContext();
  
  const debouncedSave = useMemo(
    () => debounce((editorState) => {
      saveEditorState(editorState);
    }, 2000),
    []
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      debouncedSave(editorState);
    });
  }, [editor, debouncedSave]);

  return null;
}
```

## TypeScript Types

### SerializedEditorState

```tsx
interface SerializedEditorState {
  root: SerializedRootNode;
}

interface SerializedRootNode {
  type: 'root';
  format: string;
  indent: number;
  version: number;
  direction: 'ltr' | 'rtl' | null;
  children: SerializedNode[];
}

interface SerializedNode {
  type: string;
  version: number;
  format?: string;
  indent?: number;
  children?: SerializedNode[];
  text?: string;
}
```

### Editor Instance Methods

```tsx
import { LexicalEditor } from 'lexical';

const editor: LexicalEditor = {
  // State
  getEditorState(): EditorState;
  setEditorState(state: EditorState): void;
  getLastNode(): LexicalNode | null;
  getRootElement(): HTMLElement | null;

  // Updates
  update(fn: () => void): void;
  registerUpdateListener(listener: UpdateListener): () => void;

  // Selection
  getSelection(): BaseSelection | null;
  setSelection(selection: BaseSelection | null): void;

  // Commands
  registerCommand(command: Command, handler: CommandHandler): () => void;
  dispatchCommand(command: Command, payload: unknown): boolean;

  // Key
  registerKeyListener(listener: KeyListener): () => void;

  // Focus
  focus(callbackFn?: () => void): void;
  blur(): void;
  isEditable(): boolean;
  setEditable(editable: boolean): void;
};
```

## Form Integration Examples

### With Zod Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SerializedEditorState } from 'lexical';

const articleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.custom<SerializedEditorState>(
    (val) => val !== null && typeof val === 'object',
    'Valid editor content required'
  ),
  excerpt: z.string().max(500).optional(),
});

type ArticleForm = z.infer<typeof articleSchema>;

export function ArticleEditor() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      content: null,
    },
  });

  const onSubmit = async (data: ArticleForm) => {
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
      <EditorField
        value={watch('content')}
        onChange={(state) => setValue('content', state)}
        error={errors.content?.message}
      />
    </form>
  );
}
```

## Export Formats

### Export to HTML

```tsx
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot } from 'lexical';

function exportToHtml(editor: LexicalEditor): string {
  let html = '';
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  return html;
}
```

### Export to Plain Text

```tsx
function exportToPlainText(editorState: SerializedEditorState): string {
  let text = '';

  function traverse(node: any) {
    if (node.text) {
      text += node.text;
    }
    if (node.type === 'linebreak') {
      text += '\n';
    }
    if (node.children) {
      node.children.forEach(traverse);
      if (node.type === 'paragraph' || node.type === 'heading') {
        text += '\n';
      }
    }
  }

  traverse(editorState.root);
  return text.trim();
}
```

## Error Handling

### Try-Catch Pattern

```tsx
async function saveWithErrorHandling(
  editorState: SerializedEditorState,
  docId: string
) {
  try {
    const response = await fetch(`/api/docs/${docId}`, {
      method: 'PUT',
      body: JSON.stringify(editorState),
    });

    if (!response.ok) {
      throw new Error(`Save failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Save error:', error);
    toast.error('Failed to save document');
    throw error;
  }
}
```

### Editor Error Boundaries

```tsx
export class EditorErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Editor error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Editor encountered an error. Please refresh.</div>;
    }

    return this.props.children;
  }
}
```

## Browser DevTools Integration

### Debug Editor State

```tsx
// In browser console
window.__LEXICAL_DEBUG_EDITOR_STATE__ = (editorState) => {
  console.log(JSON.stringify(editorState, null, 2));
};

// Then in your editor update listener:
editor.registerUpdateListener(({ editorState }) => {
  if (window.__LEXICAL_DEBUG_EDITOR_STATE__) {
    window.__LEXICAL_DEBUG_EDITOR_STATE__(editorState.toJSON());
  }
});
```

## Testing

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Editor } from './editor';

describe('Editor Component', () => {
  it('should render editor', () => {
    render(<Editor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should update content', async () => {
    const onChangeMock = jest.fn();
    const { container } = render(<Editor onChange={onChangeMock} />);
    
    const editor = container.querySelector('[role="textbox"]');
    await userEvent.type(editor, 'Hello world');
    
    expect(onChangeMock).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Common Issues

**Issue**: Editor not accepting input
- Solution: Check `isEditable()` state, ensure `'use client'` directive

**Issue**: Plugins not loading
- Solution: Verify plugin registration in nodes array, check console errors

**Issue**: Performance degradation
- Solution: Implement debouncing for updates, lazy-load plugins, use memoization

**Issue**: Markdown conversion issues
- Solution: Verify node types compatibility, check transformer configuration

## Version Support

- **Next.js**: 13.0+
- **React**: 18.0+
- **Lexical**: 0.30+
- **Node.js**: 16.0+
