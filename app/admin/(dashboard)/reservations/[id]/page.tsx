import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BookingDetail from "@/components/admin/BookingDetail";
import type { Booking } from "@/lib/types";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();

  if (!booking) notFound();

  return (
    <div>
      <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-sm text-anthracite/50 hover:text-anthracite mb-6">
        <ArrowLeft size={16} /> Retour aux réservations
      </Link>
      <h1 className="heading-md mb-8">
        {booking.first_name} {booking.last_name}
      </h1>
      <BookingDetail booking={booking as Booking} />
    </div>
  );
}
