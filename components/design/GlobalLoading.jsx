import { useContext } from "react";
import { DataContext } from "../../store/globalstate";

function GlobalLoading() {
  const { state } = useContext(DataContext);
  const { globalLoading } = state;
  return <>{globalLoading && <Loading />}</>;
}

function Loading() {
  return (
    <div
      className="fixed w-full h-full text-center loading"
      style={{ background: "#0008", color: "#fff", top: 0, left: 0, zIndex: 5 }}
    >
      <svg width="205" height="250" viewBox="0 0 40 50">
        <polygon
          strokeWidth="1"
          stroke="#fff"
          fill="none"
          points="20, 1 40,40 1,40"
        ></polygon>
        <text fill="#fff" x="5" y="47">
          Loading
        </text>
      </svg>
    </div>
  );
}

export default GlobalLoading;
