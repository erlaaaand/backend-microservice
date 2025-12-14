// apps/auth-service/src/modules/presence/presentation/presence.controller.ts

import { Controller, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/api/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/api/decorators/current-user.decorator';
import { SetOnlineUseCase } from '../application/use-cases/set-online.use-case';
import { SetOfflineUseCase } from '../application/use-cases/set-offline.use-case';
import { HeartbeatUseCase } from '../application/use-cases/heartbeat.use-case';
import { GetOnlineUsersUseCase } from '../application/use-cases/get-online-users.use-case';
import { OnlineUsersResponseDto } from '../application/dto/user-status.response.dto';

@ApiTags('Presence')
@Controller('presence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PresenceController {
    constructor(
        private readonly setOnlineUseCase: SetOnlineUseCase,
        private readonly setOfflineUseCase: SetOfflineUseCase,
        private readonly heartbeatUseCase: HeartbeatUseCase,
        private readonly getOnlineUsersUseCase: GetOnlineUsersUseCase
    ) { }

    @Post('online')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Set user as online' })
    @ApiResponse({ status: 200, description: 'User set to online' })
    async setOnline(@CurrentUser() user: any): Promise<{ message: string }> {
        await this.setOnlineUseCase.execute(user.id);
        return { message: 'User set to online' };
    }

    @Post('offline')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Set user as offline' })
    @ApiResponse({ status: 200, description: 'User set to offline' })
    async setOffline(@CurrentUser() user: any): Promise<{ message: string }> {
        await this.setOfflineUseCase.execute(user.id);
        return { message: 'User set to offline' };
    }

    @Post('heartbeat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Send heartbeat to keep user online',
        description: 'Should be called every 1-2 minutes to maintain online status'
    })
    @ApiResponse({ status: 200, description: 'Heartbeat received' })
    async heartbeat(@CurrentUser() user: any): Promise<{ message: string }> {
        await this.heartbeatUseCase.execute(user.id);
        return { message: 'Heartbeat received' };
    }

    @Get('online-users')
    @ApiOperation({ summary: 'Get all online users' })
    @ApiResponse({
        status: 200,
        description: 'Online users retrieved',
        type: OnlineUsersResponseDto
    })
    async getOnlineUsers(): Promise<OnlineUsersResponseDto> {
        return this.getOnlineUsersUseCase.execute();
    }
}