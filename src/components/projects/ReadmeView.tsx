import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  markdown: string;
}

export default function ReadmeView({ markdown }: Props) {
  const html = useMemo(() => {
    const raw = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  return <div className="readme-view" dangerouslySetInnerHTML={{ __html: html }} />;
}
