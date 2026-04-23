"use client";

import Image from "next/image";
import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImagePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  zoomable?: boolean;
}

export function ImagePreview({
  src,
  alt,
  width = 200,
  height = 150,
  className = "",
  zoomable = true,
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-400 ${className}`}
        style={{ width, height }}
      >
        No Image
      </div>
    );
  }

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg border border-slate-700 object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );

  if (!zoomable) {
    return imageElement;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer transition-opacity hover:opacity-80">{imageElement}</div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl p-0">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="h-auto w-full object-contain"
          onError={() => setImageError(true)}
        />
      </DialogContent>
    </Dialog>
  );
}
