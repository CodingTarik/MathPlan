import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
//import React from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/joy/Typography';

//const examRegulationNames = ["B.Sc. Mathematik 2018", "M.Sc. Mathematik 2015"]
//const [examRegulationName, setExamRegulationName] = React.useState("");
function loadExamRegulation () {
    //examRegulationName
    return 0;
}
export default function ApplicationForm() {
    return (
        <>
            <h1>Antrag Detailansicht</h1>
            <FormControl sx={{ width: 300 }}>
                <FormLabel>
                    Prüfungsordnung
                </FormLabel>
                <Select placeholder="Wählen Sie eine Prüfungsordnung" sx={{ width: 300 }} onChange={() => {loadExamRegulation;}}>
                    <Option value="a">A</Option>
                </Select>
            </FormControl>
            <Typography variant="soft" color="primary" level="body-lg" startDecorator={<InfoOutlined />} sx = {{mt: 2, p:2}}>
                Hinweis:  Wenn im Master die Studienrichtung gewechselt wird, muss ein seperater Prüfungsplan ausgefüllt werden.
            </Typography>
        </>
        
    )
  }

