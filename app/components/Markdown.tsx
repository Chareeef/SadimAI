"use client";

import ReactMarkdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
  },
};

export default function Markdown({ content }: Props) {
  const components: Components = {
    a({ children, ...props }) {
      return (
        <a {...props} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    code({ className, children, ...props }) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, schema], rehypeHighlight]}
      className="prose prose-sm prose-invert max-w-none break-words prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-p:my-3 prose-p:leading-7 prose-p:text-emerald-50/90 prose-a:text-emerald-300 prose-a:no-underline hover:prose-a:text-emerald-200 prose-strong:text-white prose-code:rounded-md prose-code:bg-emerald-200/[0.08] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.82em] prose-code:text-emerald-100 prose-code:before:content-none prose-code:after:content-none prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-emerald-100/[0.12] prose-pre:bg-[#06130e] prose-pre:p-4 prose-pre:shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_12px_34px_rgba(0,0,0,0.18)] prose-li:my-1 prose-li:text-emerald-50/90 prose-blockquote:border-emerald-300/30 prose-blockquote:text-emerald-50/70 prose-hr:border-white/10 prose-table:block prose-table:overflow-x-auto [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
