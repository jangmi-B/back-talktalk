import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChatRoom } from './dto/chatRoom.dto';
import { Chat } from './dto/chat.dto';
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async getAllMember() {
    const members = await prisma.user.findMany({
      orderBy: {
        name: 'asc', // 'asc'는 오름차순, 'desc'는 내림차순인데 정렬이 제대로 안됨
      },
    });

    // 이름순으로 정렬
    const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));

    return sortedMembers;
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

    return sortedResult;
  }

  // https://velog.io/@corgi-world/Next.js-React-Query-Prisma%EC%99%80-%ED%95%A8%EA%BB%98%ED%95%98%EB%8A%94-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4
  async getChatList(data: Chat) {
    const pageSize = 50;
    const skip = (data.page - 1) * pageSize;
    // const take = pageSize * data.page;

    const chats = await prisma.chat.findMany({
      skip,
      take: pageSize,
      where: {
        roomIdx: data.roomIdx,
      },
      orderBy: {
        createAt: 'desc', // 'asc'는 오름차순, 'desc'는 내림차순
      },
      include: {
        user: true,
      },
    });

    return chats.reverse();
  }

  // async addChatList(data: Chat) {
  //   const pageSize = 50;
  //   const skip = data.page * pageSize;
  //   const take = pageSize;

  //   const chats = await prisma.chat.findMany({
  //     skip,
  //     take,
  //     where: {
  //       roomIdx: data.roomIdx,
  //     },
  //     orderBy: {
  //       createAt: 'desc', // 'asc'는 오름차순, 'desc'는 내림차순
  //     },
  //     include: {
  //       user: true,
  //     },
  //   });

  //   console.log(chats.reverse());

  //   return chats.reverse();
  // }

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
