import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const sendEmailSchema = z
  .object({
    to: z.union([z.string().email(), z.array(z.string().email())]),
    subject: z.string().min(1, "Subject is required"),
    html: z.string().optional(),
    text: z.string().optional(),
    from: z.string().email().optional(),
  })
  .refine((data) => data.html || data.text, {
    message: "Either html or text content is required",
    path: ["html", "text"],
  });

export async function POST(request: NextRequest) {
  try {
    await auth.protect();
    const body = await request.json();
    const validatedData = sendEmailSchema.parse(body);

    const result = await sendEmail(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Email API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          // details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
