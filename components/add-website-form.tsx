"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/service/user.service"
import { Website } from "@/lib/types/website.type"

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
]

const geoReaches = [
  "Global",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
]

const formSchemaStep1 = z.object({
  name: z.string().min(1, "Website name is required"),
  url: z.string().url("Invalid URL"),
  category: z.string().min(1, "Category is required"),
})

const formSchemaStep2 = z.object({
  keywords: z.array(z.string()).nonempty("At least one keyword is required"),
  trafficAverage: z.enum(["<10k", "10k-50k", "50k-100k", "100k+"]),
  language: z.string().min(1, "Language is required"),
  geoReach: z.string().min(1, "At least one geographic reach is required"),
})

const formSchemaStep3 = z.object({
  analyticsPropertyId: z.string().optional().or(z.literal("")),
})

type StepFormValues = z.infer<typeof formSchemaStep1> &
  z.infer<typeof formSchemaStep2> &
  z.infer<typeof formSchemaStep3>

interface AddWebsiteFormProps {
  setIsSuccess: (bool: boolean) => void
  setIsSubmitting: (bool: boolean) => void
}

export default function AddWebsiteForm({
  setIsSuccess,
  setIsSubmitting,
}: AddWebsiteFormProps) {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")

  const steps = [
    "Website Details",
    "Keywords & Audience",
    "Google Analytics (Optional)",
    "Review & Submit",
  ]

  const formMethods = useForm<StepFormValues>({
    resolver: zodResolver(
      currentStep === 1
        ? formSchemaStep1
        : currentStep === 2
        ? formSchemaStep2
        : formSchemaStep3
    ),
    defaultValues: {
      name: "",
      url: "",
      category: "",
      keywords: [],
      trafficAverage: "<10k",
      language: "",
      geoReach: "",
      analyticsPropertyId: "",
    },
    mode: "onChange",
  })

  const { control, getValues } = formMethods

  async function onSubmit() {
    if (currentStep !== 4) return
    const formValues = formMethods.watch()

    setIsSubmitting(true)
    try {
      if (!user || !user.firebaseId) {
        throw new Error("User is not authenticated or firebaseId is missing")
      }
      const websiteData: Website = {
        id: "",
        ...formValues,
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

  const handleNextStep = async () => {
    const isValid = await formMethods.trigger()
    if (isValid) setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      const updatedKeywords = [...keywords, keywordInput.trim()]
      setKeywords(updatedKeywords)
      formMethods.setValue("keywords", updatedKeywords as [string, ...string[]])
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index)
    setKeywords(updatedKeywords)
    formMethods.setValue("keywords", updatedKeywords as [string, ...string[]])
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e: any) => {
          e.preventDefault()
        }}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto p-2"
      >
        <Progress value={(currentStep / steps.length) * 100} className="mb-4" />

        <h2 className="text-2xl font-bold mb-4">{steps[currentStep - 1]}</h2>

        {currentStep === 1 && (
          <>
            <FormField
              control={control}
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

            <FormField
              control={control}
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

            <FormField
              control={control}
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
          </>
        )}

        {currentStep === 2 && (
          <>
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Enter a keyword"
                />
                <Button type="button" onClick={handleAddKeyword}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      className="text-white"
                      onClick={() => handleRemoveKeyword(index)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </FormItem>

            <FormField
              control={control}
              name="trafficAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Traffic Average</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="geoReach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Reach</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select geographic reach" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {geoReaches.map((reach) => (
                        <SelectItem key={reach} value={reach}>
                          {reach}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h3 className="text-xl font-semibold">
              Share Your Google Analytics Data (Optional)
            </h3>
            <p className="text-sm text-gray-600">
              Sharing your Google Analytics property ID allows advertisers to
              see more detailed data about your site, increasing the chances of
              renting your ad parcels.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Please add our service account{" "}
              <span className="text-blue-500 font-bold">
                google-analytics@lemonads-434513.iam.gserviceaccount.com
              </span>{" "}
              as a viewer in your Google Analytics property.
            </p>
            <FormField
              control={control}
              name="analyticsPropertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics Property ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UA-XXXXXXXXX-X or GA4 Property ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            <h3 className="text-xl font-semibold">Review Your Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please review your website details before submitting.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p>
                <strong>Website Name:</strong> {getValues("name")}
              </p>
              <p>
                <strong>Website URL:</strong> {getValues("url")}
              </p>
              <p>
                <strong>Category:</strong> {getValues("category")}
              </p>
              <p>
                <strong>Keywords:</strong> {getValues("keywords").join(", ")}
              </p>
              <p>
                <strong>Traffic Average:</strong> {getValues("trafficAverage")}
              </p>
              <p>
                <strong>Language:</strong> {getValues("language")}
              </p>
              <p>
                <strong>Geographic Reach:</strong> {getValues("geoReach")}
              </p>
              {getValues("analyticsPropertyId") && (
                <p>
                  <strong>Google Analytics Property ID:</strong>{" "}
                  {getValues("analyticsPropertyId")}
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button onClick={handlePreviousStep} type="button">
              Back
            </Button>
          )}

          {currentStep < steps.length ? (
            <Button
              onClick={async () => {
                const isValid = await formMethods.trigger()
                if (isValid) handleNextStep()
              }}
              type="button"
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => {
                onSubmit()
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
