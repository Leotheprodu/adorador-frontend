"use client";
import { ArrowUpIcon } from "@/global/icons/ArrowUpIcon";
import { Button } from "@nextui-org/react";
import React from "react";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Posición en píxeles desde la parte superior
      behavior: "smooth", // Desplazamiento suave
    });
  };

  return (
    <Button
      className=" bg-slate-800/75 absolute rounded-full p-0 m-0 w-[5rem] h-[5rem] right-0 top-[-5rem] scale-75 z-30"
      onClick={scrollToTop}
    >
      <ArrowUpIcon className="text-9xl p-0 m-0 text-slate-400" />
    </Button>
  );
};

export default ScrollToTopButton;
