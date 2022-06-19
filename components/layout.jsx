import Head from "next/head";
import Navbar from "./design/Navbar";
import Footer from "./design/Footer";
import GlobalLoading from "./design/GlobalLoading";
import Toast from "./toast/toast";

import { useContext } from "react";
import { DataContext } from "../store/globalstate";
import Router from "next/router";
import { ACTIONS } from "../store/actions";

function layout({ children }) {
  const { dispatch } = useContext(DataContext);
  Router.events.on("routeChangeStart", (url) => {
    dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: true });
  });
  Router.events.on("routeChangeComplete", (url) => {
    dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: false });
  });
  return (
    <>
      <Head>
        {/* <link rel="shortcut icon" href="/logosm2.png" type="image/x-icon" /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
      </Head>
      <Navbar />
      <GlobalLoading />
      <Toast />
      {/* <Loading show={routeChanged} /> */}
      {children}
      <Footer />
    </>
  );
}

export default layout;
