/**
 * Markdown pipeline plugins for the guide collection.
 *
 * These exist so the source files can stay ordinary, portable markdown. A
 * writer drafts a page with a leading `# Title` and links written with trailing
 * slashes, which is what every markdown editor expects, and the build
 * reconciles it with this site's conventions.
 *
 * Written against the Sätteri visitor API (`mdastPlugins` / `hastPlugins` on
 * the processor), which is Astro's default markdown processor. They are not
 * unified/remark plugins and will not run on that pipeline.
 */

/**
 * Drop the leading `# Title` from every markdown file.
 *
 * The layout renders the h1 itself, from frontmatter, above the standfirst and
 * the byline. Leaving the markdown h1 in place would give every page two h1s,
 * which is an accessibility-checklist failure and muddies the outline Google
 * builds from the page. Only a top-level h1 is touched; h2 and below are the
 * document's own structure and are left alone.
 */
export const stripLeadingTitle = {
  name: 'vm-strip-leading-title',
  heading(node, ctx) {
    if (node.depth !== 1) return;
    if (ctx.parent(node)?.type !== 'root') return;
    ctx.removeNode(node);
  },
};

/**
 * Strip the trailing slash from internal links in body copy.
 *
 * astro.config.mjs sets `trailingSlash: 'never'`, so /getting-here/ would 301
 * on every click. Rewriting at build time keeps the drafts readable as markdown
 * and stops the shipped HTML spending a redirect on an internal link. External
 * links and bare anchors are left exactly as written.
 */
export const internalLinkSlashes = {
  name: 'vm-internal-link-slashes',
  link(node, ctx) {
    const { url } = node;
    if (typeof url !== 'string' || !url.startsWith('/') || url.length < 2) return;

    const stripped = url.replace(/\/+(?=$|[?#])/, '');
    if (stripped !== url) ctx.setProperty(node, 'url', stripped);
  },
};

/**
 * Wrap every markdown table in a horizontally scrollable region.
 *
 * These pages carry timetables, fare bands and door-to-door tables running to
 * five columns, and the layout has to hold at 320px. A table that scrolls
 * inside its own box keeps the page body from scrolling sideways. The wrapper
 * is focusable and labelled, because a scroll container only a mouse can reach
 * fails WCAG 2.1.
 */
export const scrollableTables = {
  name: 'vm-scrollable-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['vm-table'],
          tabIndex: 0,
          role: 'region',
          'aria-label': 'Table, scrollable horizontally',
        },
        children: [],
      });
    },
  },
};

/**
 * Turn an image that stands alone in a paragraph into a captioned figure.
 *
 * Every guide page carries a lead image and at least three body figures,
 * because these pages run 1,300 to 2,100 words and unbroken prose at that
 * length does not get read. The drafts stay portable markdown: an image on its
 * own line, with the caption in the title slot.
 *
 *   ![Alt text](/images/guide/slug-2.webp 'Caption under the image.')
 *
 * A markdown image inline in a sentence is left alone; only a paragraph whose
 * single child is an image becomes a figure. Dimensions are stamped here rather
 * than asked of the writer: every body figure on this site is generated at 3:2,
 * and a missing width/height is a layout shift on a slow connection.
 */
const FIGURE_WIDTH = 1200;
const FIGURE_HEIGHT = 800;

export const figures = {
  name: 'vm-figures',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const children = (node.children ?? []).filter(
        (child) => !(child.type === 'text' && child.value.trim() === ''),
      );
      if (children.length !== 1) return;

      const image = children[0];
      if (image.type !== 'element' || image.tagName !== 'img') return;

      const { src, alt, title } = image.properties ?? {};
      if (typeof src !== 'string') return;

      const figureChildren = [
        {
          type: 'element',
          tagName: 'img',
          properties: {
            src,
            alt: typeof alt === 'string' ? alt : '',
            width: FIGURE_WIDTH,
            height: FIGURE_HEIGHT,
            loading: 'lazy',
            decoding: 'async',
          },
          children: [],
        },
      ];

      // The caption carries what the prose does not, so it is a real element
      // when present and absent entirely when not. An empty figcaption reads
      // to a screen reader as a caption the author forgot to write.
      if (typeof title === 'string' && title.trim() !== '') {
        figureChildren.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: title.trim() }],
        });
      }

      ctx.replaceNode(node, {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['vm-figure'] },
        children: figureChildren,
      });
    },
  },
};
