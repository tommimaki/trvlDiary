import mongoose from "mongoose";

// MONGODB SETUPPI
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn; // Palautetaan olemassa oleva yhteys
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true, // Käytetään uutta URL-syntaksia
        useUnifiedTopology: true, // Käytetään uutta MongoDB-yhteysprotokollaa
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise; // Odotetaan yhteyden avaamista ja tallennetaan
  return cached.conn; // Palautetaan valmis yhteys
}

export default dbConnect;
