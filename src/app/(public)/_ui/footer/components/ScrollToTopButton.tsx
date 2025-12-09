'use client';
import { ArrowUpIcon } from '@global/icons/ArrowUpIcon';
import { Button } from "@heroui/react";
import React from 'react';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Posición en píxeles desde la parte superior
      behavior: 'smooth', // Desplazamiento suave
    });
  };

  return (
    <Button
      className="absolute right-0 top-[-5rem] z-30 m-0 h-[5rem] w-[5rem] scale-75 rounded-full bg-slate-800/75 p-0 dark:bg-slate-700/75"
      onClick={scrollToTop}
    >
      <ArrowUpIcon className="m-0 p-0 text-9xl text-slate-400 dark:text-slate-300" />
    </Button>
  );
};

export default ScrollToTopButton;
