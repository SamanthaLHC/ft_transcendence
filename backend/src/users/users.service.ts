import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { SearchDto, addRelationDto, rmRelationDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async getUserFromId(id: string) {
        var id_num:number = +id
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
                photo: true
            }
        })
        if (user)
            return (user)
        else
            throw new NotFoundException(`Aucun user avec l'id ${id_num}`)
    }

    async getHistoFromId(id: string) {
        var id_num:number = +id
        const hist = await this.prisma.gameHistory.findMany({
            where: {
                OR: [
                    {
                        gagnantId : id_num
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

    async searchUser(dto: SearchDto) {
        const userlist = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        login : {
                            startsWith: dto.search,
                          },
                    },
                    {
                        name : {
                            contains: dto.search,
                          },
                    }
                ]
            },
            select: {
                id: true,
                login: true,
                name: true,
                photo: true
            }
        })
        if (userlist[0])
        {
            
            return userlist;
        }
        else
            throw new NotFoundException(`Aucun user`)
    }

    async deleterelation(dto: rmRelationDto, source_id: number) {
        if (source_id === dto.target_id)
            throw new BadRequestException("source_id et target_id sont identique");
        const source = await this.prisma.user.findFirst({
            where: { id: source_id}
        })
        const target = await this.prisma.user.findFirst({
            where: { id: dto.target_id}
        })
        if (!source || !target)
            throw new NotFoundException("user non trouve")
        await this.prisma.relationships.deleteMany({
            where: { 
                AND: [
                    {
                        userId : source.id
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
        if(dto.status != "FRIEND" && dto.status != "BLOCKED")
            throw new BadRequestException("status doit etre FRIEND ou BLOCKED");
        const source = await this.prisma.user.findFirst({
            where: { id: source_id}
        })
        const target = await this.prisma.user.findFirst({
            where: { id: dto.target_id}
        })
        if (!source || !target)
            throw new NotFoundException("user non trouve")
        await this.prisma.relationships.upsert({
            where: { id: {userId: source.id, targetId: target.id} },
            create: {
                userId: source.id,
                targetId: target.id,
                status: dto.status
            },
            update: { status: dto.status}
        });
    }

    async getstatusrelation(dto: rmRelationDto, source_id:number)
    {
        const relation = await this.prisma.relationships.findFirst({
            where: { 
                AND: [
                    {
                        userId : source_id
                    },
                    {
                        targetId: dto.target_id
                    }
                ]
             },
          })
        if (relation)
          return ({ status: relation.status})
        else
          throw new NotFoundException("aucune relation avec ces ids");
    }

    async getclassement()
    {
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

    async getlistfriend(source_id:number)
    {
        const relation = await this.prisma.relationships.findMany({
            where: { 
                AND: [
                    {
                        userId : source_id
                    },
                    {
                        status: "FRIEND"
                    }
                ]
             },
            select: {
                targetId: true
            }
          })
        if (relation[0])
          return (relation)
        else
          throw new NotFoundException("aucune relation avec ces ids");
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId}
        })
        return await this.generateTwoFactorAuthenticationSecret(user.login, userId)
    }

    async turnOffTwoFactorAuthentication(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { deuxfa: false,
                    deuxfasecret: null },
          })
      }

    async generateTwoFactorAuthenticationSecret(userLogin: string, userId: number) {
        const secret = authenticator.generateSecret();
    
        const otpauthUrl = authenticator.keyuri(userLogin, 'ft_transcendence', secret);
    
        await this.prisma.user.update({
            where: { id: userId },
            data: { deuxfa: true, deuxfasecret: secret },
          })
    
        return {
          secret,
          otpauthUrl
        }
      }

      async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
      }

      async updateAvatar(id: number, url: string) {
        await this.prisma.user.update({
            where: { id: id },
            data: {photo: url}
        })
      }
}

