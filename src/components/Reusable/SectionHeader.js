
import { Typography } from '@mui/material';
import React from 'react';

const SectionHeader = ({ title, mb }) => {
  return (
    <Typography
      variant="h5"
      component="h5"
      sx={{
        fontSize: { xs: '14px', sm: '18px', md: '20px' },
        fontWeight: 700,
        lineHeight: 1.2,
        textAlign: 'center',
        fontFamily: 'Poppins, Roboto, sans-serif',
        marginBottom: mb ? mb : '1rem',
        background: 'linear-gradient(90deg, #2d95bd, #00c6ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      {title}
    </Typography>
  );
};

export default SectionHeader;
