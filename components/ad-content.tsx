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
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const adContentSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  linkUrl: z.string().url("Link must be a valid URL"),
})

type AdContentFormValues = z.infer<typeof adContentSchema>

interface AdContentPageProps {
  loading: boolean
  setLoading: (bool: boolean) => void
}

export default function AdContentPage({
  loading,
  setLoading,
}: AdContentPageProps) {
  const { user } = useUser()
  const [adContents, setAdContents] = useState<AdContent[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<AdContentFormValues>({
    resolver: zodResolver(adContentSchema),
    mode: "onChange",
  })

  useEffect(() => {
    async function fetchAdContents() {
      if (user?.firebaseId) {
        const contents = await getAdContents(user.firebaseId)
        console.log(contents)
        setAdContents(contents)
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

  const onSubmit = async (data: AdContentFormValues) => {
    if (!user || !data.file) return

    setLoading(true)

    try {
      const createdAdContent = await createAdContent({
        user,
        file: data.file,
        title: data.title,
        description: data.description,
        linkUrl: data.linkUrl,
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
    } finally {
      setLoading(false)
    }
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
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
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={!isValid || loading}>
                  {loading ? "Creating..." : "Create"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
