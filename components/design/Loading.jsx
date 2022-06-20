import { useContext } from "react";
import { DataContext } from "../../store/globalstate";
import { ProgressSpinner } from "primereact/progressspinner";

function Loading() {
  const { state } = useContext(DataContext);
  const { loading } = state;
  return <>{loading && <Loader />}</>;
}

function Loader() {
  return (
    <ProgressSpinner
      style={{ width: "50px", height: "50px" }}
      strokeWidth="4"
      fill="transparent"
      animationDuration=".5s"
    />
  );
}

export default Loading;
