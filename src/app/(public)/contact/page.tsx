import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactMapSection from "@/components/contact/ContactMapSection";
import React from "react";

export default function contactPage() {
  return (
    <div>
      <ContactHero></ContactHero>
      <ContactInfoCards></ContactInfoCards>
      <ContactForm></ContactForm>
      <ContactMapSection></ContactMapSection>
    </div>
  );
}
