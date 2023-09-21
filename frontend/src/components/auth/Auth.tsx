// import React, { useEffect, useState } from "react";

// eslint-disable-next-line
import React from "react";

function getCode() {
	let url_str = window.location.search;
	let strToSearch = new URLSearchParams(url_str);
	let code_param = strToSearch.get("code");
	return code_param;
}

let codeP = getCode();



const authProcess = async () => {


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
	console.log("response status: ");
	console.log(response.status);
	if (datas.status === 302) {
		const newUrl = datas.url;
		window.location.href = newUrl;
		console.log("bearer token: ", datas.access_token);
	}

	// FIXME :
	// var bearertok = process.env.REACT_APP_BEARER_TOKEN;
	// bearertok = datas.access_token;
}

authProcess();


//TODO traduire en typsecript

//TODO gestion d'erreurs possibles