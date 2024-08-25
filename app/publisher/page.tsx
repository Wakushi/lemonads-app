'use client';
import { useEffect, useState } from "react";
import { WebsiteDataTable } from "@/components/website-data-table/website-data-table";
import { columns } from "@/components/website-data-table/website-data-table-column";
import { Website } from "@/lib/types/website.type";
import { useUser } from "@/service/user.service";


export default function PublisherDashboard() {
  const { user } = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (user && user.firebaseId) {
        try {
          const response = await fetch(`/api/website?uid=${user.firebaseId}`);
          if (!response.ok) throw new Error("Failed to fetch websites");

          const userWebsites: Website[] = await response.json();
          setWebsites(userWebsites);
          console.log(websites)
        } catch (error) {
          console.error("Failed to load websites:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWebsites();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-20">
      <WebsiteDataTable data={websites} columns={columns} />
    </div>
  );
}
