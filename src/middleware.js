import { NextResponse } from "next/server";

export function middleware(request) {
    if (
        request.nextUrl.pathname === "/parents" ||
        request.nextUrl.pathname === "/parents/"
    ) {
        return NextResponse.next();
    }

    const audience = request.cookies.get("gamanavi_audience")?.value;

    if (audience !== "parents") {
        const url = request.nextUrl.clone();
        const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
        url.pathname = "/kids/parents-gate";
        url.search = "";
        url.searchParams.set("next", nextPath);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/parents/:path*"],
};
