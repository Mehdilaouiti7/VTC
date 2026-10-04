import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { createBooking } from "@/lib/bookings";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await createBooking(parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ booking: result.booking }, { status: 201 });
}
