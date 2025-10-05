"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, Users, User, Eye, TrendingUp, Check, X } from "lucide-react"

export default function ProfilePage() {
  const { institution, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600">No institution data found. Please log in again.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)] border-[color:var(--primary-200)]'
      case 'pending':
        return 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)] border-[color:var(--primary-200)]'
      case 'rejected':
        return 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)] border-[color:var(--primary-200)]'
      default:
        return 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)] border-[color:var(--primary-200)]'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Check className="h-4 w-4 text-[color:var(--primary-600)]" />
      case 'pending':
        return <Calendar className="h-4 w-4 text-[color:var(--primary-600)]" />
      case 'rejected':
        return <X className="h-4 w-4 text-[color:var(--primary-600)]" />
      default:
        return <Check className="h-4 w-4 text-[color:var(--primary-600)]" />
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[color:var(--primary-50)] to-[color:var(--primary-100)]">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Institution Profile</h1>
              <p className="text-gray-600 mt-2">Manage your institution details and settings</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Institution Overview */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                    <User className="h-6 w-6 text-[color:var(--primary-600)]" />
                  </div>
                  Institution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                      {institution.logoUrl ? (
                        <AvatarImage src={institution.logoUrl} alt={`${institution.name} logo`} />
                      ) : null}
                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[color:var(--primary-500)] to-[color:var(--primary-600)] text-white">
                        {institution.name?.charAt(0)?.toUpperCase() || "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className={`flex items-center gap-1 px-2 py-1 text-xs font-medium border ${getStatusColor(institution.approvalStatus)} hover:bg-transparent`}>
                        {getStatusIcon(institution.approvalStatus)}
                        {institution.approvalStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{institution.name}</h2>
                    <p className="text-lg text-gray-600 mb-3">{institution.type}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {institution.affiliatedBoard}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Est. {institution.yearOfEstablishment}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {institution.totalStudentStrength.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <User className="h-5 w-5 text-[color:var(--primary-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{institution.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <User className="h-5 w-5 text-[color:var(--primary-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{institution.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <Eye className="h-5 w-5 text-[color:var(--primary-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {institution.website ? (
                          <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-[color:var(--primary-600)] hover:underline">
                            {institution.website}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <Calendar className="h-5 w-5 text-[color:var(--primary-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm font-semibold text-gray-900">{institution.address}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Institution Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="p-1 bg-[color:var(--primary-100)] rounded">
                      <TrendingUp className="h-4 w-4 text-[color:var(--primary-600)]" />
                    </div>
                    Institution Stats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-r from-[color:var(--primary-50)] to-[color:var(--primary-100)] rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Curriculum Mode</span>
                        <Badge className="bg-[color:var(--primary-100)] text-[color:var(--primary-700)] border-[color:var(--primary-200)] hover:bg-[color:var(--primary-100)]">
                          {institution.curriculumMode || "Standard"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-[color:var(--primary-50)] to-[color:var(--primary-100)] rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Approval Status</span>
                        <Badge className={`flex items-center gap-1 ${getStatusColor(institution.approvalStatus)} hover:bg-transparent`}>
                          {getStatusIcon(institution.approvalStatus)}
                          {institution.approvalStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Account Status</span>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-[color:var(--primary-100)] text-[color:var(--primary-700)] border-[color:var(--primary-200)] hover:bg-[color:var(--primary-100)]">
                            {institution.isSuspended ? 'Suspended' : 'Active'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {institution.pocName && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <User className="h-6 w-6 text-[color:var(--primary-600)]" />
                    </div>
                    Point of Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[color:var(--primary-50)] to-[color:var(--primary-100)] rounded-lg">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <User className="h-6 w-6 text-[color:var(--primary-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="text-lg font-semibold text-gray-900">{institution.pocName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Institution Proof */}
            {institution.proofOfInstitutionUrl && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <Eye className="h-6 w-6 text-[color:var(--primary-600)]" />
                    </div>
                    Institution Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Official institution registration and verification documents
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="gap-2 border-[color:var(--primary-200)] text-[color:var(--primary-700)] "
                        asChild
                      >
                        <a
                          href={institution.proofOfInstitutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4" />
                          View Document
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Brand Colors */}
            {(institution.primaryColor || institution.secondaryColor) && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-[color:var(--primary-100)] rounded-lg">
                      <Eye className="h-6 w-6 text-[color:var(--primary-600)]" />
                    </div>
                    Brand Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {institution.primaryColor && (
                    <div className="p-4 bg-gradient-to-r from-[color:var(--primary-50)] to-[color:var(--primary-100)] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: institution.primaryColor }}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Primary Color</p>
                          <p className="text-xs font-mono text-gray-800 bg-white/50 px-2 py-1 rounded">
                            {institution.primaryColor}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {institution.secondaryColor && (
                    <div className="p-4 bg-gradient-to-r from-[color:var(--primary-50)] to-[color:var(--primary-100)] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: institution.secondaryColor }}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Secondary Color</p>
                          <p className="text-xs font-mono text-gray-800 bg-white/50 px-2 py-1 rounded">
                            {institution.secondaryColor}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
