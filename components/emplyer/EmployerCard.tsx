"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from "@/lib/types"
import {
    Building2,
    Calendar,
    Eye,
    Mail,
    MapPin,
    MessageSquare,
    Star,
    Users
} from "lucide-react"


export default function EmployerCard({
  company,
  // companyInfo,
  onViewDetails,
}: {
  company: Company | null
  // companyInfo: any
  onViewDetails: React.Dispatch<React.SetStateAction<Company | null>>
}) {
  if (!company) return null

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{company.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="text-sm font-medium">{4}</span>
                  </div>
              </div>
              <CardDescription className="text-base font-medium">Contact: {company.employees && company.employees[0].name}</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{company.employees && company.employees[0].email}</span>
                </div>
                  <>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      {/* <span>{companyInfo.size} employees</span> */}
                    </div>
                  </>
              </div>
            </div>
          </div>
          <Badge variant="secondary">{company?.industry}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* {companyInfo && (
          <>
            <p className="text-muted-foreground line-clamp-2">{companyInfo.description}</p>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{companyInfo.activeJobs}</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{companyInfo.totalHires}</div>
                <div className="text-xs text-muted-foreground">Total Hires</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">₹{(companyInfo.avgSalary / 100000).toFixed(1)}L</div>
                <div className="text-xs text-muted-foreground">Avg. Package</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">
                  {new Date().getFullYear() - Number.parseInt(companyInfo.established)}
                </div>
                <div className="text-xs text-muted-foreground">Years Old</div>
              </div>
            </div>
          </>
        )} */}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last interaction: 2 days ago</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button size="sm" onClick={() => onViewDetails(company)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
