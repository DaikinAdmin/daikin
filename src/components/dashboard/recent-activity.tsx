"use client";

import {
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

interface RecentActivityProps {
  userRole: "user" | "employee" | "admin";
}

const activityConfig = {
  user: [
    {
      title: "Order #2024-001 shipped",
      description: "Your laptop order is on its way",
      time: "2 hours ago",
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Benefit enrolled",
      description: "You've enrolled in the health insurance plan",
      time: "1 day ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Profile updated",
      description: "Emergency contact information updated",
      time: "3 days ago",
      icon: User,
      color: "text-purple-600",
    },
  ],
  employee: [
    {
      title: "New order created",
      description: "Office supplies order for Marketing team",
      time: "30 minutes ago",
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Message received",
      description: "From HR regarding policy update",
      time: "2 hours ago",
      icon: MessageSquare,
      color: "text-yellow-600",
    },
    {
      title: "Order approved",
      description: "Equipment request for John Doe approved",
      time: "5 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ],
  admin: [
    {
      title: "New user registered",
      description: "Sarah Johnson joined the platform",
      time: "15 minutes ago",
      icon: User,
      color: "text-blue-600",
    },
    {
      title: "System alert",
      description: "High order volume detected",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Event created",
      description: "Annual company meeting scheduled",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ],
};

export function RecentActivity({ userRole }: RecentActivityProps) {
  const activities = activityConfig[userRole];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-gray-100 ${activity.color} flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}