"use client";

import React, { useState } from "react";
import { GalleryMosaic } from "@/components/sections/Gallery/GalleryMosaic";
import { GalleryLightbox } from "@/components/sections/Gallery/GalleryLightbox";
import { galleryItems, GalleryItem } from "@/content/gallery";

export const GalleryClient: React.FC = () => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <GalleryMosaic onSelectItem={(item) => setActiveItem(item)} />
      <GalleryLightbox
        item={activeItem}
        items={galleryItems}
        onClose={() => setActiveItem(null)}
        onNavigate={(item) => setActiveItem(item)}
      />
    </>
  );
};
