import {
  createAppointment,
  getAppointmentsByUserId,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
  checkOverlap,
} from "../dal/appointment";

export const addAppointment = async (
  userId: string,
  purpose: string,
  startTime: string,
  endTime: string
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start < new Date()) {
    return { error: true, error_message: "Appointment cannot be created in the past." };
  }

  if (end <= start) {
    return { error: true, error_message: "End time must be after start time." };
  }

  const overlap = await checkOverlap(userId, start, end);
  if (overlap) {
    return { error: true, error_message: "You already have an appointment at this time." };
  }

  const appointment = await createAppointment(userId, purpose, start, end);
  return { success: true, appointment };
};

export const getAppointments = async (userId: string) => {
  const appointments = await getAppointmentsByUserId(userId);
  return { success: true, appointments };
};

export const cancelAppointment = async (id: number, userId: string) => {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return { error: true, error_message: "Appointment not found." };
  }

  if (appointment.userId !== userId) {
    return { error: true, error_message: "You cannot cancel other user's appointments." };
  }

  await deleteAppointmentById(id);
  return { success: true, message: "Appointment cancelled successfully." };
};
export const updateAppointment = async (
  id: number,
  userId: string,
  data: { purpose?: string; startTime?: string; endTime?: string }
) => {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return { error: true, error_message: "Appointment not found." };
  }

  if (appointment.userId !== userId) {
    return { error: true, error_message: "You cannot update this appointment." };
  }

  const updatedData: { purpose?: string; startTime?: Date; endTime?: Date } = {};

  if (data.purpose) {
    updatedData.purpose = data.purpose;
  }
  const newStart = data.startTime ? new Date(data.startTime) : appointment.startTime;
  const newEnd = data.endTime ? new Date(data.endTime) : appointment.endTime;

  if (newEnd <= newStart) {
    return { error: true, error_message: "End time must be after start time." };
  }

  if (data.startTime || data.endTime) {
    const overlap = await checkOverlap(userId, newStart, newEnd, id);
    if (overlap) {
      return { error: true, error_message: "You already have an appointment at this time." };
    }
  }

  if (data.startTime) updatedData.startTime = newStart;
  if (data.endTime) updatedData.endTime = newEnd;

  const updated = await updateAppointmentById(id, updatedData);
  return { success: true, appointment: updated };
};