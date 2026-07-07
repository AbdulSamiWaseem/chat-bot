import prisma from "./prisma";

export const createAppointment = async (
  userId: string,
  purpose: string,
  startTime: Date,
  endTime: Date
) => {
  return prisma.appointment.create({
    data: { userId, purpose, startTime, endTime },
  });
};

export const getAppointmentsByUserId = async (userId: string) => {
  return prisma.appointment.findMany({
    where: { userId, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
  });
};

export const getAppointmentById = async (id: number) => {
  return prisma.appointment.findUnique({ where: { id } });
};

export const updateAppointmentById = async (
  id: number,
  data: { purpose?: string; startTime?: Date; endTime?: Date }
) => {
  return prisma.appointment.update({ where: { id }, data });
};

export const deleteAppointmentById = async (id: number) => {
  return prisma.appointment.delete({ where: { id } });
};

export const checkOverlap = async (
  userId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: number
) => {
  return prisma.appointment.findFirst({
    where: {
      userId,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      id: { not: excludeId },
    },
  });
};
