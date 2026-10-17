// components/home/AmbulanceTypes.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Car,
  HeartPulse,
  Brain,
  Baby,
  Bandage,
  Wind,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const TYPES = [
  {
    icon: Car,
    type: "ACCIDENT",
    title: "Accident",
    description: "Emergency response for vehicle accidents and collisions.",
    features: ["Trauma care", "Rapid stabilization", "Emergency transport"],
  },
  {
    icon: HeartPulse,
    type: "CARDIAC",
    title: "Cardiac Emergency",
    description: "Specialized care for heart attacks and cardiac conditions.",
    features: ["ECG monitoring", "Defibrillator", "Cardiac specialist"],
  },
  {
    icon: Brain,
    type: "STROKE",
    title: "Stroke",
    description: "Time-critical care for stroke patients.",
    features: [
      "Neurological assessment",
      "Rapid hospital transfer",
      "Stroke protocol",
    ],
  },
  {
    icon: Baby,
    type: "PREGNANCY",
    title: "Pregnancy",
    description: "Safe transport for pregnancy-related emergencies.",
    features: ["Maternal care", "Comfortable transport", "OB/GYN support"],
  },
  {
    icon: Bandage,
    type: "TRAUMA",
    title: "Trauma",
    description: "Critical care for severe injuries and trauma cases.",
    features: ["Advanced life support", "Trauma specialist", "ICU equipment"],
  },
  {
    icon: Wind,
    type: "BREATHING_PROBLEM",
    title: "Breathing Problem",
    description: "Immediate care for respiratory distress and emergencies.",
    features: ["Oxygen support", "Ventilator", "Respiratory specialist"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AmbulanceTypes() {
  return (
    <section className="bg-background py-20" id="ambulance-types">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Emergency care for every situation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Select the type of emergency you're experiencing. Our dispatch
            system will send the most appropriate ambulance with specialized
            equipment and trained staff.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TYPES.map(({ icon: Icon, type, title, description, features }) => (
            <motion.div key={type} variants={item}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10">
                    <Icon className="h-5 w-5 text-destructive" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="border-t border-border pt-4">
                  <Link
                    href={`/caller/request?emergencyType=${type}`}
                    className="w-full"
                  >
                    <Button size="sm" className="w-full">
                      Request for {title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
