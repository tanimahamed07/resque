"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  User,
  Phone,
  MapPin,
  Navigation,
  AlertCircle,
  FileText,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

import { emergenciesRequestSchema } from "@/validation";
import { useAmbulanceRequest } from "@/hooks/emergency.hooks";
import { getErrorMessage } from "@/lib/get-error-message";
import type { EmergencyType, EmergencyPayload } from "@/types/emergency.type";

const LocationPicker = dynamic(
  () => import("@/components/location/location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-xl border bg-muted">
        <Spinner />
      </div>
    ),
  },
);

const EMERGENCY_TYPES = [
  {
    value: "ACCIDENT" as const,
    label: "Accident",
    icon: "🚗",
  },
  {
    value: "CARDIAC" as const,
    label: "Cardiac Emergency",
    icon: "❤️",
  },
  {
    value: "STROKE" as const,
    label: "Stroke",
    icon: "🧠",
  },
  {
    value: "PREGNANCY" as const,
    label: "Pregnancy",
    icon: "🤰",
  },
  {
    value: "TRAUMA" as const,
    label: "Trauma",
    icon: "🩹",
  },
  {
    value: "BREATHING_PROBLEM" as const,
    label: "Breathing Problem",
    icon: "🫁",
  },
  {
    value: "OTHER" as const,
    label: "Other",
    icon: "🏥",
  },
] as const;

