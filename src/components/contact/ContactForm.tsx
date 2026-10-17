"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBJECTS = [
  { value: "general", label: "General inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "driver_support", label: "Driver support" },
  { value: "report_issue", label: "Report an issue" },
] as const;

type SubjectValue = (typeof SUBJECTS)[number]["value"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectValue>("general");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Show success toast
    toast.add({
      title: "Message Sent Successfully!",
      description: "Thank you for contacting us. We'll get back to you soon.",
      type: "success",
    });

    // Reset form
    setName("");
    setEmail("");
    setSubject("general");
    setMessage("");
  }

  return (
    <section className="border-y bg-background">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl space-y-5 p-4 sm:px-6"
      >
        {/* Intro */}
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <div>
            <h2 className="text-sm font-medium">Send us a message</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Have a question? Send us a message and our team will get back to
              you.
            </p>
          </div>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-3 border-t pt-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Name
            </Label>

            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-background"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label htmlFor="subject" className="text-xs text-muted-foreground">
            Subject
          </Label>

          <Select
            value={subject}
            onValueChange={(value) => setSubject(value as SubjectValue)}
          >
            <SelectTrigger id="subject" className="bg-background">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>

            <SelectContent>
              {SUBJECTS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs text-muted-foreground">
            Message
          </Label>

          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="How can we help?"
            className="resize-none bg-background"
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            We&apos;ll get back to you as soon as possible.
          </span>

          <Button type="submit" className="w-full shrink-0 sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            Send message
          </Button>
        </div>
      </form>
    </section>
  );
}
