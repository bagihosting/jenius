
"use client"

import NextImage from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"

const Image = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  React.ComponentProps<typeof NextImage>
>(({ className, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <NextImage
      ref={ref}
      className={cn(
        "duration-300 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "scale-100 blur-0",
        className
      )}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  )
})
Image.displayName = "Image"

export { Image }
