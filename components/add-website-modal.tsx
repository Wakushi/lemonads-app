"use client"

import { CiCircleCheck } from "react-icons/ci"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/service/user.service"
import LoaderSmall from "./ui/loader-small/loader-small"
import AddWebsiteForm from "./add-website-form"

export default function AddWebsiteDialog() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!isSuccess) return
    queryClient.invalidateQueries({ queryKey: ["websites", user?.address] })
  }, [isSuccess])

  const getDialogContent = () => {
    if (isSubmitting) {
      return (
        <div className="h-full flex justify-center items-center">
          <LoaderSmall />
        </div>
      )
    }

    if (isSuccess) {
      return (
        <div className="h-full flex flex-col gap-4 justify-center items-center">
          <CiCircleCheck className="text-green-600 text-[8rem]" />
          <p className="text-3xl pb-20">Website added !</p>
        </div>
      )
    }

    return (
      <AddWebsiteForm
        setIsSubmitting={setIsSubmitting}
        setIsSuccess={setIsSuccess}
      />
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-brand">Add new website</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg mx-auto my-8 bg-white rounded-lg shadow-lg">
        <AlertDialogHeader className="flex flex-row items-center w-full justify-between justify-self-end">
          {!isSuccess && !isSubmitting && (
            <AlertDialogTitle>Add New Website</AlertDialogTitle>
          )}
          <AlertDialogCancel>
            <IoMdClose />
          </AlertDialogCancel>
        </AlertDialogHeader>
        <div className="min-h-[400px] overflow-y-auto">
          {getDialogContent()}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
