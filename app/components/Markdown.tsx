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
      className="prose prose-sm prose-invert max-w-none break-words prose-headings:mb-3 prose-headings:mt-6 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-100 prose-p:my-3 prose-p:leading-7 prose-p:text-slate-300 prose-a:text-emerald-300 prose-a:no-underline hover:prose-a:text-emerald-200 prose-strong:text-slate-100 prose-code:rounded-md prose-code:bg-white/[0.07] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.82em] prose-code:text-emerald-200 prose-code:before:content-none prose-code:after:content-none prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/[0.08] prose-pre:bg-[#020706] prose-pre:p-4 prose-li:my-1 prose-li:text-slate-300 prose-blockquote:border-emerald-300/30 prose-blockquote:text-slate-400 prose-hr:border-white/10 prose-table:block prose-table:overflow-x-auto"
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
