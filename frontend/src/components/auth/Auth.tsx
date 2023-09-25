import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Navigate } from "react-router-dom";


function getCode() {
	let url_str = window.location.search;
	let strToSearch = new URLSearchParams(url_str);
	let code_param = strToSearch.get("code");
	return code_param;
}

//renderless component
export default function AuthProcess() {


	const [cookies, setCookie] = useCookies(["access_token"]);
	const navigate = useNavigate();

	useEffect(() => {
		async function getTok() {

			let codeP = getCode();
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
				const response = await fetch(req);
				var datas = await response.json();
				console.log("response status: ", datas.status);
				if (datas.status === 302) {
					const newUrl = datas.url;
					window.location.href = newUrl; //problematique ? ça ne reste pas ça va recharger la page 
					setCookie("access_token", datas.access_token, { path: "/" }); //autorise les pages qui commencent par /
				}
			}
		}
		getTok();
	}, []);
	return (<React.Fragment />); //workaround renvoie un frag vide
}




//TODO traduire en typsecript

//TODO gestion d'erreurs possibles