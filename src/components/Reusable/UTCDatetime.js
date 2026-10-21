
import { Typography } from '@mui/material';
import React from 'react';
import { getUTCDatetime } from '../../utilities/DatetimeUtils';

const UTCDatetime = () => {
  const utcFullDate = getUTCDatetime();

  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontWeight: 500,
        fontSize: { xs: '10px', sm: '12px' },
        lineHeight: 1,
        paddingRight: '2px',
        fontFamily: 'Poppins, Roboto, sans-serif',
        background: 'linear-gradient(90deg, #2d95bd, #00c6ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 4px rgba(0,198,255,0.5)',
      }}
    >
      {utcFullDate} GMT
    </Typography>
  );
};

export default UTCDatetime;
