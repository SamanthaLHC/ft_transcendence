import React, {useEffect, useState }  from "react";

let url_str = window.location.search;
console.log(url_str);
let strToSearch = new URLSearchParams(url_str);
let code_param = strToSearch.get("code");
console.log(code_param);




//TODO traduire en typsecript
//TODO creer des func et composants