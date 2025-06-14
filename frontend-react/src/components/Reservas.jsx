import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  CardActions,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import useUserStore from "../stores/useUserStore";
import dayjs from "dayjs";
import { apiUrl, getAuthHeaders } from "../config";

function Reservas() {
  const { user } = useUserStore();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [email, setEmail] = useState(user ? user.email : "");
  const [name, setName] = useState(user ? user.name : "");
  const [confirmation, setConfirmation] = useState(null);
  const [tables, setTables] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [error, setError] = useState(null);
  const [people, setPeople] = useState(2);

  const availableTimes = [
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ];

  const isPastOrMonday = (date) => {
    const today = dayjs().startOf("day");
    return date.isBefore(today, "day") || date.day() === 1;
  };

  useEffect(() => {
    if (selectedTable) {
      const table = tables.find((t) => t.id === parseInt(selectedTable));
      if (table && table.capacity >= 2 && table.capacity <= 8) {
        setPeople(table.capacity);
      } else {
        setPeople(2);
      }
    } else {
      setPeople(1);
    }
  }, [selectedTable, tables]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    } else {
      setName("");
      setEmail("");
    }
  }, [user]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${apiUrl}tables`, {
          method: "GET",
          credentials: "include",
          headers
        });
        if (!response.ok) throw new Error("Error al cargar las mesas");
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (user) {
        try {
          const headers = await getAuthHeaders();
          const response = await fetch(`${apiUrl}reservations/user`, {
            method: "GET",
            credentials: "include",
            headers,
          });
          if (!response.ok) throw new Error("Error al cargar las reservas del usuario");
          const data = await response.json();
          setUserReservations(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    fetchUserReservations();
  }, [user]);

  const handleCancelReservation = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiUrl}reservations/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cancelar la reserva");
      }

      const updatedReservation = await response.json();
      setUserReservations(
        userReservations.map((reservation) =>
          reservation.id === id ? updatedReservation.reservation : reservation
        )
      );
      setConfirmation("Reserva cancelada exitosamente.");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // const checkForConflictingReservation = async (tableId, date, time) => {
  //   try {
  //     const csrfToken = await getCsrfToken();
  //     const response = await fetch(`${apiUrl}reservations/check`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-XSRF-TOKEN": csrfToken,
  //       },
  //       body: JSON.stringify({
  //         table_id: parseInt(tableId),
  //         date: date.toISOString().split("T")[0],
  //         time,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Error al verificar conflictos de reserva");
  //     }

  //     const data = await response.json();
  //     return data.exists;
  //   } catch (err) {
  //     setError(err.message);
  //     return false;
  //   }
  // };

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
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiUrl}reservations`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          date: formatDateLocal(selectedDate),
          time: selectedTime,
          people: parseInt(people),
          table_id: parseInt(selectedTable),
          name: name,
          email: email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la reserva");
      }

      const data = await response.json();
      setConfirmation(data);
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedTable("");
      setPeople(2);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  const getMaxPeopleForTable = (tableId) => {
    const table = tables.find((t) => t.id === parseInt(tableId));
    return table ? Math.min(table.capacity + 1, 8) : 8;
  };
  const getMinPeopleForTable = (tableId) => {
    const table = tables.find((t) => t.id === parseInt(tableId));
    return table ? Math.min(table.capacity - 1, 8) : 2;
  };

  const validateForm = () => {
    if (
      selectedDate &&
      selectedTime &&
      selectedTable &&
      email &&
      name &&
      people >= 2 &&
      people <= 8
    ) {
      const selectedTableObj = tables.find((t) => t.id === parseInt(selectedTable));
      if (!selectedTableObj) {
        setConfirmation("Por favor, selecciona una mesa válida.");
        return false;
      }
      if (people > selectedTableObj.capacity + 1) {
        setConfirmation(
          `No puedes reservar para ${people} personas en una mesa con capacidad de ${selectedTableObj.capacity}. El máximo permitido es ${selectedTableObj.capacity + 1}.`
        );
        return false;
      }
      return true;
    } else {
      setConfirmation(
        "Por favor, completa todos los campos y asegúrate de que el número de personas esté entre 2 y 8."
      );
      return false;
    }
  };

  return (
    <Box sx={{ bgcolor: "#fefae0", py: 8, pt: "164px", fontFamily: "Oswald, sans-serif" }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Reservar Mesa
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h6" align="center">Selecciona Fecha</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Selecciona Fecha"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              shouldDisableDate={isPastOrMonday}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Horario</InputLabel>
            <Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              label="Horario"
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Mesa</InputLabel>
            <Select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              label="Mesa"
            >
              {tables.map((table) => (
                <MenuItem key={table.id} value={table.id}>
                  Nº {table.id}, {table.location} ({table.capacity} personas)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Cantidad de personas"
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            fullWidth
            inputProps={{ min: getMinPeopleForTable(selectedTable), max: getMaxPeopleForTable(selectedTable) }}
          />
          <TextField
            label="Nombre"
            placeholder={name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled
          />
          <TextField
            label="Email"
            type="email"
            placeholder={email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled
          />

          <Button
            type="submit"
            variant="contained"
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "#E6240B",
              },
            }}
          >
            Confirmar Reserva
          </Button>

          {confirmation && (
            <Typography
              variant="body1"
              color={confirmation.includes("completar") || confirmation.includes("Error") || confirmation.includes("No puedes reservar") ? "error" : "success"}
              sx={{ mt: 2 }}
            >
              {confirmation}
            </Typography>
          )}
        </Box>

        {user && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Mis Reservas
            </Typography>
            {userReservations.length === 0 ? (
              <Typography variant="body1">No tienes reservas.</Typography>
            ) : (
              <Grid container spacing={3}>
                {userReservations.map((reservation) => (
                  <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                    <Card sx={{ maxWidth: 345, mx: "auto" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Reserva #{reservation.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fecha: {dayjs(reservation.date).format('L')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hora: {reservation.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mesa: {tables.find((t) => t.id === reservation.table_id)?.location || "N/A"} (Nº{reservation.table_id})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Personas: {reservation.people}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Estado: {reservation.status}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {reservation.status === "pending" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Reservas;