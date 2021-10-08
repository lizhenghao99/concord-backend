import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsDuplicateDto } from './dto/is-duplicate.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from '../users/user.entity';
import { AccessTokenDto } from './dto/access-token.dto';
import { UsernameDto } from './dto/username.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @ApiOperation({ summary: 'Sign up new user' })
    @Post('sign-up')
    signUp(@Body() body: AuthCredentialsDto): Promise<UserEntity> {
        return this.authService.signUp(body.username, body.password);
    }

    @ApiOperation({ summary: 'Sign in user' })
    @Post('sign-in')
    async signIn(
        @Body() body: AuthCredentialsDto,
        @Res({ passthrough: true }) res,
    ): Promise<AccessTokenDto> {
        try {
            const result = await this.authService.signIn(
                body.username,
                body.password,
            );
            res.cookie('access_token', result.accessToken, {
                expires: new Date(new Date().getTime() + 3600 * 1000),
                sameSite: 'strict',
                httpOnly: 'true',
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: 'Sign out user' })
    @Post('sign-out')
    @UseGuards(AuthGuard(['jwt', 'cookie']))
    signOut(@GetUser() user: UserEntity): Promise<void> {
        return this.authService.signOut(user);
    }

    @ApiOperation({ summary: 'Check if username is duplicated' })
    @Get('duplicate/:username')
    checkDuplicateUsername(
        @Param() param: UsernameDto,
    ): Promise<IsDuplicateDto> {
        return this.authService.checkDuplicateUsername(param.username);
    }

    @ApiOperation({ summary: 'Get current user' })
    @Get('user')
    @UseGuards(AuthGuard(['jwt', 'cookie']))
    getCurrentUser(@GetUser() user: UserEntity): Promise<UserEntity> {
        return this.authService.getCurrentUser(user);
    }
}
