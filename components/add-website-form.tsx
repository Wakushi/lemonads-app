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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const formSchema = z.object({
  websiteName: z.string().min(1, "Website name is required"),
  websiteUrl: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required"),
  trafficVolume: z.enum(["<10k", "10k-50k", "50k-100k", "100k+"]),
  cms: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  gdprCompliance: z
    .boolean()
    .refine((value) => value === true, "GDPR compliance is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function AddWebsiteForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const websiteForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteName: "",
      websiteUrl: "",
      category: "",
      trafficVolume: "<10k",
      cms: "",
      contactEmail: "",
      gdprCompliance: false,
    },
  })

  async function onSubmit(formValues: FormValues) {
    setIsSubmitting(true)

    try {
      console.log("Form submitted:", formValues)
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...websiteForm}>
      <form
        onSubmit={websiteForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* WEBSITE NAME */}
        <FormField
          control={websiteForm.control}
          name="websiteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your website name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WEBSITE URL */}
        <FormField
          control={websiteForm.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY */}
        <FormField
          control={websiteForm.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TRAFFIC VOLUME */}
        <FormField
          control={websiteForm.control}
          name="trafficVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Traffic Volume</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic volume" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="<10k">Less than 10k</SelectItem>
                  <SelectItem value="10k-50k">10k-50k</SelectItem>
                  <SelectItem value="50k-100k">50k-100k</SelectItem>
                  <SelectItem value="100k+">More than 100k</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CMS */}
        <FormField
          control={websiteForm.control}
          name="cms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Management System (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., WordPress, Joomla, Custom"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONTACT EMAIL */}
        <FormField
          control={websiteForm.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your contact email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GDPR COMPLIANCE */}
        <FormField
          control={websiteForm.control}
          name="gdprCompliance"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="mt-2">GDPR Compliance</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="mt-4 bg-amber-500 hover:bg-white hover:text-amber-500 hover:border hover:border-amber-500"
          disabled={!websiteForm.formState.isValid || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Website"}
        </Button>
      </form>
    </Form>
  )
}
