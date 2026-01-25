import { NextResponse } from "next/server";

export function middleware(request) {
    const audience = request.cookies.get("gamanavi_audience")?.value;

    if (audience !== "parents") {
        const url = request.nextUrl.clone();
        url.pathname = "/kids/parents-gate";
        url.search = "";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/parents/:path*"],
};
