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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRSAKeyPair } from "@/lib/encryption";

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
    //save the user data in the context to be then retrieved and push him in the custom room url
    const avatar = data.name[0].toUpperCase() + data.surname[0].toUpperCase();
    const { privateKey, publicKey } = generateRSAKeyPair();

    sessionStorage.setItem(
      "user",
      JSON.stringify({
        name: data.name,
        surname: data.surname,
        avatar,
        publicKey,
        privateKey,
      })
    );

    router.push(`/home/${data.room}`);
  };
  // todo add card and wrap and start chat logic
  return (
    <div className="flex items-center h-screen justify-center bg-black transform sm:scale-150 md:scale-100">
      <Card className="p-5 bg-white rounded-md md:w-[50%] w-[70%]">
        <CardHeader className="justify-center text-center font-semibold">
          <CardTitle>Log in to chat room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 border-black"
            >
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
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center w-[100%]">
                <Button
                  className="text-center border-black border-2 w-[80%] hover:bg-slate-300"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
