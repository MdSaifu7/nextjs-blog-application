import Nav from "@/components/web/Navbar";
import React from "react";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
