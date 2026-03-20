import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

//types
import type { CategoryItem } from "@/types/post";

//components
import Toolbar from "@/pages/Write/component/Toolbar";
import CategorySelect from "@/pages/Write/component/CategorySelect";
import PreviewModal from "@/pages/Write/component/PreviewModal";
import TagInput from "@/pages/Write/component/TagInput";
import AlertModal from "@/components/AlertModal/AlertModal";

interface WritePageViewProps {
  editor: Editor | null;
  title: string;
  category: string;
  tags: string[];
  tempSaveCount: number;
  isTempSaveDisabled: boolean;
  categories: CategoryItem[];
  alertMessage: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onTempSave: () => void;
  onPublish: () => void;
  onCancel: () => void;
  onVideoAdd: (blobUrl: string, file: File) => void;
  onAlertClose: () => void;
}

function WritePageView({
  editor,
  title,
  category,
  tags,
  tempSaveCount,
  isTempSaveDisabled,
  categories,
  alertMessage,
  onTitleChange,
  onCategoryChange,
  onTagsChange,
  onTempSave,
  onPublish,
  onCancel,
  onVideoAdd,
  onAlertClose,
}: WritePageViewProps) {
  return (
    <div className="write-page">
      {alertMessage && <AlertModal message={alertMessage} onClose={onAlertClose} />}
      {/* 상단 툴바 */}
      <Toolbar editor={editor} onVideoAdd={onVideoAdd} />

      {/* 콘텐츠 영역 */}
      <div className="write-content">
        <div className="write-inner">
          {/* 카테고리 선택 */}
          <CategorySelect
            value={category}
            categories={categories}
            onChange={onCategoryChange}
          />

          {/* 제목 입력 */}
          <input
            type="text"
            className="write-title-input"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />

          {/* 구분선 */}
          <hr className="write-divider" />

          {/* TipTap 에디터 */}
          <EditorContent editor={editor} className="write-editor-wrapper" />

          {/* 태그 입력 */}
          <hr className="write-divider write-tag-divider" />
          <TagInput tags={tags} onChange={onTagsChange} />
        </div>
      </div>

      {/* 하단 바 */}
      <div className="write-bottom-bar">
        <div className="write-bottom-left">
          <button className="write-cancel-btn" onClick={onCancel}>
            취소
          </button>
        </div>

        <div className="write-bottom-right">
          <PreviewModal title={title} editor={editor} />
          <button
            className="write-temp-save-btn"
            onClick={onTempSave}
            disabled={isTempSaveDisabled}
          >
            임시저장
            <span className="write-temp-badge">{tempSaveCount}</span>
          </button>
          <button className="write-publish-btn" onClick={onPublish}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default WritePageView;
