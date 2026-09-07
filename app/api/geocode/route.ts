import { NextResponse } from "next/server";

// Proxies the French national address database (BAN — Base Adresse Nationale),
// a free, keyless, CORS-friendly API. No account or API key required, and it
// covers French addresses (streets, airports, stations) with good accuracy.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await res.json();
    const suggestions: string[] = Array.isArray(data.features)
      ? data.features
          .map((feature: { properties?: { label?: string } }) => feature.properties?.label)
          .filter((label: unknown): label is string => typeof label === "string")
      : [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Erreur géocodage", error);
    return NextResponse.json({ suggestions: [] });
  }
}
