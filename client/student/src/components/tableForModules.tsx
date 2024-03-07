import * as React from 'react';
import { Table, Checkbox, Typography, Sheet } from '@mui/joy';
import objectPath from 'object-path';
import { Box } from '@mui/material';
import { setExamPlan, getExamPlan } from './examPlanVariable.ts';

type Modul = {
  moduleID: string;
  moduleName: string;
  moduleCredits: string;
  moduleLanguage: string;
  moduleApplicability: string;
};
type ModulWrapper = {
  name: Modul;
  moduleID: string;
  creditPoints: number;
  pflicht: boolean;
  nichtwählbarmitmodul: Array<object>;
};

function descendingComparator(a: ModulWrapper, b: ModulWrapper) {
  if (b['name']['moduleName'] < a['name']['moduleName']) {
    return -1;
  }
  if (b['name']['moduleName'] > a['name']['moduleName']) {
    return 1;
  }
  return 0;
}

function stableSort(
  array: readonly ModulWrapper[],
  comparator: (a: ModulWrapper, b: ModulWrapper) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [ModulWrapper, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: readonly string[] = ['Name', 'Nummer', 'CP', 'Sprache'];

function TableHead() {
  return (
    <thead>
      <tr>
        <th></th>
        {headCells.map((headCell) => {
          return <th>{headCell}</th>;
        })}
      </tr>
    </thead>
  );
}

function TableToolbar({
  numSelected,
  selected
}: {
  numSelected: number;
  selected: readonly ModulWrapper[];
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1'
        })
      }}
    >
      {numSelected > 0 && (
        <Typography sx={{ flex: '1 1 100%' }} component="div">
          {numSelected} Modul(e) ausgewählt:{' '}
          {selected
            .map((x) => x['name']['moduleName'])
            .toString()
            .split(',')
            .join(', ')}
        </Typography>
      )}
    </Box>
  );
}

export default function TableForModules({
  rows,
  nestedKeys
}: {
  rows: ModulWrapper[];
  nestedKeys: string;
}) {
  const [selected, setSelected] = React.useState<readonly ModulWrapper[]>([]);

  const handleClick = (
    _event: React.MouseEvent<unknown>,
    wrapper: ModulWrapper
  ) => {
    const selectedIndex = selected.indexOf(wrapper);
    let newSelected: readonly ModulWrapper[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, wrapper);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    const examPlan = getExamPlan();

    objectPath.set(examPlan, nestedKeys, newSelected);
    setExamPlan(examPlan);
  };

  const isSelected = (wrapper: ModulWrapper) =>
    selected.indexOf(wrapper) !== -1;

  return (
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
      <TableToolbar numSelected={selected.length} selected={selected} />
      <Table
        hoverRow
        sx={{
          '--TableCell-headBackground': 'transparent',
          '--TableCell-selectedBackground': (theme) =>
            theme.vars.palette.primary.softBg,
          '& thead th:nth-child(1)': {
            width: '40px'
          },
          '& thead th:nth-child(2)': {
            width: '40%'
          },
          '& thead th:nth-child(3)': {
            width: '20%'
          },
          '& thead th:nth-child(4)': {
            width: '13%'
          },
          '& tr > *:nth-child(n+3)': { textAlign: 'right' }
        }}
      >
        <TableHead />
        <tbody>
          {stableSort(rows, (a, b) => -descendingComparator(a, b)).map(
            (row) => {
              const isItemSelected = isSelected(row);
              return (
                <tr
                  onClick={(event) => handleClick(event, row)}
                  style={
                    isItemSelected
                      ? ({
                          '--TableCell-dataBackground':
                            'var(--TableCell-selectedBackground)',
                          '--TableCell-headBackground':
                            'var(--TableCell-selectedBackground)'
                        } as React.CSSProperties)
                      : {}
                  }
                >
                  <th scope="row">
                    <Checkbox
                      checked={isItemSelected}
                      sx={{ verticalAlign: 'top' }}
                    />
                  </th>
                  <td scope="row">
                    {' '}
                    <Typography level="title-sm">
                      {row.name.moduleName}
                    </Typography>
                  </td>
                  <td>{row.name.moduleID}</td>
                  <td>{row.name.moduleCredits}</td>
                  <td>{row.name.moduleLanguage}</td>
                </tr>
              );
            }
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'flex-end'
                }}
              ></Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
}
