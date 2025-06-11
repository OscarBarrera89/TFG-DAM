import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Tabs,
  TextField,
  Tab,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useNavigate } from 'react-router';
import useUserStore from '../stores/useUserStore';
import dayjs from 'dayjs';
import { apiUrl } from '../config';

function PanelAdmin() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [tabValue, setTabValue] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuPage, setMenuPage] = useState(0);
  const [reservationsPage, setReservationsPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [tablesPage, setTablesPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [filterRole, setFilterRole] = useState('');
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const availableTimes = [
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ];

  const tableLocations = ['Interior', 'Ventana', 'Terraza'];

  const isPastOrMonday = (date) => {
    const today = dayjs().startOf("day");
    return date.isBefore(today, "day") || date.day() === 1;
  };

  const getCsrfToken = async () => {
    await fetch(`${apiUrl}sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN"))
      ?.split("=")[1];
    if (!csrfToken) throw new Error("No se encontró el token CSRF");
    return decodeURIComponent(csrfToken);
  };

  const getMaxPeopleForTable = (tableId) => {
    const table = tables.find((t) => t.id === parseInt(tableId));
    return table ? Math.min(table.capacity + 1, 8) : 8;
  };

  const getMinPeopleForTable = (tableId) => {
    const table = tables.find((t) => t.id === parseInt(tableId));
    return table ? Math.min(table.capacity - 1, 2) : 2;
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch(`${apiUrl}categories`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al cargar las categorías');
        const data = await response.json();
        setCategories([{ id: 0, name: 'Todas' }, ...data]);
      } catch (err) {
        setError(err.message);
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${apiUrl}products`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al cargar el menú');
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${apiUrl}tables`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al cargar las mesas');
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${apiUrl}reservations`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al cargar las reservas');
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}users`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al cargar los usuarios');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteMenuItem = async (id) => {
    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN'))
        ?.split('=')[1];
      if (!csrfToken) throw new Error('No se encontró el token CSRF');

      const response = await fetch(`${apiUrl}products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
      });
      if (!response.ok) throw new Error('Error al eliminar el producto');
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN'))
        ?.split('=')[1];
      if (!csrfToken) throw new Error('No se encontró el token CSRF');

      const response = await fetch(`${apiUrl}reservations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
      });
      if (!response.ok) throw new Error('Error al eliminar la reserva');
      setReservations(reservations.filter((reservation) => reservation.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmReservation = async (id) => {
    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN'))
        ?.split('=')[1];
      if (!csrfToken) throw new Error('No se encontró el token CSRF');

      const response = await fetch(`${apiUrl}reservations/${id}/confirm`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al confirmar la reserva');
      }
      const updatedReservation = await response.json();
      setReservations(reservations.map((res) => (res.id === id ? updatedReservation.reservation : res)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN'))
        ?.split('=')[1];
      if (!csrfToken) throw new Error('No se encontró el token CSRF');

      const response = await fetch(`${apiUrl}users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
      });
      if (!response.ok) throw new Error('Error al eliminar el usuario');
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${apiUrl}tables/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la mesa");
      }
      setTables(tables.filter((table) => table.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenModal = (type, item = {}) => {
    setModalType(type);
    if (type === 'reservation') {
      const formattedTime = item.time ? item.time.slice(0, 5) : '';
      setCurrentItem({
        ...item,
        date: item.date ? dayjs(item.date) : null,
        time: formattedTime,
      });
    } else if (type === 'user') {
      setCurrentItem({
        ...item,
        password: '',
      });
    } else {
      setCurrentItem(item);
    }
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType('');
    setCurrentItem({});
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (modalType === 'menu') {
      if (!currentItem.name?.trim()) errors.name = 'El nombre es obligatorio';
      if (!currentItem.description?.trim()) errors.description = 'La descripción es obligatoria';
      if (!currentItem.price || currentItem.price <= 0) errors.price = 'El precio debe ser mayor a 0';
      if (!currentItem.category_id) errors.category_id = 'La categoría es obligatoria';
    } else if (modalType === 'reservation') {
      if (!currentItem.user_id) errors.user_id = 'El ID de usuario es obligatorio';
      if (!currentItem.table_id) errors.table_id = 'La mesa es obligatoria';
      if (!currentItem.date) errors.date = 'La fecha es obligatoria';
      if (!currentItem.time) errors.time = 'La hora es obligatoria';
      if (!currentItem.people || currentItem.people < getMinPeopleForTable(currentItem.table_id) || currentItem.people > getMaxPeopleForTable(currentItem.table_id)) {
        errors.people = `El número de personas debe estar entre ${getMinPeopleForTable(currentItem.table_id)} y ${getMaxPeopleForTable(currentItem.table_id)}`;
      }
      if (!currentItem.status) errors.status = 'El estado es obligatorio';
    } else if (modalType === 'user') {
      if (!currentItem.name?.trim()) errors.name = 'El nombre es obligatorio';
      if (!currentItem.email?.trim()) errors.email = 'El email es obligatorio';
      if (currentItem.password && currentItem.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
      if (!currentItem.role) errors.role = 'El rol es obligatorio';
    } else if (modalType === 'table') {
      if (!currentItem.location?.trim()) errors.location = 'La localización es obligatoria';
      if (!currentItem.capacity || currentItem.capacity <= 0) errors.capacity = 'La capacidad debe ser mayor a 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatDateLocal = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date)) {
    throw new Error("Fecha inválida");
  }
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const csrfToken = await getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
      };

      let response;
      if (modalType === 'menu') {
        response = await fetch(`${apiUrl}products/${currentItem.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            name: currentItem.name,
            description: currentItem.description,
            price: parseFloat(currentItem.price),
            category_id: parseInt(currentItem.category_id),
            image: currentItem.image,
          }),
        });
        if (!response.ok) throw new Error('Error al actualizar el producto');
        const updatedItem = await response.json();
        setMenuItems(menuItems.map((item) => (item.id === currentItem.id ? updatedItem : item)));
      } else if (modalType === 'reservation') {
        response = await fetch(`${apiUrl}reservations/${currentItem.id}/edit`, {
          method: 'PUT',
          credentials: 'include',
          headers,
          body: JSON.stringify({
            user_id: parseInt(currentItem.user_id),
            table_id: parseInt(currentItem.table_id),
            date: formatDateLocal(currentItem.date),
            time: currentItem.time,
            people: parseInt(currentItem.people),
            status: currentItem.status,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar la reserva');
        }
        const updatedReservation = await response.json();
        setReservations(reservations.map((res) => (res.id === currentItem.id ? updatedReservation.reservation : res)));
      } else if (modalType === 'user') {
        const payload = {
          name: currentItem.name,
          email: currentItem.email,
          role: currentItem.role,
        };
        if (currentItem.password) {
          payload.password = currentItem.password;
        }
        response = await fetch(`${apiUrl}users/${currentItem.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers,
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar el usuario');
        }
        const updatedResponse = await response.json();
        setUsers(users.map((user) => (user.id === currentItem.id ? updatedResponse.user : user)));
      } else if (modalType === 'table') {
        if (currentItem.id) {
          response = await fetch(`${apiUrl}tables/${currentItem.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              location: currentItem.location,
              capacity: parseInt(currentItem.capacity),
            }),
          });
          if (!response.ok) throw new Error('Error al actualizar la mesa');
          const updatedTable = await response.json();
          setTables(tables.map((table) => (table.id === currentItem.id ? updatedTable : table)));
        } else {
          response = await fetch(`${apiUrl}tables`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              location: currentItem.location,
              capacity: parseInt(currentItem.capacity),
              status: 'disponible',
            }),
          });
          if (!response.ok) throw new Error('Error al añadir la mesa');
          const newTable = await response.json();
          setTables([...tables, newTable]);
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePage = (type, newPage) => {
    if (type === 'menu') setMenuPage(newPage);
    else if (type === 'reservation') setReservationsPage(newPage);
    else if (type === 'user') setUsersPage(newPage);
    else if (type === 'table') setTablesPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setMenuPage(0);
    setReservationsPage(0);
    setUsersPage(0);
    setTablesPage(0);
  };

  const handleClearDateFilter = () => {
    setFilterDate('');
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === parseInt(userId));
    return user ? user.name : 'Desconocido';
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredMenuItems = filterCategory
    ? menuItems.filter((item) => item.category_id === parseInt(filterCategory))
    : menuItems;

  const filteredReservations = filterDate
    ? reservations.filter(
        (reservation) => formatDateToDDMMYYYY(reservation.date) === formatDateToDDMMYYYY(filterDate)
      )
    : reservations;

  const filteredUsers = filterRole
    ? users.filter((user) => user.role === filterRole)
    : users;

  const getTableLocation = (tableId) => {
    const table = tables.find((t) => t.id === parseInt(tableId));
    return table ? table.location : 'Desconocido';
  };

  const roles = ['cliente', 'camarero', 'admin'];

  return (
    <Box sx={{ bgcolor: '#fefae0', py: 8, pt: '164px', fontFamily: 'Oswald, sans-serif' }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Panel de Administración
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Gestión de Menú" />
          <Tab label="Gestión de Reservas" />
          <Tab label="Gestión de Usuarios" />
          <Tab label="Gestión de Mesas" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Menú
            </Typography>
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Categoría"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio (€)</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMenuItems
                  .slice(menuPage * rowsPerPage, menuPage * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        {categories.find((cat) => cat.id === item.category_id)?.name || 'Desconocida'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenModal('menu', item)}
                          sx={{ mr: 1,
                            "&:hover": {
                                backgroundColor: "#219ebc",
                                color: "white",
                              },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          sx={{ "&:hover": { backgroundColor: "#E6240B", color: "white" } }}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredMenuItems.length}
              rowsPerPage={rowsPerPage}
              page={menuPage}
              onPageChange={(e, newPage) => handleChangePage('menu', newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total de platos: {filteredMenuItems.length}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Reservas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Filtrar por fecha"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                sx={{
                  "&:hover": {
                    backgroundColor: "#219ebc",
                    color: "white",
                  },
                }}
                variant="outlined"
                color="primary"
                onClick={handleClearDateFilter}
              >
                Mostrar Todas las Reservas
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Mesa</TableCell>
                  <TableCell>Personas</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations
                  .slice(reservationsPage * rowsPerPage, reservationsPage * rowsPerPage + rowsPerPage)
                  .map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{getUserName(reservation.user_id)}</TableCell>
                      <TableCell>{formatDateToDDMMYYYY(reservation.date)}</TableCell>
                      <TableCell>{reservation.time.slice(0, 5)}</TableCell>
                      <TableCell>{getTableLocation(reservation.table_id)}</TableCell>
                      <TableCell>{reservation.people}</TableCell>
                      <TableCell>
                        {reservation.status === "pending" && (
                          <Badge badgeContent="Pendiente" color="warning" />
                        )}
                        {reservation.status === "cancelled" && (
                          <Badge badgeContent="Cancelada" color="error" />
                        )}
                        {reservation.status === "confirmed" && (
                          <Badge badgeContent="Confirmada" color="success" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenModal('reservation', reservation)}
                          sx={{ mr: 1,
                            "&:hover": {
                              backgroundColor: "#219ebc",
                              color: "white",
                            },
                          }}
                        >
                          Editar
                        </Button>
                        {reservation.status === "pending" && (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleConfirmReservation(reservation.id)}
                            sx={{ mr: 1, "&:hover": { backgroundColor: "#4f772d", color: "white" }}}
                          >
                            Confirmar
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteReservation(reservation.id)}
                          sx={{ "&:hover": { backgroundColor: "#E6240B", color: "white" } }}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredReservations.length}
              rowsPerPage={rowsPerPage}
              page={reservationsPage}
              onPageChange={(e, newPage) => handleChangePage('reservation', newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total de reservas: {filteredReservations.length}
            </Typography>
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Usuarios
            </Typography>
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Rol"
              >
                <MenuItem value="">Todos</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(usersPage * rowsPerPage, usersPage * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenModal('user', item)}
                          sx={{ mr: 1,
                            "&:hover": {
                              backgroundColor: "#219ebc",
                              color: "white",
                            },                          
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteUser(item.id)}
                          sx={{ "&:hover": { backgroundColor: "#E6240B", color: "white" } }}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={usersPage}
              onPageChange={(e, newPage) => handleChangePage('user', newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total de usuarios: {filteredUsers.length}
            </Typography>
          </Box>
        )}

        {tabValue === 3 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Mesas
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleOpenModal('table')}
              sx={{ mb: 2,
              "&:hover": {
                    backgroundColor: "#219ebc",
                    color: "white",
                  },
              }}
            >
              Añadir Mesa
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Localización</TableCell>
                  <TableCell>Capacidad</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables
                  .slice(tablesPage * rowsPerPage, tablesPage * rowsPerPage + rowsPerPage)
                  .map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>{table.id}</TableCell>
                      <TableCell>{table.location}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenModal('table', table)}
                          sx={{ mr: 1,
                            "&:hover": {
                              backgroundColor: "#219ebc",
                              color: "white",
                            },
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteTable(table.id)}
                          sx={{ "&:hover": { backgroundColor: "#E6240B", color: "white" } }}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tables.length}
              rowsPerPage={rowsPerPage}
              page={tablesPage}
              onPageChange={(e, newPage) => handleChangePage('table', newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total de mesas: {tables.length}
            </Typography>
          </Box>
        )}

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>
            {modalType === 'menu' ? 'Editar Producto' : 
             modalType === 'reservation' ? 'Editar Reserva' : 
             modalType === 'user' ? 'Editar Usuario' : 
             modalType === 'table' ? (currentItem.id ? 'Editar Mesa' : 'Añadir Mesa') : ''}
          </DialogTitle>
          <DialogContent>
            {modalType === 'menu' && (
              <>
                <TextField
                  margin="normal"
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentItem.name || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  margin="normal"
                  name="description"
                  label="Descripción"
                  fullWidth
                  value={currentItem.description || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
                <TextField
                  margin="normal"
                  name="price"
                  label="Precio (€)"
                  type="number"
                  fullWidth
                  value={currentItem.price || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                />
                <FormControl fullWidth margin="normal" error={!!formErrors.category_id}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    name="category_id"
                    value={currentItem.category_id || ''}
                    onChange={handleInputChange}
                    label="Categoría"
                  >
                    {categories.filter((category) => category.id !== 0).map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.category_id && (
                    <Typography variant="caption" color="error">
                      {formErrors.category_id}
                    </Typography>
                  )}
                </FormControl>
              </>
            )}
            {modalType === 'reservation' && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha"
                    value={currentItem.date || null}
                    onChange={(date) => {
                      setCurrentItem((prev) => ({ ...prev, date }));
                      setFormErrors((prev) => ({ ...prev, date: '' }));
                    }}
                    shouldDisableDate={isPastOrMonday}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!formErrors.date,
                        helperText: formErrors.date,
                      },
                    }}
                  />
                </LocalizationProvider>
                <FormControl fullWidth margin="normal" error={!!formErrors.time}>
                  <InputLabel>Hora</InputLabel>
                  <Select
                    name="time"
                    value={currentItem.time || ''}
                    onChange={handleInputChange}
                    label="Hora"
                  >
                    {availableTimes.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.time && (
                    <Typography variant="caption" color="error">
                      {formErrors.time}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth margin="normal" error={!!formErrors.table_id}>
                  <InputLabel>Mesa</InputLabel>
                  <Select
                    name="table_id"
                    value={currentItem.table_id || ''}
                    onChange={handleInputChange}
                    label="Mesa"
                  >
                    {tables.map((table) => (
                      <MenuItem key={table.id} value={table.id}>
                        {`Nº ${table.id}, ${table.location} (${table.capacity} personas)`}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.table_id && (
                    <Typography variant="caption" color="error">
                      {formErrors.table_id}
                    </Typography>
                  )}
                </FormControl>
                <TextField
                  margin="normal"
                  name="people"
                  label="Personas"
                  type="number"
                  fullWidth
                  value={currentItem.people || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.people}
                  helperText={formErrors.people}
                  inputProps={{
                    min: getMinPeopleForTable(currentItem.table_id),
                    max: getMaxPeopleForTable(currentItem.table_id),
                  }}
                />
              </>
            )}
            {modalType === 'user' && (
              <>
                <TextField
                  margin="normal"
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentItem.name || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  margin="normal"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={currentItem.email || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
                <FormControl fullWidth margin="normal" error={!!formErrors.role}>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    value={currentItem.role || ''}
                    onChange={handleInputChange}
                    label="Rol"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.role && (
                    <Typography variant="caption" color="error">
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
              </>
            )}
            {modalType === 'table' && (
              <>
                <FormControl fullWidth margin="normal" error={!!formErrors.location}>
                  <InputLabel>Localización</InputLabel>
                  <Select
                    name="location"
                    value={currentItem.location || ''}
                    onChange={handleInputChange}
                    label="Localización"
                  >
                    {tableLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.location && (
                    <Typography variant="caption" color="error">
                      {formErrors.location}
                    </Typography>
                  )}
                </FormControl>
                <TextField
                  margin="normal"
                  name="capacity"
                  label="Capacidad"
                  type="number"
                  fullWidth
                  value={currentItem.capacity || ''}
                  onChange={handleInputChange}
                  error={!!formErrors.capacity}
                  helperText={formErrors.capacity}
                  inputProps={{ min: 1 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} color="primary">
              {modalType === 'table' && !currentItem.id ? 'Añadir' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default PanelAdmin;