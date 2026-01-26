import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Sesuaikan path Navbar Anda

export default function UserLayout() {
  return (
    <>
      {/* Navbar hanya muncul di layout ini */}
      <Navbar /> 
      
      {/* Outlet adalah tempat halaman (Home, Login, Menu) dirender */}
      <main>
        <Outlet />
      </main>
    </>
  );
}