import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { SearchDto, addRelationDto, rmRelationDto } from './dto';
import { Auth2faDto } from 'src/auth/dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }
    async getUserFromId(id: string) {
        var id_num: number = +id
        if (!id_num)
            throw new BadRequestException()
        const user = await this.prisma.user.findFirst({
            where: {
                id: id_num,
            },
            select: {
                id: true,
                login: true,
                name: true,
                photo: true,
                nbwin: true,
                nbloose: true,
                status: true
            }
        })
        if (user)
            return (user)
        else
            throw new NotFoundException(`Aucun user avec l'id ${id_num}`)
    }

    async getState2fa(id: string) {
        var id_num: number = +id
        if (!id_num)
            throw new BadRequestException()
        const user = await this.prisma.user.findFirst({
            where: {
                id: id_num,
            },
            select: {
                deuxfa: true
            }
        })
        if (user)
            return (user)
        else
            throw new NotFoundException(`Aucun user avec l'id ${id_num}`)
    }

    async getHistoFromId(id: string) {
        var id_num: number = +id
        if (!id_num)
            throw new BadRequestException()
        const hist = await this.prisma.gameHistory.findMany({
            where: {
                OR: [
                    {
                        gagnantId: id_num
                    },
                    {
                        perdantId: id_num
                    }
                ]
            },
        })
        if (hist)
            return hist;
        else
            throw new NotFoundException(`Aucun user avec l'id ${id_num} ou aucun match effectue`)
    }

    async searchUser(dto: string) {
        if (/^[a-zA-Z0-9_-]*$/.test(dto) === false)
            return []
        const userlist = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        login : {
                            startsWith: dto,
                          },
                    },
                    {
                        name : {
                            contains: dto,
                          },
                    }
                ]
            },
            select: {
                id: true,
                login: true,
                name: true,
                photo: true,
                status: true
            }
        })
        return userlist;
    }

    async deleterelation(dto: rmRelationDto, source_id: number) {
        if (source_id === dto.target_id)
            throw new BadRequestException("source_id et target_id sont identique");
        const source = await this.prisma.user.findFirst({
            where: { id: source_id }
        })
        const target = await this.prisma.user.findFirst({
            where: { id: dto.target_id }
        })
        if (!source || !target)
            throw new NotFoundException("user non trouve")
        await this.prisma.relationships.deleteMany({
            where: {
                AND: [
                    {
                        userId: source.id
                    },
                    {
                        targetId: target.id
                    }
                ]
            },
        })
    }

    async addrelation(dto: addRelationDto, source_id: number) {
        if (source_id === dto.target_id)
            throw new BadRequestException("source_id et target_id sont identique");
        if (dto.status != "FRIEND" && dto.status != "BLOCKED")
            throw new BadRequestException("status doit etre FRIEND ou BLOCKED");
        const source = await this.prisma.user.findFirst({
            where: { id: source_id }
        })
        const target = await this.prisma.user.findFirst({
            where: { id: dto.target_id }
        })
        if (!source || !target)
            throw new NotFoundException("user non trouve")
        await this.prisma.relationships.upsert({
            where: { id: { userId: source.id, targetId: target.id } },
            create: {
                userId: source.id,
                targetId: target.id,
                status: dto.status
            },
            update: { status: dto.status }
        });
    }

    async getstatusrelation(target_id: string, source_id:number)
    {
        let target_id_num =+ target_id
        const relation = await this.prisma.relationships.findFirst({
            where: {
                AND: [
                    {
                        userId: source_id
                    },
                    {
                        targetId: target_id_num
                    }
                ]
            },
        })
        if (relation)
            return ({ status: relation.status })
		else
			return ({ status: "NONE" })
    }

    async getclassement() {
        const classement = await this.prisma.user.findMany({
            orderBy: {
                nbwin: 'desc',
            },
            select: {
                id: true,
                login: true,
                name: true,
                photo: true,
                nbwin: true,
                nbloose: true
            }
        })
        return (classement)
    }

    async getlistfriend(source_id: number) {
        const relation = await this.prisma.relationships.findMany({
            where: {
                AND: [
                    {
                        userId: source_id
                    },
                    {
                        status: "FRIEND"
                    }
                ]
            },
            select: {
                target: {
                    select: {
                        id: true,
                        login: true,
                        name: true,
                        photo: true,
                        nbwin: true,
                        nbloose: true,
                        status: true
                    }
                }
            }
        })
        return (relation)
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId }
        })
        return await this.generateTwoFactorAuthenticationSecret(user.name, userId)
    }

    async turnOffTwoFactorAuthentication(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                deuxfa: false,
                deuxfasecret: null
            },
        })
    }

    async generateTwoFactorAuthenticationSecret(userLogin: string, userId: number) {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(userLogin, 'ft_transcendence', secret);

        await this.prisma.user.update({
            where: { id: userId },
            data: { deuxfa: false, deuxfasecret: secret },
        })

        return {
            secret,
            otpauthUrl
        }
    }

    async validate2fa(dto: Auth2faDto, userId: number) {
        const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
			},
		})
		const isCodeValid = this.isTwoFactorAuthenticationCodeValid(
			dto.code,
			user.deuxfasecret,
		);
		if (!isCodeValid)
			throw new UnauthorizedException();
        else
        {
            await this.prisma.user.update({
                where: { id: userId },
                data: { deuxfa: true },
            })
        }
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, secret: string) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: secret,
		});
	}

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    async updateAvatar(id: number, url: string) {
		await this.prisma.user.update({
			where: { id: id },
			data: { photo: url }
		})
		return url;
    }
    async updateName(id: number, name: string) {
        if (name.length > 15)
            throw new BadRequestException("Name too long: should be between 1 and 15 caracters")
        const user = await this.prisma.user.findFirst({
            where: { 
                name:{
                    contains: name,
                    mode: 'insensitive'
                },
            },
        })
        if (!user) {
            await this.prisma.user.update({
                where: { id: id },
                data: { name: name }
            })
        }
        else {
            throw new ConflictException("This name is already used !")
        }
    }
}

