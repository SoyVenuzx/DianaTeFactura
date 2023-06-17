export const capitalizeString = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export const formatName = (nombreCliente, apellidoCliente) => {
  // Capitalizar nombre y apellido
  const nombre = capitalizeString(nombreCliente)
  const apellido = capitalizeString(apellidoCliente)

  return `${nombre} ${apellido}`
}
