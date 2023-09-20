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
	const response = await fetch(req)
	var datas = await response.json()
	if (response.status === 302) {
		const newUrl = datas.url
		console.log(response.status)
		console.log(newUrl)
		window.location.href = newUrl;
	}
	var bearertok = process.env.REACT_APP_BEARER_TOKEN 
	bearertok = datas.access_token
	console.log("datas in response body: ")
	console.log(datas)
	console.log("bearer token = ")
	console.log(bearertok)







	//TOFIX
	// .then((response) => response.json()).then((data) => {
	// 	console.log('URL: ', data.url);
		// if (response.status === 302){

		// }
	// }).catch(err => {
	// 	console.log("err in catch: ")
	// 	console.log(err)

		// )
		// 	if (response.status === 302) {

		// 	} else {
		// 		console.log(response.status)
		// 	}
		// }).catch(err => {
		// 	console.log("err in catch: ")
		// 	console.log(err)
	// });
}





//TODO traduire en typsecript

