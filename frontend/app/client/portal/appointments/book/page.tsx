"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react";
import api from "@/lib/api";
import { Service, Dentist } from "@/types/appointment.types";
import Link from "next/link";

type Step = "service" | "dentist" | "datetime" | "confirm";

interface BookingData {
  service_id?: number;
  dentist_id?: number;
  appointment_date?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("service");
  const [booking, setBooking] = useState<BookingData>({});

  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch services on mount
  useEffect(() => {
    api.get<Service[]>("/services").then((res) => setServices(res.data));
  }, []);

  // Fetch dentists when service selected
  useEffect(() => {
    if (booking.service_id) {
      api
        .get<Dentist[]>("/services/dentists", {
          params: { service_id: booking.service_id },
        })
        .then((res) => setDentists(res.data));
    }
  }, [booking.service_id]);

  // Fetch available slots when dentist + date selected
  useEffect(() => {
    if (booking.dentist_id && booking.appointment_date) {
      setLoading(true);
      api
        .get("/services/available-slots", {
          params: {
            dentist_id: booking.dentist_id,
            date: booking.appointment_date,
          },
        })
        .then((res) => {
          setAvailableSlots(res.data.slots || []);
        })
        .finally(() => setLoading(false));
    }
  }, [booking.dentist_id, booking.appointment_date]);

