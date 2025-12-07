/**
 * Example usage of the recommendation client in a Next.js component
 */

import { RecommendationClient, type MatchResult, type RecommendationRequest } from './recommendation-client';

// Example: Server-side API route (app/api/recommendations/route.ts)
export async function getRecommendationsServerSide(userProfile: {
  department: string;
  batch: string;
  skills: string[];
}) {
  const client = new RecommendationClient(process.env.RECOMMENDATION_ENGINE_URL);
  
  const request: RecommendationRequest = {
    department: userProfile.department,
    batch: userProfile.batch,
    skills: userProfile.skills,
    k: 10,
  };

  try {
    const response = await client.getRecommendations(request);
    return response.recommendations;
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    return [];
  }
}

// Example: Sync jobs when a new opportunity is created
export async function syncJobToRecommendationEngine(job: {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  status: string;
  salary?: string;
  requirements: string[];
  eligibleDepartments: string[];
  skillsRequired: string[];
  additionalInfo?: string;
}) {
  const client = new RecommendationClient(process.env.RECOMMENDATION_ENGINE_URL);
  
  try {
    await client.addJob(job as any);
    console.log(`Job ${job.id} synced to recommendation engine`);
  } catch (error) {
    console.error(`Failed to sync job ${job.id}:`, error);
    throw error;
  }
}

// Example: Remove job from recommendations when deleted
export async function removeJobFromRecommendations(jobId: string) {
  const client = new RecommendationClient(process.env.RECOMMENDATION_ENGINE_URL);
  
  try {
    await client.removeJob(jobId);
    console.log(`Job ${jobId} removed from recommendation engine`);
  } catch (error) {
    console.error(`Failed to remove job ${jobId}:`, error);
    throw error;
  }
}

// Example React component for displaying recommendations
/*
'use client';

import { useEffect, useState } from 'react';
import { RecommendationClient, type MatchResult } from '@/lib/recommendation-client';

interface UserProfile {
  department: string;
  batch: string;
  skills: string[];
}

export function RecommendationsPage({ userProfile }: { userProfile: UserProfile }) {
  const [recommendations, setRecommendations] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      const client = new RecommendationClient();
      
      try {
        const response = await client.getRecommendations({
          department: userProfile.department,
          batch: userProfile.batch,
          skills: userProfile.skills,
          k: 10,
        });
        setRecommendations(response.recommendations);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [userProfile]);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommended for You</h2>
      {recommendations.map((rec) => (
        <div key={rec.job_id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{rec.job_id}</h3>
              <p className="text-sm text-gray-600">
                {rec.job_type} • {rec.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">
                {(rec.composite_score * 100).toFixed(0)}% Match
              </span>
            </div>
          </div>
          
          {rec.highlights.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Matching Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {rec.highlights.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
*/
