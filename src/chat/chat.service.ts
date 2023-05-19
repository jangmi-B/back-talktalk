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

  // 나중에 해당하는 룸에 있는 사람이 아닌 접근권한 막으려고 작성함
  async getRoomMemberIdxList(data: ChatRoom) {
    const rooms = await prisma.chatMember.findMany({
      where: {
        roomIdx: data.roomIdx, // 채팅룸 ID로 ChatMember를 검색
      },
    });
    return rooms.map((chatMember) => chatMember.userIdx);
  }

  async getRoomMemberInfoList(data: any) {
    const users = await prisma.chatMember.findMany({
      where: {
        roomIdx: data.roomIdx,
        userIdx: {
          in: data.users,
        },
      },
      include: {
        user: true,
        room: true,
      },
    });

    console.log(
      users.map((chatMember) => ({
        user: chatMember.user,
        room: chatMember.room,
      })),
    );
    return users.map((chatMember) => ({
      user: chatMember.user,
      room: chatMember.room,
    }));
  }

  async addRoomMember(member: ChatRoom) {
    const chatMember = await prisma.chatMember.create({
      data: {
        userIdx: member.userIdx,
        roomIdx: member.roomIdx,
      },
    });
    return chatMember;
  }

  async deleteRoomMember(member: ChatRoom) {
    try {
      // 해당 사용자의 채팅 삭제
      // await prisma.chat.deleteMany({
      //   where: {
      //     userIdx: member.userIdx,
      //     roomIdx: member.roomIdx,
      //   },
      // });

      // 해당 사용자의 채팅 멤버 삭제
      await prisma.chatMember.deleteMany({
        where: {
          userIdx: member.userIdx,
          roomIdx: member.roomIdx,
        },
      });
    } catch (error) {
      console.error('deleteRoomMember :', error);
    }
  }

  async getRoomIdxList(userIdx: any) {
    const rooms = await prisma.chatMember.findMany({
      where: {
        userIdx: parseInt(userIdx),
      },
      include: {
        room: {
          include: {
            chats: {
              orderBy: {
                createAt: 'desc',
              },
              take: 1,
              include: {
                user: true, // chats에 해당하는 user 정보를 가져오기 위해 include 옵션 사용
              },
            },
          },
        },
        user: true,
      },
    });

    const result = rooms.map((chatMember) => {
      const room = chatMember.room;
      const chat = room?.chats[0];
      const user = chat?.user;

      return {
        ...room,
        chat,
        user,
      };
    });

    const sortedResult = result.sort((a, b) => {
      if (a.chat && b.chat) {
        return a.chat.createAt > b.chat.createAt ? -1 : 1;
      } else if (a.chat && !b.chat) {
        return -1;
      } else if (!a.chat && b.chat) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log(sortedResult);

    return sortedResult;
  }

  async getChatList(data: Chat) {
    const chats = await prisma.chat.findMany({
      where: {
        roomIdx: data.roomIdx,
      },
      orderBy: {
        createAt: 'asc', // 'asc'는 오름차순, 'desc'는 내림차순
      },
      include: {
        user: true,
      },
    });
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

  async senderInfo(data: any) {
    const sender = await prisma.user.findUnique({
      where: {
        userIdx: data.userIdx,
      },
    });

    return sender;
  }
}
