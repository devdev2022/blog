import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLoginModal, closeAlertModal } from "@/store/modalSlice";
import LoginModal from "@/components/LoginModal/LoginModal";
import AlertModal from "@/components/AlertModal/AlertModal";

function GlobalModal() {
  const dispatch = useAppDispatch();
  const { loginModal, alertModal } = useAppSelector((state) => state.modal);

  return (
    <>
      {loginModal.open && (
        <LoginModal onClose={() => dispatch(closeLoginModal())} />
      )}
      {alertModal.open && (
        <AlertModal
          message={alertModal.message}
          onClose={() => dispatch(closeAlertModal())}
        />
      )}
    </>
  );
}

export default GlobalModal;
