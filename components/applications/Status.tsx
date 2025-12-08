import { ApplicationStatus } from '@/lib/types'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type StatusConfig = {
  colorClass: string
  lightColorClass: string
  ringClass?: string
  label: string
}

const getStatusConfig = (status: ApplicationStatus): StatusConfig => {
  switch (status) {
    case "applied":
      return { colorClass: "bg-sky-600", lightColorClass: "bg-sky-200", ringClass: "ring-sky-600/20", label: "Applied" }
    case "reviewed":
      return { colorClass: "bg-blue-600", lightColorClass: "bg-blue-200", ringClass: "ring-blue-600/20", label: "Reviewed" }
    case "shortlisted":
      return { colorClass: "bg-emerald-600", lightColorClass: "bg-emerald-200", ringClass: "ring-emerald-600/20", label: "Shortlisted" }
    case "interviewed":
      return { colorClass: "bg-amber-500", lightColorClass: "bg-amber-200", ringClass: "ring-amber-500/20", label: "Interviewed" }
    case "rejected":
      return { colorClass: "bg-red-500", lightColorClass: "bg-red-200", ringClass: "ring-red-500/20", label: "Rejected" }
    case "accepted":
      return { colorClass: "bg-sky-700", lightColorClass: "bg-sky-200", ringClass: "ring-sky-700/20", label: "Accepted" }
    default:
      return { colorClass: "bg-slate-500", lightColorClass: "bg-slate-200", ringClass: "ring-slate-500/20", label: "Unknown" }
  }
}

const Status = ({ status }: { status: ApplicationStatus }) => {
  // If you have a status string that's not part of ApplicationStatus
  // (e.g. "mentor_approval_needed"), either add it to the union type
  // or handle it separately here:
  if (status === ("mentor_approval_needed" as ApplicationStatus)) {
    return null
  }

  const statusSteps: ApplicationStatus[] = ["applied", "reviewed", "shortlisted", "interviewed", "accepted"]
  let currentSteps: ApplicationStatus[] = []

  if (status !== "rejected") {
    const currentIndex = statusSteps.indexOf(status)
    currentSteps = currentIndex >= 0 ? statusSteps.slice(0, currentIndex + 1) : [status]
  } else {
    currentSteps = ["applied", "rejected"] as ApplicationStatus[]
  }

  const isRejected = status === "rejected"

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 mb-2 w-full">
        <div className="flex items-center w-full gap-3">
          {currentSteps.map((s, index) => {
            const config = getStatusConfig(s)
            const isCurrentStatus = s === status
            const isCompleted = index < currentSteps.length - 1

            return (
              <div key={s} className="flex items-center flex-1 min-w-[56px]">
                {/* Status Node with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex flex-col items-center justify-center">
                      <div
                        className={[
                          "rounded-full transition-all duration-300 shadow-sm relative flex items-center justify-center",
                          isCurrentStatus ? `h-3.5 w-3.5 ring-4 ring-offset-1 ${config.ringClass ?? ""}` : "h-3 w-3",
                          config.colorClass,
                        ].join(" ")}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="absolute h-4 w-4 text-white" strokeWidth={2.6} />
                        )}
                      </div>

                      {/* show label at first and last nodes */}
                      {(index === 0 || index === currentSteps.length - 1) && (
                        <span className="absolute -left-[115%] top-7 text-[12px] font-semibold text-slate-900 whitespace-nowrap">
                          {getStatusConfig(currentSteps[index]).label}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p className="text-xs font-medium">{config.label}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Connector Line */}
                {index < currentSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all duration-300 min-w-[48px] ml-2 ${config.colorClass}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Status
