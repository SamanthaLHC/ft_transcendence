import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
            return user;
        else
            return { "statusCode": 404 }
    }
}
