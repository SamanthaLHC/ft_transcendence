// import React, { useEffect, useState } from "react";
import React from "react";


function getCode() {
	let url_str = window.location.search;
	console.log(url_str);
	let strToSearch = new URLSearchParams(url_str);
	let code_param = strToSearch.get("code");
	return code_param;
}

let codeP = getCode();
console.log(codeP);


if (codeP != null )
{
	//FIXME fetch sur le service de Nathan
	fetch('localhost:3300/auth/login', {
		method: "POST",
		body: codeP })
		.then((response) => {
			if (!response.ok) {
				throw new Error('HTTP error! Status: ${response.status}');
			}
		});
}


//TODO traduire en typsecript
//TODO creer des func et composants
//TODO gestion d'erreurs possibles (impossible de recuperer un code, lien invalide etc)
//TODO voir quelles protection smettre en place (routes ?)
//TODO JWT ?