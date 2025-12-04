'use client';

import {
  $applyNodeReplacement,
  $createNodeSelection,
  $getSelection,
  $getRoot,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  DOMConversionMap,
  DOMConversionOutput,
  DecoratorNode,
  EditorConfig,
  ElementFormatType,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  createCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import type { JSX } from 'react';

export type InsertImagePayload = {
  src: string;
  altText?: string;
  width?: number | string;
  height?: number | string;
  captionsEnabled?: boolean;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

type SerializedImageNode = {
  src: string;
  altText: string;
  width?: number | string;
  height?: number | string;
  type: 'image';
  version: 1;
} & SerializedLexicalNode;

function convertImageElement(domNode: HTMLElement): DOMConversionOutput | null {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, altText: alt });
    return { node };
  }
  return null;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width?: number | string;
  __height?: number | string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height } = serializedNode;
    return $createImageNode({ src, altText, width, height });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    width?: number | string,
    height?: number | string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          maxWidth: '100%',
          height: this.__height ?? 'auto',
          width: this.__width ?? 'auto',
          borderRadius: '6px',
        }}
      />
    );
  }
}

export function $createImageNode({
  src,
  altText = '',
  width,
  height,
}: InsertImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height));
}

export function $isImageNode(node?: LexicalNode | null): node is ImageNode {
  return node instanceof ImageNode;
}

const ImagesPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);

        const insertAtSelection = (sel: any) => {
          if ($isRangeSelection(sel) || $isNodeSelection(sel)) {
            sel.insertNodes([imageNode]);
            return true;
          }
          return false;
        };

        const selection = $getSelection();
        let inserted = insertAtSelection(selection);

        if (!inserted) {
          // Nếu chưa focus editor, chọn cuối root rồi chèn
          const root = $getRoot();
          root.selectEnd();
          const selAfterFocus = $getSelection();
          inserted = insertAtSelection(selAfterFocus);
          if (!inserted) {
            // Fallback: gắn trực tiếp vào root
            root.append(imageNode);
            const nodeSelection = $createNodeSelection();
            nodeSelection.add(imageNode.getKey());
            $setSelection(nodeSelection);
          }
        }

        // Ensure not wrapped in paragraph if already block
        const parent = imageNode.getParent();
        if ($isParagraphNode(parent)) {
          parent.insertAfter(imageNode);
          parent.remove();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
};

export default ImagesPlugin;
