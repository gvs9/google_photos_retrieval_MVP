import photos from "@/data/photos.json";
import { Photo, GroqOutput } from "@/types";

const STOP_WORDS = new Set(["a", "an", "the", "at", "in", "on", "was", "with", "is", "of", "and", "to", "for", "my", "our", "some", "we", "were", "it", "they"]);

import embeddingsData from "@/data/embeddings.json";

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function matchPhotos(groqOutput: GroqOutput, queryEmbedding?: number[]): Photo[] {
  // Extract and clean keywords
  const keywords = groqOutput.semantic_search_string
    ?.toLowerCase()
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0 && !STOP_WORDS.has(k)) ?? [];

  const peopleFilters = groqOutput.metadata_filters?.people?.map(p => p.toLowerCase().trim()) ?? [];
  const locationFilter = groqOutput.metadata_filters?.location_inference?.map(l => l.toLowerCase().trim()) ?? [];
  const peopleRequired = peopleFilters.length > 0;
  
  const allPhotos = photos as Photo[];
  const embeddings = embeddingsData as Record<string, number[]>;

  const scoredPhotos = allPhotos.map(photo => {
    let score = 0;
    let personMatched = false;

    // Check People (High Weight)
    if (peopleRequired) {
      const photoPeople = photo.metadata?.people?.map(p => p.toLowerCase()) ?? [];
      peopleFilters.forEach(person => {
        if (photoPeople.some(p => p.includes(person) || person.includes(p))) {
          score += 10;
          personMatched = true;
        }
      });
      // If people were specified but this photo matches NONE of them, disqualify it.
      if (!personMatched) {
        return { photo, score: 0 };
      }
    }

    // Check Location (Medium Weight)
    if (locationFilter.length > 0) {
      const photoLoc = photo.metadata?.location?.toLowerCase() ?? "";
      locationFilter.forEach(loc => {
        if (photoLoc.includes(loc) || loc.includes(photoLoc)) {
          score += 5;
        }
      });
    }

    // Vector Search for Semantic Visual Tags
    if (queryEmbedding && embeddings[photo.id]) {
      const photoVec = embeddings[photo.id];
      const sim = cosineSimilarity(queryEmbedding, photoVec);
      // Multiply similarity to scale it appropriately (e.g. max ~8-10 points for a perfect match)
      // Only count decent positive correlations
      if (sim > 0.20) {
        score += sim * 10;
      }
    } else if (keywords.length > 0) {
      // Fallback to keyword matching if embeddings aren't available
      keywords.forEach(keyword => {
        const hasMatch = photo.visual_tags?.some(tag => {
          const lowerTag = tag.toLowerCase();
          return lowerTag.includes(keyword) || keyword.includes(lowerTag);
        });
        
        if (hasMatch) {
          score += 1;
        } else {
          const inLoc = photo.metadata?.location?.toLowerCase().includes(keyword);
          const inPeople = photo.metadata?.people?.some(p => p.toLowerCase().includes(keyword));
          if (inLoc || inPeople) {
            score += 1;
          }
        }
      });
    } else if (!peopleRequired && locationFilter.length === 0) {
      score = 0;
    }

    return { photo, score };
  });

  // Filter out zero scores, sort by score descending
  let results = scoredPhotos
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.photo);

  // If we have a lot of results, only return the highly relevant ones (e.g. top 5)
  // to avoid showing completely unrelated photos at the bottom of the list.
  if (results.length > 5) {
    results = results.slice(0, 5);
  }

  return results;
}
