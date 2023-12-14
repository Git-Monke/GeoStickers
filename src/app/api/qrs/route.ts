import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

function newErrorResponse(message: string, error: string, status: number) {
    let response = NextResponse.json({
        error: error,
        message: message
    }, {status: status, headers: {'Access-Control-Allow-Origin': '*'}})
    return response
}

const containsNonNumeric = /[^0-9]/

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
        return newErrorResponse("Expected an 'id' field in JSON body.", "Bad Request", 400)
    }

    const isNumeric = !containsNonNumeric.test(id);

    let qr = await prisma.qR.findUnique({
        where: isNumeric ? {
            index: parseInt(id)
        } : {
            id: id
        }
    });

    if (!qr) {
        return newErrorResponse("The requested id could not be found", "Not Found", 404);
    }

    if (!isNumeric) {
        await prisma.qR.update({
            where: {
                id: id
            },
            data: {
                scans: {
                    increment: 1
                }
            }
        })
    }

    return new Response(JSON.stringify(qr), {status: 200, headers: {'Access-Control-Allow-Origin': "*"}});
}
