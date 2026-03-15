interface AlertModalProps {
  message: string;
  onClose: () => void;
}

function AlertModal({ message, onClose }: AlertModalProps) {
  return (
    <div className="write-alert-overlay" onClick={onClose}>
      <div className="write-alert" onClick={(e) => e.stopPropagation()}>
        <p className="write-alert-message">{message}</p>
        <div className="write-alert-actions">
          <button className="write-alert-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
