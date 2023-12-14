"use client"

import { useSearchParams, useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scanID = searchParams.get("s")
  
  if (scanID) {
    sessionStorage.setItem("QRID", scanID)
    router.push("/qr")
    return;
  }

  router.push("/home")
}

