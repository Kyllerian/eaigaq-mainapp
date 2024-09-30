// src/components/Header.js

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Кнопка меню (опционально) */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Название приложения
        </Typography>
        {/* Кнопки навигации или иконки пользователя */}
        <Button color="inherit">Выйти</Button>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
