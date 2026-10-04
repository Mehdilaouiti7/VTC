import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingDetail from "@/components/admin/BookingDetail";
import type { Booking } from "@/lib/types";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();

  if (!booking) notFound();

  return (
    <div className="flex justify-center lg:justify-start">
      <div className="w-full max-w-[520px] lg:border-l-2 border-divider">
        <BookingDetail booking={booking as Booking} />
      </div>
    </div>
  );
}
