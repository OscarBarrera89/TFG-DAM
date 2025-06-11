import { Link, useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { apiUrl } from "../config";

function Menu() {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const csrfResponse = await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Error al obtener el token CSRF");
      }

      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1];

      const response = await fetch(`${apiUrl}logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
        },
        credentials: "include",
      });

      if (response.ok) {
        clearUser();
        sessionStorage.removeItem("user-storage");
        handleMenuClose();
        setMobileOpen(false);
        navigate("/");
        alert("Sesión cerrada correctamente");
      } else {
        const data = await response.json();
        alert(data.message || "Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error de red. Inténtalo de nuevo más tarde.");
    }
  };

  // Mobile menu content
  const drawerContent = (
    <Box sx={{ 
      width: { xs: "80vw", sm: 250 }, 
      bgcolor: "rgba(0,0,0,0.9)", 
      height: "100%", 
      color: "white",
      display: "flex",
      flexDirection: "column",
      p: 2,
    }}>
      <List>
        {user?.role === "None" ? (
          <>
            <ListItemButton component={Link} to="/home/bienvenida" onClick={handleDrawerToggle}>
              <ListItemText primary="Inicio" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/home/menu" onClick={handleDrawerToggle}>
              <ListItemText primary="Menú" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Iniciar Sesión" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton component={Link} to="/home/bienvenida" onClick={handleDrawerToggle}>
              <ListItemText primary="Inicio" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/home/menu" onClick={handleDrawerToggle}>
              <ListItemText primary="Menú" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/home/reservations" onClick={handleDrawerToggle}>
              <ListItemText primary="Reservas" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
            {user?.role === "admin" && (
              <ListItemButton component={Link} to="/home/admin" onClick={handleDrawerToggle}>
                <ListItemText primary="Panel de Admin" primaryTypographyProps={{ fontWeight: "medium" }} />
              </ListItemButton>
            )}
            {user?.role === "camarero" && (
              <ListItemButton component={Link} to="/home/camarero" onClick={handleDrawerToggle}>
                <ListItemText primary="Panel de Camarero" primaryTypographyProps={{ fontWeight: "medium" }} />
              </ListItemButton>
            )}
            <ListItem>
              <ListItemText 
                primary={`Hola, ${user.name}`} 
                primaryTypographyProps={{ fontWeight: "bold", color: "white" }} 
              />
            </ListItem>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontWeight: "medium" }} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar sx={{ 
      position: "fixed", 
      top: 0, 
      width: "100%", 
      bgcolor: "rgba(0,0,0,0.7)", 
      zIndex: 3, 
      px: { xs: 1, sm: 2 },
    }}>
      <Toolbar sx={{py: 2, display: "flex", justifyContent: "space-between", width: "100%", minHeight: { xs: 56, sm: 64 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          <img src="/images/LogoTopBurguers.png" className="img-fluid" alt="LogoTopBurguer" style={{ width: "70px", height: "auto" }} />
          TopBurgers
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: { xs: 1, md: 2 } }}>
          {user?.role === "None" ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/home/menu">
                Menú
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Iniciar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/home/menu">
                Menú
              </Button>
              <Button color="inherit" component={Link} to="/home/reservations">
                Reservas
              </Button>
              {user?.role === "admin" && (
                <Button color="inherit" component={Link} to="/home/admin">
                  Panel de Admin
                </Button>
              )}
              {user?.role === "camarero" && (
                <Button color="inherit" component={Link} to="/home/camarero">
                  Panel de Camarero
                </Button>
              )}
              <IconButton 
                color="inherit" 
                onClick={handleMenuOpen} 
                aria-label="cuenta de usuario"
                sx={{ p: { xs: 0.5, md: 1 } }}
              >
                <AccountCircle />
              </IconButton>
              <MuiMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { bgcolor: "rgba(0,0,0,0.9)", color: "white" },
                }}
              >
                <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
                  Hola, {user.name}
                </Typography>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </MuiMenu>
            </>
          )}
        </Box>

        {/* Mobile Hamburger Icon */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            aria-label="abrir menú"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Modo móvil */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": { 
            width: { xs: "80vw", sm: 250 }, 
            bgcolor: "rgba(0,0,0,0.9)",
            color: "white",
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
	root
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Menu;