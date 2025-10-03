import React from 'react'
import { DashboardLayout } from './page'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  )
}

export default layout
