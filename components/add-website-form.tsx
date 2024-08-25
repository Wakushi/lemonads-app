"use client"
import { useUser } from "@/service/user.service"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Website } from "@/lib/types/website.type"

const formSchema = z.object({
  name: z.string().min(1, "Website name is required"),
  url: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required"),
  keywords: z.array(z.string()).nonempty("At least one keyword is required"),
  trafficAverage: z.enum(["<10k", "10k-50k", "50k-100k", "100k+"]),
  language: z.string().min(1, "Language is required"),
  geoReach: z
    .array(z.string())
    .nonempty("At least one geographic reach is required"),
})

type FormValues = z.infer<typeof formSchema>

interface AddWebsiteFormProps {
  setIsSuccess: (bool: boolean) => void
  setIsSubmitting: (bool: boolean) => void
}

export default function AddWebsiteForm({
  setIsSuccess,
  setIsSubmitting,
}: AddWebsiteFormProps) {
  const { user } = useUser()
  const [keywords, setKeywords] = useState<string[]>([])
  const [geoReach, setGeoReach] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState<string>("")
  const [geoReachInput, setGeoReachInput] = useState<string>("")

  const websiteForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      category: "",
      keywords: [],
      trafficAverage: "<10k",
      language: "",
      geoReach: [],
    },
  })

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      const updatedKeywords = [...keywords, keywordInput.trim()]
      setKeywords(updatedKeywords)
      websiteForm.setValue(
        "keywords",
        updatedKeywords as [string, ...string[]],
        { shouldValidate: true }
      )
      setKeywordInput("")
    }
  }

  const handleAddGeoReach = () => {
    if (geoReachInput.trim() !== "") {
      const updatedGeoReach = [...geoReach, geoReachInput.trim()]
      setGeoReach(updatedGeoReach)
      websiteForm.setValue(
        "geoReach",
        updatedGeoReach as [string, ...string[]],
        { shouldValidate: true }
      )
      setGeoReachInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleRemoveGeoReach = (index: number) => {
    setGeoReach(geoReach.filter((_, i) => i !== index))
  }

  async function onSubmit(formValues: FormValues) {
    setIsSubmitting(true)

    try {
      if (!user || !user.firebaseId) {
        throw new Error("User is not authenticated or firebaseId is missing")
      }

      const websiteData: Website = {
        id: "",
        ...formValues,
        keywords,
        geoReach,
      }

      const response = await fetch("/api/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.firebaseId,
          ...websiteData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add website")
      }
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setIsSubmitting(false)
      setIsSuccess(true)
    }
  }

  return (
    <Form {...websiteForm}>
      <form
        onSubmit={websiteForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-2"
      >
        {/* WEBSITE NAME */}
        <FormField
          control={websiteForm.control}
          name="name"
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
          name="url"
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
              <FormControl>
                <Input placeholder="e.g., Technology, Fashion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* KEYWORDS */}
        <FormItem>
          <FormLabel>Keywords</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Enter a keyword and press Enter"
              onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            />
            <Button type="button" onClick={handleAddKeyword}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{keyword}</span>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveKeyword(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </FormItem>

        {/* TRAFFIC AVERAGE */}
        <FormField
          control={websiteForm.control}
          name="trafficAverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Traffic Average</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic average" />
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

        {/* LANGUAGE */}
        <FormField
          control={websiteForm.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the primary language of the website"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GEO REACH */}
        <FormItem>
          <FormLabel>Geographic Reach</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              value={geoReachInput}
              onChange={(e) => setGeoReachInput(e.target.value)}
              placeholder="Enter a geographic reach and press Enter"
              onKeyDown={(e) => e.key === "Enter" && handleAddGeoReach()}
            />
            <Button type="button" onClick={handleAddGeoReach}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {geoReach.map((reach, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{reach}</span>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveGeoReach(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </FormItem>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="mt-4 bg-brand hover:bg-white hover:text-brand hover:border hover:border-brand"
          disabled={!websiteForm.formState.isValid}
        >
          Create Website
        </Button>
      </form>
    </Form>
  )
}
