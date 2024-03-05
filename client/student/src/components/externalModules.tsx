import { Button, Input } from "@mui/joy";
import React from "react";

export default function ExternalModules(){
    const [displayAdd, setDisplayAdd] = React.useState<boolean>(false) 
    return <div><Button size="sm" variant = "plain" onClick={() => setDisplayAdd(true)}> Externe Leistung hinzufügen</Button>
    {displayAdd && <div><Input sx={{ maxWidth: 300 }} placeholder = "Name"></Input><Input sx={{ maxWidth: 300 }} type = "number" placeholder = "CP"></Input><Button sx= {{mt:2}}onClick={() => setDisplayAdd(false)} size="sm">Hinzufügen</Button></div>}</div>
}