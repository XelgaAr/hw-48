export const CATEGORIES = ['Frontend', 'Backend', 'Дизайн', 'Инструменты'];
export const DEFAULT_FILTERS = { query: '', category: 'all', status: 'all', sort: 'newest' };
export const EMPTY_COURSE = { title: '', description: '', category: 'Frontend', totalLessons: '12', completedLessons: '0' };

export const SEED_COURSES = [
  { id: 'react', title: 'React: от компонентов к приложению', description: 'Компоненты, хуки и архитектура современных интерфейсов.', category: 'Frontend', totalLessons: 24, completedLessons: 14, favorite: true, createdAt: 6 },
  { id: 'design', title: 'Основы дизайн-систем', description: 'Типографика, компоненты и визуальный язык продукта.', category: 'Дизайн', totalLessons: 16, completedLessons: 5, favorite: false, createdAt: 5 },
  { id: 'node', title: 'Node.js и работа с API', description: 'Маршруты, обработка запросов и структура серверного приложения.', category: 'Backend', totalLessons: 20, completedLessons: 8, favorite: true, createdAt: 4 },
  { id: 'git', title: 'Git: уверенная работа в команде', description: 'Ветки, коммиты и понятная история изменений.', category: 'Инструменты', totalLessons: 10, completedLessons: 10, favorite: false, createdAt: 3 },
  { id: 'css', title: 'CSS Grid и адаптивная вёрстка', description: 'Гибкие сетки и интерфейсы для любого размера экрана.', category: 'Frontend', totalLessons: 14, completedLessons: 3, favorite: false, createdAt: 2 },
  { id: 'figma', title: 'Прототипирование в Figma', description: 'От первой идеи до интерактивного прототипа.', category: 'Дизайн', totalLessons: 12, completedLessons: 0, favorite: false, createdAt: 1 },
];

function integerInput(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? value : NaN;
  return typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : NaN;
}

export function validateCourse(values) {
  const errors = {};
  const title = typeof values?.title === 'string' ? values.title.trim() : '';
  if (title.length < 3 || title.length > 80) errors.title = 'Название должно содержать от 3 до 80 символов.';
  if (typeof values?.description !== 'string' || values.description.length > 240) errors.description = 'Описание — не более 240 символов.';
  if (!CATEGORIES.includes(values?.category)) errors.category = 'Выберите направление.';
  const total = integerInput(values?.totalLessons);
  const completed = integerInput(values?.completedLessons);
  if (!Number.isInteger(total) || total < 1 || total > 100) errors.totalLessons = 'Введите целое число от 1 до 100.';
  if (!Number.isInteger(completed) || completed < 0 || completed > total) errors.completedLessons = 'Введите целое число от 0 до количества уроков.';
  return errors;
}

export function normalizeCourse(values) {
  if (Object.keys(validateCourse(values)).length) throw new Error('Некорректные данные курса.');
  return { title: values.title.trim(), description: values.description.trim(), category: values.category, totalLessons: integerInput(values.totalLessons), completedLessons: integerInput(values.completedLessons) };
}

export function validCourseList(value) {
  return Array.isArray(value) && value.length <= 5000 && new Set(value.map((item) => item?.id)).size === value.length
    && value.every((item) => item && typeof item.id === 'string' && item.id.length > 0
      && typeof item.favorite === 'boolean' && Number.isFinite(item.createdAt)
      && typeof item.totalLessons === 'number' && typeof item.completedLessons === 'number'
      && Object.keys(validateCourse(item)).length === 0);
}

export function progressOf(course) {
  return Math.round(course.completedLessons / course.totalLessons * 100);
}

export function advanceCourse(course) {
  return course.completedLessons >= course.totalLessons ? course : { ...course, completedLessons: course.completedLessons + 1 };
}

export function courseStats(courses) {
  const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0);
  const completedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0);
  const completed = courses.filter((course) => course.completedLessons === course.totalLessons).length;
  return {
    total: courses.length, active: courses.length - completed, completed,
    favorite: courses.filter((course) => course.favorite).length, totalLessons, completedLessons,
    percent: totalLessons ? Math.round(completedLessons / totalLessons * 100) : 0
  };
}

export function visibleCourses(courses, filters) {
  const query = filters.query.trim().toLocaleLowerCase('ru');
  return courses.filter((course) => {
    const done = course.completedLessons === course.totalLessons;
    return (!query || `${course.title} ${course.description}`.toLocaleLowerCase('ru').includes(query))
      && (filters.category === 'all' || course.category === filters.category)
      && (filters.status === 'all' || (filters.status === 'active' && !done)
        || (filters.status === 'completed' && done) || (filters.status === 'favorite' && course.favorite));
  }).sort((a, b) => {
    if (filters.sort === 'title') return a.title.localeCompare(b.title, 'ru');
    if (filters.sort === 'progress') return progressOf(b) - progressOf(a) || a.title.localeCompare(b.title, 'ru');
    return b.createdAt - a.createdAt;
  });
}

export function restoreCourse(courses, course) {
  return courses.some((item) => item.id === course.id) ? courses : [...courses, course];
}
