import {
  Box,
  Button,
  FormControl,
  
  FormLabel,
  IconButton,
  Sheet,
  Table,
  Textarea
} from '@mui/joy';
import {FormHelperText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { setExamPlan, getExamPlan } from './examPlanVariable';
import objectPath from 'object-path';

interface ExternalModule {
  moduleName: string;
  moduleID: string;
  moduleCredits: number;
}

export default function ExternalModules({
  nestedKeys
}: {
  nestedKeys: string;
}) {
  const [displayAdd, setDisplayAdd] = React.useState<boolean>(false);
  const [addedModules, setAddedModules] = React.useState<ExternalModule[]>([]);
  const [currentModule, setCurrentModule] = React.useState<ExternalModule>({
    moduleCredits: NaN,
    moduleID: '',
    moduleName: ''
  });
  return (
    <div>
      {!displayAdd && (
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          style={{ float: 'left' }}
          onClick={() => setDisplayAdd(true)}
        >
          {' '}
          Anerkannte Leistung hinzufügen
        </Button>
      )}
      {displayAdd && (
        <div>
          <FormControl sx={{ mt: 4, mb:2 }}>
            <FormLabel>Name des Moduls (max. 100 Zeichen)</FormLabel>
            <Textarea
              required
              onChange={(event) => {
                if (event.target.value.length > 100) window.alert("Der Eintrag für den Namen des Moduls ist zu lang und kann deswegen nicht gespeichert werden")
                else {
                const tmp = {
                  moduleID: currentModule.moduleID,
                  moduleName: event?.target.value,
                  moduleCredits: currentModule.moduleCredits
                };
                setCurrentModule(tmp);
            }
              }}
            />
          </FormControl>
          <FormControl sx= {{mb:2}}>
            <FormLabel>Anzahl CP (max. 10 Zeichen)</FormLabel>
            <Textarea
              required
              onChange={(event) => {
                if (event.target.value.length > 10) window.alert("Der Eintrag für Anzahl CP ist zu lang und kann deswegen nicht gespeichert werden")
                else {
                const credits = Number(event?.target.value);
                if (isNaN(credits)) {
                  window.alert('Die Credit Points müssen eine Zahl sein');
                } else {
                  {
                    const tmp = {
                      moduleID: currentModule.moduleID,
                      moduleName: currentModule.moduleName,
                      moduleCredits: credits
                    };
                    setCurrentModule(tmp);
                  }
                }}
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Modulnummer (max. 100 Zeichen)</FormLabel>
            <Textarea
              required
              onChange={(event) => {
                if (event.target.value.length > 100) window.alert("Der Eintrag für die Modulnummer ist zu lang und kann deswegen nicht gespeichert werden")
                else {
                const tmp = {
                  moduleID: event?.target.value,
                  moduleName: currentModule.moduleName,
                  moduleCredits: currentModule.moduleCredits
                };
                setCurrentModule(tmp);
            }
              }}
            />
            <FormHelperText>
              Tragen Sie die Modulnummer ein, wenn die Leistung an der TU
              Darmstadt erbracht wurde oder tippen Sie "Anerkennung" ein, wenn
              Sie eine extern erbrachte Leistung einbringen möchten.
            </FormHelperText>
          </FormControl>
          <Button
            disabled={
              !(
                !isNaN(currentModule.moduleCredits) &&
                currentModule.moduleID.length !== 0 &&
                currentModule.moduleName.length !== 0
              )
            }
            sx={{ mt: 2 }}
            onClick={() => {
              setDisplayAdd(false);
              const examPlan = getExamPlan();
              objectPath.set(examPlan, nestedKeys + '.externalModules', [
                ...addedModules,
                currentModule
              ]);
              setExamPlan(examPlan);
              setAddedModules([...addedModules, currentModule]);
              setCurrentModule({
                moduleCredits: NaN,
                moduleID: '',
                moduleName: ''
              });
            }}
            size="sm"
          >
            Leistung hinzufügen
          </Button>
        </div>
      )}
      {addedModules.length != 0 && (
        <Sheet
          variant="outlined"
          sx={{
            width: '100%',
            boxShadow: 'sm',
            borderRadius: 'sm',
            maxHeight: '300px',
            overflow: 'auto',
            mt: 2,
            mb: 2
          }}
        >
          <Table sx={{ textAlign: 'left' }} borderAxis="bothBetween">
            <tbody>
              {addedModules.map((row) => (
                <tr>
                  <td style={{ wordBreak: 'break-word', width: '40%' }}>
                    {row.moduleID}
                  </td>
                  <td style={{ wordBreak: 'break-word', width: '40%' }}>
                    {row.moduleName}
                  </td>
                  <td style={{ width: '15%' }}>{row.moduleCredits} CP</td>
                  <td style={{ width: '5%' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => {
                          const newAddedModules = addedModules.filter(
                            (entry) =>
                              !(
                                entry.moduleCredits === row.moduleCredits &&
                                entry.moduleName === row.moduleName &&
                                entry.moduleID === row.moduleID
                              )
                          );
                          const examPlan = getExamPlan();
                          setAddedModules(newAddedModules);
                          if (newAddedModules.length > 0) {
                            objectPath.set(
                              examPlan,
                              nestedKeys + '.externalModules',
                              newAddedModules
                            );
                          } else {
                            objectPath.del(
                              examPlan,
                              nestedKeys + '.externalModules'
                            );
                          }

                          setExamPlan(examPlan);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      )}
    </div>
  );
}
