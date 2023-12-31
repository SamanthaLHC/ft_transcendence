import { Controller, Get, Param, UseGuards, Post, Req, Body, Delete, UploadedFile, UseInterceptors, StreamableFile, Res, NotFoundException, BadRequestException, FileTypeValidator, ParseFilePipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SearchDto, addRelationDto, rmRelationDto, upNameDto } from './dto';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthDto } from 'src/auth/dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get('id/:id')
    findOne(@Param('id') id: string) {
        return this.usersService.getUserFromId(id);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    findme(@Req() req) {
        return this.usersService.getUserFromId(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('gameHistorique/:id')
    gethisto(@Param('id') id: string) {
        return this.usersService.getHistoFromId(id);
        // gethisto(@Param('id',ParseIntPipe) id: number) {
        //     return this.usersService.getHistoFromId(id);
    }

    @Post('2fa/turn-on')
    @UseGuards(AuthGuard)
    async turnOnTwoFactorAuthentication(@Req() req) {
        const ret = await this.usersService.turnOnTwoFactorAuthentication(req.user.sub);
        return {
            otpAuthUrl: await this.usersService.generateQrCodeDataURL(ret.otpauthUrl),
        };
    }

    @Post('2fa/validate')
    @UseGuards(AuthGuard)
    async val2fa(@Body() dto: AuthDto, @Req() req) {
        return await this.usersService.validate2fa(dto, req.user.sub);
    }

    @Post('2fa/turn-off')
    @UseGuards(AuthGuard)
    async turnOffTwoFactorAuthentication(@Req() req) {
        this.usersService.turnOffTwoFactorAuthentication(req.user.sub)
    }

    @Get('2fa/state')
    @UseGuards(AuthGuard)
    async getstate2fa(@Req() req) {
        return this.usersService.getState2fa(req.user.sub)
    }

    @Get('search')
    @UseGuards(AuthGuard)
    async SearchUser(@Query('search') searchTerm: string) {
        return this.usersService.searchUser(searchTerm)
    }

    @Post('addup_relation')
    @UseGuards(AuthGuard)
    async addefriend(@Body() dto: addRelationDto, @Req() req) {
        return this.usersService.addrelation(dto, req.user.sub);
    }

    @Get('status_relation')
    @UseGuards(AuthGuard)
    async getstatusfriend(@Query('id') id: string, @Req() req){
        return this.usersService.getstatusrelation(id, req.user.sub);
    }

    @Get('get_friend')
    @UseGuards(AuthGuard)
    async getlistfriend(@Req() req) {
        return this.usersService.getlistfriend(req.user.sub);
    }

    @Get('get_class')
    @UseGuards(AuthGuard)
    async getclass(@Req() req) {
        return this.usersService.getclassement();
    }

    @Delete('rm_relation')
    @UseGuards(AuthGuard)
    async rmfriend(@Body() dto: rmRelationDto, @Req() req) {
        return this.usersService.deleterelation(dto, req.user.sub);
    }

    @Post('upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads'
            , filename: (req, file, cb) => {
                // Generating a 32 random chars long string
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async upload(@UploadedFile()file, @Req() req) {
        if (!file)
            throw new BadRequestException("Error: No file sent")
        if(file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpeg")
        {
            return this.usersService.updateAvatar(req.user.sub, `http://` + process.env.REACT_APP_HOSTNAME + `:3000/users/avatar/${file.filename}`)
        }
        else
            throw new BadRequestException("Pas une image ou un gif")
    }

    @Post('update_name')
    @UseGuards(AuthGuard)
    async upname(@Body() dto: upNameDto, @Req() req) {
        return this.usersService.updateName(req.user.sub, dto.name);
    }

    @Public()
    @UseGuards(AuthGuard)
    @Get("avatar/:name")
    getFile(@Param('name') name: string): StreamableFile {
        const file = createReadStream(join(process.cwd(), `/uploads/${name}`));
        if (!file)
            throw new NotFoundException()
        return new StreamableFile(file);
    }
}
