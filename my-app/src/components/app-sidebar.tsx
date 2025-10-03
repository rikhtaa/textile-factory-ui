"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible"

type MainItem = {
  mainTitle: string
  title: string
  url: string
  title2?: string
  url2?: string
}

type SimpleItem = {
  title: string
  url: string
}

type NavProps = {
  items: MainItem[]
  simpleItems: SimpleItem[]
}

const NavMain = React.memo(function NavMain({ items, simpleItems }: NavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.mainTitle}>
              <Collapsible defaultOpen={false} className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex justify-between items-center" tooltip={item.mainTitle}>
                    <span>{item.mainTitle}</span>
                    <ChevronDown
                      className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out
                      group-data-[state=open]:rotate-180"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.url && (
                      <SidebarMenuSubItem key={item.title}>
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuSubItem>
                    )}
                    {item.url2 && item.title2 && (
                      <SidebarMenuSubItem key={item.title2}>
                        <Link href={item.url2}>{item.title2}</Link>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ))}

          {simpleItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>{item.title}</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mainItems: MainItem[] = [
    {
      mainTitle: "Looms",
      title: "Add Looms",
      url: "/looms",
      title2: "Looms Management",
      url2: "/loomManagement",
    },
    {
      mainTitle: "Beams",
      title: "Add Beams",
      url: "/beam",
      title2: "Beams Production",
      url2: "/beamProduction",
    },
  ]

  const simpleItems: SimpleItem[] = [
    { title: "Workers", url: "/dashboard" },
    { title: "Qualities", url: "/qualities" },
    { title: "Production", url: "/production" },
    { title: "Reports", url: "/reports" },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={mainItems} simpleItems={simpleItems} />
      </SidebarContent>
    </Sidebar>
  )
}
