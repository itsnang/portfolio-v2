import { RecommendationsTable } from "@/features/recommendations/components/recommendations-table";
import { getRecommendations } from "@/features/recommendations/admin-queries";

async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return <RecommendationsTable items={recommendations} />;
}

export default RecommendationsPage;
