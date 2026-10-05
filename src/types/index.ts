export type Photo = {
  id: string;
  url: string;
  metadata: {
    people: string[];
    date: string;
    location: string;
  };
  visual_tags: string[];
};

export type ChipState = "idle" | "expanding" | "filled";

export type ChipData = {
  state: ChipState;
  value: string | null;
};

export type GroqOutput = {
  metadata_filters: {
    people: string[];
    location_inference: string[];
  };
  semantic_search_string: string;
};
