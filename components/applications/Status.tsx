import { ApplicationStatus } from '@/lib/types'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Status = ({status}:{status:ApplicationStatus}) => {
    const getStatusConfig = (status: ApplicationStatus) => {
        switch (status) {
          case "applied":
            return { 
              color: "bg-sky-500", 
              lightColor: "bg-sky-200", 
              label: "Applied" 
            }
          case "reviewed":
            return { 
              color: "bg-indigo-500", 
              lightColor: "bg-indigo-200", 
              label: "Reviewed" 
            }
          case "shortlisted":
            return { 
              color: "bg-emerald-500", 
              lightColor: "bg-emerald-200", 
              label: "Shortlisted" 
            }
          case "interviewed":
            return { 
              color: "bg-amber-500", 
              lightColor: "bg-amber-200", 
              label: "Interviewed" 
            }
          case "rejected":
            return { 
              color: "bg-red-500", 
              lightColor: "bg-red-200", 
              label: "Rejected" 
            }
          case "accepted":
            return { 
              color: "bg-green-500", 
              lightColor: "bg-green-200", 
              label: "Accepted" 
            }
          default:
            return { 
              color: "bg-slate-400", 
              lightColor: "bg-slate-200", 
              label: "Unknown" 
            }
        }
    }

    const statusSteps: ApplicationStatus[] = ["applied", "reviewed", "shortlisted", "interviewed", "accepted"];
    let currentSteps: ApplicationStatus[] = [];
    
    if (status !== "rejected") {
        const currentIndex = statusSteps.indexOf(status);
        currentSteps = statusSteps.slice(0, currentIndex + 1);
    } else {
        currentSteps = ["applied", "rejected"];
    }

    if (status === "mentor_approval_needed") {
      return <></>
    }

    const isRejected = status === "rejected";

  return (
    <TooltipProvider>
      <div className='flex flex-col gap-2 mb-2 mx-1'>
        <div className='flex items-center'>
          {currentSteps.map((s, index) => {
            const config = getStatusConfig(s);
            const isCurrentStatus = s === status;
            const isCompleted = index < currentSteps.length - 1;
            
            return (
              <div key={index} className='flex items-center'>
                {/* Status Node with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative flex-col items-center justify-center'>
                      <div 
                        className={`
                          rounded-full transition-all duration-300 shadow-sm
                          ${isCurrentStatus ? 'h-3 w-3 ring-4 ring-offset-1' : 'h-2.5 w-2.5'}
                          ${isCurrentStatus ? config.color + ' ring-' + config.color + '/20' : config.color}
                        `}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="absolute inset-0 h-3 w-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                      {
                        (index === 0 || index === currentSteps.length -1) && (
                          <span className="absolute -left-[100%] top-5 text-[10px] font-medium text-slate-900">
                            {getStatusConfig(currentSteps[index]).label}
                          </span>
                        )
                      }
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">{config.label}</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Connector Line */}
                {index < currentSteps.length - 1 && (
                  <div 
                    className={`
                      h-0.5 transition-all duration-300
                      ${isRejected && index === currentSteps.length - 2 ? 'w-8' : 'w-12'}
                      ${config.color}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Status Labels - Only show first and current */}
        {/* <div className='flex items-center justify-between'>
          <span className="text-[10px] font-medium text-slate-900">
            {getStatusConfig(currentSteps[0]).label}
          </span>
          {currentSteps.length > 1 && (
            <span className="text-[10px] font-medium text-slate-900 ml-2">
              {getStatusConfig(currentSteps[currentSteps.length - 1]).label}
            </span>
          )}
        </div> */}
      </div>
    </TooltipProvider>
  )
}

export default Status
