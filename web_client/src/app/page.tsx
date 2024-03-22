"use client";

import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import MenuPage from "./components/MenuPage/MenuPage";


export default function Home() {

  return (
    <div className="App">
      <Navbar />
            <MenuPage
            />
      <Footer />
    </div>
  );
}
