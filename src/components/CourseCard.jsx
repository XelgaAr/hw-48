import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import Code from '@mui/icons-material/Code';
import StorageOutlined from '@mui/icons-material/StorageOutlined';
import PaletteOutlined from '@mui/icons-material/PaletteOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import Bookmark from '@mui/icons-material/Bookmark';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Check from '@mui/icons-material/Check';
import { progressOf } from '../domain/courses.js';

const categoryStyles = {
  Frontend: { Icon: Code, color: '#6655ad', background: '#efebfb', code: '< />' },
  Backend: { Icon: StorageOutlined, color: '#37776d', background: '#e7f3ed', code: '{ }' },
  Дизайн: { Icon: PaletteOutlined, color: '#a66b45', background: '#f8eee5', code: 'Aa' },
  Инструменты: { Icon: BuildOutlined, color: '#4c779b', background: '#e8f0f7', code: 'git' },
};

export default function CourseCard({ course, onAdvance, onFavorite, onEdit, onDelete }) {
  const { Icon, color, background, code } = categoryStyles[course.category];
  const done = course.completedLessons === course.totalLessons;
  const percent = progressOf(course);
  return <Card
    component="article"
    aria-label={course.title}
    sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
  >

    <Box sx={{ height: 110, m: 1.2, mb: 0, borderRadius: 2.4, bgcolor: background, color, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.4, position: 'relative', overflow: 'hidden' }}>

      <Icon sx={{ fontSize: 33, zIndex: 1 }} />
      <Typography
        aria-hidden="true"
        sx={{ fontSize: 66, fontWeight: 800, letterSpacing: '-0.08em', opacity: 0.17 }}
      >{code}</Typography>

      <Tooltip title={course.favorite ? 'Убрать из избранного' : 'В избранное'}><IconButton
        aria-label={`Избранное: ${course.title}`}
        aria-pressed={course.favorite}
        onClick={() => onFavorite(course.id)}
        sx={{ color, position: 'absolute', right: 7, top: 7 }}
      >{course.favorite ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}</IconButton></Tooltip>

    </Box>

    <CardContent sx={{ p: 2.4, display: 'flex', flexDirection: 'column', flex: 1, '&:last-child': { pb: 2.4 } }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.4, gap: 1 }}>

        <Chip
          label={course.category}
          size="small"
          sx={{ bgcolor: background, color, fontSize: 10, height: 23, fontWeight: 600 }}
        />

        <Typography variant="caption" color={done ? 'success.main' : 'text.secondary'} sx={{ fontSize: 10 }}>{done ? 'Завершён' : course.completedLessons ? 'В процессе' : 'Новый курс'}</Typography>

      </Box>

      <Typography component="h3" variant="h6" sx={{ lineHeight: 1.4, mb: 0.8, overflowWrap: 'anywhere' }}>{course.title}</Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: 12, lineHeight: 1.7, mb: 2.2, overflowWrap: 'anywhere' }}
      >{course.description || 'Добавьте описание в настройках курса.'}</Typography>

      <Box sx={{ mt: 'auto' }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography variant="caption" color="text.secondary">{course.completedLessons} / {course.totalLessons} уроков</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{percent}%</Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={percent}
          aria-label={`Прогресс: ${course.title}`}
          sx={{ height: 5, borderRadius: 5, mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>

          <Button
            fullWidth
            variant="outlined"
            size="small"
            disabled={done}
            endIcon={done ? <Check /> : <ArrowForward />}
            onClick={() => onAdvance(course.id)}
            sx={{ mr: 0.5, fontSize: 11, py: 0.8 }}
          >{done ? 'Курс завершён' : 'Следующий урок'}</Button>

          <Tooltip title="Редактировать"><IconButton aria-label={`Редактировать: ${course.title}`} onClick={() => onEdit(course)}><EditOutlined sx={{ fontSize: 18 }} /></IconButton></Tooltip>

          <Tooltip title="Удалить"><IconButton aria-label={`Удалить: ${course.title}`} onClick={() => onDelete(course)}><DeleteOutline sx={{ fontSize: 18 }} /></IconButton></Tooltip>

        </Box>

      </Box>

    </CardContent>

  </Card>;
}
