import { useState } from "react";
import type { DraftListItem } from "@/types/post";

interface DraftListModalProps {
  drafts: DraftListItem[];
  total: number;
  currentDraftId: string | null;
  onClose: () => void;
  onLoad: (id: string) => void;
  onDelete?: (ids: string[]) => void;
}

function formatDraftDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function DraftListModal({
  drafts,
  total,
  currentDraftId,
  onClose,
  onLoad,
  onDelete,
}: DraftListModalProps) {
  const [pendingLoadId, setPendingLoadId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<"all" | "selected" | null>(
    null,
  );

  const deletableAll = drafts.filter((d) => d.id !== currentDraftId);
  const deletableSelected = [...selectedIds];

  const handleItemClick = (id: string) => {
    if (isEditMode) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      return;
    }
    if (id === currentDraftId) return;
    setPendingLoadId(id);
  };

  const handleConfirmLoad = () => {
    if (pendingLoadId) {
      onLoad(pendingLoadId);
      setPendingLoadId(null);
    }
  };

  const handleEditMode = () => {
    setIsEditMode(true);
    setSelectedIds(new Set());
  };

  const handleDone = () => {
    setIsEditMode(false);
    setSelectedIds(new Set());
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm === "all") {
      onDelete?.(deletableAll.map((d) => d.id));
    } else if (deleteConfirm === "selected") {
      onDelete?.(deletableSelected);
    }
    setDeleteConfirm(null);
    setIsEditMode(false);
    setSelectedIds(new Set());
  };

  const getDeleteConfirmMessage = () => {
    if (deleteConfirm === "all") {
      const count = deletableAll.length;
      if (currentDraftId && drafts.some((d) => d.id === currentDraftId)) {
        return `현재 작성중인 글을 제외한 ${count}개의 임시저장 글 전체를 삭제하시겠습니까?\n삭제된 글은 복구되지 않습니다.`;
      }
      return `${count}개의 임시저장 글 전체를 삭제하시겠습니까?\n삭제된 글은 복구되지 않습니다.`;
    }
    return `선택한 ${deletableSelected.length}개의 임시저장 글을 삭제하시겠습니까?\n삭제된 글은 복구되지 않습니다.`;
  };

  return (
    <div className="draft-list-overlay" onClick={onClose}>
      <div className="draft-list-panel" onClick={(e) => e.stopPropagation()}>
        <div className="draft-list-header">
          <h2 className="draft-list-title">임시저장 글</h2>
          <button className="draft-list-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="draft-list-meta">
          {isEditMode ? (
            <>
              <span className="draft-list-count">
                총 {selectedIds.size}개 선택됨
              </span>
              <div className="draft-list-edit-actions">
                <button
                  className="draft-list-action-btn"
                  onClick={() => setDeleteConfirm("all")}
                  disabled={deletableAll.length === 0}
                >
                  전체 삭제
                </button>
                <button
                  className="draft-list-action-btn"
                  onClick={() => setDeleteConfirm("selected")}
                  disabled={selectedIds.size === 0}
                >
                  선택 삭제
                </button>
                <button className="draft-list-action-btn" onClick={handleDone}>
                  완료
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="draft-list-count">총 {total}개</span>
              {drafts.length > 0 && (
                <button
                  className="draft-list-edit-btn"
                  onClick={handleEditMode}
                >
                  편집
                </button>
              )}
            </>
          )}
        </div>

        <div className="draft-list-items">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className={`draft-list-item${selectedIds.has(draft.id) ? " is-selected" : ""}${draft.id === currentDraftId ? " is-current" : ""}`}
              onClick={() => handleItemClick(draft.id)}
            >
              {isEditMode && (
                <input
                  type="checkbox"
                  className="draft-list-checkbox"
                  checked={selectedIds.has(draft.id)}
                  onChange={() => {}}
                />
              )}
              <div className="draft-list-item-info">
                <p className="draft-list-item-title">
                  {draft.title || "(제목 없음)"}
                </p>
                <p className="draft-list-item-date">
                  {formatDraftDate(draft.createdAt)}
                </p>
              </div>
              {draft.id === currentDraftId && (
                <span className="draft-list-item-badge">작성중</span>
              )}
            </div>
          ))}
          {drafts.length === 0 && (
            <p className="draft-list-empty">임시저장된 글이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 불러오기 확인 팝업 */}
      {pendingLoadId && (
        <div
          className="draft-list-confirm-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="draft-list-confirm">
            <p className="draft-list-confirm-message">
              작성 중인 내용을 임시저장하고 선택한 문서를 불러오시겠습니까?
            </p>
            <div className="draft-list-confirm-actions">
              <button
                className="draft-list-confirm-cancel"
                onClick={() => setPendingLoadId(null)}
              >
                취소
              </button>
              <button
                className="draft-list-confirm-ok"
                onClick={handleConfirmLoad}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 팝업 */}
      {deleteConfirm && (
        <div
          className="draft-list-confirm-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="draft-list-confirm">
            <p className="draft-list-confirm-message">
              {getDeleteConfirmMessage()}
            </p>
            <div className="draft-list-confirm-actions">
              <button
                className="draft-list-confirm-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                취소
              </button>
              <button
                className="draft-list-confirm-ok"
                onClick={handleConfirmDelete}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DraftListModal;
