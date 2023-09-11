import { Injectable } from '@nestjs/common';
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

	login(body: any) {
		var TOKEN = "coucou"
		//DEBUGG 
		console.log(JSON.stringify(body))
		// console.log(JSON.stringify(process.env.API42_ID))
		// console.log(JSON.stringify(process.env.API42_SECRET))
		// console.log(JSON.stringify(process.env.API42_URL))
		const form = new FormData()
		form.append("grant_type", "authorization_code")
		form.append("client_id", process.env.API42_ID)
		form.append("client_secret", process.env.API42_SECRET)
		form.append("redirect_uri", process.env.API42_URL)
		form.append("code", body.code)
		console.log(JSON.stringify(body.code))
		fetch("https://api.intra.42.fr/v2/oauth/token", {
			method: "POST",
			body: form,
		})
			.then(function (raiponce) {
				return raiponce.json().then(function (json) {
					if (raiponce.status != 200) {
						console.log("nop not a 200")
						//DEBUGG
						// console.log("raiponce return: ")
						// console.log(raiponce)
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
									console.log("nop can't get bearer token")
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