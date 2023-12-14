"use client"

import { useSearchParams, useRouter } from "next/navigation"

interface ScannedIDS {
  [key: string | number]: string
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scanID = searchParams.get("s")
  
  if (scanID) {
    let asidsString = localStorage.getItem("scannedIDS")
    let alreadyScannedIDS = asidsString ? JSON.parse(asidsString) as ScannedIDS : {}

    if (alreadyScannedIDS[scanID]) {
      sessionStorage.setItem("QRID", alreadyScannedIDS[scanID])
    } else {
      sessionStorage.setItem("QRID", scanID)
    }

    router.push("/qr")
    return;
  }

  router.push("/home")
}

