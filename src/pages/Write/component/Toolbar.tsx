import { useRef, useState, useEffect } from "react";

import type { Editor } from "@tiptap/react";

import AlertModal from "@/components/AlertModal/AlertModal";

const TEXT_TYPE_OPTIONS = [
  { label: "본문", value: "paragraph" },
  { label: "제목 1", value: "heading1" },
  { label: "제목 2", value: "heading2" },
  { label: "제목 3", value: "heading3" },
];

const FONT_FAMILY_OPTIONS = [
  { label: "기본서체", value: "" },
  { label: "Pretendard", value: "Pretendard, sans-serif" },
  { label: "나눔고딕", value: "'Nanum Gothic', sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

function getTextTypeValue(editor: Editor | null): string {
  if (!editor) return "paragraph";
  if (editor.isActive("heading", { level: 1 })) return "heading1";
  if (editor.isActive("heading", { level: 2 })) return "heading2";
  if (editor.isActive("heading", { level: 3 })) return "heading3";
  return "paragraph";
}

interface ToolbarSelectProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  minWidth?: number;
}

function ToolbarSelect({
  value,
  options,
  onChange,
  minWidth,
}: ToolbarSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? options[0].label;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="write-toolbar-dropdown"
      ref={containerRef}
      style={minWidth ? { minWidth } : undefined}
    >
      <button
        type="button"
        className={`write-toolbar-dropdown-trigger${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span>{selectedLabel}</span>
        <svg
          className="write-toolbar-dropdown-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <ul className="write-toolbar-dropdown-list">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`write-toolbar-dropdown-item${value === opt.value ? " is-selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface LinkModalProps {
  defaultValue: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}

function LinkModal({ defaultValue, onConfirm, onClose }: LinkModalProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleConfirm = () => {
    if (!value.trim()) return;
    const url = /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`;
    onConfirm(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="write-link-modal-overlay" onClick={onClose}>
      <div
        className="write-link-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="write-link-modal-label">링크 URL</p>
        <input
          ref={inputRef}
          className="write-link-modal-input"
          type="url"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="write-link-modal-actions">
          <button className="write-link-modal-cancel" onClick={onClose}>
            취소
          </button>
          <button className="write-link-modal-confirm" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export interface ToolbarProps {
  editor: Editor | null;
  onVideoAdd: (blobUrl: string, file: File) => void;
}

function Toolbar({ editor, onVideoAdd }: ToolbarProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleTextTypeChange = (value: string) => {
    if (!editor) return;
    switch (value) {
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  const handleFontFamilyChange = (value: string) => {
    if (!editor) return;
    if (value) {
      editor.chain().focus().setFontFamily(value).run();
    } else {
      editor.chain().focus().unsetFontFamily().run();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    editor.chain().focus().setColor(e.target.value).run();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().insertContent({ type: "video", attrs: { src: blobUrl } }).run();
    onVideoAdd(blobUrl, file);
    e.target.value = "";
  };

  const handleLinkToggle = () => {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    setIsLinkModalOpen(true);
  };

  const handleLinkConfirm = (url: string) => {
    editor?.chain().focus().setLink({ href: url, target: "_blank" }).run();
    setIsLinkModalOpen(false);
  };

  const handleTableInsert = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const currentTextType = getTextTypeValue(editor);
  const currentFontFamily = editor?.getAttributes("textStyle").fontFamily ?? "";

  return (
    <div className="write-toolbar">
      {/* 이미지 업로드 */}
      <button
        className="write-toolbar-icon-btn"
        onClick={() => imageInputRef.current?.click()}
        title="이미지 삽입"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="write-toolbar-file-input"
        onChange={handleImageFileChange}
      />

      {/* 동영상 업로드 */}
      <button
        className="write-toolbar-icon-btn"
        onClick={() => videoInputRef.current?.click()}
        title="동영상 삽입"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      </button>
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="write-toolbar-file-input"
        onChange={handleVideoFileChange}
      />

      <div className="write-toolbar-divider" />

      {/* 텍스트 유형 */}
      <ToolbarSelect
        value={currentTextType}
        options={TEXT_TYPE_OPTIONS}
        onChange={handleTextTypeChange}
        minWidth={88}
      />

      {/* 폰트 */}
      <ToolbarSelect
        value={currentFontFamily}
        options={FONT_FAMILY_OPTIONS}
        onChange={handleFontFamilyChange}
        minWidth={120}
      />

      <div className="write-toolbar-divider" />

      {/* Bold */}
      <button
        className={`write-toolbar-btn${editor?.isActive("bold") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      {/* Italic */}
      <button
        className={`write-toolbar-btn${editor?.isActive("italic") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </button>

      {/* Underline */}
      <button
        className={`write-toolbar-btn${editor?.isActive("underline") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        title="밑줄 (Ctrl+U)"
      >
        <span className="write-toolbar-underline-icon">U</span>
      </button>

      {/* Strike */}
      <button
        className={`write-toolbar-btn${editor?.isActive("strike") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        title="취소선"
      >
        <span className="write-toolbar-strike-icon">S</span>
      </button>

      {/* 글자 색상 */}
      <button
        className="write-toolbar-icon-btn write-toolbar-color-btn"
        onClick={() => colorInputRef.current?.click()}
        title="글자 색상"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3l8 18H4L12 3z" />
          <line x1="6.5" y1="14" x2="17.5" y2="14" />
        </svg>
        <input
          ref={colorInputRef}
          type="color"
          className="write-toolbar-color-input"
          onChange={handleColorChange}
          defaultValue="#000000"
        />
      </button>

      <div className="write-toolbar-divider" />

      {/* 정렬 */}
      <button
        className={`write-toolbar-icon-btn${editor?.isActive({ textAlign: "left" }) ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        title="왼쪽 정렬"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z" />
        </svg>
      </button>
      <button
        className={`write-toolbar-icon-btn${editor?.isActive({ textAlign: "center" }) ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        title="가운데 정렬"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z" />
        </svg>
      </button>
      <button
        className={`write-toolbar-icon-btn${editor?.isActive({ textAlign: "right" }) ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        title="오른쪽 정렬"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z" />
        </svg>
      </button>
      <button
        className={`write-toolbar-icon-btn${editor?.isActive({ textAlign: "justify" }) ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        title="양쪽 정렬"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z" />
        </svg>
      </button>

      <div className="write-toolbar-divider" />

      {/* 인용구 */}
      <button
        className={`write-toolbar-icon-btn${editor?.isActive("blockquote") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        title="인용구"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 7H6C4.9 7 4 7.9 4 9v4c0 1.1.9 2 2 2h2l-1.5 2.5c-.3.5.1 1.1.7 1.1H9c.4 0 .7-.2.9-.5L12 15V9c0-1.1-.9-2-2-2zm8 0h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2l-1.5 2.5c-.3.5.1 1.1.7 1.1h1.8c.4 0 .7-.2.9-.5L20 15V9c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      {/* 표 */}
      <button
        className="write-toolbar-icon-btn"
        onClick={handleTableInsert}
        title="표 삽입"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      </button>

      {/* 하이퍼링크 */}
      <button
        className={`write-toolbar-icon-btn${editor?.isActive("link") ? " is-active" : ""}`}
        onClick={handleLinkToggle}
        title="하이퍼링크"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {/* 목록 */}
      <button
        className={`write-toolbar-icon-btn${editor?.isActive("bulletList") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        title="글머리 기호"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="4" cy="6" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="4" cy="18" r="1.5" />
          <path d="M8 5h13v2H8zm0 6h13v2H8zm0 6h13v2H8z" />
        </svg>
      </button>
      <button
        className={`write-toolbar-icon-btn${editor?.isActive("orderedList") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        title="번호 목록"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17h2v.5H4v1h1v.5H3v1h3v-4H3zm1-9h1V4H3v1h1zm-1 3h1.8L3 13.1v.9h3v-1H4.2L6 10.9V10H3zm5-5v2h13V6zm0 6h13v-2H8zm0 6h13v-2H8z" />
        </svg>
      </button>

      {/* 수평선 */}
      <button
        className="write-toolbar-icon-btn"
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        title="수평선"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 11h18v2H3z" />
        </svg>
      </button>

      {/* 코드 스니펫 */}
      <button
        className={`write-toolbar-btn${editor?.isActive("codeBlock") ? " is-active" : ""}`}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        title="코드 스니펫"
      >
        &lt;/&gt;
      </button>

      {/* 링크 URL 입력 모달 */}
      {isLinkModalOpen && (
        <LinkModal
          defaultValue=""
          onConfirm={handleLinkConfirm}
          onClose={() => setIsLinkModalOpen(false)}
        />
      )}

      {/* 업로드 실패 알림 모달 */}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
}

export default Toolbar;
