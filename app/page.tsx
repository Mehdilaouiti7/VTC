import Hero from "@/components/home/Hero";
import QuickBookingForm from "@/components/home/QuickBookingForm";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import CustomRequest from "@/components/home/CustomRequest";
import HowItWorks from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/PricingSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickBookingForm />
      <Services />
      <WhyUs />
      <CustomRequest />
      <HowItWorks />
      <PricingSection />
      <ContactSection />
    </>
  );
}
