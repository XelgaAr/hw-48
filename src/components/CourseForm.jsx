import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { CATEGORIES, EMPTY_COURSE, normalizeCourse, validateCourse } from '../domain/courses.js';

export default function CourseForm({ course, onClose, onSave }) {
  const [values, setValues] = useState(() => course ? { ...course } : { ...EMPTY_COURSE });
  const [errors, setErrors] = useState({});
  const update = (name) => (event) => {
    setValues((previous) => ({ ...previous, [name]: event.target.value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateCourse(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.currentTarget.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    onSave(normalizeCourse(values), course?.id);
  };
  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="course-form-title">

    <Box component="form" noValidate onSubmit={submit}>

      <DialogTitle id="course-form-title">{course ? 'Редактировать курс' : 'Новый курс'}</DialogTitle>

      <DialogContent>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Поставьте учебную цель и двигайтесь к ней в своём темпе.</Typography>

        <Box sx={{ display: 'grid', gap: 2.2 }}>

          <TextField
            id="course-title"
            name="title"
            label="Название курса"
            autoFocus
            value={values.title}
            onChange={update('title')}
            error={Boolean(errors.title)}
            helperText={errors.title || 'От 3 до 80 символов'}
            slotProps={{ htmlInput: { maxLength: 100 } }}
          />

          <TextField
            id="course-description"
            name="description"
            label="Описание"
            multiline
            minRows={2}
            value={values.description}
            onChange={update('description')}
            error={Boolean(errors.description)}
            helperText={errors.description || 'Необязательно, до 240 символов'}
          />

          <TextField
            id="course-category"
            name="category"
            label="Направление курса"
            select
            value={values.category}
            onChange={update('category')}
            error={Boolean(errors.category)}
            helperText={errors.category}
          >
            {CATEGORIES.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
          </TextField>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>

            <TextField
              id="total-lessons"
              name="totalLessons"
              label="Всего уроков"
              value={values.totalLessons}
              onChange={update('totalLessons')}
              error={Boolean(errors.totalLessons)}
              helperText={errors.totalLessons || 'От 1 до 100'}
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            />

            <TextField
              id="completed-lessons"
              name="completedLessons"
              label="Пройдено уроков"
              value={values.completedLessons}
              onChange={update('completedLessons')}
              error={Boolean(errors.completedLessons)}
              helperText={errors.completedLessons || 'Не больше общего количества'}
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            />

          </Box>

        </Box>

      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit">Отмена</Button>
        <Button variant="contained" type="submit">Сохранить курс</Button>
      </DialogActions>

    </Box>

  </Dialog>;
}
