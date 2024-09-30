// src/pages/CaseDetailPage.js

import React, { useEffect, useState, useContext } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  AppBar,
  Toolbar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const CaseDetailPage = () => {
  const { id } = useParams(); // Получаем ID дела из URL
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '' });
  const [newEvidence, setNewEvidence] = useState({ name: '', description: '' });
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openEvidenceDialog, setOpenEvidenceDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Получаем детали дела
    axios
      .get(`/api/cases/${id}/`)
      .then((response) => {
        setCaseItem(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении деталей дела:', error);
        setSnackbar({ open: true, message: 'Ошибка при загрузке дела.', severity: 'error' });
      });

    // Получаем группы и связанные с ними вещественные доказательства
    axios
      .get(`/api/evidence-groups/?case=${id}`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении групп:', error);
        setSnackbar({ open: true, message: 'Ошибка при загрузке групп.', severity: 'error' });
      });
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Вкладка "Информация"
  const handleInfoChange = (event) => {
    const { name, value } = event.target;
    setCaseItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSave = () => {
    axios
      .put(`/api/cases/${id}/`, {
        name: caseItem.name,
        description: caseItem.description,
        active: caseItem.active,
      })
      .then((response) => {
        setCaseItem(response.data);
        setSnackbar({ open: true, message: 'Дело успешно обновлено.', severity: 'success' });
      })
      .catch((error) => {
        console.error('Ошибка при обновлении дела:', error);
        setSnackbar({ open: true, message: 'Ошибка при обновлении дела.', severity: 'error' });
      });
  };

  const handleStatusToggle = () => {
    const updatedStatus = !caseItem.active;
    axios
      .patch(`/api/cases/${id}/`, {
        active: updatedStatus,
      })
      .then((response) => {
        setCaseItem(response.data);
        setSnackbar({
          open: true,
          message: `Дело ${updatedStatus ? 'активировано' : 'закрыто'}.`,
          severity: 'success',
        });
      })
      .catch((error) => {
        console.error('Ошибка при изменении статуса дела:', error);
        setSnackbar({ open: true, message: 'Ошибка при изменении статуса дела.', severity: 'error' });
      });
  };

  // Вкладка "Вещдоки"
  const handleOpenGroupDialog = () => {
    setOpenGroupDialog(true);
  };

  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
    setNewGroup({ name: '' });
  };

  const handleGroupInputChange = (event) => {
    const { name, value } = event.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleGroupFormSubmit = (event) => {
    event.preventDefault();

    axios
      .post('/api/evidence-groups/', {
        name: newGroup.name,
        case: id,
      })
      .then((response) => {
        setGroups([...groups, response.data]);
        handleCloseGroupDialog();
        setSnackbar({ open: true, message: 'Группа успешно добавлена.', severity: 'success' });
      })
      .catch((error) => {
        console.error('Ошибка при добавлении группы:', error.response?.data || error);
        setSnackbar({ open: true, message: 'Ошибка при добавлении группы.', severity: 'error' });
      });
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId === selectedGroupId ? null : groupId);
  };

  const handleOpenEvidenceDialog = () => {
    setOpenEvidenceDialog(true);
  };

  const handleCloseEvidenceDialog = () => {
    setOpenEvidenceDialog(false);
    setNewEvidence({ name: '', description: '' });
  };

  const handleEvidenceInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvidence({ ...newEvidence, [name]: value });
  };

  const handleEvidenceFormSubmit = (event) => {
    event.preventDefault();

    axios
      .post('/api/material-evidences/', {
        name: newEvidence.name,
        description: newEvidence.description,
        case_id: id,
        group_id: selectedGroupId,
      })
      .then((response) => {
        // Обновляем список доказательств в группе
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === selectedGroupId
              ? {
                  ...group,
                  material_evidences: [...group.material_evidences, response.data],
                }
              : group
          )
        );
        handleCloseEvidenceDialog();
        setSnackbar({
          open: true,
          message: 'Вещественное доказательство добавлено.',
          severity: 'success',
        });
      })
      .catch((error) => {
        console.error(
          'Ошибка при добавлении вещественного доказательства:',
          error.response?.data || error
        );
        setSnackbar({
          open: true,
          message: 'Ошибка при добавлении вещественного доказательства.',
          severity: 'error',
        });
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!caseItem) {
    return (
      <Container>
        <Typography variant="h6">Загрузка...</Typography>
      </Container>
    );
  }

  // Проверяем, является ли текущий пользователь создателем дела
  const isCreator = user && user.id === caseItem.creator;

  // Проверяем права просмотра
  const canView =
    isCreator || user.role === 'DEPARTMENT_HEAD' || user.role === 'REGION_HEAD';

  // Определяем, может ли пользователь редактировать дело
  const canEdit = isCreator && user.role !== 'REGION_HEAD';

  // Определяем, может ли пользователь добавлять группы
  const canAddGroup = isCreator && user.role !== 'REGION_HEAD';

  if (!canView) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          У вас нет прав для просмотра этого дела.
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Верхнее меню */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Детали дела
          </Typography>
          {canEdit && (
            <Tooltip
              title={caseItem.active ? 'Закрыть дело' : 'Активировать дело'}
            >
              <Button
                variant="contained"
                color={caseItem.active ? 'secondary' : 'primary'}
                startIcon={
                  caseItem.active ? <CloseIcon /> : <CheckCircleIcon />
                }
                onClick={handleStatusToggle}
              >
                {caseItem.active ? 'Закрыть' : 'Активировать'}
              </Button>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* Основной контент */}
      <Container sx={{ marginTop: 10, paddingTop: 4 }}>
        {/* Вкладки */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ marginBottom: 2 }}
        >
          <Tab label="Информация" />
          <Tab label="Вещдоки" />
        </Tabs>

        {/* Вкладка "Информация" */}
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Название дела"
                  name="name"
                  value={caseItem.name}
                  onChange={handleInfoChange}
                  fullWidth
                  disabled={!canEdit}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Описание дела"
                  name="description"
                  value={caseItem.description}
                  onChange={handleInfoChange}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={!canEdit}
                />
              </Grid>
              {canEdit && (
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleInfoSave}
                  >
                    Сохранить изменения
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {/* Вкладка "Вещдоки" */}
        {tabValue === 1 && (
          <Box>
            {/* Кнопки над таблицей */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              {canAddGroup && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenGroupDialog}
                >
                  Добавить группу
                </Button>
              )}
              {selectedGroupId && canAddGroup && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenEvidenceDialog}
                >
                  Добавить вещественное доказательство
                </Button>
              )}
            </Box>

            {/* Таблица с группами и вещественными доказательствами */}
            <Box>
              {groups.map((group) => (
                <Accordion
                  key={group.id}
                  expanded={selectedGroupId === group.id}
                  onChange={() => handleGroupSelect(group.id)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{group.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table aria-label={`Таблица ВД группы ${group.name}`}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Штрихкод</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.material_evidences &&
                          group.material_evidences.length > 0 ? (
                            group.material_evidences.map((evidence) => (
                              <TableRow key={evidence.id}>
                                <TableCell>{evidence.name}</TableCell>
                                <TableCell>{evidence.description}</TableCell>
                                <TableCell>
                                  {evidence.status_display || evidence.status}
                                </TableCell>
                                <TableCell>{evidence.barcode}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                Нет вещественных доказательств.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Диалоговое окно для добавления новой группы */}
            <Dialog
              open={openGroupDialog}
              onClose={handleCloseGroupDialog}
            >
              <DialogTitle>Добавить группу</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Название группы"
                  name="name"
                  value={newGroup.name}
                  onChange={handleGroupInputChange}
                  fullWidth
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseGroupDialog}>Отмена</Button>
                <Button
                  onClick={handleGroupFormSubmit}
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
              </DialogActions>
            </Dialog>

            {/* Диалоговое окно для добавления нового вещественного доказательства */}
            <Dialog
              open={openEvidenceDialog}
              onClose={handleCloseEvidenceDialog}
            >
              <DialogTitle>Добавить вещественное доказательство</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Название ВД"
                  name="name"
                  value={newEvidence.name}
                  onChange={handleEvidenceInputChange}
                  fullWidth
                  required
                />
                <TextField
                  margin="dense"
                  label="Описание ВД"
                  name="description"
                  value={newEvidence.description}
                  onChange={handleEvidenceInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEvidenceDialog}>Отмена</Button>
                <Button
                  onClick={handleEvidenceFormSubmit}
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Container>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CaseDetailPage;
