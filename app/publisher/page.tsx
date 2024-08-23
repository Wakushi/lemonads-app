import { WebsiteDataTable } from "@/components/website-data-table/website-data-table"
import { columns } from "@/components/website-data-table/website-data-table-column"
import mockWebsites from "@/lib/website-list-mock"

export default function PublisherDashboard() {
  return (
    <div className="p-4">
      <WebsiteDataTable data={mockWebsites} columns={columns} />
    </div>
  )
}
