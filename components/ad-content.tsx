import { useEffect, useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { useUser } from "@/service/user.service";
import { createAdContent, getAdContents } from "@/lib/actions/client/firebase-actions";
import { toast } from "@/components/ui/use-toast";
import { AdContent } from "@/lib/types/ad-content.type";
import Image from "next/image";
import Link from "next/link";

export default function AdContentPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adContents, setAdContents] = useState<AdContent[]>([]);

  useEffect(() => {
    async function fetchAdContents() {
      if (user?.firebaseId) {
        const contents = await getAdContents(user.firebaseId);
        console.log(contents); 
        setAdContents(contents); 
      }
    }

    fetchAdContents();
  }, [user]);

  async function submitAdContent() {
    if (!user) return;

    if (!file || !title || !description || !linkUrl) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const createdAdContent = await createAdContent({
        user,
        file,
        title,
        description,
        linkUrl,
      });

      if (createdAdContent) {
        toast({
          title: "Success",
          description: "Ad content created successfully!",
        });
        setAdContents((prevContents) => [...prevContents, createdAdContent]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating ad content. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating ad content:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-10 py-20">
      <h1 className="text-3xl font-bold mb-6">Your Ad Contents</h1>

      <div className="grid grid-cols-3 gap-4">
        {adContents.map((content) => (
           <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md min-w-52">
		   <Image
			 src={"/pubtest.webp"}
			 alt="Ad Image"
			 className="w-full h-32 object-cover rounded-t-lg"
			 width={1280}
			 height={1280}
		   />
		   <div className="p-2">
			 <h2 className="font-bold text-lg">{content.title}</h2>
			 <button className="mt-2 px-4 py-2 bg-brand text-white rounded-lg">
				<Link href={content.linkUrl}>Learn more</Link>
			 </button>
		   </div>
		 </div>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex justify-center items-center border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner rounded-lg cursor-pointer">
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
            <div className="flex flex-col gap-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Link URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submitAdContent}>
                {loading ? "Creating..." : "Create"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}