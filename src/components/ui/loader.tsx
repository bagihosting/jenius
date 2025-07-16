import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function Loader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />
}
