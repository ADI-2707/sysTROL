"use client";

import React, { useState } from "react";
import { GalleryMosaic } from "@/components/sections/Gallery/GalleryMosaic";
import { GalleryLightbox } from "@/components/sections/Gallery/GalleryLightbox";
import { galleryItems, GalleryItem } from "@/content/gallery";

interface GalleryClientProps {
  initialItems?: GalleryItem[];
}

export const GalleryClient: React.FC<GalleryClientProps> = ({ initialItems }) => {
  const items = initialItems && initialItems.length > 0 ? initialItems : galleryItems;
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <GalleryMosaic items={items} onSelectItem={(item) => setActiveItem(item)} />
      <GalleryLightbox
        item={activeItem}
        items={items}
        onClose={() => setActiveItem(null)}
        onNavigate={(item) => setActiveItem(item)}
      />
    </>
  );
};

