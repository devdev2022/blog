import { useState } from "react";

import type { Editor } from "@tiptap/react";

interface PreviewModalProps {
  title: string;
  editor: Editor | null;
}

function PreviewModal({ title, editor }: PreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="write-bottom-btn" onClick={() => setIsOpen(true)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        미리보기
      </button>

      {isOpen && (
        <div className="write-preview-overlay">
          <div className="write-preview-header">
            <button
              className="write-preview-back-btn"
              onClick={() => setIsOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
          <div className="write-preview-content">
            <h1 className="write-preview-title">{title || "(제목 없음)"}</h1>
            <div
              className="write-preview-body"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default PreviewModal;
