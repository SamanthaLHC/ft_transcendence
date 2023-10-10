import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client'
import { AuthDto, Auth2faDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { access } from 'fs';

const formData = (body: { [key: string]: string }) => {
	const form = new FormData()
	for (let key in body) {
		form.append(key, body[key])
	}
	return form
}

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, 
        private jwtService: JwtService) {}
    async login(body: AuthDto, res: Response){
        var TOKEN = "coucou"
        const form = new FormData()
        form.append("grant_type", "authorization_code")
        form.append("client_id", process.env.API42_ID)
        form.append("client_secret", process.env.API42_SECRET)
        form.append("redirect_uri", process.env.API42_URL)
        form.append("code", body.code)
        const raiponce = await fetch("https://api.intra.42.fr/v2/oauth/token", {
            method: "POST",
            body: form,
        })
        var data = await raiponce.json();
        if (raiponce.status != 200) {
            console.log("nop 1")
            throw new HttpException({
                status: 401,
                error: 'Erreur API 42',
              }, 401, {
              });
        }
        TOKEN = data["access_token"]
        const raiponce2 = await fetch("https://api.intra.42.fr/v2/me", {
            method: "GET",
            headers: {Authorization: "Bearer " + TOKEN}
        })
        var data2 = await raiponce2.json()
        if (raiponce2.status != 200) {
            console.log("nop 2")
            throw new HttpException({
                status: 401,
                error: 'Erreur API 42',
              }, 401, {
              });
        }
        const logine = data2.login
        const usere = await this.prisma.user.findFirst({
            where: {
                login: logine,
            },
        })
        if (usere)
        {
            if (usere.deuxfa)
            {
                const uuid = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                const payload = { uuid: uuid, type: "2fa", sub: usere.id, username: usere.login };
                const acces_token = await this.jwtService.signAsync(payload)
                res.cookie("access_token", acces_token)
                throw new HttpException({
                status: 302,
                clientId: usere.id,
                url: "http://localhost:8000/2fa",
                access_token: acces_token
              }, 302, {
              }); 
            }
            const uuid = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            const payload = { uuid: uuid, type: "acces", sub: usere.id, username: usere.login };
            const acces_token = await this.jwtService.signAsync(payload)
            res.cookie("access_token", acces_token)
            throw new HttpException({
                status: 302,
                url: "http://localhost:8000/home",
                access_token: acces_token
              }, 302, {
              });
        }
        else
        {
            let useret = await this.prisma.user.findFirst({
                where: {
                    name: data2['login'],
                },
            })
            let user
            if (useret)
            {
                let randomName
                while (useret)
                {
                    randomName = Array(3).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    randomName = `${data2['login']}${randomName}`
                    useret = await this.prisma.user.findFirst({
                        where: {
                            name: randomName,
                        },
                    })
                }
                user = await this.prisma.user.create({
                    data: {
                        login: data2['login'],
                        photo: data2['image']['link'],
                        name:  randomName,
                    },
                });
            }
            else
            {
                user = await this.prisma.user.create({
                    data: {
                        login: data2['login'],
                        photo: data2['image']['link'],
                        name:  data2['login'],
                    },
                });
            }
            const uuid = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            const payload = { uuid: uuid, type: "acces", sub: user.id, username: user.login };
            const acces_token = await this.jwtService.signAsync(payload)
            res.cookie("access_token", acces_token)
            throw new HttpException({
                status: 302,
                url: "http://localhost:8000/home",
                access_token: acces_token
              }, 302, {
              });
        }
    }

	async login2fa(body: Auth2faDto, res: Response, id: number) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
			},
		})
		const isCodeValid = this.isTwoFactorAuthenticationCodeValid(
			body.code,
			user.deuxfasecret,
		);
		if (!isCodeValid)
			throw new UnauthorizedException();
		const payload = { type: "acces", sub: user.id, username: user.login };
		res.cookie("access_token", await this.jwtService.signAsync(payload),)
		const acces_token = await this.jwtService.signAsync(payload);
		throw new HttpException({
			status: 302,
			url: "http://localhost:8000/home",
			access_token: acces_token
		}, 302, {
		});
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, secret: string) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: secret,
		});
	}


}


