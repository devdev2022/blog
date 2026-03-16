interface WithdrawalModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function WithdrawalModal({ onConfirm, onCancel }: WithdrawalModalProps) {
  return (
    <div className="account-modal-overlay" onClick={onCancel}>
      <div className="account-modal" onClick={(e) => e.stopPropagation()}>
        <p className="account-modal-title">정말 탈퇴하시겠습니까?</p>
        <p className="account-modal-msg">
          탈퇴 시 작성한 모든 게시물과 댓글이 삭제되며 복구할 수 없습니다.
        </p>
        <div className="account-modal-actions">
          <button
            type="button"
            className="account-modal-btn-cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="account-modal-btn-danger"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalModal;
