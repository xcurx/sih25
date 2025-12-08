"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from "@/lib/types"
import {
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Star,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function EmployerCard({
  company,
  onViewDetails,
}: {
  company: Company | null
  onViewDetails?: React.Dispatch<React.SetStateAction<Company | null>>
}) {
  if (!company) return null

  const primaryContact = company.employees?.[0]

  return (
    <Card className="group rounded-3xl border-slate-200 bg-white/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Gradient Header */}
      <div className="h-3 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <Avatar className="h-16 w-16 rounded-2xl border-2 border-white shadow-md">
            <AvatarImage src="/placeholder.svg" alt={company.name} />
            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 text-lg font-bold">
              {company.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-bold text-slate-900 truncate">
                {company.name}
              </CardTitle>
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-amber-700">4.0</span>
              </div>
            </div>
            <Badge className="rounded-full bg-sky-100 text-sky-700 border-sky-200 font-medium">
              {company.industry}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info */}
        <div className="flex flex-wrap gap-2">
          {company.location && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span>{company.location}</span>
            </div>
          )}
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-sky-100 hover:text-sky-700 transition-colors cursor-pointer">
                <Globe className="h-3 w-3 text-slate-400" />
                <span>Website</span>
              </div>
            </a>
          )}
        </div>

        {/* Primary Contact */}
        {primaryContact && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Primary Contact</h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-xl border border-white shadow-sm">
                <AvatarImage src="/placeholder.svg" alt={primaryContact.name} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold">
                  {primaryContact.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{primaryContact.name}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{primaryContact.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Users className="h-4 w-4" />
              <span className="text-lg font-bold">{company.employees?.length || 0}</span>
            </div>
            <div className="text-xs text-slate-600">Recruiters</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Star className="h-4 w-4" />
              <span className="text-lg font-bold">4.0</span>
            </div>
            <div className="text-xs text-slate-600">Rating</div>
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{company.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/employers/${company.id}`} className="flex-1">
            <Button 
              className="w-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Building2 className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
          {onViewDetails && (
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full border-slate-200 hover:bg-slate-100"
              onClick={() => onViewDetails(company)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
