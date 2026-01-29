/**
 * Remark plugin to wrap code blocks with figure/figcaption for captions and filenames.
 *
 * Syntax:
 *   :::filename
 *   path/to/file.js
 *   :::
 *
 *   ```js
 *   code here
 *   ```
 *
 *   :::caption
 *   Caption with **markdown** and [links](url).
 *   :::
 */

import type { Root, Parent, RootContent, PhrasingContent } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';

type Directive = ContainerDirective & RootContent;

function processParent(parent: Parent) {
  // Process in reverse to avoid index-shifting issues when splicing
  for (let i = parent.children.length - 1; i >= 0; i--) {
    const node = parent.children[i];

    // Recurse into nested structures (blockquotes, list items, etc.)
    if ('children' in node) processParent(node as Parent);

    if (node.type !== 'code') continue;

    const prev = parent.children[i - 1] as Directive | undefined;
    const next = parent.children[i + 1] as Directive | undefined;
    const hasFilename =
      prev?.type === 'containerDirective' && prev.name === 'filename';
    const hasCaption =
      next?.type === 'containerDirective' && next.name === 'caption';

    if (!hasFilename && !hasCaption) continue;

    // Build figure children
    const children: RootContent[] = [];

    if (hasFilename) {
      children.push({
        type: 'paragraph',
        data: { hName: 'div', hProperties: { className: ['code-filename'] } },
        children: prev.children.flatMap((c) =>
          c.type === 'paragraph' ? c.children : [],
        ) as PhrasingContent[],
      } as RootContent);
    }

    children.push(node);

    if (hasCaption) {
      children.push({
        type: 'paragraph',
        data: { hName: 'figcaption' },
        children: next.children.flatMap((c) =>
          c.type === 'paragraph' ? c.children : [],
        ) as PhrasingContent[],
      } as RootContent);
    }

    // Replace the directive(s) + code block with the figure
    const start = hasFilename ? i - 1 : i;
    const count = 1 + (hasFilename ? 1 : 0) + (hasCaption ? 1 : 0);
    parent.children.splice(start, count, {
      type: 'paragraph',
      data: { hName: 'figure', hProperties: { className: ['code-figure'] } },
      children,
    } as RootContent);
  }
}

export default function remarkCodeFigure() {
  return (tree: Root) => processParent(tree);
}
