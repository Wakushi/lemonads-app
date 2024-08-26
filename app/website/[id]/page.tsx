"use client";

import { useEffect, useState } from "react";
import { Website } from "@/lib/types/website.type";
import { useUser } from "@/service/user.service";

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
        const response = await fetch(`/api/website?id=${id}&uid=${user.firebaseId}`);
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
      <div className="min-h-screen flex items-center justify-center">
        loader
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl">
        Website not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{website.name}</h1>
      <p className="mb-2"><strong>URL:</strong> <a href={website.url} target="_blank" rel="noopener noreferrer">{website.url}</a></p>
      <p className="mb-2"><strong>Category:</strong> {website.category}</p>
      <p className="mb-2"><strong>Traffic Average:</strong> {website.trafficAverage}</p>
      <p className="mb-2"><strong>Language:</strong> {website.language}</p>
      <p className="mb-2"><strong>Geographical Reach:</strong> {website.geoReach.join(", ")}</p>
      <p className="mb-2"><strong>Keywords:</strong> {website.keywords.join(", ")}</p>
    </div>
  );
};

export default WebsiteDetailPage;

