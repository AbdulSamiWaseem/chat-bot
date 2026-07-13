import prisma from "./prisma";

export const getChat = async (chatId: string) => {
  return prisma.chat.findUnique({
    where: { id: chatId },
  });
};

export const createNewChat = async (userId: string, chatName: string, initialChats: any[]) => {
  return prisma.chat.create({
    data: {
      userId,
      chatName,
      chats: initialChats,
    },
  });
};

export const updateChatMessages = async (chatId: string, updatedChats: any[]) => {
  return prisma.chat.update({
    where: { id: chatId },
    data: { chats: updatedChats },
  });
};

export const getChatHistoryByUserId = async (userId: string) => {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, chatName: true, updatedAt: true },
  });
};

