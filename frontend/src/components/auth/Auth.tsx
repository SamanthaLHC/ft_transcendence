import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

function getCode(): string | null {
	let url_str: string = window.location.search;
	let strToSearch: URLSearchParams = new URLSearchParams(url_str);
	let code_param: string | null = strToSearch.get("code");
	return code_param;
}

const AuthProcess: React.FC = () => {

	const [cookies, setCookie] = useCookies(["access_token"]);
	const [authDone, setAuthDone] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		async function getTok(): Promise<void> {

			const codeP: string | null = getCode();
			if (codeP != null) {
				const obj = {
					code: codeP
				};
				const req = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/auth/login', {
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
						setCookie("access_token", datas.access_token, { path: "/" }); //autorise les pages qui commencent par /
						setAuthDone(true);
						const tmp = new URL(datas.url);
						navigate(tmp.pathname);
					}
				} catch (error) {
					console.error(error);
					navigate("/");
				}
			}
		}
		getTok();
	}, [navigate, authDone, cookies.access_token, setCookie]);
	return (<React.Fragment />); //workaround renvoie un frag vide
}
export default AuthProcess;