  const selectedService = services.find((s) => s.id === booking.service_id);
  const selectedDentist = dentists.find((d) => d.id === booking.dentist_id);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post("/client/appointments", booking);
      router.push("/client/portal/appointments?success=true");
    } catch (error: any) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 py-8 px-4">
      <div className="flex-1 px-5 py-6 lg:px-8 lg:py-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/client/portal/appointments"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/80 transition-colors"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: "hsl(220,60%,15%)" }}
            />
          </Link>
          <div>
            <h1
              className="text-2xl font-serif font-bold"
              style={{ color: "hsl(220,60%,15%)" }}
            >
              Book Appointment
            </h1>
            <p className="text-sm" style={{ color: "hsl(220,15%,50%)" }}>
              {step === "service" && "Choose a service"}
              {step === "dentist" && "Select your dentist"}
              {step === "datetime" && "Pick date and time"}
              {step === "confirm" && "Review and confirm"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 max-w-md mx-auto">
          {(["service", "dentist", "datetime", "confirm"] as Step[]).map(
            (s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step === s ? "scale-110" : ""}`}
                  style={{
                    background:
                      step === s ||
                      i <
                        ["service", "dentist", "datetime", "confirm"].indexOf(
                          step,
                        )
                        ? "linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)"
                        : "hsl(213,30%,90%)",
                    color:
                      step === s ||
                      i <
                        ["service", "dentist", "datetime", "confirm"].indexOf(
                          step,
                        )
                        ? "white"
                        : "hsl(220,30%,50%)",
                  }}
                >
                  {i <
                  ["service", "dentist", "datetime", "confirm"].indexOf(
                    step,
                  ) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div
                    className="flex-1 h-0.5 mx-2"
                    style={{
                      background:
                        i <
                        ["service", "dentist", "datetime", "confirm"].indexOf(
                          step,
                        )
                          ? "hsl(213,94%,44%)"
                          : "hsl(213,30%,90%)",
                    }}
                  />
                )}
              </div>
            ),
          )}
        </div>

        {/* Step Content */}
        <div
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border"
          style={{ borderColor: "hsl(213,30%,90%)" }}
        >
          {/* STEP 1: Service */}
          {step === "service" && (
            <div className="space-y-4">
              <h2
                className="text-lg font-serif font-bold mb-4"
                style={{ color: "hsl(220,60%,15%)" }}
              >
                Select Service
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setBooking({ ...booking, service_id: service.id });
                      setStep("dentist");
                    }}
                    className="p-4 rounded-2xl border-2 text-left hover:shadow-lg transition-all"
                    style={{
                      borderColor:
                        booking.service_id === service.id
                          ? "hsl(213,94%,44%)"
                          : "hsl(213,30%,90%)",
                      background:
                        booking.service_id === service.id
                          ? "hsl(213,60%,97%)"
                          : "white",
                    }}
                  >
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "hsl(220,60%,15%)" }}
                    >
                      {service.name}
                    </p>
                    <p
                      className="text-xs mb-2"
                      style={{ color: "hsl(220,15%,60%)" }}
                    >
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: "hsl(213,94%,44%)" }}>
                        ₱{parseFloat(service.price).toLocaleString()}
                      </span>
                      <span style={{ color: "hsl(220,15%,60%)" }}>
                        {service.duration_mins} min
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Dentist */}
          {step === "dentist" && (
            <div className="space-y-4">
              <h2
                className="text-lg font-serif font-bold mb-4"
                style={{ color: "hsl(220,60%,15%)" }}
              >
                Choose Dentist
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {dentists.map((dentist) => (
                  <button
                    key={dentist.id}
                    onClick={() => {
                      setBooking({ ...booking, dentist_id: dentist.id });
                      setStep("datetime");
                    }}
                    className="p-4 rounded-2xl border-2 text-left hover:shadow-lg transition-all"
                    style={{
                      borderColor:
                        booking.dentist_id === dentist.id
                          ? "hsl(213,94%,44%)"
                          : "hsl(213,30%,90%)",
                      background:
                        booking.dentist_id === dentist.id
                          ? "hsl(213,60%,97%)"
                          : "white",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)",
                        }}
                      >
                        {dentist.first_name[0]}
                        {dentist.last_name[0]}
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: "hsl(220,60%,15%)" }}
                        >
                          Dr. {dentist.first_name} {dentist.last_name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "hsl(213,94%,44%)" }}
                        >
                          {dentist.specialization}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("service")}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ color: "hsl(213,94%,44%)" }}
              >
                ← Back to Services
              </button>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {step === "datetime" && (
            <div className="space-y-6">
              <h2
                className="text-lg font-serif font-bold"
                style={{ color: "hsl(220,60%,15%)" }}
              >
                Pick Date & Time
              </h2>

              {/* Date Picker */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "hsl(220,30%,35%)" }}
                >
                  Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={booking.appointment_date || ""}
                  onChange={(e) =>
                    setBooking({ ...booking, appointment_date: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "hsl(213,30%,90%)",
                    color: "hsl(220,60%,15%)",
                  }}
                />
              </div>

              {/* Time Slots */}
              {booking.appointment_date && (
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "hsl(220,30%,35%)" }}
                  >
                    Available Time Slots
                  </label>
                  {loading ? (
                    <p
                      className="text-sm"
                      style={{ color: "hsl(220,15%,60%)" }}
                    >
                      Loading slots...
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm" style={{ color: "hsl(0,70%,50%)" }}>
                      No slots available for this date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.start_time}
                          disabled={!slot.available}
                          onClick={() => {
                            setBooking({
                              ...booking,
                              start_time: slot.start_time,
                              end_time: slot.end_time,
                            });
                            setStep("confirm");
                          }}
                          className="px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            borderWidth: 2,
                            borderColor:
                              booking.start_time === slot.start_time
                                ? "hsl(213,94%,44%)"
                                : "hsl(213,30%,90%)",
                            background:
                              booking.start_time === slot.start_time
                                ? "hsl(213,60%,97%)"
                                : "white",
                            color: slot.available
                              ? "hsl(220,60%,15%)"
                              : "hsl(220,15%,60%)",
                          }}
                        >
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep("dentist")}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ color: "hsl(213,94%,44%)" }}
              >
                ← Back to Dentists
              </button>
            </div>
          )}

          {/* STEP 4: Confirm */}
          {step === "confirm" && (
            <div className="space-y-6">
              <h2
                className="text-lg font-serif font-bold"
                style={{ color: "hsl(220,60%,15%)" }}
              >
                Review Booking
              </h2>

              <div
                className="space-y-4 p-4 rounded-2xl"
                style={{ background: "hsl(213,60%,97%)" }}
              >
                {selectedService && (
                  <div className="flex items-start gap-3">
                    <FileText
                      className="w-5 h-5 mt-0.5"
                      style={{ color: "hsl(213,94%,44%)" }}
                    />
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(220,15%,60%)" }}
                      >
                        Service
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: "hsl(220,60%,15%)" }}
                      >
                        {selectedService.name}
                      </p>
                    </div>
                  </div>
                )}

                {selectedDentist && (
                  <div className="flex items-start gap-3">
                    <User
                      className="w-5 h-5 mt-0.5"
                      style={{ color: "hsl(213,94%,44%)" }}
                    />
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(220,15%,60%)" }}
                      >
                        Dentist
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: "hsl(220,60%,15%)" }}
                      >
                        Dr. {selectedDentist.first_name}{" "}
                        {selectedDentist.last_name}
                      </p>
                    </div>
                  </div>
                )}

                {booking.appointment_date && (
                  <div className="flex items-start gap-3">
                    <Calendar
                      className="w-5 h-5 mt-0.5"
                      style={{ color: "hsl(213,94%,44%)" }}
                    />
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(220,15%,60%)" }}
                      >
                        Date
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: "hsl(220,60%,15%)" }}
                      >
                        {new Date(booking.appointment_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {booking.start_time && booking.end_time && (
                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-5 h-5 mt-0.5"
                      style={{ color: "hsl(213,94%,44%)" }}
                    />
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(220,15%,60%)" }}
                      >
                        Time
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: "hsl(220,60%,15%)" }}
                      >
                        {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "hsl(220,30%,35%)" }}
                >
                  Notes (Optional)
                </label>
                <textarea
                  value={booking.notes || ""}
                  onChange={(e) =>
                    setBooking({ ...booking, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Any specific concerns or requests?"
                  className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "hsl(213,30%,90%)",
                    color: "hsl(220,60%,15%)",
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("datetime")}
                  className="flex-1 px-4 py-3 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50"
                  style={{
                    borderColor: "hsl(213,30%,90%)",
                    color: "hsl(220,60%,15%)",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)",
                  }}
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
