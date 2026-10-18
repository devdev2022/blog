interface AlertModalProps {
  message: string;
  onClose: () => void;
}

function AlertModal({ message, onClose }: AlertModalProps) {
  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <p className="alert-modal-message">{message}</p>
        <div className="alert-modal-actions">
          <button className="alert-modal-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
