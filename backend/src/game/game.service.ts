import { Injectable } from '@nestjs/common';
import { Data } from './interface/game.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor (private prisma: PrismaService) {}
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
        }
    }
}
