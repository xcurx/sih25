import { ApplicationStatus } from '@/lib/types'
import React from 'react'

const Status = ({status}:{status:ApplicationStatus}) => {
    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
          case "applied":
            return "bg-blue-400"
          case "reviewed":
            return "bg-indigo-400"
          case "shortlisted":
            return "bg-emerald-500"
          case "interviewed":
            return "bg-amber-500"
          case "rejected":
            return "bg-rose-500"
          case "accepted":
            return "bg-green-500"
          default:
            return "secondary"
        }
    }

    const allStatuses: ApplicationStatus[] = ["applied", "reviewed", "shortlisted", "interviewed", "accepted"];
    if (status != "rejected") {
        allStatuses.forEach((s, index) => {
            if (s === status) {
                allStatuses.splice(index + 1);
            }
        })
    } else {
        allStatuses[allStatuses.length-1] = "rejected"
    }


  return (
    <div className='flex items-center'>
        {
          allStatuses.map((s, index) => (
              <div key={index} className='flex items-center'>
                  <div className={`rounded-full h-2 w-2 ${getStatusColor(s)}`}></div>
                  <div className={`h-0.5 w-10 ${getStatusColor(s)}`}></div>
              </div>
          ))
        }
        <div className={`rounded-full h-2 w-2 ${getStatusColor(status)}`}></div>
    </div>
  )
}

export default Status
