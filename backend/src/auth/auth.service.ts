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

    login(code: any) {
        var TOKEN = "coucou"
		console.log(code.code)
        var form = new FormData()
        form.append("grant_type", "authorization_code")
        form.append("client_id", "")
        form.append("client_secret", "")
        form.append("redirect_url", "localhost:8000")
        form.append("code", code.code)
        fetch("https://api.intra.42.fr/v2/oauth/token", {
            method: "POST",
            body: form,
        })
            .then(function (raiponce) {
                return raiponce.json().then(function (json) {
                console.log(json)
                if (raiponce.status != 200)
                    return "c pas bon"
                TOKEN = json["access_token"]
                console.log(json)
        fetch("https://api.intra.42.fr/v2/me", {
            method: "GET",
            headers: {Authorization: "Bearer " + TOKEN}
        })
            .then(function (raiponce) {
                return raiponce.json().then(function (json) {
                console.log("ICICICICICICICI")
                console.log(json)
                })})
            })})
    }
}


