import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function MarkDownMessage({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ children, ...props }) => (
          <p {...props} className="text-sm break-words ">
            {children}
          </p>
        ),
        h1: ({ children, ...props }) => (
          <h1 {...props} className="text-sm font-bold break-words ">
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 {...props} className="text-sm font-semibold break-words ">
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 {...props} className="text-sm font-medium break-words ">
            {children}
          </h3>
        ),
        // Inline code
        code: ({ children, ...props }) => {
          return (
            <code {...props} className="rounded px-1 py-0.5 text-sm break-all">
              {children}
            </code>
          );
        },
        pre: ({ children, ...props }) => (
          <div className="w-full max-w-full">
            <pre
              {...props}
              className="rounded-md text-sm whitespace-pre-wrap w-full max-w-full"
            >
              {children}
            </pre>
          </div>
        ),
        // Lists
        ul: ({ children, ...props }) => (
          <ul {...props} className="text-sm break-words">
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol {...props} className="text-sm break-words">
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li {...props} className="text-sm break-words">
            {children}
          </li>
        ),
        // Tables
        table: ({ children, ...props }) => (
          <table
            {...props}
            className="text-xs border-collapse w-full border border-gray-300 table-fixed"
          >
            {children}
          </table>
        ),
        th: ({ children, ...props }) => (
          <th
            {...props}
            className="border border-gray-300 bg-gray-100 px-3 py-2 text-left text-xs font-semibold overflow-auto"
          >
            {children}
          </th>
        ),
        // Table row
        tr: ({ children, ...props }) => (
          <tr
            {...props}
            className="border-b border-gray-200 hover:bg-gray-50 overflow-auto"
          >
            {children}
          </tr>
        ),
        // Table cell
        td: ({ children, ...props }) => (
          <td
            {...props}
            className="border border-gray-300 px-3 py-2 text-xs overflow-auto"
          >
            {children}
          </td>
        ),
      }}
    >
      {children}
    </Markdown>
  );
}

export default MarkDownMessage;
