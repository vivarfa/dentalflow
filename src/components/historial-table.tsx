"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { ClinicalHistory } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface HistorialTableProps {
  data: ClinicalHistory[];
  onUpdateField: (recordId: string, fieldName: string, newValue: string, recordType: 'history') => Promise<void>;
  onDeleteHistorial?: (historialId: string) => Promise<void>;
  onAddHistorial?: (historialData: Partial<ClinicalHistory>) => Promise<void>;
  patientId?: string;
  availableCitas?: Array<{ID_Cita: string, Fecha_Cita: string, Motivo_Cita: string}>;
}

const estadosPago = [
  { value: 'Pendiente', label: 'Pendiente', color: 'warning' as const },
  { value: 'Pagado', label: 'Pagado', color: 'success' as const },
  { value: 'Parcial', label: 'Parcial', color: 'primary' as const },
  { value: 'Cancelado', label: 'Cancelado', color: 'error' as const }
];

interface EditableCellProps {
  value: string | undefined;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'date' | 'select' | 'number';
  options?: { value: string; label: string; color?: string }[];
  multiline?: boolean;
  placeholder?: string;
}

function EditableCell({ value, onSave, type = 'text', options, multiline = false, placeholder }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (editValue !== value) {
      setIsSaving(true);
      try {
        await onSave(editValue);
        toast({
          title: "Campo actualizado",
          description: "El cambio se ha guardado correctamente."
        });
      } catch (error) {
        console.error('Error saving:', error);
        setEditValue(value || '');
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar el cambio."
        });
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDisplayValue = () => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return placeholder || 'Sin información';
    }
    if (type === 'date' && typeof value === 'string') {
      try {
        return format(parseISO(value), "dd/MM/yyyy", { locale: es });
      } catch (error) {
        return value;
      }
    }
    if (type === 'number' && value && typeof value === 'string') {
      return `${parseFloat(value).toLocaleString()}`;
    }
    return value || '';
  };

  if (type === 'select' && !isEditing) {
    const option = options?.find(opt => opt.value === value);
    if (option) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={option.label} 
            color={option.color as any || 'default'} 
            size="small"
            onClick={() => setIsEditing(true)}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      );
    }
  }

  if (!isEditing) {
    return (
      <Box 
        onClick={() => setIsEditing(true)}
        sx={{ 
          cursor: 'pointer', 
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'action.hover',
            borderRadius: 1
          },
          padding: '2px 4px',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color={!value || (typeof value === 'string' && value.trim() === '') ? 'text.secondary' : 'text.primary'}>
          {formatDisplayValue()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '200px' }}>
      {type === 'select' ? (
        <TextField
          select
          size="small"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          fullWidth
          disabled={isSaving}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          size="small"
          type={type}
          multiline={multiline}
          rows={multiline ? 2 : 1}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          fullWidth
          disabled={isSaving}
        />
      )}
      <IconButton 
        size="small" 
        onClick={handleSave} 
        disabled={isSaving}
        color="primary"
      >
        <SaveIcon fontSize="small" />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={handleCancel} 
        disabled={isSaving}
      >
        <CancelIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export function HistorialTable({ data, onUpdateField, onDeleteHistorial, onAddHistorial, patientId, availableCitas = [] }: HistorialTableProps) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newHistorial, setNewHistorial] = useState<Partial<ClinicalHistory>>({
    Fecha_Historial: '',
    ID_Cita: '',
    Diagnostico: '',
    Tratamiento_Realizado: '',
    Prescripciones: '',
    Notas_Adicionales: '',
    Costo_Tratamiento: '',
    Estado_Pago: 'Pendiente'
  });
  const { toast } = useToast();

  const handleDelete = async (historialId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro del historial?')) {
      try {
        await onDeleteHistorial?.(historialId);
        toast({
          title: "Registro eliminado",
          description: "El registro del historial se ha eliminado correctamente."
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el registro."
        });
      }
    }
  };

  const handleAddHistorial = async () => {
    try {
      await onAddHistorial?.(newHistorial);
      setOpenAddDialog(false);
      setNewHistorial({
        Fecha_Historial: '',
        ID_Cita: '',
        Diagnostico: '',
        Tratamiento_Realizado: '',
        Prescripciones: '',
        Notas_Adicionales: '',
        Costo_Tratamiento: '',
        Estado_Pago: 'Pendiente'
      });
      toast({
        title: "Historial agregado",
        description: "El nuevo registro se ha agregado correctamente."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar el registro."
      });
    }
  };

  // Verificar si hay datos vacíos o sin información
  // Solo considerar vacío si NO hay ID_Historial o si los campos principales están vacíos
  const hasEmptyData = data && data.length > 0 && data.every(item => 
    !item.ID_Historial || (
      (!item.Diagnostico || item.Diagnostico.trim() === '') &&
      (!item.Tratamiento_Realizado || item.Tratamiento_Realizado.trim() === '') &&
      (!item.Fecha_Historial || item.Fecha_Historial.trim() === '')
    )
  );



  if (!data || data.length === 0 || hasEmptyData) {
    return (
      <>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {hasEmptyData 
              ? "El historial clínico fue omitido durante el registro. Los campos están vacíos."
              : "No hay registros en el historial clínico."
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Puede agregar información del historial clínico cuando esté disponible.
          </Typography>
          {onAddHistorial && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ mt: 2 }}
            >
              Agregar Primer Registro
            </Button>
          )}
        </Paper>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Agregar Nuevo Registro al Historial</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
              <TextField
                label="Fecha del Tratamiento"
                type="date"
                value={newHistorial.Fecha_Historial}
                onChange={(e) => setNewHistorial({ ...newHistorial, Fecha_Historial: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                select
                label="Cita Asociada"
                value={newHistorial.ID_Cita}
                onChange={(e) => setNewHistorial({ ...newHistorial, ID_Cita: e.target.value })}
                fullWidth
                helperText={availableCitas.length === 0 ? "No hay citas disponibles" : "Selecciona la cita relacionada"}
              >
                <MenuItem value="">
                  <em>Sin cita asociada</em>
                </MenuItem>
                {availableCitas.map((cita) => (
                  <MenuItem key={cita.ID_Cita} value={cita.ID_Cita}>
                    {cita.Fecha_Cita} - {cita.Motivo_Cita}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Costo del Tratamiento"
                type="number"
                value={newHistorial.Costo_Tratamiento}
                onChange={(e) => setNewHistorial({ ...newHistorial, Costo_Tratamiento: e.target.value })}
                fullWidth
              />
              <TextField
                label="Diagnóstico"
                value={newHistorial.Diagnostico}
                onChange={(e) => setNewHistorial({ ...newHistorial, Diagnostico: e.target.value })}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                label="Tratamiento Realizado"
                value={newHistorial.Tratamiento_Realizado}
                onChange={(e) => setNewHistorial({ ...newHistorial, Tratamiento_Realizado: e.target.value })}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                label="Prescripciones"
                value={newHistorial.Prescripciones}
                onChange={(e) => setNewHistorial({ ...newHistorial, Prescripciones: e.target.value })}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                label="Observaciones Adicionales"
                value={newHistorial.Notas_Adicionales}
                onChange={(e) => setNewHistorial({ ...newHistorial, Notas_Adicionales: e.target.value })}
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                select
                label="Estado del Pago"
                value={newHistorial.Estado_Pago}
                onChange={(e) => setNewHistorial({ ...newHistorial, Estado_Pago: e.target.value })}
                fullWidth
              >
                {estadosPago.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddHistorial} variant="contained">Agregar Registro</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Historial Clínico ({data.length})
        </Typography>
        {onAddHistorial && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Nuevo Registro
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Diagnóstico</strong></TableCell>
              <TableCell><strong>Tratamiento</strong></TableCell>
              <TableCell><strong>Prescripciones</strong></TableCell>
              <TableCell><strong>Observaciones</strong></TableCell>
              <TableCell><strong>Costo</strong></TableCell>
              <TableCell><strong>Estado Pago</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((historial) => (
              <TableRow key={historial.ID_Historial} hover>
                <TableCell>
                  <EditableCell
                    value={historial.Fecha_Historial || historial.Fecha_Tratamiento}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Fecha_Historial', newValue, 'history')}
                    type="date"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Diagnostico}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Diagnostico', newValue, 'history')}
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Tratamiento_Realizado}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Tratamiento_Realizado', newValue, 'history')}
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Prescripciones}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Prescripciones', newValue, 'history')}
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Notas_Adicionales}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Notas_Adicionales', newValue, 'history')}
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Costo_Tratamiento}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Costo_Tratamiento', newValue, 'history')}
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={historial.Estado_Pago}
                    onSave={(newValue) => onUpdateField(historial.ID_Historial, 'Estado_Pago', newValue, 'history')}
                    type="select"
                    options={estadosPago}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {onDeleteHistorial && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(historial.ID_Historial)}
                        color="error"
                        title="Eliminar registro"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para agregar nuevo registro */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Nuevo Registro al Historial</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              label="Fecha del Tratamiento"
              type="date"
              value={newHistorial.Fecha_Historial}
              onChange={(e) => setNewHistorial({ ...newHistorial, Fecha_Historial: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Costo del Tratamiento"
              type="number"
              value={newHistorial.Costo_Tratamiento}
              onChange={(e) => setNewHistorial({ ...newHistorial, Costo_Tratamiento: e.target.value })}
              fullWidth
            />
            <TextField
              label="Diagnóstico"
              value={newHistorial.Diagnostico}
              onChange={(e) => setNewHistorial({ ...newHistorial, Diagnostico: e.target.value })}
              multiline
              rows={2}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Tratamiento Realizado"
              value={newHistorial.Tratamiento_Realizado}
              onChange={(e) => setNewHistorial({ ...newHistorial, Tratamiento_Realizado: e.target.value })}
              multiline
              rows={2}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Prescripciones"
              value={newHistorial.Prescripciones}
              onChange={(e) => setNewHistorial({ ...newHistorial, Prescripciones: e.target.value })}
              multiline
              rows={2}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Observaciones Adicionales"
              value={newHistorial.Notas_Adicionales}
              onChange={(e) => setNewHistorial({ ...newHistorial, Notas_Adicionales: e.target.value })}
              multiline
              rows={2}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              select
              label="Estado del Pago"
              value={newHistorial.Estado_Pago}
              onChange={(e) => setNewHistorial({ ...newHistorial, Estado_Pago: e.target.value })}
              fullWidth
            >
              {estadosPago.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>
                  {estado.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddHistorial} variant="contained">Agregar Registro</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HistorialTable;