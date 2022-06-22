import { useContext, useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { DataContext } from "../../store/globalstate";
import { ACTIONS } from "../../store/actions";
import cookie from "js-cookie";
import Router from "next/router";

export default function MenubarDemo() {
  function logOutNow() {
    dispatch({ type: ACTIONS.AUTH, payload: null });
    cookie.remove("token");
  }
  const { dispatch, state } = useContext(DataContext);
  const logOutItem = {
    label: "Log Out",
    icon: "pi pi-fw pi-power-off",
    command: () => {
      logOutNow();
    },
  };

  const logInItem = {
    label: "Log In",
    icon: "pi pi-fw pi-sign-in",
    command: () => {
      Router.push("/login");
    },
  };
  const items = [
    {
      label: "File",
      icon: "pi pi-fw pi-file",
      items: [
        {
          label: "New",
          icon: "pi pi-fw pi-plus",
          items: [
            {
              label: "Bookmark",
              icon: "pi pi-fw pi-bookmark",
            },
            {
              label: "Video",
              icon: "pi pi-fw pi-video",
            },
          ],
        },
        {
          label: "Delete",
          icon: "pi pi-fw pi-trash",
        },
        {
          separator: true,
        },
        {
          label: "Export",
          icon: "pi pi-fw pi-external-link",
        },
      ],
    },
    {
      label: "Edit",
      icon: "pi pi-fw pi-pencil",
      items: [
        {
          label: "Left",
          icon: "pi pi-fw pi-align-left",
        },
        {
          label: "Right",
          icon: "pi pi-fw pi-align-right",
        },
        {
          label: "Center",
          icon: "pi pi-fw pi-align-center",
        },
        {
          label: "Justify",
          icon: "pi pi-fw pi-align-justify",
        },
      ],
    },
    {
      label: "Users",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "New",
          icon: "pi pi-fw pi-user-plus",
        },
        {
          label: "Delete",
          icon: "pi pi-fw pi-user-minus",
        },
        {
          label: "Search",
          icon: "pi pi-fw pi-users",
          items: [
            {
              label: "Filter",
              icon: "pi pi-fw pi-filter",
              items: [
                {
                  label: "Print",
                  icon: "pi pi-fw pi-print",
                },
              ],
            },
            {
              icon: "pi pi-fw pi-bars",
              label: "List",
            },
          ],
        },
      ],
    },
    {
      label: "Events",
      icon: "pi pi-fw pi-calendar",
      items: [
        {
          label: "Edit",
          icon: "pi pi-fw pi-pencil",
          items: [
            {
              label: "Save",
              icon: "pi pi-fw pi-calendar-plus",
            },
            {
              label: "Delete",
              icon: "pi pi-fw pi-calendar-minus",
            },
          ],
        },
        {
          label: "Archieve",
          icon: "pi pi-fw pi-calendar-times",
          items: [
            {
              label: "Remove",
              icon: "pi pi-fw pi-calendar-minus",
            },
          ],
        },
      ],
    },
  ];
  const [data, setData] = useState(items);
  const { user } = state;
  useEffect(() => {
    if (user === null) {
      setData([...items, logInItem]);
    } else if (user) setData([...items, logOutItem]);
  }, [dispatch, user]);

  const start = (
    <img
      alt="logo"
      src="/vercel.svg"
      height="40"
      width="70"
      className="mr-2"
    ></img>
  );
  const end = <InputText placeholder="Search" type="text" />;

  return (
    <div>
      <div className="card fixed w-full z-1">
        <Menubar model={data} start={start} end={end} className="bg-white" />
      </div>
      <div className="heightBelowNav"></div>
    </div>
  );
}
