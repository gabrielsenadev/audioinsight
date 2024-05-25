"use client";

import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes } from "react";

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  title: string;
}

export function Header({ className, title, ...props }: HeaderProps) {
  const router = useRouter();

  const pushToHome = () => {
    router.push('/');
  };

  return (
    <header className={`self-start max-w-full ${className}`} {...props}>
      <button className="flex items-center hover:underline transition-all hover:text-sky-700" onClick={pushToHome} type="button"><IconChevronLeft /> Go back</button>
      <h1 className="text-[1.75rem] font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{title}</h1>
    </header>
  )
}