"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import { useState } from "react"

const Preferences = ({ isEditing }: { isEditing:boolean }) => {
    const [student, setStudent] = useState<Student>(mockStudents[0])

  return (
     <TabsContent value="preferences" className="space-y-6">
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Job Preferences</CardTitle>
          <CardDescription className="text-slate-600">Set your preferences for job recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-medium">Preferred Job Types</Label>
              <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                {student.preferences.jobTypes.map((type, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="rounded-full border-sky-200 bg-sky-50 text-sky-700"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-medium">Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                {student.preferences.locations.map((location, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="rounded-full border-sky-200 bg-sky-50 text-sky-700"
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium">Salary Range (Annual)</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Min"
                onChange={(e) => {}}
                value={student.preferences.salaryRange.min}
                disabled={!isEditing}
                className="rounded-full border-slate-200 disabled:bg-slate-50"
              />
              <span className="text-slate-600 font-medium">to</span>
              <Input
                type="number"
                placeholder="Max"
                onChange={(e) => {}}
                value={student.preferences.salaryRange.max}
                disabled={!isEditing}
                className="rounded-full border-slate-200 disabled:bg-slate-50"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium">Preferred Industries</Label>
            <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              {student.preferences.industries.map((industry, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="rounded-full border-sky-200 bg-sky-50 text-sky-700"
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Preferences
