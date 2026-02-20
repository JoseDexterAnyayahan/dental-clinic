'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, FileText, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { Appointment, Service, Dentist, TimeSlot } from '@/types/appointment.types'

interface AppointmentEditModalProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AppointmentEditModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: AppointmentEditModalProps) {
  const [formData, setFormData] = useState({
    dentist_id: appointment.dentist_id,
    service_id: appointment.service_id,
    appointment_date: appointment.appointment_date,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    notes: appointment.notes || '',
  })

  const [services, setServices] = useState<Service[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch services
  useEffect(() => {
    if (isOpen) {
      api.get<Service[]>('/services').then((res) => setServices(res.data))
    }
  }, [isOpen])

  // Fetch dentists when service changes
  useEffect(() => {
    if (formData.service_id) {
      api
        .get<Dentist[]>('/services/dentists', {
          params: { service_id: formData.service_id },
        })
        .then((res) => setDentists(res.data))
    }
  }, [formData.service_id])

  // Fetch available slots when dentist + date changes
  useEffect(() => {
    if (formData.dentist_id && formData.appointment_date) {
      setLoadingSlots(true)
      api
        .get('/services/available-slots', {
          params: {
            dentist_id: formData.dentist_id,
            date: formData.appointment_date,
          },
        })
        .then((res) => {
          setAvailableSlots(res.data.slots || [])
        })
        .finally(() => setLoadingSlots(false))
    }
  }, [formData.dentist_id, formData.appointment_date])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await api.put(`/client/appointments/${appointment.id}`, formData)
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update appointment')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedService = services.find((s) => s.id === formData.service_id)
  const selectedDentist = dentists.find((d) => d.id === formData.dentist_id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ borderColor: 'hsl(213,30%,90%)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10"
          style={{ borderColor: 'hsl(213,30%,90%)' }}>
          <div>
            <h2 className="text-xl font-serif font-bold" style={{ color: 'hsl(220,60%,15%)' }}>
              Edit Appointment
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'hsl(220,15%,50%)' }}>
              {appointment.appointment_no}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'hsl(220,30%,40%)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(220,30%,35%)' }}>
              Service
            </label>
            <select
              value={formData.service_id}
              onChange={(e) =>
                setFormData({ ...formData, service_id: Number(e.target.value), dentist_id: 0 })
              }
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — ₱{parseFloat(service.price).toLocaleString()} ({service.duration_mins} min)
                </option>
              ))}
            </select>
          </div>

          {/* Dentist */}
          {dentists.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(220,30%,35%)' }}>
                Dentist
              </label>
              <select
                value={formData.dentist_id}
                onChange={(e) =>
                  setFormData({ ...formData, dentist_id: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
              >
                <option value="">Select Dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    Dr. {dentist.first_name} {dentist.last_name} — {dentist.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(220,30%,35%)' }}>
              Appointment Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.appointment_date}
              onChange={(e) =>
                setFormData({ ...formData, appointment_date: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
            />
          </div>

          {/* Time Slots */}
          {formData.dentist_id && formData.appointment_date && (
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'hsl(220,30%,35%)' }}>
                Available Time Slots
              </label>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'hsl(213,94%,44%)' }} />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: 'hsl(0,70%,50%)' }}>
                  No available slots for this date
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.start_time}
                      disabled={!slot.available}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          start_time: slot.start_time,
                          end_time: slot.end_time,
                        })
                      }
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderWidth: 2,
                        borderColor:
                          formData.start_time === slot.start_time
                            ? 'hsl(213,94%,44%)'
                            : 'hsl(213,30%,90%)',
                        background:
                          formData.start_time === slot.start_time
                            ? 'hsl(213,60%,97%)'
                            : 'white',
                        color: slot.available ? 'hsl(220,60%,15%)' : 'hsl(220,15%,60%)',
                      }}
                    >
                      {slot.start_time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(220,30%,35%)' }}>
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any specific concerns or requests?"
              className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-3xl"
          style={{ borderColor: 'hsl(213,30%,90%)' }}>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: 'hsl(213,30%,90%)', color: 'hsl(220,60%,15%)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !formData.start_time}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(220,60%,15%) 0%, hsl(213,94%,44%) 100%)',
            }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}