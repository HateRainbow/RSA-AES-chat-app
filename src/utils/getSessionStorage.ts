"use client";

import type { UserData } from "../../types/types";

export function getUserData(): UserData {
  const userData = sessionStorage.getItem("user");
  if (!userData) throw new Error("NO user data");

  return JSON.parse(userData) as UserData;
}
