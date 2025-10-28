import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();
        const signInResponse = await auth.api.signInEmail({
            returnHeaders: true,
            body: {
                email,
                password,
            },
        });

        if (signInResponse) {
            return NextResponse.json({ message: "Sign in successful" , data: signInResponse }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
}