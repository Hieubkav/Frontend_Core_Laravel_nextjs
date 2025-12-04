# Shadcn Editor - Real-World Examples

## Example 1: Blog Post Editor

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@/registry/default/block/editor-x';
import { SerializedEditorState } from 'lexical';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface BlogPost {
  title: string;
  excerpt: string;
  content: SerializedEditorState;
}

export function BlogPostEditor() {
  const { register, watch, setValue, handleSubmit } = useForm<BlogPost>({
    defaultValues: {
      title: '',
      excerpt: '',
      content: null,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const onSubmit = async (data: BlogPost) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setLastSaved(new Date());
        alert('Post published successfully!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          {...register('title', { required: true })}
          placeholder="Enter post title"
          className="text-2xl font-bold"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Excerpt</label>
        <textarea
          {...register('excerpt')}
          placeholder="Enter post excerpt"
          className="w-full h-20 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <div className="border rounded-lg overflow-hidden">
          <Editor
            onChange={(state) => setValue('content', state)}
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Publishing...' : 'Publish Post'}
        </Button>
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>
    </form>
  );
}
```

## Example 2: Document Management System

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Editor } from '@/registry/default/block/editor-x';
import { SerializedEditorState } from 'lexical';
import { useDebounce } from '@/hooks/use-debounce';

interface Document {
  id: string;
  title: string;
  content: SerializedEditorState;
  updatedAt: Date;
  version: number;
}

export function DocumentEditor({ initialDoc }: { initialDoc: Document }) {
  const [doc, setDoc] = useState<Document>(initialDoc);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedContent = useDebounce(doc.content, 2000);

  // Auto-save
  useEffect(() => {
    if (!debouncedContent) return;

    const saveDocument = async () => {
      setIsSaving(true);
      try {
        await fetch(`/api/documents/${doc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...doc,
            content: debouncedContent,
          }),
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveDocument();
  }, [debouncedContent, doc.id]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
        <p className="text-gray-500">
          {isSaving ? 'Saving...' : 'All changes saved'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Editor
          initialState={doc.content ? JSON.stringify(doc.content) : undefined}
          onChange={(state) => {
            setDoc((prev) => ({
              ...prev,
              content: state,
              updatedAt: new Date(),
            }));
          }}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => exportDocument(doc)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export as PDF
        </button>
        <button
          onClick={() => shareDocument(doc.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Share
        </button>
      </div>
    </div>
  );
}

async function exportDocument(doc: Document) {
  // Implement PDF export
  console.log('Exporting document:', doc.id);
}

async function shareDocument(docId: string) {
  // Implement share functionality
  console.log('Sharing document:', docId);
}
```

## Example 3: Comment/Note Editor

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@/registry/default/block/editor-00'; // Lighter version
import { SerializedEditorState } from 'lexical';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: SerializedEditorState;
  createdAt: Date;
  likes: number;
}

export function CommentEditor({ onSubmit }: { onSubmit: (content: SerializedEditorState) => void }) {
  const [content, setContent] = useState<SerializedEditorState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content) return;

    setIsSubmitting(true);
    try {
      onSubmit(content);
      setContent(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-4 py-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="border rounded-lg overflow-hidden mb-3">
          <Editor
            onChange={setContent}
            placeholder="Write a comment..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!content || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CommentThread({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 py-4 border-b">
          <Avatar>
            <AvatarImage src={comment.avatar} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <strong>{comment.author}</strong>
              <span className="text-sm text-gray-500">
                {comment.createdAt.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 rounded p-3 mb-2">
              <CommentContent content={comment.content} readOnly />
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-gray-600 hover:text-blue-600">
                ❤️ {comment.likes} Likes
              </button>
              <button className="text-gray-600 hover:text-blue-600">
                Reply
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentContent({ content, readOnly }: { content: SerializedEditorState; readOnly: boolean }) {
  return (
    <div className="text-sm">
      {/* Render serialized content */}
      {/* You might use a custom renderer here */}
    </div>
  );
}
```

## Example 4: Email Template Builder

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@/registry/default/block/editor-x';
import { SerializedEditorState } from 'lexical';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: SerializedEditorState;
  variables: string[];
}

export function EmailTemplateBuilder() {
  const [template, setTemplate] = useState<EmailTemplate>({
    id: '',
    name: 'New Template',
    subject: 'Hello {{firstName}}',
    content: null,
    variables: ['firstName', 'lastName', 'email'],
  });

  const [previewVars, setPreviewVars] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  });

  const handleSaveTemplate = async () => {
    const response = await fetch('/api/email-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });

    if (response.ok) {
      alert('Template saved!');
    }
  };

  const handlePreviewEmail = () => {
    // Render email preview with variables
    console.log('Rendering preview with:', previewVars);
  };

  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      {/* Editor Column */}
      <div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Template Name</label>
          <input
            type="text"
            value={template.name}
            onChange={(e) =>
              setTemplate({ ...template, name: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Subject Line</label>
          <input
            type="text"
            value={template.subject}
            onChange={(e) =>
              setTemplate({ ...template, subject: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Content</label>
          <div className="border rounded-lg h-96 overflow-hidden">
            <Editor
              onChange={(state) =>
                setTemplate({ ...template, content: state })
              }
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveTemplate}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Template
          </button>
          <button
            onClick={handlePreviewEmail}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Variable Reference Column */}
      <div className="bg-gray-50 rounded p-6">
        <h3 className="font-semibold mb-4">Available Variables</h3>
        <div className="space-y-2 mb-6">
          {template.variables.map((variable) => (
            <code
              key={variable}
              className="block bg-white p-2 rounded border cursor-pointer hover:bg-blue-50"
              onClick={() => {
                const el = document.getElementById('editor-textarea');
                if (el) {
                  (el as any).value += `{{${variable}}}`;
                }
              }}
            >
              {`{{${variable}}}`}
            </code>
          ))}
        </div>

        <h3 className="font-semibold mb-4">Preview Variables</h3>
        <div className="space-y-3">
          {Object.entries(previewVars).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium block mb-1">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setPreviewVars({ ...previewVars, [key]: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Example 5: Markdown + Editor Integration

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@/registry/default/block/editor-x';
import { SerializedEditorState } from 'lexical';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MarkdownEditorTabs() {
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(null);
  const [markdown, setMarkdown] = useState('');

  const handleEditorChange = (state: SerializedEditorState) => {
    setEditorState(state);
    // Convert to markdown
    const md = lexicalToMarkdown(state);
    setMarkdown(md);
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    // Convert to editor state
    const editorState = markdownToLexical(e.target.value);
    setEditorState(editorState);
  };

  const handleExport = (format: 'md' | 'html' | 'json') => {
    if (!editorState) return;

    let content: string;
    let filename: string;

    switch (format) {
      case 'md':
        content = markdown;
        filename = 'document.md';
        break;
      case 'html':
        content = lexicalToHtml(editorState);
        filename = 'document.html';
        break;
      case 'json':
        content = JSON.stringify(editorState, null, 2);
        filename = 'document.json';
        break;
    }

    downloadFile(content, filename);
  };

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editor">Visual Editor</TabsTrigger>
        <TabsTrigger value="markdown">Markdown</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="border-t">
        <div className="min-h-96 border rounded-lg overflow-hidden">
          <Editor onChange={handleEditorChange} />
        </div>
      </TabsContent>

      <TabsContent value="markdown" className="border-t">
        <textarea
          value={markdown}
          onChange={handleMarkdownChange}
          className="w-full min-h-96 p-4 font-mono text-sm border rounded"
          placeholder="Enter markdown..."
        />
      </TabsContent>

      <TabsContent value="export" className="border-t p-4">
        <div className="space-y-2">
          <button
            onClick={() => handleExport('md')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download as Markdown
          </button>
          <button
            onClick={() => handleExport('html')}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download as HTML
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Download as JSON
          </button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Helper functions
function lexicalToMarkdown(state: SerializedEditorState): string {
  // Implement Lexical to Markdown conversion
  return '';
}

function markdownToLexical(markdown: string): SerializedEditorState {
  // Implement Markdown to Lexical conversion
  return {} as SerializedEditorState;
}

function lexicalToHtml(state: SerializedEditorState): string {
  // Implement Lexical to HTML conversion
  return '';
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Integration Patterns

### With Next.js Server Actions

```tsx
'use server';

import { db } from '@/lib/db';
import { SerializedEditorState } from 'lexical';

export async function saveDocument(
  id: string,
  content: SerializedEditorState
) {
  return db.document.update({
    where: { id },
    data: {
      content,
      updatedAt: new Date(),
    },
  });
}

export async function publishDocument(id: string) {
  return db.document.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date(),
    },
  });
}
```

### With API Routes

```tsx
// pages/api/documents/[id].ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { content } = await request.json();

  // Save to database
  const doc = await saveDocumentToDB(params.id, content);

  return NextResponse.json(doc);
}
```

These examples cover common real-world scenarios. Adapt them to your specific needs!
