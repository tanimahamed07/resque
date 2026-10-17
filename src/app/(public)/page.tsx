"use client";

import { useGetMe } from "@/hooks";
import AmbulanceTypes from "@/components/home/AmbulanceTypes";
import BecomeDriver from "@/components/home/BecomeDriver";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import FinalCta from "@/components/home/FinalCta";
import FirstAidTips from "@/components/home/FirstAidTips";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import PaymentPricing from "@/components/home/PaymentPricing";
import SafetyTrust from "@/components/home/SafetyTrust";
import StatsCounters from "@/components/home/StatsCounters";
import Testimonials from "@/components/home/Testimonials";
import TripLifecycle from "@/components/home/TripLifecycle";

export default function HomePage() {
  const { data } = useGetMe();
  const user = data?.data;

  // Hide AmbulanceTypes section for ADMIN, DISPATCHER, and DRIVER
  // Show only for public users (not logged in) and CALLER role
  const shouldHideAmbulanceTypes =
    user && ["ADMIN", "DISPATCHER", "DRIVER"].includes(user.role);

  return (
    <div>
      <HeroSection></HeroSection>
      <StatsCounters></StatsCounters>
      <HowItWorks></HowItWorks>
      {!shouldHideAmbulanceTypes && <AmbulanceTypes></AmbulanceTypes>}
      <FeaturesGrid></FeaturesGrid>
      <BecomeDriver></BecomeDriver>
      <TripLifecycle></TripLifecycle>
      <PaymentPricing></PaymentPricing>
      <SafetyTrust></SafetyTrust>
      <FirstAidTips></FirstAidTips>
      <Testimonials></Testimonials>
      <FinalCta></FinalCta>
    </div>
  );
}
