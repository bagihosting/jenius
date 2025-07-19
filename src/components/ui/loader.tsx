import { cn } from "@/lib/utils"
import { Loader2, type LucideProps } from "lucide-react"

export function Loader({
  className,
  ...props
}: LucideProps) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />
}
