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
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Documents</CardTitle>
          <CardDescription className="text-slate-600">Manage your resume and other important documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-sky-200 rounded-3xl p-8 text-center bg-sky-50/30 hover:bg-sky-50/50 transition-colors">
            <div className="rounded-full bg-gradient-to-br from-sky-100 to-blue-100 p-4 w-fit mx-auto mb-4">
              <Upload className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Upload Resume</h3>
            <p className="text-sm text-slate-600 mb-4">Upload your latest resume in PDF format</p>
            <Button className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
              Choose File
            </Button>
          </div>
          {student.resume && (
            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-slate-50/60">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl">
                  <Download className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Current Resume</p>
                  <p className="text-sm text-slate-600">Last updated: Nov 15, 2024</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-slate-200 hover:bg-slate-50"
              >
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
