import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { SearchDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async getUserFromId(id: string) {
        var id_num:number = +id
        const user = await this.prisma.user.findFirst({
            where: {
                id: id_num,
            },
        })
        if (user)
        {
            const { deuxfasecret: _, ...userWithoutPassword } = user
            return userWithoutPassword;
        }
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
}

