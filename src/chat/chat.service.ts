import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/auth/dto/user.dto';
import { ChatRoom } from './dto/chatRoom.dto';
import { Chat } from './dto/chat.dto';
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async getAllMember() {
    const members = await prisma.user.findMany({
      orderBy: {
        name: 'asc', // 'asc'는 오름차순, 'desc'는 내림차순
      },
    });
    return members;
  }

  async makeChatRoom(data: any) {
    const roomName = data.roomTitle;
    const chatRoom = await prisma.chatRoom.create({
      data: {
        roomTitle: roomName,
      },
    });
    return chatRoom.roomIdx;
  }

  async addChatMember(data: ChatRoom) {
    const chatMember = await prisma.chatMember.createMany({
      data: [
        { userIdx: data.userIdx, roomIdx: data.roomIdx },
        { userIdx: data.friendIdx, roomIdx: data.roomIdx },
      ],
      skipDuplicates: false,
    });

    return chatMember;
  }

  async getRoomIdxList(userIdx: any) {
    const rooms = await prisma.chatMember.findMany({
      where: {
        userIdx: parseInt(userIdx), // 사용자 ID로 ChatMember를 검색
      },
      include: {
        room: true, // ChatMember와 연결된 ChatRoom 정보를 가져옴
      },
    });
    return rooms.map((chatMember) => chatMember.room);
  }

  async getChatList(data: Chat) {
    const chats = await prisma.chat.findMany({
      where: {
        roomIdx: data.roomIdx,
      },
      orderBy: {
        createAt: 'asc', // 'asc'는 오름차순, 'desc'는 내림차순
      },
    });
    console.log('>>>>>> ', chats);
    return chats;
  }

  async saveChat(data: Chat) {
    const chat = await prisma.chat.create({
      data: {
        text: data.text,
        isMine: data.isMine,
        room: { connect: { roomIdx: data.roomIdx } },
        user: { connect: { userIdx: data.userIdx } },
      },
    });
    return chat;
  }
}
