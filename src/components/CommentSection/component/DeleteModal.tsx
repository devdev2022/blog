interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="comment-modal-overlay" onClick={onCancel}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <p className="comment-modal-title">댓글 삭제</p>
        <p className="comment-modal-msg">댓글을 삭제하시겠습니까?</p>
        <div className="comment-form-actions">
          <button type="button" className="comment-btn-cancel" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="comment-btn-danger" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
