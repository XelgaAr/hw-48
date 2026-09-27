import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, CssBaseline, Paper, Snackbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Add from '@mui/icons-material/Add';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import SearchOff from '@mui/icons-material/SearchOff';
import { buildTheme } from './theme.js';
import { usePersistentState } from './hooks/usePersistentState.js';
import { storageKey } from './lib/storage.js';
import { advanceCourse, courseStats, DEFAULT_FILTERS, restoreCourse, SEED_COURSES, validCourseList, visibleCourses } from './domain/courses.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import StudyStats from './components/StudyStats.jsx';
import CourseFilters from './components/CourseFilters.jsx';
import CourseCard from './components/CourseCard.jsx';
import CourseForm from './components/CourseForm.jsx';
import DeleteDialog from './components/DeleteDialog.jsx';

const courseKey = storageKey('campus-courses', import.meta.env.BASE_URL);
const themeKey = storageKey('campus-theme', import.meta.env.BASE_URL);
const validMode = (value) => value === 'light' || value === 'dark';
const sectionTitles = { all: 'Мои курсы', active: 'В процессе', completed: 'Завершённые курсы', favorite: 'Избранные курсы' };

export default function App() {
  const [courses, setCourses, coursesStorageFailed] = usePersistentState(courseKey, SEED_COURSES, validCourseList);
  const [mode, setMode, themeStorageFailed] = usePersistentState(themeKey, 'light', validMode);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState(null);
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const stats = useMemo(() => courseStats(courses), [courses]);
  const visible = useMemo(() => visibleCourses(courses, filters), [courses, filters]);
  const setFilter = (key, value) => setFilters((previous) => ({ ...previous, [key]: value }));
  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS });
  const saveCourse = (values, id) => {
    if (id) setCourses((previous) => previous.map((course) => course.id === id ? { ...course, ...values } : course));
    else {
      const course = { ...values, id: crypto.randomUUID(), favorite: false, createdAt: Date.now() };
      setCourses((previous) => [course, ...previous]);
      resetFilters();
    }
    setEditor(null);
    setNotice({ message: id ? 'Изменения сохранены.' : 'Новый курс добавлен в план.' });
  };
  const removeCourse = () => {
    setCourses((previous) => previous.filter((course) => course.id !== deleting.id));
    setNotice({ message: 'Курс удалён.', deleted: deleting });
    setDeleting(null);
  };
  const undoDelete = () => {
    setCourses((previous) => restoreCourse(previous, notice.deleted));
    setNotice({ message: 'Курс восстановлен.' });
  };
  const advance = (id) => {
    setCourses((previous) => previous.map((course) => course.id === id ? advanceCourse(course) : course));
    setNotice({ message: 'Ещё один урок пройден. Отличная работа!' });
  };
  const favorite = (id) => setCourses((previous) => previous.map((course) => course.id === id ? { ...course, favorite: !course.favorite } : course));

  return <ThemeProvider theme={theme}>
    <CssBaseline />

    <a className="skip-link" href="#main-content">Перейти к курсам</a>

    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        status={filters.status}
        onSelect={(value) => setFilter('status', value)}
        stats={stats}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>

        <Header
          mode={mode}
          onToggleTheme={() => setMode((previous) => previous === 'light' ? 'dark' : 'light')}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ p: { xs: 2, md: 4 }, maxWidth: 1480, mx: 'auto' }}
        >

          {(coursesStorageFailed || themeStorageFailed) && <Alert severity="warning" sx={{ mb: 2 }}>Браузер не разрешил сохранить данные. Изменения доступны до перезагрузки страницы.</Alert>}

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.8, fontSize: 10 }}>ВАШ ЛИЧНЫЙ УЧЕБНЫЙ ПЛАН</Typography>

              <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 29, md: 36 }, mt: 0.7 }}>Учиться. Пробовать. Расти.</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Соберите свои цели в одном пространстве.</Typography>

            </Box>

          </Box>

          <Paper
            elevation={0}
            sx={{ background: mode === 'light' ? '#eeeaf9' : '#2c2943', p: { xs: 2.5, md: 3 }, borderRadius: 3, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
          >

            <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
              <Chip
                icon={<AutoAwesomeOutlined />}
                label="МАЛЕНЬКИЕ ШАГИ — БОЛЬШИЕ РЕЗУЛЬТАТЫ"
                size="small"
                sx={{ bgcolor: 'transparent', color: 'primary.main', fontSize: 9, fontWeight: 700, mb: 1, maxWidth: '100%' }}
              />

              <Typography variant="h5" component="h2" sx={{ fontSize: { xs: 21, md: 25 }, mb: 1 }}>Ваш следующий навык<br />начинается здесь.</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, maxWidth: 400, mb: 2 }}>Добавляйте курсы, отмечайте пройденные уроки<br className="desktop-break" /> и наблюдайте за своим прогрессом.</Typography>

              <Button variant="contained" startIcon={<Add />} onClick={() => setEditor({ course: null })}>Добавить курс</Button>

            </Box>

            <Box
              aria-hidden="true"
              sx={{ display: { xs: 'none', sm: 'grid' }, width: 190, height: 170, placeItems: 'center', flexShrink: 0, position: 'relative' }}
            >

              <Box sx={{ position: 'absolute', width: 145, height: 145, border: '1px solid', borderColor: 'primary.light', borderRadius: '50%', opacity: 0.3 }} />

              <Box sx={{ transform: 'rotate(-11deg)', bgcolor: mode === 'light' ? '#fff' : '#45405f', color: 'primary.main', borderRadius: 3, width: 104, height: 125, p: 2.5, boxShadow: '8px 10px 0 #8678b42b' }}>

                <Typography sx={{ fontWeight: 800, fontSize: 35, lineHeight: 1 }}>Aa</Typography>
                <Box sx={{ mt: 1.5, width: 42, height: 5, bgcolor: 'primary.light', borderRadius: 3, opacity: 0.5 }} />
                <Box sx={{ mt: 0.6, width: 29, height: 5, bgcolor: 'primary.light', borderRadius: 3, opacity: 0.3 }} />

              </Box>

            </Box>

          </Paper>

          <StudyStats stats={stats} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
            <Typography variant="h5" component="h2">{sectionTitles[filters.status]}</Typography>
            <Chip label={visible.length} size="small" sx={{ height: 24 }} />
          </Box>

          <CourseFilters filters={filters} onChange={setFilter} />

          {visible.length ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }, gap: 2.2 }}>

            {visible.map((course) => <CourseCard
              key={course.id}
              course={course}
              onAdvance={advance}
              onFavorite={favorite}
              onEdit={(item) => setEditor({ course: item })}
              onDelete={setDeleting}
            />)}

          </Box> : <Paper variant="outlined" sx={{ p: 5, textAlign: 'center' }}>
            <SearchOff sx={{ fontSize: 42, color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>Курсы не найдены</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>Измените фильтры или добавьте новый курс.</Typography>
            <Button onClick={resetFilters}>Сбросить фильтры</Button>
          </Paper>}

          <Typography
            component="footer"
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 4, fontSize: 10 }}
          >Campus · Курсы и прогресс сохраняются только в этом браузере</Typography>

        </Box>

      </Box>

    </Box>

    {editor && <CourseForm course={editor.course} onSave={saveCourse} onClose={() => setEditor(null)} />}

    {deleting && <DeleteDialog course={deleting} onClose={() => setDeleting(null)} onConfirm={removeCourse} />}

    <Snackbar
      key={notice?.message}
      open={Boolean(notice)}
      autoHideDuration={8000}
      onClose={(_event, reason) => { if (reason !== 'clickaway') setNotice(null); }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        variant="filled"
        onClose={() => setNotice(null)}
        action={notice?.deleted ? <Button color="inherit" size="small" onClick={undoDelete}>Восстановить</Button> : undefined}
      >{notice?.message}</Alert>
    </Snackbar>

  </ThemeProvider>;
}
