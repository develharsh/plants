import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "../styles/globals.css";
import Layout from "../components/layout";
import { DataProvider } from "../store/globalstate";

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  );
}

export default MyApp;
