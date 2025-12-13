"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

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
    code({ className, children, ...props }) {
      // const match = /language-(\w+)/.exec(className || "");

      // if (match) {
      //   return (
      //     <pre className="relative overflow-x-auto rounded-lg bg-green-900/40 border border-green-800/50 shadow-2xl shadow-green-900/30 p-3">
      //       <code className={className} {...props}>
      //         {String(children).replace(/\n$/, "")}
      //       </code>
      //     </pre>
      //   );
      // }

      // ✅ Inline code
      return <code className="rounded text-sm">{children}</code>;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, schema], rehypeHighlight]}
      className="
        prose
        prose-invert
        max-w-none
        prose-headings:text-green-300
        prose-a:text-blue-400
        prose-code:text-green-200
        prose-pre:bg-zinc-900
        prose-pre:border
        prose-pre:border-zinc-700
      "
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
