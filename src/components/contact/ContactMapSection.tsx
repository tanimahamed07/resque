"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OFFICE_LOCATION = "Dhanmondi 27, Dhaka, Bangladesh";

const MAP_QUERY = encodeURIComponent(OFFICE_LOCATION);

export default function ContactMapSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-12 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find us in Dhaka
          </h2>

          <p className="mt-3 text-muted-foreground">
            Visit our office or find us on the map. Rescue provides emergency
            ambulance services across Dhaka.
          </p>
        </div>

        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10">
                  <MapPin className="h-5 w-5 text-destructive" />
                </div>

                <div>
                  <CardTitle className="text-base">
                    Dhanmondi 27, Dhaka
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Rescue office & service location
                  </p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px sm:w-auto dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                <Navigation className="h-3.5 w-3.5" />
                Open in Maps
              </a>
            </CardHeader>

            <CardContent className="p-0">
              <div className="aspect-[16/7] w-full overflow-hidden border-t">
                <iframe
                  title="Rescue office location"
                  src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                  className="h-full w-full border-0 grayscale-[20%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
