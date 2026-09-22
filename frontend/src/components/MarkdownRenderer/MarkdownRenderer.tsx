import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MarkdownRenderer.css";

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="markdown-code-wrapper">
      <div className="markdown-code-header">
        <span className="markdown-code-lang">{language}</span>
        <button type="button" className="markdown-code-copy" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language.toLowerCase()}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0 0 10px 10px",
          fontSize: "0.88rem",
          lineHeight: "1.5",
          background: "#090d16",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-renderer-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isMultiline = codeString.includes("\n");

            if (match || isMultiline) {
              const lang = match ? match[1] : "text";
              return <CodeBlock language={lang} value={codeString} />;
            }

            return (
              <code className="markdown-inline-code" {...props}>
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
                {children}
              </a>
            );
          },
          h1({ children }) {
            return <h1 className="markdown-h1">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="markdown-h2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="markdown-h3">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="markdown-h4">{children}</h4>;
          },
          ul({ children }) {
            return <ul className="markdown-ul">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="markdown-ol">{children}</ol>;
          },
          li({ children }) {
            return <li className="markdown-li">{children}</li>;
          },
          blockquote({ children }) {
            return <blockquote className="markdown-blockquote">{children}</blockquote>;
          },
          hr() {
            return <hr className="markdown-hr" />;
          },
          p({ children }) {
            return <p className="markdown-p">{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
