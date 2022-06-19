import { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../store/globalstate";
import { ACTIONS } from "../../store/actions";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { Redirect, deleteCookies } from "../../utils/hardcoded";
import Loading from "../../components/design/Loading";
import Link from "next/link";
import { State, City } from "country-state-city";

function Register() {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const [states, setStates] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({
    company: "",
    state: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });
  function handleSelect(value, key) {
    if (value === "") return;
    let newState = { ...values, [key]: value };
    if (key === "state") {
      setCities(City.getCitiesOfState("IN", value));
      newState.city = "";
      alert(`Selected State: ${value}`);
    } else alert(`Selected City: ${value}`);
    setValues(newState);
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
        url: "/api/s/register",
        data: values,
      });
      dispatch({ type: ACTIONS.LOADING, payload: false });
      const { success, token, message, user } = response.data;
      if (success && token && message && user) {
        cookie.set("token", token);
        dispatch({ type: ACTIONS.NOTIFY, payload: { bg: "success", message } });
        dispatch({ type: ACTIONS.AUTH, payload: user });
        router.push("/s");
      }
    } catch (err) {
      dispatch({ type: ACTIONS.LOADING, payload: false });
      dispatch({
        type: ACTIONS.NOTIFY,
        payload: { bg: "error", message: err.response.data.message },
      });
    }
  }
  return (
    <>
      <div className="flex flex-wrap justify-evenly s_register_main_div">
        <div>
          <img className="s_register_tile" src="/signupBg.png" alt="" />
        </div>
        <div className="shadow-2xl rounded p-7 s_register_input_div">
          <h1 className="mb-3 font-medium leading-tight text-2xl">
            Registration
          </h1>
          <input
            type="text"
            className="my-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            name="company"
            value={values.company}
            onChange={handleChange}
            placeholder="*Name of Company/Business"
          />
          <States states={states} handleSelect={handleSelect} />
          <Cities cities={cities} handleSelect={handleSelect} />
          <input
            type="text"
            className="my-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            name="address"
            value={values.address}
            onChange={handleChange}
            placeholder="*Sector/Area/Plot..."
          />
          <input
            type="email"
            className="my-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="tel"
            className="my-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="*Phone"
          />
          <input
            type="password"
            className="my-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="*Password"
          />
          <div className="flex items-center">
            <button
              disabled={state?.loading}
              onClick={handleSubmit}
              className="mr-5 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Register
            </button>
            <Loading />
            <Link href="login">Have an account?</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function States({ states, handleSelect }) {
  return (
    <select
      onChange={(e) => handleSelect(e.target.value, "state")}
      name="state"
      className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      my-3
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      aria-label="Default select example"
    >
      <option value="">*State</option>
      {states.map((each, idx) => (
        <option key={idx} value={each.isoCode}>
          {each.name}
        </option>
      ))}
    </select>
  );
}

function Cities({ cities, handleSelect }) {
  return (
    <select
      onChange={(e) => handleSelect(e.target.value, "city")}
      name="city"
      className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      my-3
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      aria-label="Default select example"
    >
      <option value="">*City</option>
      {cities.map((each, idx) => (
        <option key={idx} value={each.name}>
          {each.name}
        </option>
      ))}
    </select>
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

export default Register;
