"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { User, UserType } from "@/lib/types/user.type"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  userType: z.enum([UserType.PUBLISHER, UserType.ANNOUNCER], {
    required_error: "You must select a user type",
  }),
  companyName: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine(
      (value) => value === true,
      "You must agree to the terms and conditions"
    ),
})

type FormValues = z.infer<typeof formSchema>

export default function SignupForm({ user }: { user: User }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const signupForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      userType: UserType.PUBLISHER,
      companyName: "",
      agreeToTerms: false,
    },
  })

  async function onSubmit(formValues: FormValues) {
    setIsSubmitting(true)

    try {
      const { fullName, email, userType, companyName } = formValues

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          name: fullName,
          email,
          type: userType,
          companyName,
          address: user.address,
        }),
      })

      await response.json()
      router.push(formValues.userType.toLowerCase())
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[400px]">
      <h2 className="text-3xl mb-4 font-bold">
        We'll need a few information about you !
      </h2>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* FULL NAME */}
          <FormField
            control={signupForm.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* USER TYPE */}
          <FormField
            control={signupForm.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserType.PUBLISHER}>
                      Publisher
                    </SelectItem>
                    <SelectItem value={UserType.ANNOUNCER}>
                      Announcer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* COMPANY NAME */}
          <FormField
            control={signupForm.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AGREE TO TERMS */}
          <FormField
            control={signupForm.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    className="mt-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormLabel>I agree to the terms and conditions</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            className="mt-4"
            disabled={!signupForm.formState.isValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
