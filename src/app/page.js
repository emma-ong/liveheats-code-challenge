"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BUTTON } from "./constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(BUTTON.PATHS.CREATE);
  }, [router]);

  return null;
}
