import { Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase';
import {
  useCreateStepGoalMutation,
  useUpdateStepGoalMutation,
} from '../../../hooks/useStepGoalMutation';
import { useStepGoalQuery } from '../../../hooks/useStepGoalQuery';

export const StepGoalSetting = () => {
  const [user] = useAuthState(auth);
  const { data: stepGoal } = useStepGoalQuery(user || null);
  const createMutation = useCreateStepGoalMutation(user || null);
  const updateMutation = useUpdateStepGoalMutation(user || null);

  const [open, setOpen] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const handleOpen = () => {
    setGoalInput(stepGoal?.dailyStepGoal?.toString() || '3000');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setGoalInput('');
  };

  const handleSave = async () => {
    const goal = Number.parseInt(goalInput, 10);
    if (Number.isNaN(goal) || goal <= 0) return;

    try {
      if (stepGoal) {
        await updateMutation.mutateAsync({ dailyStepGoal: goal });
      } else {
        await createMutation.mutateAsync({ dailyStepGoal: goal });
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save step goal:', error);
    }
  };

  const currentGoal = stepGoal?.dailyStepGoal || 3000;

  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          目標: {currentGoal.toLocaleString()}歩/日
        </Typography>
        <IconButton size="small" onClick={handleOpen}>
          <Settings fontSize="small" />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>一日の歩数目標を設定</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="歩数目標"
            type="number"
            fullWidth
            variant="outlined"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !goalInput ||
              Number.isNaN(Number.parseInt(goalInput, 10)) ||
              Number.parseInt(goalInput, 10) <= 0
            }
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
