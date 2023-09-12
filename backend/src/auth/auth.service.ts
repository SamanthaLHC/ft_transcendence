import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { response } from 'express';

const formData = (body: { [key: string]: string }) => {
	const form = new FormData()
	for (let key in body) {
		form.append(key, body[key])
	}
	return form
}

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async login(body: AuthDto){
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
            console.log(data)
            return { msg: "Nop"};
        }
        TOKEN = data["access_token"]
        const raiponce2 = await fetch("https://api.intra.42.fr/v2/me", {
            method: "GET",
            headers: {Authorization: "Bearer " + TOKEN}
        })
        var data2 = await raiponce2.json()
        if (raiponce.status != 200) {
            console.log("nop 2")
            console.log(data2)
            return { msg: "Nop"};
        }
        const logine = data2.login
        const usere = await this.prisma.user.findFirst({
            where: {
                login: logine,
            },
        })
        if (usere)
        {
            return usere;
        }
        else
        {
            console.log(data2);
            const user = await this.prisma.user.create({
                data: {
                    login: data2['login'],
                },
            });
            console.log(user)
            return user;
        }
    }
}


