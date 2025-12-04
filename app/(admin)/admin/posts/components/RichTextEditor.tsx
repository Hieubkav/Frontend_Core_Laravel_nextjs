'use client';

import { useMemo, useRef } from 'react';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  LexicalEditor,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from '@lexical/list';
import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import { LinkNode } from '@lexical/link';
import ImagesPlugin, {
  ImageNode,
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
} from './nodes/ImageNode';

type Props = {
  initialValue?: string;
  onChange?: (jsonValue: string, plainText: string) => void;
  placeholder?: string;
};

const theme = {
  paragraph: 'mb-1',
  quote:
    'border-l-4 border-indigo-200 dark:border-indigo-700/60 pl-3 text-slate-700 dark:text-slate-200 italic my-2',
  heading: {
    h1: 'text-2xl font-semibold mt-4 mb-2',
    h2: 'text-xl font-semibold mt-3 mb-1.5',
    h3: 'text-lg font-semibold mt-2 mb-1',
  },
  list: {
    listitem: 'mb-1',
    ul: 'list-disc pl-6 space-y-1',
    ol: 'list-decimal pl-6 space-y-1',
  },
  hr: 'my-4 border-slate-200 dark:border-slate-700',
  code: 'font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-1 rounded',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline underline-offset-2',
    strikethrough: 'line-through',
  },
};

function onError(error: Error) {
  console.error('Lexical editor error', error);
}

const Placeholder = ({ text }: { text: string }) => (
  <div className="pointer-events-none absolute left-3 top-3 text-sm text-slate-400">
    {text}
  </div>
);

function formatHeading(editor: LexicalEditor, tag: HeadingTagType | 'paragraph') {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (tag === 'paragraph') {
      $setBlocksType(selection, () => $createParagraphNode());
      return;
    }

    $setBlocksType(selection, () => $createHeadingNode(tag));
  });
}

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  title?: string;
  className?: string;
};

const ToolbarButton = ({ label, onClick, title, className }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className ?? ''}`}
  >
    {label}
  </button>
);

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyStyle = (style: string, value: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { [style]: value });
    });
  };

  const insertImage = () => {
    const url = window.prompt('Nhap URL anh');
    if (!url) return;
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: url, altText: '' });
  };

  const insertImageFile = (file: File) => {
    // Chuyển file sang data URL để đảm bảo hiển thị được ngay cả khi chưa upload lên server
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: result, altText: file.name });
      }
    };
    reader.readAsDataURL(file);
  };

  const fonts = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
  const sizes = [12, 14, 16, 18, 20, 24, 28, 32];
  const colors = ['#111827', '#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#9333ea'];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-3 py-2">
      <ToolbarButton
        label="↺"
        title="Hoan tac"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      />
      <ToolbarButton
        label="↻"
        title="Lam lai"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      />

      <select
        className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        defaultValue="paragraph"
        onChange={(e) => formatHeading(editor, e.target.value as HeadingTagType | 'paragraph')}
      >
        <option value="paragraph">Doan van</option>
        <option value="h1">Tieu de H1</option>
        <option value="h2">Tieu de H2</option>
        <option value="h3">Tieu de H3</option>
      </select>

      <select
        className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        defaultValue="Inter"
        onChange={(e) => applyStyle('font-family', e.target.value)}
      >
        {fonts.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        defaultValue={16}
        onChange={(e) => applyStyle('font-size', `${e.target.value}px`)}
      >
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      <ToolbarButton
        label="B"
        title="In dam"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      />
      <ToolbarButton
        label="I"
        title="In nghieng"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      />
      <ToolbarButton
        label="U"
        title="Gach chan"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      />

      <ToolbarButton
        label="• List"
        title="Danh sach bullet"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      />
      <ToolbarButton
        label="1. List"
        title="Danh sach so"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      />

      <div className="flex items-center gap-1">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            title={`Mau ${c}`}
            onClick={() => applyStyle('color', c)}
            className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <ToolbarButton label="Img" title="Chen anh (URL)" onClick={insertImage} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) insertImageFile(file);
          e.target.value = '';
        }}
      />
      <ToolbarButton
        label="Upload"
        title="Chen anh tu file"
        onClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
};

const createEditorStateFromPlainText = (text: string) =>
  JSON.stringify({
    root: {
      children: [
        {
          children: text
            ? [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text,
                  type: 'text',
                  version: 1,
                },
              ]
            : [],
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
  });

const normaliseInitialState = (value?: string) => {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.root) {
      return JSON.stringify(parsed);
    }
  } catch {
    return createEditorStateFromPlainText(value);
  }
  return createEditorStateFromPlainText(value);
};

const extractPlainText = (state: EditorState) =>
  state.read(() => $getRoot().getTextContent().trim());

export default function RichTextEditor({
  initialValue,
  onChange,
  placeholder = 'Nhap noi dung bai viet...',
}: Props) {
  const initialState = useMemo(() => normaliseInitialState(initialValue), [initialValue]);

  const handleChange = (state: EditorState) => {
    const jsonValue = JSON.stringify(state.toJSON());
    const plainText = extractPlainText(state);
    onChange?.(jsonValue, plainText);
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <LexicalComposer
        initialConfig={{
          namespace: 'post-editor',
          theme,
          onError,
          nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            LinkNode,
            HorizontalRuleNode,
            CodeNode,
            CodeHighlightNode,
            ImageNode,
          ],
          editorState: initialState,
        }}
      >
        <Toolbar />
        <div className="relative min-h-[240px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="prose prose-slate max-w-none min-h-[220px] px-4 py-3 focus:outline-none dark:prose-invert" />
            }
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={() => null}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <ListPlugin />
          <ImagesPlugin />
          <MarkdownShortcutPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
