import { Redirect, deleteCookies } from "../../utils/hardcoded";
import axios from "axios";
import { useContext } from "react";
import { DataContext } from "../../store/globalstate";
import Link from "next/link";

function Index() {
  const { state } = useContext(DataContext);

  return (
    <>
      <Link href="/s/add/plant">Add Plant</Link>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const token = req.cookies.token;
  if (!token) return Redirect("/");
  if (token) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.baseUrl}/api/auth/load-user`,
        headers: {
          "x-access-token": token,
        },
      });
      if (response.data.success && response.data.user.role === "Supplier") {
      } else return Redirect("/");
    } catch (err) {
      res.setHeader(...deleteCookies(["token"]));
      return Redirect("/");
    }
  }

  return { props: {} };
}

export default Index;
