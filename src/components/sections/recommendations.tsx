import React from "react";
import { IRecommendation } from "@/types/profile.type";
import { RecommendationCard } from "../recommendation-card";

interface RecommendationsProps {
  recommendations: IRecommendation[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="flex min-h-0 flex-col gap-y-3 py-6">
      <h2 className="text-xl font-bold">Recommendations</h2>
      <div className="grid gap-4 grid-cols-1">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            name={recommendation.name}
            position={recommendation.position}
            profileImageUrl={recommendation.profileImageUrl}
            recommendationText={recommendation.recommendationText}
          />
        ))}
      </div>
    </section>
  );
};
