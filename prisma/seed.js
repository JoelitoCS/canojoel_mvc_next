const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Cliente Prisma usado solo por el script de seed.
const prisma = new PrismaClient();

async function main() {
  // La semilla deja usuarios de prueba y modelos iniciales persistidos en PostgreSQL.
  // upsert evita duplicados cuando el seed se ejecuta mas de una vez.
  // La contrasena se hashea una vez y se reutiliza para los tres usuarios demo.
  const password = await bcrypt.hash("Password123!", 10);

  // Usuario administrador con permisos completos.
  const admin = await prisma.user.upsert({
    where: { email: "admin@vanlife.test" },
    update: {},
    create: {
      name: "Admin VanLife",
      email: "admin@vanlife.test",
      password,
      role: "ADMIN",
    },
  });

  // Usuario editor para probar el acceso a la gestion sin ser ADMIN.
  const editor = await prisma.user.upsert({
    where: { email: "editor@vanlife.test" },
    update: {},
    create: {
      name: "Editor VanLife",
      email: "editor@vanlife.test",
      password,
      role: "EDITOR",
    },
  });

  // Usuario cliente normal, pensado para probar la publicacion de comentarios.
  const user = await prisma.user.upsert({
    where: { email: "client@vanlife.test" },
    update: {},
    create: {
      name: "Client Demo",
      email: "client@vanlife.test",
      password,
      role: "USER",
    },
  });

  // Modelos camper iniciales que alimentan el catalogo publico.
  const models = [
    {
      slug: "sunlight-cliff-640",
      name: "Sunlight Cliff 640",
      brand: "Sunlight",
      short: "Gran autonomia para rutas largas",
      description:
        "Camper totalmente equipada con cocina, cama doble, calefaccion estacionaria y espacio amplio para viajar sin depender de hoteles.",
      seats: 4,
      sleeps: 4,
      pricePerDay: 120,
      highlighted: true,
      imageUrl:
        "https://images.unsplash.com/photo-1515876305430-f06edab8282a?auto=format&fit=crop&w=1100&q=80",
      features: ["Cocina", "Ducha", "WC", "Parking heater", "GPS"],
    },
    {
      slug: "volkswagen-california",
      name: "Volkswagen California",
      brand: "Volkswagen",
      short: "Compacta y agil para escapadas",
      description:
        "Una camper iconica, facil de conducir y con techo elevable. Perfecta para parejas o familias que priorizan flexibilidad.",
      seats: 4,
      sleeps: 4,
      pricePerDay: 150,
      highlighted: true,
      imageUrl:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1100&q=80",
      features: ["Cocina", "Ducha exterior", "WC portatil", "Toldo", "HVAC"],
    },
    {
      slug: "ford-transit-custom",
      name: "Ford Transit Custom",
      brand: "Ford",
      short: "Practica para viajes activos",
      description:
        "Modelo versatil con consumo ajustado, almacenaje optimizado y equipamiento esencial para escapadas deportivas.",
      seats: 4,
      sleeps: 2,
      pricePerDay: 110,
      highlighted: true,
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80",
      features: ["Cocina", "Frigorifico", "WC", "Bluetooth", "GPS"],
    },
  ];

  // Inserta o actualiza cada modelo por slug para que el seed sea repetible.
  for (const model of models) {
    await prisma.camperModel.upsert({
      where: { slug: model.slug },
      update: model,
      create: model,
    });
  }

  // Se toma un modelo concreto para asociarle opiniones iniciales.
  const sunlight = await prisma.camperModel.findUnique({
    where: { slug: "sunlight-cliff-640" },
  });

  if (sunlight) {
    // Primer comentario demo asociado al usuario cliente.
    await prisma.comment.upsert({
      where: { id: "seed-comment-1" },
      update: {},
      create: {
        id: "seed-comment-1",
        modelId: sunlight.id,
        userId: user.id,
        rating: 5,
        content:
          "Experiencia increible. La furgoneta estaba impecable y el viaje por Pirineos fue muy comodo.",
      },
    });

    // Segundo comentario demo asociado al usuario editor.
    await prisma.comment.upsert({
      where: { id: "seed-comment-2" },
      update: {},
      create: {
        id: "seed-comment-2",
        modelId: sunlight.id,
        userId: editor.id,
        rating: 5,
        content:
          "Muy buen servicio y atencion clara antes de salir. Repetiria sin dudarlo.",
      },
    });
  }

  // Salida sencilla para confirmar que se han creado los usuarios esperados.
  console.log({ admin: admin.email, editor: editor.email, user: user.email });
}

main()
  .catch((error) => {
    // Si algo falla, se imprime el error y el proceso termina con codigo 1.
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // Cierra la conexion aunque el seed haya ido bien o mal.
    await prisma.$disconnect();
  });
