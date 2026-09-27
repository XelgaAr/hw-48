import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCourse, courseStats, DEFAULT_FILTERS, normalizeCourse, progressOf, restoreCourse, SEED_COURSES, validCourseList, validateCourse, visibleCourses } from '../../src/domain/courses.js';

test('seed courses satisfy the storage schema', () => {
  assert.equal(validCourseList(SEED_COURSES), true);
  assert.equal(validCourseList([...SEED_COURSES, SEED_COURSES[0]]), false);
  assert.equal(validCourseList([{ ...SEED_COURSES[0], completedLessons: 999 }]), false);
  assert.equal(validCourseList([{ ...SEED_COURSES[0], totalLessons: '24' }]), false);
});
test('course form normalizes valid values and strips unrelated fields', () => {
  const result = normalizeCourse({ ...SEED_COURSES[0], title: '  Новый курс  ', totalLessons: '10', completedLessons: '3', extra: true });
  assert.equal(result.title, 'Новый курс'); assert.equal(result.totalLessons, 10); assert.equal(result.completedLessons, 3);
  assert.equal('extra' in result, false); assert.equal('id' in result, false);
});
test('course form rejects blanks, decimals, NaN, negatives and progress beyond total', () => {
  for (const totalLessons of ['', '1.2', '2e1', 'Infinity', 0, 101, NaN, -1]) {
    assert.ok(validateCourse({ ...SEED_COURSES[0], totalLessons }).totalLessons);
  }
  assert.ok(validateCourse({ ...SEED_COURSES[0], completedLessons: 25 }).completedLessons);
  assert.ok(validateCourse({ ...SEED_COURSES[0], completedLessons: '' }).completedLessons);
  assert.ok(validateCourse({ ...SEED_COURSES[0], title: '  ' }).title);
  assert.throws(() => normalizeCourse({}));
});
test('progress increments immutably and stops at total', () => {
  const original = { ...SEED_COURSES[0], totalLessons: 2, completedLessons: 1 };
  const next = advanceCourse(original);
  assert.equal(original.completedLessons, 1); assert.equal(next.completedLessons, 2);
  assert.equal(progressOf(next), 100); assert.equal(advanceCourse(next), next);
});
test('statistics handle empty lists and weighted progress', () => {
  assert.equal(courseStats([]).percent, 0);
  const stats = courseStats(SEED_COURSES);
  assert.equal(stats.total, 6); assert.equal(stats.completed, 1); assert.equal(stats.favorite, 2);
  assert.equal(stats.completedLessons, 40); assert.equal(stats.totalLessons, 96); assert.equal(stats.percent, 42);
});
test('combined search, category and favorite filters', () => {
  const result = visibleCourses(SEED_COURSES, { ...DEFAULT_FILTERS, query: '  REACT  ', status: 'favorite', category: 'Frontend' });
  assert.deepEqual(result.map((course) => course.id), ['react']);
  assert.deepEqual(visibleCourses(SEED_COURSES, { ...DEFAULT_FILTERS, status: 'completed' }).map((course) => course.id), ['git']);
  assert.equal(visibleCourses(SEED_COURSES, { ...DEFAULT_FILTERS, query: 'несуществующий' }).length, 0);
});
test('sort does not mutate the original array', () => {
  const frozen = Object.freeze([...SEED_COURSES]);
  const result = visibleCourses(frozen, { ...DEFAULT_FILTERS, sort: 'progress' });
  assert.equal(result[0].id, 'git'); assert.equal(frozen[0].id, 'react');
});
test('undo restores a course once without duplicate identifiers', () => {
  const removed = SEED_COURSES[0]; const list = SEED_COURSES.slice(1);
  const restored = restoreCourse(list, removed);
  assert.equal(restored.length, 6); assert.equal(list.length, 5);
  assert.equal(restoreCourse(restored, removed), restored);
});
