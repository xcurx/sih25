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
      <Card>
        <CardHeader>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Set your preferences for job recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Preferred Job Types</Label>
              <div className="flex flex-wrap gap-2">
                {student.preferences.jobTypes.map((type, index) => (
                  <Badge key={index} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2">
                {student.preferences.locations.map((location, index) => (
                  <Badge key={index} variant="secondary">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Salary Range (Annual)</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Min"
                onChange={(e) => {}}
                value={student.preferences.salaryRange.min}
                disabled={!isEditing}
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                onChange={(e) => {}}
                value={student.preferences.salaryRange.max}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preferred Industries</Label>
            <div className="flex flex-wrap gap-2">
              {student.preferences.industries.map((industry, index) => (
                <Badge key={index} variant="secondary">
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
