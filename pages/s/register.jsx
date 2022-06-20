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
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

function Register() {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const [states, setStates] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({
    company: "",
    stateLabel: null,
    state: "",
    city: "",
    cityLabel: null,
    address: "",
    email: "",
    phone: "",
    password: "",
  });
  function handleSelect(value, key) {
    let newState = { ...values };
    if (key === "state") {
      newState.stateLabel = value;
      newState.state = value.name;
      setCities(City.getCitiesOfState("IN", value.isoCode));
      newState.city = "";
      newState.cityLabel = null;
      alert(`Selected State: ${value.name}`);
    } else {
      newState.city = value.name;
      newState.cityLabel = value;
      alert(`Selected City: ${value.name}`);
    }
    setValues(newState);
  }
  function handleChange(e) {
    dispatch({ type: ACTIONS.NOTIFY, payload: null });
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  async function handleSubmit() {
    dispatch({ type: ACTIONS.LOADING, payload: true });
    delete values.stateLabel;
    delete values.cityLabel;
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
        dispatch({ type: ACTIONS.NOTIFY, payload: ["success", message] });
        dispatch({ type: ACTIONS.AUTH, payload: user });
        router.push("/s");
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
      <div className="sregisterMainDiv flex flex-wrap justify-content-evenly">
        <div>
          <img src="/signupBg.png" alt="" className="sregisterTile" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card shadow-2 border-round sregisterCard">
            <div className="text-center mb-3">
              <div className="text-900 text-3xl font-medium mb-3">
                Registration
              </div>
              <span className="text-600 font-medium line-height-3">
                Already have an Account?
              </span>
              <Link href="/s/login">
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                  Log In!
                </a>
              </Link>
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-900 font-medium mb-2"
              >
                Name of Company/Business
              </label>
              <InputText
                name="company"
                value={values.company}
                onChange={handleChange}
                id="company"
                type="text"
                className="w-full mb-3"
                placeholder="Required"
              />
              <div className="mb-3">
                <States
                  states={states}
                  values={values}
                  handleSelect={handleSelect}
                />
              </div>
              <div className="mb-3">
                <Cities
                  cities={cities}
                  values={values}
                  handleSelect={handleSelect}
                />
              </div>
              <label
                htmlFor="address"
                className="block text-900 font-medium mb-2"
              >
                Sector/Plot/Area
              </label>
              <InputText
                name="address"
                value={values.address}
                onChange={handleChange}
                id="address"
                type="text"
                className="w-full mb-3"
                placeholder="Required"
              />
              <label
                htmlFor="email"
                className="block text-900 font-medium mb-2"
              >
                Email
              </label>
              <InputText
                name="email"
                value={values.email}
                onChange={handleChange}
                id="email"
                type="email"
                className="w-full mb-3"
                placeholder="Optional"
              />
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
                placeholder="Required"
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
                className="w-full"
                feedback={false}
                toggleMask
                placeholder="Required"
              />
              {/* <InputText id="password" type="password" className="w-full mb-3" /> */}

              <div className="flex align-items-center justify-content-between my-2">
                <Loading />
              </div>

              <Button
                disabled={state.loading}
                onClick={handleSubmit}
                label="Create an Account"
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

function States({ values, states, handleSelect }) {
  // onChange={(e) => handleSelect(e.target.value, "state")}
  return (
    <Dropdown
      value={values.stateLabel}
      options={states}
      onChange={(e) => handleSelect(e.target.value, "state")}
      optionLabel="name"
      filter
      filterBy="name"
      placeholder="Select a State"
      // valueTemplate={selectedCountryTemplate}
      // itemTemplate={countryOptionTemplate}
      className="w-full"
    />
  );
}

function Cities({ values, cities, handleSelect }) {
  return (
    <Dropdown
      value={values.cityLabel}
      options={cities}
      onChange={(e) => handleSelect(e.target.value, "city")}
      optionLabel="name"
      filter
      filterBy="name"
      placeholder="Select a City"
      // valueTemplate={selectedCountryTemplate}
      // itemTemplate={countryOptionTemplate}
      className="w-full"
    />
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
