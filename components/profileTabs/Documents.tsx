"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import {
    Download,
    Upload
} from "lucide-react"
import { useState } from "react"


const Documents = () => {
    const [student, setStudent] = useState<Student>(mockStudents[0])

  return (
    <TabsContent value="documents" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Manage your resume and other important documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Upload Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your latest resume in PDF format</p>
            <Button>Choose File</Button>
          </div>
          {student.resume && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-muted-foreground">Last updated: Nov 15, 2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Documents
