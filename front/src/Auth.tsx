import React, { useEffect, useState } from "react";

function getCode()
{
    let url_str = window.location.search;
    console.log(url_str);
    let strToSearch = new URLSearchParams(url_str);
    let code_param = strToSearch.get("code");
    return code_param;
}

let codeP = getCode();
console.log(codeP);


    fetch(' https://api.intra.42.fr/oauth/token', {
        method: "POST",});


//TODO traduire en typsecript
//TODO creer des func et composants