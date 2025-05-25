"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const TOOLBAR_OPTIONS = [
  ["bold", "italic"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Write something...",
  className,
}: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize Quill
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      placeholder,
    });

    // Set initial content
    quill.root.innerHTML = content;

    // Handle content changes
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChange(html === "<p><br></p>" ? "" : html);
    });

    quillRef.current = quill;

    return () => {
      quill.off("text-change");
    };
  }, []); // Empty deps array since we only want to initialize once

  // Update content when prop changes
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  return (
    <div className={cn("border rounded-md", className)}>
      <div ref={editorRef} className="min-h-[150px]" />
    </div>
  );
};
