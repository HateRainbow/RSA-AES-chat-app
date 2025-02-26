"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

import { socket } from "@/lib/socketClient";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name too short",
    }) // regex validation I don't know regex I just asked AI for this sorry I only know what it does xD
    .refine((value) => /^[A-Za-zÀ-ÿ\s'-]+$/.test(value), {
      message: "Name can only contain letters and spaces.",
    }),

  surname: z
    .string()
    .min(2, {
      message: "Surname too short",
    })
    .refine((value) => /^[A-Za-zÀ-ÿ\s'-]+$/.test(value), {
      message: "Surname can only contain letters and spaces.",
    }),

  room: z.coerce
    .number({
      invalid_type_error: "ID must be a whole number",
    })
    .int({ message: "ID must be a whole number" })
    .gte(0, { message: "Number must be at least 0" })
    .lte(9999, { message: "Number cannot exceed 9999" })
    .transform((num) => String(num)),
});

export default function UserLoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // This is for the user the user that logs in with the avatar "icon" of in the chat app
    const avatar = data.name[0].toUpperCase() + data.surname[0].toUpperCase();

    localStorage.setItem("avatar", avatar);
    localStorage.setItem("room_id", data.room); // spara room_id för koppla till numret

    router.push("/home");
  };
  return (
    <div className="flex items-center h-screen justify-center transform sm:scale-150 md:scale-125 lg:scale-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your surname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>room</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
