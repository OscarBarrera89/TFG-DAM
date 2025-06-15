import { Box, Container, Typography, Grid, Link } from "@mui/material";
import { Instagram, Facebook, GitHub } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import LanguageTwoToneIcon from "@mui/icons-material/LanguageTwoTone";

function Footer() {
  const locations = [
    { city: "Madrid", address: "Calle Gran Vía 45" },
    { city: "Barcelona", address: "Passeig de Gràcia 22" },
    { city: "Valencia", address: "Avenida del Puerto 10" },
    { city: "Sevilla", address: "Alameda de Hércules 8" },
    { city: "Bilbao", address: "Plaza Moyúa 3" },
  ];

  const schedule = {
    Lunes: "Cerrado",
    Martes: "13:00 - 15:30 | 21:00 - 23:30",
    Miércoles: "13:00 - 15:30 | 21:00 - 23:30",
    Jueves: "13:00 - 15:30 | 21:00 - 23:30",
    Viernes: "13:00 - 15:30 | 21:00 - 23:30",
    Sábado: "13:00 - 15:30 | 21:00 - 23:30",
    Domingo: "13:00 - 15:30 | 21:00 - 23:30",
  };

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/topburgers",
      icon: <Instagram />,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/topburgers",
      icon: <Facebook />,
    },
    {
      name: "GitHub",
      url: "https://github.com/OscarBarrera89/TFG-DAM",
      icon: <GitHub />,
    },
  ];

  return (
    <Box sx={{ bgcolor: "#222", color: "#fff", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ justifyContent: "space-around" }}>
          {/* Horarios */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                textAlign: "left"
              }}
            >
              <AccessTimeIcon /> Horarios
            </Typography>
            <Box component="ul" sx={{ padding: 0, listStyle: "none", textAlign: "left" }}>
              {Object.entries(schedule).map(([day, hours]) => (
                <Typography key={day} variant="body2" component="li" sx={{ mb: 0.5 }}>
                  {day}: {hours}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Ubicaciones */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                textAlign: "left"
              }}
            >
              <LocationOnTwoToneIcon /> Nuestras Ubicaciones
            </Typography>
            <Box component="ul" sx={{ padding: 0, listStyle: "none", textAlign: "left" }}>
              {locations.map((location, index) => (
                <Typography key={index} variant="body2" component="li" sx={{ mb: 0.5 }}>
                  {location.city}: {location.address}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Redes Sociales */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                textAlign: "left"
              }}
            >
              <LanguageTwoToneIcon /> Síguenos
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#E6240B",
                    },
                  }}
                >
                  {link.icon}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography variant="body2" sx={{ mt: 4, textAlign: "center" }}>
          © 2025 TopBurgers. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;