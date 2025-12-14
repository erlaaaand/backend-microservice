// apps/auth-service/src/modules/auth/presentation/auth.controller.ts

import { Body, Controller, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RegisterRequestDto } from '../application/dtos/request/register.request.dto';
import { LoginRequestDto } from '../application/dtos/request/login.request.dto';
import { LoginResponseDto } from '../application/dtos/response/login.response.dto';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { ValidateTokenUseCase } from '../application/use-cases/validate-token.use-case';
import { Public } from '../../../shared/api/decorators/public.decorator';
import { CurrentUser } from '../../../shared/api/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/api/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly validateTokenUseCase: ValidateTokenUseCase
    ) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: LoginResponseDto
    })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async register(@Body() dto: RegisterRequestDto): Promise<LoginResponseDto> {
        return this.registerUseCase.execute(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        type: LoginResponseDto
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.loginUseCase.execute(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user info' })
    @ApiResponse({ status: 200, description: 'User info retrieved' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getCurrentUser(@CurrentUser() user: any) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }

    @Public()
    @Post('validate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Validate JWT token',
        description: 'Used by other microservices to validate tokens'
    })
    @ApiResponse({ status: 200, description: 'Token is valid' })
    @ApiResponse({ status: 401, description: 'Invalid token' })
    async validateToken(@Body('token') token: string) {
        return this.validateTokenUseCase.execute(token);
    }
}