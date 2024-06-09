import { auth } from "auth"
import { NextResponse } from 'next/server';
import { createUser } from "@/db";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE

    console.log({ username, email, password });
    const response = await createUser(username,email,password);
    console.log("Post response is: " , response);
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}