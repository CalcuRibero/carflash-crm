
import { MetricsComponent } from "@/features/users-metrics/components/metrics-component";
import { MetricsHeader } from "@/features/users-metrics/components/metrics-header";

export default async function UserMetricsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const userIdNumber = slug ? parseInt(slug, 10) : null;


  return (
    <div className="flex flex-col gap-6 p-6">
      <MetricsHeader/>
      <MetricsComponent userId={userIdNumber}/>
    </div>
  );
}
