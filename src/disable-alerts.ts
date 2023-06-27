// Sobrescribe el método alert del objeto window
const originalAlert = window.alert;
window.alert = function(message: string) {
  // No hacer nada o puedes realizar alguna otra acción si lo deseas
};