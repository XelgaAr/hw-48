import { Box, Paper, Typography } from '@mui/material';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import AutoGraphOutlined from '@mui/icons-material/AutoGraphOutlined';

export default function StudyStats({ stats }) {
  const cards = [
    ['Курсов в плане', stats.total, MenuBookOutlined, `${stats.active} в процессе`],
    ['Уроков пройдено', stats.completedLessons, TaskAltOutlined, `из ${stats.totalLessons} уроков`],
    ['Общий прогресс', `${stats.percent}%`, AutoGraphOutlined, `${stats.completed} курсов завершено`],
  ];
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, my: 3 }}>

    {cards.map(([label, value, Icon, note]) => <Paper key={label} variant="outlined" sx={{ p: 2.2, display: 'flex', gap: 2, alignItems: 'center' }}>

      <Box sx={{ p: 1.3, bgcolor: 'action.hover', color: 'primary.main', borderRadius: 2.5, display: 'flex' }}>
        <Icon />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" sx={{ lineHeight: 1.4 }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{note}</Typography>
      </Box>

    </Paper>)}

  </Box>;
}
