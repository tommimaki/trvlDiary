export function convertDMSToDecimal(dms, ref) {
  const [degrees, minutes, seconds] = dms
    .split(/[^\d.]+/)
    .filter(Boolean)
    .map(Number);
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") decimal *= -1; // Make negative for South/West
  return decimal;
}
