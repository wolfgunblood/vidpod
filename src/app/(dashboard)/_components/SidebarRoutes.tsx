"use client";

import React from "react";
import SidebarItems from "./SidebarItems";

const mainRoutes = [
  {
    icon: "/home.svg",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: "/bar-chart-3.svg",
    label: "Analytics",
    href: "/",
  },
  {
    icon: "/circle-dollar-sign.svg",
    label: "Ads",
    href: "/ads",
  },
  {
    icon: "/tv.svg",
    label: "Channels",
    href: "/channels",
  },
  {
    icon: "/import.svg",
    label: "Import",
    href: "/import",
  },
  {
    icon: "/settings.svg",
    label: "Settings",
    href: "/settings",
  },
];

const SidebarRoutes = () => {
  const routes = mainRoutes;
  return (
    <div className="flex flex-col gap-8 px-8 py-0">
      {routes.map((route, index) => (
        <SidebarItems
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
