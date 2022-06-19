// import Head from 'next/head'
// import Image from 'next/image'
import styles from "../styles/Home.module.css";
import { useContext } from "react";
import { DataContext } from "../store/globalstate";

export default function Home() {
  const { state } = useContext(DataContext);
  return (
    <div className="container">
      <p>Home</p>
      <p>Name: {state.user?.phone}</p>
    </div>
  );
}
