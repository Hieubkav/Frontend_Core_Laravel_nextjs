'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from 'lexical';
import slugify from 'slugify';
import { Editor } from '@/components/blocks/editor-00/editor';

export interface PostFormValues {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  order: string;
  active: boolean;
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: PostFormValues) => Promise<void> | void;
  extraActions?: React.ReactNode;
  hideSlug?: boolean;
  hideOrder?: boolean;
}

const defaultValues: PostFormValues = {
  title: '',
  slug: '',
  content: '',
  thumbnail: '',
  order: '',
  active: true,
};

const toSlug = (value: string) =>
  slugify(value, {
    lower: true,
    locale: 'vi',
    strict: true,
    trim: true,
  });

const createSerializedFromPlainText = (text: string): SerializedEditorState => {
  const textNode: SerializedTextNode = {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  };

  const paragraphChildren: SerializedLexicalNode[] = text ? [textNode] : [];

  const paragraph: SerializedParagraphNode = {
    children: paragraphChildren,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    type: 'paragraph',
    version: 1,
  };

  const root: SerializedRootNode = {
    children: [paragraph],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  };

  return { root };
};

const normaliseEditorState = (value?: string): SerializedEditorState | undefined => {
  if (!value) return createSerializedFromPlainText('');
  try {
    const parsed = JSON.parse(value);
    if (parsed?.root) return parsed as SerializedEditorState;
  } catch {
    return createSerializedFromPlainText(value);
  }
  return createSerializedFromPlainText(value);
};

const PostForm: React.FC<PostFormProps> = ({
  initialValues,
  submitting = false,
  submitLabel = 'Luu bai viet',
  onSubmit,
  extraActions,
  hideSlug = false,
  hideOrder = false,
}) => {
  const initialEditorState = normaliseEditorState(initialValues?.content);

  const [formValues, setFormValues] = useState<PostFormValues>({
    ...defaultValues,
    ...initialValues,
    order:
      initialValues?.order !== undefined && initialValues.order !== null
        ? String(initialValues.order)
        : defaultValues.order,
    active:
      initialValues?.active !== undefined
        ? initialValues.active
        : defaultValues.active,
    content: JSON.stringify(initialEditorState ?? createSerializedFromPlainText('')),
  });
  const [slugEdited, setSlugEdited] = useState<boolean>(Boolean(initialValues?.slug));
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(
    initialEditorState,
  );

  const contentSeed = useMemo(() => {
    if (!editorState) return 'seed-empty';
    const seed = JSON.stringify(editorState);
    return seed ? `seed-${seed.slice(0, 24)}-${seed.length}` : 'seed-empty';
  }, [editorState]);

  useEffect(() => {
    const nextEditorState = normaliseEditorState(initialValues?.content);
    setFormValues({
      ...defaultValues,
      ...initialValues,
      order:
        initialValues?.order !== undefined && initialValues.order !== null
          ? String(initialValues.order)
          : defaultValues.order,
      active:
        initialValues?.active !== undefined
          ? initialValues.active
          : defaultValues.active,
      content: JSON.stringify(nextEditorState ?? createSerializedFromPlainText('')),
    });
    setSlugEdited(Boolean(initialValues?.slug));
    setEditorState(nextEditorState);
  }, [
    initialValues?.title,
    initialValues?.slug,
    initialValues?.content,
    initialValues?.thumbnail,
    initialValues?.order,
    initialValues?.active,
  ]);

  const handleTitleChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      title: value,
      slug: slugEdited ? prev.slug : toSlug(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setFormValues((prev) => ({ ...prev, slug: toSlug(value) }));
  };

  const handleContentChange = (value: SerializedEditorState) => {
    setEditorState(value);
    setFormValues((prev) => ({
      ...prev,
      content: JSON.stringify(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(formValues);
  };

  const titleSlugCols = hideSlug ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2';
  const detailCols = hideOrder ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3';
  const editorKey = contentSeed ? `seed-${contentSeed.slice(0, 24)}-${contentSeed.length}` : 'seed-empty';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow p-6 space-y-6"
    >
      <div className={`grid ${titleSlugCols} gap-4`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Tieu de *
          </label>
          <input
            type="text"
            value={formValues.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Nhap tieu de bai viet"
            required
          />
        </div>

        {!hideSlug && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formValues.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="tieu-de-bai-viet"
              required
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Tu dong sinh tu tieu de, co the chinh sua thu cong khi can.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
          Noi dung *
        </label>
        <Editor
          key={editorKey}
          editorSerializedState={editorState}
          onSerializedChange={handleContentChange}
        />
      </div>

      <div className={`grid ${detailCols} gap-4`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Thumbnail (URL)
          </label>
          <input
            type="text"
            value={formValues.thumbnail}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, thumbnail: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Co the bo trong.</p>
        </div>

        {!hideOrder && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Thu tu hien thi
            </label>
            <input
              type="number"
              min={0}
              value={formValues.order}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, order: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              So nho hon se hien thi truoc. De trong neu khong dung.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-6">
          <input
            id="active"
            type="checkbox"
            checked={formValues.active}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, active: e.target.checked }))
            }
            className="h-4 w-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-indigo-500"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-slate-200">
            Kich hoat (hien thi)
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        {extraActions}
        <button
          type="submit"
          disabled={submitting}
          className="ml-auto bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-50 transition"
        >
          {submitting ? 'Dang luu...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