export default function AmbulanceRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { mutate: request, isPending: requestPending } = useAmbulanceRequest();

  const form = useForm({
    defaultValues: {
      patientName: "",
      patientPhone: "",
      emergencyType: "" as EmergencyType | "",
      description: "",
      pickupAddress: "",
      pickupLatitude: 0,
      pickupLongitude: 0,
    },

    onSubmit: ({ value }) => {
      const validationResult = emergenciesRequestSchema.safeParse(value);

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];

        toast.add({
          title: "Validation Error",
          description: firstError.message,
          type: "error",
        });

        return;
      }

      const requestData: EmergencyPayload = validationResult.data;

      request(requestData, {
        onSuccess: () => {
          toast.add({
            title: "Request Submitted",
            description:
              "Your ambulance request has been submitted successfully. Help is on the way!",
            type: "success",
          });

          // Redirect to my-emergencies page to see the new request
          router.push("/caller/my-emergencies");
        },

        onError: (error) => {
          toast.add({
            title: "Request Failed",
            description:
              getErrorMessage(error) ||
              "Something went wrong. Please try again.",
            type: "error",
          });
        },
      });
    },
  });

  // Pre-fill emergency type from URL parameter
  useEffect(() => {
    const emergencyTypeParam = searchParams.get("emergencyType");

    if (emergencyTypeParam) {
      const validEmergencyTypes = [
        "ACCIDENT",
        "CARDIAC",
        "STROKE",
        "PREGNANCY",
        "TRAUMA",
        "BREATHING_PROBLEM",
        "OTHER",
      ];

      if (validEmergencyTypes.includes(emergencyTypeParam)) {
        form.setFieldValue(
          "emergencyType",
          emergencyTypeParam as EmergencyType,
        );
      }
    }
  }, [searchParams]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.add({
        title: "Geolocation Not Supported",
        description: "Your browser does not support location services.",
        type: "error",
      });

      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );

          let address = "";

          if (response.ok) {
            const data = await response.json();
            address = data.display_name || "";
          }

          form.setFieldValue("pickupLatitude", latitude);

          form.setFieldValue("pickupLongitude", longitude);

          if (address) {
            form.setFieldValue("pickupAddress", address);
          }

          toast.add({
            title: "Location Captured",
            description: "Your current location has been selected.",
            type: "success",
          });
        } catch {
          form.setFieldValue("pickupLatitude", latitude);

          form.setFieldValue("pickupLongitude", longitude);

          toast.add({
            title: "Location Captured",
            description:
              "Coordinates captured. Please enter your pickup address.",
            type: "success",
          });
        } finally {
          setIsGettingLocation(false);
        }
      },

      (error) => {
        let message = "Unable to get your current location.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Please allow location access.";
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Your current location is unavailable.";
        }

        if (error.code === error.TIMEOUT) {
          message = "Location request timed out. Please try again.";
        }

        toast.add({
          title: "Location Error",
          description: message,
          type: "error",
        });

        setIsGettingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {/* Patient Name */}
        <form.Field name="patientName">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Patient Name <span className="text-destructive">*</span>
                </Label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter patient's full name"
                    className="h-11 pl-10"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        {/* Patient Phone */}
        <form.Field name="patientPhone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Patient Phone <span className="text-destructive">*</span>
                </Label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    placeholder="01712345678"
                    className="h-11 pl-10"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        {/* Emergency Type */}
        <form.Field name="emergencyType">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <Label>
                  Emergency Type <span className="text-destructive">*</span>
                </Label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EMERGENCY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => field.handleChange(type.value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-destructive/50 hover:bg-muted/50 ${
                        field.state.value === type.value
                          ? "border-destructive bg-destructive/5 ring-2 ring-destructive/20"
                          : "border-border"
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>

                      <span className="text-center text-xs font-medium">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Description{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>

                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Please describe the emergency situation..."
                    className="min-h-25 resize-none pl-10"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {field.state.value.length}/500 characters
                </p>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        {/* Pickup Address */}
        <form.Field name="pickupAddress">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Pickup Address <span className="text-destructive">*</span>
                </Label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter detailed pickup address"
                    className="h-11 pl-10"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        {/* Map Location */}
        <form.Field name="pickupLatitude">
          {(latitudeField) => (
            <form.Field name="pickupLongitude">
              {(longitudeField) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Pickup Location{" "}
                        <span className="text-destructive">*</span>
                      </Label>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Select your exact pickup location on the map.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="h-9 shrink-0 gap-2"
                    >
                      {isGettingLocation ? (
                        <>
                          <Spinner className="h-3.5 w-3.5" />
                          Getting...
                        </>
                      ) : (
                        <>
                          <Navigation className="h-3.5 w-3.5" />
                          Current Location
                        </>
                      )}
                    </Button>
                  </div>

                  <LocationPicker
                    latitude={latitudeField.state.value}
                    longitude={longitudeField.state.value}
                    onLocationChange={(latitude, longitude, address) => {
                      latitudeField.handleChange(latitude);

                      longitudeField.handleChange(longitude);

                      if (address) {
                        form.setFieldValue("pickupAddress", address);
                      }
                    }}
                  />

                  {latitudeField.state.value !== 0 &&
                    longitudeField.state.value !== 0 && (
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Location Selected
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Latitude: {latitudeField.state.value.toFixed(6)}
                              <br />
                              Longitude: {longitudeField.state.value.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {(latitudeField.state.meta.isTouched &&
                    !latitudeField.state.meta.isValid) ||
                  (longitudeField.state.meta.isTouched &&
                    !longitudeField.state.meta.isValid) ? (
                    <FieldError
                      errors={[
                        ...latitudeField.state.meta.errors,
                        ...longitudeField.state.meta.errors,
                      ]}
                    />
                  ) : null}
                </div>
              )}
            </form.Field>
          )}
        </form.Field>

        {/* Emergency Response Info */}
        <div className="flex items-start gap-3 rounded-lg border border-muted bg-muted/30 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

          <div className="space-y-1">
            <p className="text-sm font-medium">Emergency Response</p>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Your request will be dispatched to the nearest available
              ambulance. Please ensure all information is accurate for faster
              response.
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          disabled={requestPending}
          type="submit"
          className="h-11 w-full font-medium shadow-sm"
          size="lg"
        >
          {requestPending ? (
            <>
              <Spinner />
              Submitting Request...
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              Request Ambulance
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
