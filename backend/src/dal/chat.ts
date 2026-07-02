import prisma from "./prisma";

export const getChatByIdAndUser = async (chatId: string, userId: string) => {
  return prisma.chat.findUnique({
    where: { id: chatId, userId },
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

