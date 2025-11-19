"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { mockStudents } from "@/lib/mock-data"
import type { Student } from "@/lib/types"
import {
    Award,
    Edit,
    ExternalLink,
    Plus
} from "lucide-react"
import { useState } from "react"

const Certificates = () => {
    const [student, setStudent] = useState<Student>(mockStudents[0])

  return (
    <TabsContent value="certifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
              <p className="text-slate-600">Your professional certifications and achievements</p>
            </div>
            <Button className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </div>

          <div className="grid gap-4">
            {student.certifications.map((cert) => (
              <Card key={cert.id} className="group relative overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-lg transition-all hover:shadow-xl hover:border-sky-200">
                {/* Subtle gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-sky-50/50 to-transparent" />
                
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl">
                        <Award className="h-6 w-6 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900">{cert.name}</h3>
                        <p className="text-slate-600 font-medium mt-1">{cert.issuer}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            Issued: {cert.issueDate}
                          </span>
                          {cert.expiryDate && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                              Expires: {cert.expiryDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {cert.credentialUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="rounded-full border-sky-200 hover:bg-sky-50"
                          asChild
                        >
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-sky-600" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full border-slate-200 hover:bg-slate-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
  )
}

export default Certificates
