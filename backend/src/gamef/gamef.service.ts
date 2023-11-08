import { Injectable } from '@nestjs/common';
import { Data } from './interface/gamef.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameFService {
    constructor (private prisma: PrismaService) {}
    async set_status(status: string, id:number){
        if (status == "INGAME")
        {
            await this.prisma.user.updateMany({
                where: {
                    id: id,
                },
                data: {
                status: "INGAME",
                },
            })
        }
        else if (status == "CONNECTED")
        {
            await this.prisma.user.updateMany({
                where: { 
                    AND: [
                        {
                            id: id,
                        },
                        {
                            status: "INGAME"
                        }
                    ]
                 },
                data: {
                status: "CONNECTED",
                },
            })
        }
    }
    async finish_game(dat:Data) {
        if (dat.scoredroite > dat.scoregauche)
        {
            await this.prisma.gameHistory.create({
                data: {
                    gagnantId: dat.jdroiteid,
                    perdantId: dat.jgaucheid,
                    scoreGagnant: dat.scoredroite,
                    scorePerdant: dat.scoregauche
                },
            });
            await this.prisma.user.update({
                where: {
                    id: dat.jdroiteid,
                },
                data: {
                    nbwin: {
                        increment: 1,
                    }
                },
            });
            await this.prisma.user.update({
                where: {
                    id: dat.jgaucheid,
                },
                data: {
                    nbloose: {
                        increment: 1,
                    }
                },
            });
        }
        else
        {
            await this.prisma.gameHistory.create({
                data: {
                    gagnantId: dat.jgaucheid,
                    perdantId: dat.jdroiteid,
                    scoreGagnant: dat.scoregauche,
                    scorePerdant: dat.scoredroite
                },
            });
            await this.prisma.user.update({
                where: {
                    id: dat.jgaucheid,
                },
                data: {
                    nbwin: {
                        increment: 1,
                    }
                },
            });
            await this.prisma.user.update({
                where: {
                    id: dat.jdroiteid,
                },
                data: {
                    nbloose: {
                        increment: 1,
                    }
                },
            });
        }
    }
}
