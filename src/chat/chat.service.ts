import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChatRoom } from './dto/chatRoom.dto';
import { Chat } from './dto/chat.dto';
const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  /* 친구목록 가져오기(전체유저) */
  async getAllMember() {
    const members = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    // 한글 정렬이 안됨 -> 이름순으로 정렬 다시하기
    const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));

    return sortedMembers;
  }

  /* 채팅룸 생성하고 생성한 룸Idx 반환 */
  async makeChatRoom(data: any) {
    const roomName = data.roomTitle;
    const chatRoom = await prisma.chatRoom.create({
      data: {
        roomTitle: roomName,
      },
    });
    return chatRoom.roomIdx;
  }

  /* 생성된 채팅룸의 인덱스에 사용자와 클릭한 친구의 인덱스를 chatMember에 저장 */
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

  /* 사용자Idx로 참여중인 채팅방 검색하고, 해당하는 채팅방의 가장 최근 채팅내용 검색 후 해당 채팅에 해당하는 유저정보 가져옴*/
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

    // 가져온 내역을 room, chat, user로 구분
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

    // 최근 채팅순으로 정렬
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

  /* 참여중인 멤버들 검색 number[] 반환 */
  async getRoomMemberIdxList(data: ChatRoom) {
    const rooms = await prisma.chatMember.findMany({
      where: {
        roomIdx: data.roomIdx, // 채팅룸 ID로 ChatMember를 검색
      },
    });

    // 참여중인 멤버의 idx 배열 반환
    return rooms.map((chatMember) => chatMember.userIdx);
  }

  /* 참여중인 멤버들 검색 userInfo[]반환: chatRoom */
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

  /* 채팅내역 저장 row별 : chatRoom */
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

  /* 저장되어있는 채팅리스트 출력 */
  // https://velog.io/@corgi-world/Next.js-React-Query-Prisma%EC%99%80-%ED%95%A8%EA%BB%98%ED%95%98%EB%8A%94-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4
  async getChatList(data: Chat) {
    const pageSize = 50;
    const skip = (data.page - 1) * pageSize;

    const chats = await prisma.chat.findMany({
      skip,
      take: pageSize,
      where: {
        roomIdx: data.roomIdx,
      },
      orderBy: {
        createAt: 'desc',
      },
      include: {
        user: true,
      },
    });

    // 거꾸로 가져온걸 다시 반대로 출력
    return chats.reverse();
  }

  /* 채팅방 나가기 (나중에 마지막 1명이 나갔을 때 채팅방도 없어지게 바꾸기) */
  async deleteRoomMember(member: ChatRoom) {
    try {
      // 해당 사용자의 채팅 삭제 (기존에 있던 사람들한테까지 안보여서 놔둠)
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

  /* 채팅방 초대 chatMember에 roomIdx와 초대한 userIdx 추가 */
  async addRoomMember(member: ChatRoom) {
    const chatMember = await prisma.chatMember.create({
      data: {
        userIdx: member.userIdx,
        roomIdx: member.roomIdx,
      },
    });
    return chatMember;
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

  async senderInfo(data: any) {
    const sender = await prisma.user.findUnique({
      where: {
        userIdx: data.userIdx,
      },
    });

    return sender;
  }
}
