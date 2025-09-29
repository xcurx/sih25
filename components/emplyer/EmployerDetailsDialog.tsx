"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Company } from "@/lib/types"
import {
    Building2,
    Star
} from "lucide-react"


export default function EmployerDetailsDialog({
  company,
  onClose,
}: {
  company: Company | null
  onClose: () => void
}) {
  if (!company) return null

  return (
    <Dialog open={!!company} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>{company.name}</span>
          </DialogTitle>
          <DialogDescription>
            {company.industry} • { /*{companyInfo.size} employees • Est. {companyInfo.established} */}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{company.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-primary hover:underline cursor-pointer">{company.website}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p>{company.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                  {/* <p>{companyInfo.size} employees</p> */}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>4/5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={"/placeholder.svg"} alt={company.employees && company.employees[0].name} />
                  <AvatarFallback className="text-lg">
                    {company.employees && company.employees[0].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{company.employees && company.employees[0].name}</h3>
                  <p className="text-muted-foreground">HR Representative</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{company.employees && company.employees[0].email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                      <p>{company.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Statistics */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Recruitment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{companyInfo.activeJobs}</div>
                  <div className="text-sm text-muted-foreground">Active Job Postings</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{companyInfo.totalHires}</div>
                  <div className="text-sm text-muted-foreground">Students Hired</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent">₹{(companyInfo.avgSalary / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Average Package</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{companyInfo.rating}</div>
                  <div className="text-sm text-muted-foreground">Company Rating</div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Recent Activity */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-100 rounded-full">
                  <Briefcase className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Posted new job: Senior Software Engineer</p>
                  <p className="text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Users className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Interviewed 5 candidates</p>
                  <p className="text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-yellow-100 rounded-full">
                  <Star className="h-3 w-3 text-yellow-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Selected 3 students for internship</p>
                  <p className="text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}