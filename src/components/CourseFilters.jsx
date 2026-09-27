import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { CATEGORIES } from '../domain/courses.js';

export default function CourseFilters({ filters, onChange }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 170px 170px' }, gap: 1.5, mb: 2.5 }}>

    <TextField
      id="course-search"
      label="Найти курс"
      value={filters.query}
      onChange={(event) => onChange('query', event.target.value)}

      slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
    />

    <TextField
      id="category-filter"
      select
      label="Направление"
      value={filters.category}
      onChange={(event) => onChange('category', event.target.value)}
    >
      <MenuItem value="all">Все направления</MenuItem>{CATEGORIES.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
    </TextField>

    <TextField
      id="sort-filter"
      select
      label="Сортировка"
      value={filters.sort}
      onChange={(event) => onChange('sort', event.target.value)}
    >
      <MenuItem value="newest">Сначала новые</MenuItem><MenuItem value="title">По названию</MenuItem><MenuItem value="progress">По прогрессу</MenuItem>
    </TextField>

  </Box>;
}
