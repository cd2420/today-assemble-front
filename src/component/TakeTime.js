import React, {useState, useEffect} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TakeTime() {
  const [takeTimes, setTakeTimes] = useState([]);
  const [takeTime, setTakeTime] = useState(1);

  useEffect(() => {
      const tmp_times = [];
      for (let i = 1; i < 25; i++) {
        tmp_times.push([i, i + '시간']);
      }
      setTakeTimes(tmp_times);

  }, [])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTakeTime(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">걸리는 시간</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={takeTime}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {takeTimes.map((time) => (
            <MenuItem key={time[0]} value={time[0]}>
              <ListItemText primary={time[1]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}