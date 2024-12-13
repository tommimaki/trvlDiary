export function convertDMSToDecimal(dms, ref) {
  console.log("Converting DMS:", dms, "Ref:", ref);

  const direction = ref?.trim().charAt(0).toUpperCase(); // Take the first letter and normalize it
  console.log("Normalized Ref:", direction);

  const [degrees, minutes, seconds] = dms
    .split(/[^\d.]+/) // Split by non-numeric characters
    .filter(Boolean) // Remove empty parts
    .map(Number); // Convert to numbers

  let decimal = degrees + minutes / 60 + seconds / 3600;

  // Apply negative sign for South (S) and West (W)
  if (direction === "S" || direction === "W") {
    decimal *= -1;
  }

  console.log("Converted Decimal:", decimal);
  return decimal;
}
