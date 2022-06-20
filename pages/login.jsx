import { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../store/globalstate";
import { ACTIONS } from "../store/actions";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { Redirect, deleteCookies } from "../utils/hardcoded";
import Loading from "../components/design/Loading";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

function Login() {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const [values, setValues] = useState({
    phone: "",
    password: "",
  });
  function handleSwitch() {
    dispatch({ type: ACTIONS.NOTIFY, payload: null });
    setValues({ ...values, checked: !values.checked });
  }
  function handleChange(e) {
    dispatch({ type: ACTIONS.NOTIFY, payload: null });
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  async function handleSubmit() {
    dispatch({ type: ACTIONS.LOADING, payload: true });
    try {
      const response = await axios({
        method: "POST",
        url: "/api/login",
        data: values,
      });
      dispatch({ type: ACTIONS.LOADING, payload: false });
      const { success, token, message, user } = response.data;
      if (success && token && message && user) {
        cookie.set("token", token);
        dispatch({ type: ACTIONS.NOTIFY, payload: ["success", message] });
        dispatch({ type: ACTIONS.AUTH, payload: user });
        router.push("/");
      }
    } catch (err) {
      dispatch({ type: ACTIONS.LOADING, payload: false });
      dispatch({
        type: ACTIONS.NOTIFY,
        payload: ["error", err.response.data.message],
      });
    }
  }
  return (
    <>
      <div className="loginMainDiv flex flex-wrap justify-content-evenly">
        <div>
          <img src="loginBg.png" alt="" className="loginTile" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-2 border-round">
            <div className="text-center mb-5">
              <img src="loginBg.png" alt="hyper" height={50} className="mb-3" />
              <div className="text-900 text-3xl font-medium mb-3">Log In</div>
              <span className="text-600 font-medium line-height-3">
                Don't have an account?
              </span>
              <Link href="/register">
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                  Create today!
                </a>
              </Link>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-900 font-medium mb-2"
              >
                Phone
              </label>
              <InputText
                name="phone"
                value={values.phone}
                onChange={handleChange}
                id="phone"
                type="number"
                className="w-full mb-3"
              />

              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2"
              >
                Password
              </label>
              <Password
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full mb-3"
                feedback={false}
                toggleMask
              />
              {/* <InputText id="password" type="password" className="w-full mb-3" /> */}

              <div className="flex align-items-center justify-content-between mb-6">
                <Loading />
                <Link href="/forgot-password">
                  <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                    Forgot your password?
                  </a>
                </Link>
              </div>

              <Button
                disabled={state.loading}
                onClick={handleSubmit}
                label="Sign In"
                icon="pi pi-user"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const token = req.cookies.token;
  if (token) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.baseUrl}/api/auth/load-user`,
        headers: {
          "x-access-token": token,
        },
      });
      if (response.data.success) {
        return Redirect("/");
      }
    } catch (err) {
      res.setHeader(...deleteCookies(["token"]));
    }
  }

  return { props: {} };
}

export default Login;
