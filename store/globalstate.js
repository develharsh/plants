import { createContext, useReducer, useEffect } from "react";
import reducers from "./reducers";
import cookie from "js-cookie";
import axios from "axios";
import { ACTIONS } from "./actions";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {};
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  const validateSession = async () => {
    // dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: true });
    const token = cookie.get("token");
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
          dispatch({ type: ACTIONS.AUTH, payload: response.data.user });
        }
      } catch (err) {
        cookie.remove("token");
        dispatch({ type: ACTIONS.AUTH, payload: null });
      }
    } else dispatch({ type: ACTIONS.AUTH, payload: null });
    // dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: false });
  };

  useEffect(() => {
    validateSession();
  }, []);
  useEffect(() => {
    try {
      let cart = cookie.get("cart");
      // alert(cart)
      cart = JSON.parse(cart);
      if (cart) {
        dispatch({ type: "ADD_CART", payload: cart });
      }
    } catch (err) {
      console.log("GlobalState Error Cart");
      dispatch({ type: "ADD_CART", payload: [] });
    }
  }, []);
  useEffect(() => {
    // alert("dummy")
    cookie.set("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
