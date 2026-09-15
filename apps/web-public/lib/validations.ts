import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Plant / Company name is required." }),
  email: z.string().email({ message: "Please provide a valid professional email address." }),
  phone: z
    .string()
    .min(8, { message: "Please provide a valid phone/mobile number." })
    .regex(/^[+0-9\s-()]+$/, { message: "Invalid characters in phone number." }),
  service: z.string().min(1, { message: "Please select an area of interest." }),
  message: z
    .string()
    .min(10, { message: "Please describe your mill/automation requirement (min 10 characters)." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
