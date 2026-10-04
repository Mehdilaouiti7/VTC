import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function CustomRequest() {
  return (
    <section id="devis" className="bg-accent text-bg">
      <div className="container-site py-24">
        <Reveal
          className="grid items-end gap-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}
        >
          <div>
            <span className="eyebrow !text-bg">03 — Trajet sur-mesure</span>
            <h2 className="heading-lg mt-4 text-bg">Un trajet particulier ? Nous nous adaptons.</h2>
          </div>
          <div>
            <p className="text-[17px] font-semibold leading-relaxed mb-8 max-w-xl">
              Plusieurs arrêts, attente sur place, trajet professionnel, transfert aller-retour,
              mise à disposition pour plusieurs heures ou journée complète : indiquez-nous
              simplement vos besoins.
            </p>
            <Link
              href="/devis"
              className="btn bg-bg text-ink hover:bg-accent-100 justify-between w-full sm:w-auto sm:min-w-[320px]"
              style={{ padding: "14px 16px" }}
            >
              Créer une demande personnalisée
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
