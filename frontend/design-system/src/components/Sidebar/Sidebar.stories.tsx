import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, Users } from "lucide-react";

import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarGroupContent } from "./SidebarGroupContent";
import { SidebarGroupLabel } from "./SidebarGroupLabel";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarInset } from "./SidebarInset";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarTrigger } from "./SidebarTrigger";

const meta = {
  component: SidebarProvider,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SidebarProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = [
  { title: "Home", icon: Home, url: "#" },
  { title: "Users", icon: Users, url: "#" },
  { title: "Settings", icon: Settings, url: "#" },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold text-sm px-2">My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground px-2">v1.0.0</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Dashboard</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground text-sm">Main content area.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Dashboard</h1>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
};
