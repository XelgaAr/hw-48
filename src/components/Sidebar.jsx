import { Box, Chip, Drawer, LinearProgress, List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';

const navigation = [
  ['all', 'Все курсы', GridViewOutlined, 'total'],
  ['active', 'В процессе', PlayCircleOutline, 'active'],
  ['completed', 'Завершённые', CheckCircleOutline, 'completed'],
  ['favorite', 'Избранное', BookmarkBorder, 'favorite'],
];

export default function Sidebar({ open, onClose, status, onSelect, stats }) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  return <Drawer
    variant={desktop ? 'permanent' : 'temporary'}
    open={desktop || open}
    onClose={onClose}

    sx={{ width: { md: 240 }, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', borderRightColor: 'divider', p: 2.5 } }}
  >

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, py: 1, mb: 5 }}>

      <Box sx={{ display: 'grid', placeItems: 'center', width: 37, height: 37, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2.5 }}>
        <SchoolOutlined />
      </Box>

      <Typography variant="h5" component="span">campus<span style={{ color: '#9888df' }}>.</span></Typography>

    </Box>

    <Typography variant="overline" sx={{ color: 'text.secondary', pl: 1, letterSpacing: 1.5 }}>МОЁ ОБУЧЕНИЕ</Typography>

    <List component="nav" aria-label="Разделы курсов" sx={{ mt: 1 }}>

      {navigation.map(([value, label, Icon, count]) => <ListItemButton
        key={value}
        selected={status === value}

        onClick={() => { onSelect(value); onClose(); }}
        sx={{ borderRadius: 2, mb: 0.5, px: 1.2 }}
      >

        <ListItemIcon sx={{ minWidth: 34, color: status === value ? 'primary.main' : 'text.secondary' }}><Icon fontSize="small" /></ListItemIcon>

        <ListItemText
          primary={label}
          slotProps={{ primary: { fontSize: 13, fontWeight: status === value ? 700 : 500 } }}
        />

        <Chip label={stats[count]} size="small" sx={{ height: 22, fontSize: 11, bgcolor: 'action.hover' }} />

      </ListItemButton>)}

    </List>

    <Box sx={{ mt: 'auto', bgcolor: 'action.hover', p: 2, borderRadius: 3 }}>

      <Typography variant="overline" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 1 }}>ШАГ ЗА ШАГОМ</Typography>

      <Typography variant="h6" sx={{ my: 1 }}>Каждый урок —<br />новая возможность.</Typography>

      <LinearProgress
        variant="determinate"
        value={stats.percent}
        aria-label="Общий прогресс"
        sx={{ height: 6, borderRadius: 9, my: 1.5 }}
      />

      <Typography variant="caption" color="text.secondary">{stats.completedLessons} из {stats.totalLessons} уроков</Typography>

    </Box>

    <Typography variant="caption" color="text.secondary" sx={{ mt: 2.5, textAlign: 'center', fontSize: 10 }}>Личное пространство для роста</Typography>

  </Drawer>;
}
