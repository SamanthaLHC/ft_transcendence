import { Injectable } from '@nestjs/common';

const formData = (body: { [key: string]: string }) => {
    const form = new FormData()
    for (let key in body) {
        form.append(key, body[key])
    }
    return form
}

@Injectable()
export class AuthService {

    login(body: any) {
        var TOKEN = "coucou"
        const form = new FormData()
        form.append("grant_type", "authorization_code")
        form.append("client_id", process.env.CLIENT_ID)
        form.append("client_secret", process.env.CLIENT_SECRET)
        form.append("redirect_uri", "http://localhost:8000")
        // DEBUGG
        console.log("code = ")
        console.log(body.code)
        form.append("code", body.code)	
        form.append("code", body.code)
        fetch("https://api.intra.42.fr/v2/oauth/token", {
            method: "POST",
            body: form,
        })
            .then(function (raiponce) {
                return raiponce.json().then(function (json) {
                    if (raiponce.status != 200) {
                        console.log("nop")
                        return "c pas bon";
                    }
                    TOKEN = json["access_token"]
                    fetch("https://api.intra.42.fr/v2/me", {
                        method: "GET",
                        headers: { Authorization: "Bearer " + TOKEN }
                    })
                        .then(function (raiponce) {
                            return raiponce.json().then(function (json) {
                                if (raiponce.status != 200) {
                                    console.log("nop")
                                    return "c pas bon";
                                }
                                console.log("login :" + json["login"])
                                return json;
                            })
                        })
                })
            })
    }
}