// import React, { useEffect, useState } from "react";
// import React from "react";
import FormData from 'form-data';

function getCode() {
	let url_str = window.location.search;
	// console.log(url_str);
	let strToSearch = new URLSearchParams(url_str);
	let code_param = strToSearch.get("code");
	return code_param;
}

let codeP = getCode();
// console.log(codeP);

if (codeP != null) {

	//FIXME fetch sur le service de Nathan
	const form = new FormData();
	form.append("code", codeP);
	fetch('http://localhost:3000/auth/login', {
		method: "POST",
		mode: "no-cors",
		body: form,
	}).then((response) => {
		if (!response.ok) {
			throw new Error(JSON.stringify(response.status));
			// console.log(response)
		}
	}).catch(err => {
		// console.error(`Fetch to backend for authentication failed: ${err}`);
		console.log("err in catch: ")
		console.log(err)
	});
}


//TODO traduire en typsecript
//TODO gestion d'erreurs possibles (impossible de recuperer un code, lien invalide etc)
//TODO voir quelles protection smettre en place (routes ?)


