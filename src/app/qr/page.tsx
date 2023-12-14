"use client"

import { useState, useEffect } from "react";
import { formatDistanceToNow, format, parseISO } from "date-fns";

const converter = require("number-to-words")

interface Data {
    id: string,
    index: number,
    createdAt: string,
    lastScanned: string,
    scans: number
}

const dateFormatString = "EEEE, MMMM do, yyyy, 'at' h:mm a";

export default function Page() {
    const [data, setData] = useState<Data | null>(null)

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [redirectedByScan, setRedirect] = useState(false)

    useEffect(() => {
        async function run() {
            const QRID = sessionStorage.getItem("QRID") || "";

            if (QRID === "") {
                return;
            }

            setRedirect((/[^0-9]/).test(QRID))

            sessionStorage.setItem("QRID", "")

            let response = await fetch(new Request("http://localhost:3000/api/qrs?id=" + QRID))
            let data = await response.json();

            if (response.status != 200) {
                setError(true);
                setErrorMessage(data.message);
            }

            setData(data)
        }
        run()
    }, [])

    if (error) {
        return <h1>{errorMessage}</h1>
    }

    if (!data) {
        return <h1>Loading data...</h1>
    }

    const scans = data.scans + (redirectedByScan ? 1 : 0)

    return (
        <>
            <h1>This is the {converter.toOrdinal(data.index)} QR (world-wide)</h1>
            {redirectedByScan ? <h1>You're the {converter.toWordsOrdinal(scans)} person to scan this QR!</h1> : <h1>This QR has been scanned {(scans).toLocaleString()} time{scans !== 1 ? "s" : ""}!</h1>}
            <h1>It was created on {format(parseISO(data.createdAt), dateFormatString)} ({formatDistanceToNow(parseISO(data.createdAt), {addSuffix: true})})</h1>
            {scans === 0 ? <h1>This QR has never been scanned!</h1> : scans === 1 && redirectedByScan ? <h1>You're the first person to scan this QR!</h1> : <h1>It was last scanned {formatDistanceToNow(parseISO(data.lastScanned), {addSuffix: true})}</h1>}
        </>
    )
}