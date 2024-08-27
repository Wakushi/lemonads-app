"use client";

import { useEffect, useState } from "react";
import { Website } from "@/lib/types/website.type";
import { useUser } from "@/service/user.service";
import LoaderSmall from "@/components/ui/loader-small/loader-small";
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
import { Button } from "@/components/ui/button";
import { AdBlockCustomization } from "@/components/add-block-customization";

const WebsiteDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user, loading: userLoading } = useUser();

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!user || userLoading) return;

      try {
        const response = await fetch(
          `/api/website?id=${id}&uid=${user.firebaseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch website details");
        }
        const data = await response.json();
        setWebsite(data);
      } catch (error) {
        setError("An error occurred while fetching the website details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id, user, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoaderSmall />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl pt-20">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl pt-20">
        Website not found
      </div>
    );
  }

  return (
    <div className="px-10 flex justify-around w-full h-[90vh] pt-20">
      <div className="w-1/2">
        <h1 className="text-3xl font-bold mb-4">{website.name}</h1>
        <p className="mb-2">
          <strong>URL:</strong>{" "}
          <a href={website.url} target="_blank" rel="noopener noreferrer">
            {website.url}
          </a>
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {website.category}
        </p>
        <p className="mb-2">
          <strong>Traffic Average:</strong> {website.trafficAverage}
        </p>
        <p className="mb-2">
          <strong>Language:</strong> {website.language}
        </p>
        <p className="mb-2">
          <strong>Geographical Reach:</strong> {website.geoReach.join(", ")}
        </p>
        <p className="mb-2">
          <strong>Keywords:</strong> {website.keywords.join(", ")}
        </p>
      </div>

      <div className="w-1/2 h-full py-10">
        <div className="grid grid-cols-3 gap-4 p-4 border border-gray-300 rounded-lg h-full">
          {/* Mappez ici les blocs de publicité existants */}
          <div className="h-1/3 border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner flex items-center justify-center">
            Bloc 1
          </div>
          <div className="h-1/3 border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner flex items-center justify-center">
            Bloc 2
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="h-1/3 border border-gray-300 bg-gray-100 bg-opacity-40 shadow-inner flex items-center justify-center cursor-pointer">
                <span className="text-3xl text-gray-500">+</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-7xl w-full h-[90vh] mx-auto overflow-y-auto p-10">
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Ad Block</AlertDialogTitle>
                <AlertDialogDescription>
                  Customize and create your new ad block here.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AdBlockCustomization />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Create</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetailPage;
