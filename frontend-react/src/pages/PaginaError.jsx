import { Box, Button, Typography } from "@mui/material";

/**
 * Componente de página de error.
 * Muestra un mensaje de error y un botón para volver a la página principal.
 * @returns {JSX.Element} - Componente de página de error.
 */
function PaginaError() {
  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        No hemos encontrado la página que buscas
      </Typography>
      <Box textAlign={"center"} sx={{ mt: 2 }}>
        <Button sx={{ mt: 2, '&:hover': {
            backgroundColor: 'blue',
            color: 'white',
          }}} variant="outlined" align="center" href="/">
          Ir a la página princial
        </Button>
      </Box>
    </>
  );
}

export default PaginaError;
