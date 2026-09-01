import { PageHeader } from "@/components/ui/page-header"
import { TicketCategoryLabel } from "@/features/recurrent-tickets/types"
import { parseCategorySlug, TicketCategoryIcons } from "../utils";
import Layout from "../../dashboard/layout";
import { TicketsSupervisionPanel } from "@/features/supervision-panel/components/tickets-supervision-panels";
import type { UserRole } from "@/lib/api";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const categoryParsed: UserRole = parseCategorySlug(slug)
    const categoryLabel = TicketCategoryLabel[categoryParsed]
    const categoryIcons = TicketCategoryIcons[categoryParsed]
    return (
        <Layout>
            <main className="p-6">
                <PageHeader
                    title="Supervisión"
                    icon={categoryIcons}
                    category={categoryLabel}
                />
                <TicketsSupervisionPanel category={categoryParsed}/>
            </main>
        </Layout>
    )
}