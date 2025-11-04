"use client";

import { 
  Users, 
  ShoppingBag, 
  Calendar, 
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface DashboardStatsProps {
  userRole: "user" | "employee" | "admin";
}

const statsConfig = {
  user: [
    {
      title: "Active Orders",
      value: "3",
      icon: ShoppingBag,
      color: "bg-blue-500",
      change: "+2 from last month",
    },
    {
      title: "Available Benefits",
      value: "12",
      icon: Gift,
      color: "bg-green-500",
      change: "+3 new this month",
    },
    {
      title: "Profile Completion",
      value: "85%",
      icon: Users,
      color: "bg-purple-500",
      change: "Almost complete",
    },
  ],
  employee: [
    {
      title: "Orders Created",
      value: "24",
      icon: ShoppingBag,
      color: "bg-blue-500",
      change: "+12% from last month",
    },
    {
      title: "Pending Approvals",
      value: "8",
      icon: Clock,
      color: "bg-yellow-500",
      change: "3 urgent",
    },
    {
      title: "Messages",
      value: "15",
      icon: AlertCircle,
      color: "bg-red-500",
      change: "5 unread",
    },
  ],
  admin: [
    {
      title: "Total Users",
      value: "1,247",
      icon: Users,
      color: "bg-blue-500",
      change: "+8% from last month",
    },
    {
      title: "Orders This Month",
      value: "156",
      icon: ShoppingBag,
      color: "bg-green-500",
      change: "+23% from last month",
    },
    {
      title: "Active Events",
      value: "8",
      icon: Calendar,
      color: "bg-purple-500",
      change: "2 ending soon",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: CheckCircle,
      color: "bg-green-600",
      change: "All systems operational",
    },
  ],
};

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const stats = statsConfig[userRole];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-full ${stat.color}`}>
                <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4">
              <p className="text-xs lg:text-sm text-gray-500">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}