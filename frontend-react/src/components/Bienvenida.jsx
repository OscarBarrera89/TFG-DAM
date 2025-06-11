import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";

function Bienvenida() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleReservationClick = () => {
    if (user?.role === "None") {
      navigate("/login");
    } else {
      navigate("/home/reservations");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        pt: "164px",
        textAlign: "center",
        bgcolor: "#fefae0",
        p: 3,
      }}
    >
      <Typography variant="h2" gutterBottom>
        ¡Bienvenido a TopBurgers!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Descubre las mejores hamburguesas de la ciudad. ¡Explora nuestro menú y haz tu reserva hoy!
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button
          sx={{
            mr: 2,
            "&:hover": {
              backgroundColor: "#E6240B",
              color: "white",
            },
          }}
          variant="outlined"
          color="error"
          component={Link}
          to="/home/menu"
        >
          Ver Menú
        </Button>
        <Button
          sx={{
            mr: 2,
            "&:hover": {
              backgroundColor: "#E6240B",
              color: "white",
            },
          }}
          variant="outlined"
          color="error"
          onClick={handleReservationClick}
        >
          Reservar
        </Button>
      </Box>
    </Box>
  );
}

export default Bienvenida;