import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './dto/chatRoom.dto';
import { Chat } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /* 친구목록 가져오기(전체유저) : friendList*/
  @Post('/allMember')
  async getAllMember() {
    return this.chatService.getAllMember();
  }

  /* 채팅룸 생성 : friendList*/
  @Post('/makeRoom')
  async makeChatRoom(@Body() data: any) {
    return this.chatService.makeChatRoom(data);
  }

  /* 반환받은 roomIdx에 사용자와 친구를 chatMember로 추가 : friendList*/
  @Post('/chatMember')
  async addChatMember(@Body() data: ChatRoom) {
    return this.chatService.addChatMember(data);
  }

  /* 사용자Idx로 참여중인 채팅방 검색 : chatList */
  @Get('/getRoomIdxList/:userIdx')
  async getRoomIdxList(@Param('userIdx') userIdx: number) {
    return this.chatService.getRoomIdxList(userIdx);
  }

  /* 참여중인 멤버들 검색 number[]반환 : chatRoom */
  @Post('/roomMember')
  async getRoomMemberIdxList(@Body() data: ChatRoom) {
    return this.chatService.getRoomMemberIdxList(data);
  }

  /* 참여중인 멤버들 검색 userInfo[]반환: chatRoom */
  @Post('/memberInfo')
  async getRoomMemberInfoList(@Body() data: any) {
    return this.chatService.getRoomMemberInfoList(data);
  }

  /* 채팅내역 저장 row별 : chatRoom */
  @Post('/saveChat')
  async saveChat(@Body() data: Chat) {
    return this.chatService.saveChat(data);
  }

  /* 저장되어있는 채팅리스트 출력 : chatRoom */
  @Post('/list')
  async getChatList(@Body() data: Chat) {
    return this.chatService.getChatList(data);
  }

  /* 채팅방 나가기 : chatRoom */
  @Post('/deleteMember')
  async deleteRoomMember(@Body() data: ChatRoom) {
    return this.chatService.deleteRoomMember(data);
  }

  /* 채팅방 초대 : chatRoom */
  @Post('/addMember')
  async addRoomMember(@Body() data: ChatRoom) {
    return this.chatService.addRoomMember(data);
  }

  @Post('/sender')
  async senderInfo(@Body() data: any) {
    return this.chatService.senderInfo(data);
  }
}
