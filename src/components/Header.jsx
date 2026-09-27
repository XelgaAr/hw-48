import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';

export default function Header({ mode, onToggleTheme, onOpenMenu }) {
  const themeLabel = mode === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему';
  return <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>

    <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 1 }}>

      <IconButton aria-label="Открыть меню" onClick={onOpenMenu} sx={{ display: { md: 'none' } }}><Menu /></IconButton>

      <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>Моё пространство <Box component="span" sx={{ color: 'text.primary', ml: 1, display: { xs: 'none', sm: 'inline' } }}>/ Обучение</Box></Typography>

      <Tooltip title={themeLabel}><IconButton onClick={onToggleTheme} aria-label={themeLabel} sx={{ p: 1 }}>{mode === 'light' ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}</IconButton></Tooltip>

      <Box sx={{ ml: 1, display: 'grid', placeItems: 'center', bgcolor: 'action.selected', color: 'primary.main', borderRadius: '50%', width: 36, height: 36 }}>
        <SchoolOutlined fontSize="small" />
      </Box>

    </Toolbar>

  </AppBar>;
}
