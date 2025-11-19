"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

const Settings = () => {
  return (
    <TabsContent value="settings" className="space-y-6">
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Account Settings</CardTitle>
          <CardDescription className="text-slate-600">Manage your account preferences and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Change Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter new password"
              className="rounded-full border-slate-200 focus:border-sky-300 focus:ring-sky-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm new password"
              className="rounded-full border-slate-200 focus:border-sky-300 focus:ring-sky-200"
            />
          </div>
          <Button className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Settings
