import ContactSection from "@/components/ContactSection";
import InteractiveContactForm from "@/components/InteractiveContactForm";

export default function ContactPage() {
  return (
    <main id="main" className="page-main">
      <InteractiveContactForm />
      <ContactSection />
    </main>
  );
}
