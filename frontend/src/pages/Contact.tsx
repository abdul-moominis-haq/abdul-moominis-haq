import NavBar from "@/components/NavBar";
import ContactSection from "@/components/ContactSection";
import InteractiveContactForm from "@/components/InteractiveContactForm";

export default function ContactPage() {
  return (
    <div>
      <NavBar />
      <main>
        <InteractiveContactForm />
        <ContactSection />
      </main>
    </div>
  );
}
