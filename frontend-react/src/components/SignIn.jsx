import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router"; 
import useUserStore from "../stores/useUserStore";
import { apiUrl, getAuthHeaders  } from "../config";

function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
    }

    if (!formData.role) {
      newErrors.role = "Selecciona un rol.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Enviar solicitud de registro
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiUrl}register`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role 
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Guardar el usuario y token en el store
        setUser({ ...data.user, token: data.token });
        alert("Registro exitoso");
        navigate("/home/bienvenida");
      } else {
        setErrors({
          apiError: data.message || "Error al registrar. Verifica los datos.",
        });
      }
    } catch (error) {
      setErrors({
        apiError: "Error de red. Inténtalo de nuevo más tarde. " + error.message,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, white, #fefae0)",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Registrarse
        </Typography>

        {errors.apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.apiError}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
        />

        <TextField
          fullWidth
          select
          label="Rol"
          name="role"
          value={formData.role}
          onChange={handleChange}
          error={!!errors.role}
          helperText={errors.role}
          margin="normal"
        >
          <MenuItem value="cliente">Cliente</MenuItem>
          <MenuItem value="camarero">Camarero</MenuItem>
        </TextField>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{" "}
          <Link component={RouterLink} to="/login">
            Inicia sesión
          </Link>
        </Typography>

        <Button
          sx={{
            mt: 2,
            "&:hover": {
              backgroundColor: "#E6240B",
              color: "white",
            },
          }}
          variant="outlined"
          color="error"
          type="submit"
          fullWidth
        >
          Registrarse
        </Button>
      </Box>
    </Box>
  );
}

export default SignIn;