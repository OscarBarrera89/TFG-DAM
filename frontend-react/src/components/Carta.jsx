import { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useNavigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import { apiUrl } from "../config";

function Carta() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function getCategorias() {
      try {
        const response = await fetch(`${apiUrl}categories`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategories([{ id: 0, name: "Todas" }, ...data]);
      } catch (err) {
        setError(err.message);
      }
    }
    getCategorias();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}products`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Error al cargar los productos");
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 0 || item.category_id === selectedCategory;
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isAdminOrCamarero = user && (user.role === "admin" || user.role === "camarero");

  const validateForm = () => {
    const errors = {};
    if (!currentItem.name.trim()) errors.name = "El nombre es obligatorio";
    if (!currentItem.description.trim()) errors.description = "La descripción es obligatoria";
    if (!currentItem.price || currentItem.price <= 0) errors.price = "El precio debe ser mayor a 0";
    if (!currentItem.category_id) errors.category_id = "Selecciona una categoría";
    if (!currentItem.image.trim()) errors.image = "La URL de la imagen es obligatoria";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (item = null) => {
    if (isAdminOrCamarero) {
      if (item) {
        setIsEditing(true);
        setCurrentItem(item);
      } else {
        setIsEditing(false);
        setCurrentItem({
          id: null,
          name: "",
          description: "",
          price: "",
          category_id: "",
          image: "",
        });
      }
      setFormErrors({});
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentItem({
      id: null,
      name: "",
      description: "",
      price: "",
      category_id: "",
      image: "",
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!isAdminOrCamarero) {
      navigate("/login");
      return;
    }
    if (!validateForm()) return;

    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1];

      if (!csrfToken) throw new Error("No se encontró el token CSRF");

      const headers = {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
      };

      if (isEditing) {
        const response = await fetch(`${apiUrl}products/${currentItem.id}`, {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify({
            name: currentItem.name,
            description: currentItem.description,
            price: parseFloat(currentItem.price),
            category_id: parseInt(currentItem.category_id),
            image: currentItem.image,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar el producto");
        }
        const updatedItem = await response.json();
        setMenuItems(menuItems.map((item) => (item.id === currentItem.id ? updatedItem : item)));
      } else {
        const response = await fetch(`${apiUrl}products`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            name: currentItem.name,
            description: currentItem.description,
            price: parseFloat(currentItem.price),
            category_id: parseInt(currentItem.category_id),
            image: currentItem.image,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al añadir el producto");
        }
        const newItem = await response.json();
        setMenuItems([...menuItems, newItem]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdminOrCamarero) {
      navigate("/login");
      return;
    }
    try {
      await fetch(`${apiUrl}sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1];
      if (!csrfToken) throw new Error("No se encontró el token CSRF");

      const response = await fetch(`${apiUrl}products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el producto");
      }
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fefae0", py: { xs: 6, md: 8 }, pt: { xs: "120px", md: "164px" }, fontFamily: "Oswald, sans-serif", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
          Nuestra Carta
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            {error}
          </Typography>
        )}

        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          gap: 2, 
          mb: 4, 
          justifyContent: "center", 
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", sm: "300px" }, maxWidth: "400px" }}
          />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "contained" : "outlined"}
                color="error"
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    backgroundColor: "#E6240B",
                    color: "white",
                  },
                }}
              >
                {category.name}
              </Button>
            ))}
            {isAdminOrCamarero && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenModal()}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": {
                    backgroundColor: "#219ebc",
                    color: "white",
                  },
                }}
              >
                Añadir Producto
              </Button>
            )}
          </Box>
        </Box>

        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>{isEditing ? "Editar Producto" : "Añadir Producto"}</DialogTitle>
          <DialogContent>
            <TextField 
              margin="dense" 
              name="name" 
              label="Nombre" 
              fullWidth 
              value={currentItem.name} 
              onChange={handleInputChange} 
              error={!!formErrors.name} 
              helperText={formErrors.name}
              sx={{ mb: 2 }}
            />
            <TextField 
              margin="dense" 
              name="description" 
              label="Descripción" 
              fullWidth 
              multiline 
              rows={3} 
              value={currentItem.description} 
              onChange={handleInputChange} 
              error={!!formErrors.description} 
              helperText={formErrors.description}
              sx={{ mb: 2 }}
            />
            <TextField 
              margin="dense" 
              name="price" 
              label="Precio (€)" 
              type="number" 
              fullWidth 
              value={currentItem.price} 
              onChange={handleInputChange} 
              inputProps={{ step: "0.01" }} 
              error={!!formErrors.price} 
              helperText={formErrors.price}
              sx={{ mb: 2 }}
            />
            <TextField 
              margin="dense" 
              name="category_id" 
              label="Categoría" 
              select 
              fullWidth 
              value={currentItem.category_id} 
              onChange={handleInputChange} 
              error={!!formErrors.category_id} 
              helperText={formErrors.category_id}
              sx={{ mb: 2 }}
            >
              {categories.filter(cat => cat.id !== 0).map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </TextField>
            <TextField 
              margin="dense" 
              name="image" 
              label="URL de la Imagen" 
              fullWidth 
              value={currentItem.image} 
              onChange={handleInputChange} 
              error={!!formErrors.image} 
              helperText={formErrors.image}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} color="primary">{isEditing ? "Guardar Cambios" : "Añadir"}</Button>
          </DialogActions>
        </Dialog>

        {selectedCategory === 0 ? (
          categories.filter((cat) => cat.id !== 0).map((cat) => {
            const itemsByCategory = filteredItems.filter((item) => item.category_id === cat.id);
            if (itemsByCategory.length === 0) return null;
            return (
              <Box key={cat.id} sx={{ mb: { xs: 4, md: 6 } }}>
                <Typography
                  align="center"
                  variant="h5"
                  sx={{
                    mb: 2,
                    position: "relative",
                    display: "inline-block",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#E6240B",
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease-in-out",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  {cat.name}
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                  {itemsByCategory.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card sx={{ 
                        width: { xs: "100%", sm: 300 }, 
                        height: { xs: 320, sm: 360 }, 
                        mx: "auto", 
                        boxShadow: 3,
                        borderRadius: 2,
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.02)" },
                        display: "flex",
                        flexDirection: "column",
                      }}>
                        <CardMedia 
                          component="img" 
                          image={item.image} 
                          alt={item.name} 
                          sx={{ 
                            height: { xs: 120, sm: 140 },
                            objectFit: "cover",
                          }} 
                        />
                        <CardContent sx={{ 
                          p: { xs: 1.5, sm: 2 }, 
                          flexGrow: 1, 
                          display: "flex", 
                          flexDirection: "column",
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: { xs: "1rem", sm: "1.1rem" },
                              mb: 1,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              fontSize: { xs: "0.75rem", sm: "0.875rem" }, 
                              flexGrow: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.description}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color="error" 
                            sx={{ 
                              mt: 1, 
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            {Number(item.price).toFixed(2)} €
                          </Typography>
                        </CardContent>
                        {isAdminOrCamarero && (
                          <CardActions sx={{ 
                            justifyContent: "center", 
                            p: { xs: 1, sm: 1.5 },
                            mt: "auto",
                          }}>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleOpenModal(item)}
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(item.id)}
                              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                              Borrar
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        ) : filteredItems.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ 
                  width: { xs: "100%", sm: 300 }, 
                  height: { xs: 320, sm: 360 }, 
                  mx: "auto", 
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <CardMedia 
                    component="img" 
                    image={item.image} 
                    alt={item.name} 
                    sx={{ 
                      height: { xs: 120, sm: 140 },
                      objectFit: "cover",
                    }} 
                  />
                  <CardContent sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    flexGrow: 1, 
                    display: "flex", 
                    flexDirection: "column",
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        mb: 1,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, 
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="error" 
                      sx={{ 
                        mt: 1, 
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {Number(item.price).toFixed(2)} €
                    </Typography>
                  </CardContent>
                  {isAdminOrCamarero && (
                    <CardActions sx={{ 
                      justifyContent: "center", 
                      p: { xs: 1, sm: 1.5 },
                      mt: "auto",
                    }}>
                      <Button 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenModal(item)}
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(item.id)}
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        Borrar
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ width: "100%", mt: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            No se encontraron productos.
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Carta;