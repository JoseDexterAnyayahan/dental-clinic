"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Clock4,
  CheckCircle2,
  UserCog,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Activity,
  Zap,
  Star,
} from "lucide-react";
import api from "@/lib/api";
import AdminHeader from "@/components/admin/AdminHeader";
import AppointmentsChart from "@/components/admin/AppointmentsChart";
import AppointmentStatusBadge from "@/components/shared/AppointmentStatusBadge";
import { Appointment } from "@/types/appointment.types";
import { DashboardStats } from "@/types/admin";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const [statsRes, apptRes] = await Promise.all([
        api.get<DashboardStats>("/admin/dashboard"),
        api.get<{ data: Appointment[] }>("/admin/appointments", {
          params: { per_page: 5 },
        }),
      ]);
      setStats(statsRes.data);
      setRecent(apptRes.data.data ?? []);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
      {/* Header with Action */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <AdminHeader
          title="Dashboard"
          subtitle="Welcome back! Here's your clinic overview for today."
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickActionCard
          title="Appointments"
          description="Manage all bookings"
          href="/admin/dashboard/appointments"
          icon={CalendarDays}
          color="blue"
          count={stats?.pending_appointments}
        />
        <QuickActionCard
          title="Clients"
          description="Patient records"
          href="/admin/dashboard/clients"
          icon={Users}
          color="green"
        />
        <QuickActionCard
          title="Dentists"
          description="Staff management"
          href="/admin/dashboard/dentists"
          icon={UserCog}
          color="purple"
        />
        <QuickActionCard
          title="Services"
          description="Dental procedures"
          href="/admin/dashboard/services"
          icon={Zap}
          color="orange"
        />
      </div>

      {loading ? (
        <div
          className="bg-white rounded-2xl border h-64 animate-pulse mb-8"
          style={{ borderColor: "hsl(213,30%,91%)" }}
        />
      ) : (
        stats && <AppointmentsChart stats={stats} />
      )}

      {/* Recent Appointments Card */}
      <div
        className="bg-white rounded-2xl border shadow-sm"
        style={{ borderColor: "hsl(213,30%,91%)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(213,30%,91%)" }}
        >
          <div>
            <h2
              className="text-lg font-serif font-bold"
              style={{ color: "hsl(220,60%,15%)" }}
            >
              Recent Appointments
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "hsl(220,15%,50%)" }}>
              Latest {recent.length} bookings
            </p>
          </div>
          <Link
            href="/admin/dashboard/appointments"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: "hsl(213,60%,95%)",
              color: "hsl(213,94%,44%)",
            }}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl animate-pulse"
                style={{ background: "hsl(213,30%,96%)" }}
              />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle
              className="w-12 h-12 mx-auto mb-3 opacity-30"
              style={{ color: "hsl(220,15%,60%)" }}
            />
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "hsl(220,30%,40%)" }}
            >
              No appointments yet
            </p>
            <p className="text-xs" style={{ color: "hsl(220,15%,60%)" }}>
              Appointments will appear here once booked
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "hsl(213,30%,91%)" }}>
            {recent.map((a) => (
              <Link
                key={a.id}
                href="/admin/dashboard/appointments"
                className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all group"
              >
                {/* Avatar Circle */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(213,60%,95%) 0%, hsl(199,80%,92%) 100%)",
                    color: "hsl(213,94%,44%)",
                  }}
                >
                  {((a as any).client?.user?.name?.[0] || "U").toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold truncate group-hover:text-brand-blue transition-colors"
                    style={{ color: "hsl(220,60%,15%)" }}
                  >
                    {(a as any).client?.user?.name ?? "Unknown Patient"}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: "hsl(220,15%,55%)" }}
                  >
                    {(a as any).service?.name} · Dr.{" "}
                    {(a as any).dentist?.first_name}{" "}
                    {(a as any).dentist?.last_name}
                  </p>
                </div>

                {/* Date & Status */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "hsl(220,30%,35%)" }}
                    >
                      {new Date(a.appointment_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "hsl(220,15%,60%)" }}
                    >
                      {a.start_time.slice(0, 5)}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={a.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Quick Action Component
interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: "blue" | "green" | "purple" | "orange";
  count?: number;
}

function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  color,
  count,
}: QuickActionCardProps) {
  const colors = {
    blue: {
      bg: "hsl(213,60%,95%)",
      text: "hsl(213,94%,44%)",
      gradient:
        "linear-gradient(135deg, hsl(213,60%,95%) 0%, hsl(199,80%,92%) 100%)",
    },
    green: {
      bg: "hsl(142,60%,95%)",
      text: "hsl(142,72%,35%)",
      gradient:
        "linear-gradient(135deg, hsl(142,60%,95%) 0%, hsl(142,80%,88%) 100%)",
    },
    purple: {
      bg: "hsl(270,60%,95%)",
      text: "hsl(270,70%,45%)",
      gradient:
        "linear-gradient(135deg, hsl(270,60%,95%) 0%, hsl(270,80%,88%) 100%)",
    },
    orange: {
      bg: "hsl(25,90%,95%)",
      text: "hsl(25,90%,45%)",
      gradient:
        "linear-gradient(135deg, hsl(25,90%,95%) 0%, hsl(25,95%,88%) 100%)",
    },
  };

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border p-5 hover:shadow-xl transition-all overflow-hidden"
      style={{ borderColor: "hsl(213,30%,91%)" }}
    >
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
        style={{ background: colors[color].gradient }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ background: colors[color].bg }}
        >
          <Icon className="w-6 h-6" style={{ color: colors[color].text }} />
        </div>

        {count !== undefined && count > 0 && (
          <span
            className="px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: colors[color].text, color: "white" }}
          >
            {count}
          </span>
        )}
      </div>

      <h3
        className="font-serif font-bold text-base mb-1 group-hover:translate-x-1 transition-transform"
        style={{ color: "hsl(220,60%,15%)" }}
      >
        {title}
      </h3>
      <p className="text-sm mb-3" style={{ color: "hsl(220,15%,50%)" }}>
        {description}
      </p>

      <div
        className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: colors[color].text }}
      >
        Open
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
