"use client";

import { isLoggedIn } from "./infra/hacking-tools/AuthGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, []);

  return <div className={``}></div>;
}
