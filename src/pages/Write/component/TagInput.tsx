import { useState, useRef } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const name = raw.startsWith("#") ? raw.slice(1).trim() : raw.trim();
    if (!name || tags.includes(name)) return;
    onChange([...tags, name]);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (inputValue.startsWith("#") && inputValue.length > 1) {
        addTag(inputValue);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      const trimmed = val.trim();
      if (trimmed.startsWith("#") && trimmed.length > 1) {
        addTag(trimmed);
        setInputValue("");
        return;
      }
    }
    setInputValue(val);
  };

  return (
    <div className="write-tag-area" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag, i) => (
        <span key={tag} className="write-tag-chip">
          #{tag}
          <button
            type="button"
            className="write-tag-remove"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="write-tag-input"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={
          tags.length === 0 ? "#태그를 입력하세요 (엔터로 추가)" : ""
        }
      />
    </div>
  );
}

export default TagInput;
