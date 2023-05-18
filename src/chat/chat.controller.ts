import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './dto/chatRoom.dto';
import { Chat } from './dto/chat.dto';
import { User } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/allMember')
  async getAllMember() {
    return this.chatService.getAllMember();
  }

  // userIdx 받아와야함
  @Post('/makeRoom')
  async makeChatRoom(@Body() data: any) {
    return this.chatService.makeChatRoom(data);
  }

  @Post('/chatMember')
  async addChatMember(@Body() data: ChatRoom) {
    return this.chatService.addChatMember(data);
  }

  // 참여중인 멤버들 가져오려고
  @Post('/roomMember')
  async getRoomMemberIdxList(@Body() data: ChatRoom) {
    return this.chatService.getRoomMemberIdxList(data);
  }

  @Post('/memberInfo')
  async getRoomMemberInfoList(@Body() data: any) {
    return this.chatService.getRoomMemberInfoList(data);
  }

  @Post('/roomMemberList')
  async addRoomMember(@Body() data: ChatRoom) {
    return this.chatService.addRoomMember(data);
  }

  @Post('/deleteMember')
  async deleteRoomMember(@Body() data: ChatRoom) {
    return this.chatService.deleteRoomMember(data);
  }

  @Get('/getRoomIdxList/:userIdx')
  async getRoomIdxList(@Param('userIdx') userIdx: number) {
    return this.chatService.getRoomIdxList(userIdx);
  }

  @Post('/list')
  async getChatList(@Body() data: Chat) {
    return this.chatService.getChatList(data);
  }

  @Post('/saveChat')
  async saveChat(@Body() data: Chat) {
    return this.chatService.saveChat(data);
  }

  @Post('/sender')
  async senderInfo(@Body() data: any) {
    return this.chatService.senderInfo(data);
  }
}
