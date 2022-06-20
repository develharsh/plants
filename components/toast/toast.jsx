// import {  } from "react";
import { useRef, useContext, useEffect } from "react";
import { DataContext } from "../../store/globalstate";
import { ACTIONS } from "../../store/actions";
import { Toast } from "primereact/toast";

function ToastC() {
  const map = {
    success: "Woho",
    error: "Oops",
    info: "Hey",
    warn: "Warning",
  };
  const toast = useRef(null);
  const { state, dispatch } = useContext(DataContext);
  const { notify } = state;
  useEffect(() => {
    if (notify) {
      toast.current.show({
        severity: notify[0],
        summary: map[notify[0]],
        detail: notify[1],
        life: 3000,
      });
      setTimeout(() => {
        dispatch({ type: ACTIONS.NOTIFY, payload: null });
      }, 3000);
    }
  }, [dispatch, notify]);

  return (
    <>
      <Toast ref={toast} />
    </>
  );
}

export default ToastC;
