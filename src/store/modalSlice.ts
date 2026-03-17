import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  loginModal: { open: boolean };
  alertModal: { open: boolean; message: string };
}

const initialState: ModalState = {
  loginModal: { open: false },
  alertModal: { open: false, message: "" },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.loginModal.open = true;
    },
    closeLoginModal: (state) => {
      state.loginModal.open = false;
    },
    openAlertModal: (state, action: PayloadAction<string>) => {
      state.alertModal.open = true;
      state.alertModal.message = action.payload;
    },
    closeAlertModal: (state) => {
      state.alertModal.open = false;
      state.alertModal.message = "";
    },
  },
});

export const { openLoginModal, closeLoginModal, openAlertModal, closeAlertModal } =
  modalSlice.actions;
export default modalSlice.reducer;
