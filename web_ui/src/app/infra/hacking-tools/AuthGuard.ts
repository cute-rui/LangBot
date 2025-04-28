"use client";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

//TODO: FINISH THESE
export function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  return token !== null;
}

export function setLoginToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearLoginToken() {
  localStorage.removeItem("token");
}

//TODO: CALL THIS FUNCTION AT BEFORE MOUNT
export const AuthGuard = (props: PropsWithChildren) => {
  const router = useRouter();
  const ok = isLoggedIn();

  if (typeof window !== "undefined" && !ok) router.push("/");

  return props.children;
};
