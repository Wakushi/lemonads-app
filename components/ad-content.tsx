import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from "@/service/user.service"
import {
  createAdContent,
  getAdContents,
} from "@/lib/actions/client/firebase-actions"
import { toast } from "@/components/ui/use-toast"
import { AdContent } from "@/lib/types/ad-content.type"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { moderateImage } from "@/lib/actions/client/aws-actions"
import LoaderSmall from "./ui/loader-small/loader-small"
import { IoWarningOutline } from "react-icons/io5"

const adContentSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  linkUrl: z.string().url("Link must be a valid URL"),
})

type AdContentFormValues = z.infer<typeof adContentSchema>

export default function AdContentPage() {
  const { user } = useUser()
  const [adContents, setAdContents] = useState<AdContent[]>([])
  const [moderationLabels, setModerationLabels] = useState<string[]>([])
  const [isModerationAlertOpen, setIsModerationAlertOpen] = useState(false)
  const [loadingAdContents, setLoadingAdContents] = useState(true)

  const {
    register,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<AdContentFormValues>({
    resolver: zodResolver(adContentSchema),
    mode: "onChange",
  })

  useEffect(() => {
    async function fetchAdContents() {
      if (user?.firebaseId) {
        const contents = await getAdContents(user.firebaseId)
        setAdContents(contents)
        setLoadingAdContents(false)
      }
    }

    fetchAdContents()
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setValue("file", file)
    }
  }

  async function onSubmit() {
    const formValues = watch()

    if (!user || !formValues.file) return

    try {
      toast({
        title: "Verifying content...",
        description:
          "We're checking if the content follows our moderation rules..",
        action: <LoaderSmall color="#000" />,
      })

      const detectedLabels = await moderateImage(formValues.file)

      if (detectedLabels?.length) {
        setModerationLabels(detectedLabels)
        setIsModerationAlertOpen(true)
        return
      }

      toast({
        title: "Content verified !",
        description: "Uploading your ad campaign...",
        action: <LoaderSmall color="#000" />,
      })

      const createdAdContent = await createAdContent({
        user,
        file: formValues.file,
        title: formValues.title,
        description: formValues.description,
        linkUrl: formValues.linkUrl,
      })

      if (createdAdContent) {
        toast({
          title: "Success",
          description: "Ad content created successfully!",
        })
        setAdContents((prevContents) => [...prevContents, createdAdContent])
        reset()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating ad content. Please try again.",
        variant: "destructive",
      })
      console.error("Error creating ad content:", error)
    }
  }

  if (loadingAdContents) {
    return <LoaderSmall />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Ad Campaigns</h1>

      <div className="grid grid-cols-3 gap-4">
        {adContents.map((content, i) => (
          <div
            key={content.linkUrl + i}
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-md min-h-52"
          >
            <Image
              src={content.imageUrl}
              alt="Ad Image"
              className="w-full h-32 object-cover rounded-t-lg"
              width={1280}
              height={1280}
            />
            <div className="p-2 relative">
              <h2 className="font-bold text-lg">{content.title}</h2>
              <p className="line-clamp-2 relative z-10">
                {content.description}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-0"></div>
            </div>
          </div>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex justify-center items-center border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner rounded-lg cursor-pointer min-h-52">
              <span className="text-3xl text-gray-500">+</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg w-full mx-auto overflow-y-auto p-10">
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Ad Content</AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the details below to create a new ad content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="flex flex-col gap-4">
              <Input
                type="file"
                className="border p-2 rounded"
                onChange={handleFileChange}
              />
              {errors.file && (
                <p className="text-red-500">{errors.file.message}</p>
              )}

              <Input
                type="text"
                placeholder="Title"
                {...register("title")}
                className="border p-2 rounded"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}

              <Textarea
                placeholder="Description"
                {...register("description")}
                className="border p-2 rounded"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}

              <Input
                type="text"
                placeholder="Link URL"
                {...register("linkUrl")}
                className="border p-2 rounded"
              />
              {errors.linkUrl && (
                <p className="text-red-500">{errors.linkUrl.message}</p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loadingAdContents}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onSubmit}
                  disabled={!isValid || loadingAdContents}
                >
                  {loadingAdContents ? "Creating..." : "Create"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ModerationWarningAlert
        open={isModerationAlertOpen}
        setOpen={setIsModerationAlertOpen}
        moderationLabels={moderationLabels}
      />
    </div>
  )
}

function ModerationWarningAlert({
  open,
  setOpen,
  moderationLabels,
}: {
  open: boolean
  setOpen: (state: boolean) => void
  moderationLabels: string[]
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Content Moderation Warning</AlertDialogTitle>
          <AlertDialogDescription>
            The uploaded image contains the following inappropriate content:
          </AlertDialogDescription>
          <div>
            <div className="flex flex-col gap-1 mb-2">
              {moderationLabels.map((label, idx) => (
                <div key={label} className="flex items-center gap-1">
                  <IoWarningOutline className="text-red-500" />
                  <span key={idx} className="text-red-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <AlertDialogDescription>
              Please upload an image that adheres to our content guidelines.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
