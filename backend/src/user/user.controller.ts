import {
  BadRequestException,
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserDeco } from 'src/decorator/user.decorator';
import { UserSessionDto } from 'src/dto/usersession.dto';
import { UserService } from './user.service';
import { PhGuard } from './ft/guard/auth.guard';
import JwtGuard from './jwt/guard/jwtauth.guard';
import { JwtSignGuard } from './jwt/guard/jwtsign.guard';
import TwoFactorGuard from './jwt/guard/twofactor.guard';

@Controller('/api/auth')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(
    private authService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('/login')
  @UseGuards(PhGuard)
  login() {
    this.logger.log('Login');
  }

  @Get('/logincallback')
  @UseGuards(PhGuard, JwtSignGuard)
  async loginCallback(
    @Res() res: Response,
    @UserDeco() userSession: UserSessionDto,
  ) {
    this.logger.log(`Login: ${userSession.intraId}`);
    const user = await this.authService.addUserFromSession(userSession);
    const url = user.auth ? 'frontend.home' : 'frontend.auth';
    if (!user.auth) await this.authService.sendAuthMail(user);
    return res.redirect(`${this.configService.get<string>(url)}`);
  }

  @Post('/two-factor')
  @UseGuards(JwtGuard)
  async twoFactorAuth(
    @Res() res: Response,
    @UserDeco() userSession: UserSessionDto,
    @Body('code') code: string,
  ) {
    this.logger.log(`[TwoFactorAuth] code: ${code}`);
    const result = await this.authService.checkAuthCode(userSession, code);
    res.status(HttpStatus.OK).send(result);
  }

  @Get('/logout')
  @UseGuards(TwoFactorGuard)
  logout(@Res() res: Response, @UserDeco() user: UserSessionDto) {
    this.logger.log(`Logout: ${user.intraId}`);
    res.clearCookie('access_token');
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/user/profile')
  @UseGuards(TwoFactorGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Res() res: Response,
    @UserDeco() user: UserSessionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    this.logger.log(`Profile upadate: ${user.intraId}`);
    const data = await this.authService.updateProfileImage(user, image);
    if (!data.success) {
      this.logger.log(data.data);
      throw new InternalServerErrorException('데이터 저장 실패');
    }
    res.status(HttpStatus.OK).send(data.data);
  }

  @Post('/user/introduce')
  @UseGuards(TwoFactorGuard)
  async updateIntroduce(
    @Res() res: Response,
    @UserDeco() user: UserSessionDto,
    @Body('introduce') introduce: string,
  ) {
    this.logger.log(`Introduce update: ${user.intraId}`);
    await this.authService.updateUserIntroduce(user, introduce);
    const result = await this.authService.getUserByUserName(user.intraId);
    res.status(HttpStatus.OK).send(result);
  }
}
