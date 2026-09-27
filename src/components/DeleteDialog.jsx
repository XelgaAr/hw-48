import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DeleteDialog({ course, onClose, onConfirm }) {
  return <Dialog
    open
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    aria-labelledby="delete-title"
    aria-describedby="delete-description"
  >

    <DialogTitle id="delete-title">Удалить курс?</DialogTitle>

    <DialogContent>
      <DialogContentText id="delete-description">«{course.title}» и его прогресс будут удалены из плана. Сразу после удаления действие можно отменить.</DialogContentText>
    </DialogContent>

    <DialogActions sx={{ p: 2.5 }}>
      <Button onClick={onClose} autoFocus color="inherit">Оставить</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Удалить курс</Button>
    </DialogActions>

  </Dialog>;
}
