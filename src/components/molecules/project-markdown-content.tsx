import type { ReactNode } from "react";

type MarkdownBlock =
  | {
      level: 2 | 3;
      text: string;
      type: "heading";
    }
  | {
      items: string[];
      type: "list";
    }
  | {
      text: string;
      type: "paragraph";
    };

type ProjectMarkdownContentProps = {
  markdown: string;
};

function parseMarkdown(markdown: string) {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({
        text: paragraph.join(" ").trim(),
        type: "paragraph",
      });
      paragraph = [];
    }
  }

  function flushList() {
    if (list.length) {
      blocks.push({
        items: list,
        type: "list",
      });
      list = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({
        level: 2,
        text: trimmed.replace(/^##\s+/, ""),
        type: "heading",
      });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        level: 3,
        text: trimmed.replace(/^###\s+/, ""),
        type: "heading",
      });
      continue;
    }

    if (trimmed.startsWith("-")) {
      flushParagraph();
      list.push(trimmed.replace(/^-\s*/, ""));
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  if (block.type === "heading") {
    const className =
      block.level === 2
        ? "mt-12 text-3xl font-black tracking-normal text-foreground sm:text-4xl"
        : "mt-8 text-2xl font-black tracking-normal text-foreground";

    const Tag = block.level === 2 ? "h2" : "h3";

    return (
      <Tag className={className} key={`${block.type}-${index}`}>
        {block.text}
      </Tag>
    );
  }

  if (block.type === "list") {
    return (
      <ul
        className="mt-6 grid gap-3 border-l-2 border-spicy-orange pl-5 text-lg leading-8 text-muted"
        key={`${block.type}-${index}`}
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className="mt-6 text-lg leading-8 text-muted sm:text-xl sm:leading-9"
      key={`${block.type}-${index}`}
    >
      {block.text}
    </p>
  );
}

export function ProjectMarkdownContent({ markdown }: ProjectMarkdownContentProps) {
  return <div>{parseMarkdown(markdown).map(renderBlock)}</div>;
}
