import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

function getCode(): string | null {
	let url_str: string = window.location.search;
	let strToSearch: URLSearchParams = new URLSearchParams(url_str);
	let code_param: string | null = strToSearch.get("code");
	return code_param;
}

//renderless component
const AuthProcess: React.FC = () => {

	const [cookies, setCookie] = useCookies(["access_token"]);

	useEffect(() => {
		async function getTok(): Promise<void> {

			const codeP: string | null = getCode();
			if (codeP != null) {
				const obj = {
					code: codeP
				};
				const req = new Request('http://localhost:3000/auth/login', {
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify(obj),
				});
				try {

					const response = await fetch(req);
					const datas = await response.json();
					if (datas.status === 302) {
						const newUrl = datas.url;
						window.location.href = newUrl; //problematique ? ça ne reste pas ça va recharger la page 
						setCookie("access_token", datas.access_token, { path: "/" }); //autorise les pages qui commencent par /
					}
				} catch (error) {
					console.error(error);
					window.location.href = "/"; //problematique ? ça ne reste pas ça va recharger la page 

				}
			}
		}
		getTok();
	});
	return (<React.Fragment />); //workaround renvoie un frag vide
}
export default AuthProcess;