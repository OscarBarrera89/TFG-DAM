import { Container, Typography, Grid, IconButton, Menu, Button, MenuItem, Box, Card, CardMedia } from "@mui/material";
import { Link, useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import Footer from "../components/Footer";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import StarHalfTwoToneIcon from '@mui/icons-material/StarHalfTwoTone';
import { useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProtectedClick = (path) => {
    console.log("User is logged in:", user);
    // Allow access to /home/menu without login
    if (path === "/home/menu" || user.role !== "None") {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleMenuOpen = (event) => {
    console.log("User is logged in:", user);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearUser();
    handleMenuClose();
    navigate("/");
  };

  // Datos de ubicaciones con imágenes
  const locations = [
    {
      city: "Madrid",
      address: "Calle Gran Vía 45",
      image: "/images/Fachada.png",
    },
    {
      city: "Barcelona",
      address: "Paseo de Gracia 2",
      image: "/images/Interior.png",
    },
    {
      city: "Valencia",
      address: "Avenida del Puerto 10",
      image: "/images/proximaApertura.png",
    },
    {
      city: "Sevilla",
      address: "Alameda de Hércules 8",
      image: "/images/Sevilla.png",
    },
    {
      city: "Bilbao",
      address: "Plaza Moyúa 3",
      image: "/images/proximaApertura.png",
    },
  ];

  return (
    <Box sx={{ fontFamily: "Oswald, sans-serif" }}>
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.7)",
          zIndex: 10,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ ml: 3 }}>
          <img
            src="/images/LogoTopBurguers.png"
            className="img-fluid"
            alt="LogoTopBurguer"
            style={{ width: "50px", height: "auto" }}
          />{" "}
          TopBurgers
        </Typography>
        <Box sx={{ mr: 3 }}>
          {user.role !== "None" ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Typography sx={{ ml: 2.5, fontWeight: 'bold' }}>Hola, {user.name}</Typography>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
              variant="outlined"
              color="inherit"
              href="/login"
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Box>

      {/* Navbar */}
      <Box
        sx={{
          height: "100vh",
          backgroundImage: "url(/images/FondoLandPage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textShadow: "2px 2px 4px #000",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <Box sx={{ zIndex: 2, textAlign: "center", fontFamily: "Oswald, sans-serif" }}>
          <Typography variant="h2" gutterBottom>
            TopBurgers
          </Typography>
          <Typography variant="h5">
            ¡Las mejores hamburguesas gourmet en un solo lugar!
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 3,
              "&:hover": {
                backgroundColor: "#E6240B",
                color: "white",
              },
            }}
            color="error"
            onClick={() => handleProtectedClick("/home/menu")}
          >
            Ver Menú
          </Button>
        </Box>
      </Box>

      {/* Sección Sobre Nosotros */}
      <Box sx={{ bgcolor: "#fefae0", py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Sobre Nosotros
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
          >
            En <strong>TopBurgers</strong> nos apasiona reinventar la hamburguesa gourmet.
            Nacimos en Marzo de 2025 con una misión clara: ofrecer productos frescos,
            locales y con un sabor único. Nuestros chefs fusionan tradición americana con
            ingredientes mediterráneos para que cada bocado sea una experiencia
            inolvidable.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6} sx={{ mt: 2}}>
              <Typography variant="h6" gutterBottom>
                <StarHalfTwoToneIcon/> Nuestros Valores:
              </Typography>
              <ul style={{ padding: 0, listStyle: "none" }}>
                <li>Ingredientes frescos y de calidad</li>
                <li>Recetas únicas con identidad propia</li>
                <li>Atención al cliente cercana y profesional</li>
                <li>Compromiso con el medio ambiente (packaging eco)</li>
              </ul>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                <LocationOnTwoToneIcon/> Nuestras Ubicaciones:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {locations.map((location, index) => (
                  <Box key={index} sx={{ textAlign: "center", maxWidth: 120 }}>
                    <Card sx={{ maxWidth: 100, mx: "auto" }}>
                      <CardMedia
                        component="img"
                        height="80"
                        image={location.image}
                        alt={location.city}
                        sx={{ objectFit: "cover" }}
                      />
                    </Card>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {location.city}: {location.address}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Typography variant="h6" gutterBottom>
                <PhonelinkRingTwoToneIcon/> También en tu móvil:
              </Typography>
              <Typography variant="body2">
                Pronto podrás descargar nuestra app para hacer reservas, pedir a
                domicilio y consultar el menú en tiempo real. Disponible para iOS y
                Android.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Próximamente en App Store y Google Play
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
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
              onClick={() => handleProtectedClick("/home/reservations")}
            >
              Reservar Mesa
            </Button>

            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "#E6240B",
                  color: "white",
                },
              }}
              variant="outlined"
              color="error"
              onClick={() => handleProtectedClick("/home/menu")}
            >
              Explorar Menú
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default LandingPage;