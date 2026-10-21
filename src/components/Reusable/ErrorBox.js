import * as React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function ErrorBox(props) {
  const isInfo = props.type === 'info';

  return (
    <Box
      display={props.display || 'flex'}
      justifyContent={props.justifyContent || 'center'}
      alignItems={props.alignItems || 'center'}
      margin={props.margin || '1rem auto'}
      gap={props.gap || '8px'}
      flex={props.flex || 'auto'}
      width={props.width || 'auto'}
      sx={{
        padding: '1rem',
        flexDirection: { xs: 'column', sm: 'row' },
        color: isInfo ? '#f5a922' : '#DC2941',
        border: isInfo ? '1px solid rgba(245,169,34,0.6)' : '1px solid rgba(220,41,65,0.6)',
        borderRadius: '12px',
        background: isInfo
          ? 'linear-gradient(145deg, rgba(245,169,34,0.15), rgba(245,169,34,0.05))'
          : 'linear-gradient(145deg, rgba(220,41,65,0.25), rgba(220,41,65,0.1))',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: '28px',
          color: isInfo ? '#f5a922' : '#DC2941',
        }}
      />

      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: isInfo
            ? { xs: '12px', sm: '14px' }
            : { xs: '14px', sm: '16px' },
          fontFamily: 'Poppins',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        {props.errorMessage || (isInfo ? 'Notice' : 'Something went wrong.')}
      </Typography>
    </Box>
  );
}
