"use client";

import { useState } from "react";
import { Photo } from "@/types";

export default function PhotoCard({ photo }: { photo: Photo }) {
  const [imgSrc, setImgSrc] = useState(photo.url);

  return (
    <div className="group relative aspect-square rounded-DEFAULT overflow-hidden bg-surface-container-low shadow-sm cursor-pointer">
      <img
        src={imgSrc}
        alt={`Photo of ${photo.metadata.people.join(", ")}`}
        onError={() => setImgSrc("https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&q=80")}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 pt-8 pb-space-sm px-space-sm bg-gradient-to-t from-surface-dim via-surface-dim/50 to-transparent flex flex-col justify-end">
        <span className="font-title-sm text-title-sm text-on-surface truncate">
          {photo.metadata.people.length > 0 ? photo.metadata.people.join(", ") : "Unknown"}
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
          {photo.metadata.date} • {photo.metadata.location}
        </span>
      </div>
    </div>
  );
}
