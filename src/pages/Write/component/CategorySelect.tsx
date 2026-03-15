import { useRef, useState, useEffect } from "react";

import type { PostCategory } from "@/types/post";

interface DropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

function Dropdown({
  label,
  isOpen,
  onToggle,
  containerRef,
  children,
}: DropdownProps) {
  return (
    <div className="write-category-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`write-category-trigger${isOpen ? " is-open" : ""}`}
        onClick={onToggle}
      >
        <span>{label}</span>
        <svg
          className="write-category-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isOpen ? (
            <polyline points="18 15 12 9 6 15" />
          ) : (
            <polyline points="6 9 12 15 18 9" />
          )}
        </svg>
      </button>
      {isOpen && <ul className="write-category-list">{children}</ul>}
    </div>
  );
}

export interface CategorySelectProps {
  value: string;
  categories: PostCategory[];
  onChange: (value: string) => void;
}

function CategorySelect({ value, categories, onChange }: CategorySelectProps) {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  const mainCategories = categories.filter((c) => c.slug !== "all");
  const mainSlug = value.includes("/") ? value.split("/")[0] : value;
  const selectedMain = mainCategories.find((c) => c.slug === mainSlug) ?? null;
  const subCategories = selectedMain?.children ?? [];
  const hasChildren = subCategories.length > 0;

  const mainLabel = selectedMain?.name ?? "카테고리";
  const subLabel =
    subCategories.find((c) => c.slug === value)?.name ?? "서브 카테고리";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mainRef.current && !mainRef.current.contains(e.target as Node))
        setIsMainOpen(false);
      if (subRef.current && !subRef.current.contains(e.target as Node))
        setIsSubOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainSelect = (slug: string) => {
    onChange(slug);
    setIsMainOpen(false);
    setIsSubOpen(false);
  };

  const handleSubSelect = (slug: string) => {
    onChange(slug);
    setIsSubOpen(false);
  };

  return (
    <div className="write-category-group">
      <Dropdown
        label={mainLabel}
        isOpen={isMainOpen}
        onToggle={() => setIsMainOpen((p) => !p)}
        containerRef={mainRef}
      >
        <li
          className={`write-category-item${value === "" ? " is-selected" : ""}`}
          onClick={() => handleMainSelect("")}
        >
          카테고리 없음
        </li>
        {mainCategories.map((cat) => (
          <li
            key={cat.slug}
            className={`write-category-item${mainSlug === cat.slug ? " is-selected" : ""}`}
            onClick={() => handleMainSelect(cat.slug)}
          >
            {cat.name}
          </li>
        ))}
      </Dropdown>

      {hasChildren && (
        <Dropdown
          label={subLabel}
          isOpen={isSubOpen}
          onToggle={() => setIsSubOpen((p) => !p)}
          containerRef={subRef}
        >
          {subCategories.map((cat) => (
            <li
              key={cat.slug}
              className={`write-category-item${value === cat.slug ? " is-selected" : ""}`}
              onClick={() => handleSubSelect(cat.slug)}
            >
              {cat.name}
            </li>
          ))}
        </Dropdown>
      )}
    </div>
  );
}

export default CategorySelect;
