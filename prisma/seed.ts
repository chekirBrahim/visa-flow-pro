import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@visaflowpro.tn" },
    update: {},
    create: {
      email: "admin@visaflowpro.tn",
      name: "Admin VisaFlow",
      firstName: "Admin",
      lastName: "VisaFlow",
      password: adminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      isVerified: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create agent
  const agentPassword = await bcrypt.hash("Agent@1234", 12);
  const agent = await prisma.user.upsert({
    where: { email: "agent@visaflowpro.tn" },
    update: {},
    create: {
      email: "agent@visaflowpro.tn",
      name: "Sarra Agent",
      firstName: "Sarra",
      lastName: "Trabelsi",
      password: agentPassword,
      role: "AGENT",
      isActive: true,
      isVerified: true,
    },
  });

  // Create demo client
  const clientPassword = await bcrypt.hash("Client@1234", 12);
  const client = await prisma.user.upsert({
    where: { email: "client@demo.tn" },
    update: {},
    create: {
      email: "client@demo.tn",
      name: "Mohamed Ben Ali",
      firstName: "Mohamed",
      lastName: "Ben Ali",
      password: clientPassword,
      phone: "+216 98 765 432",
      role: "CLIENT",
      isActive: true,
      isVerified: true,
      nationality: "Tunisienne",
      city: "Tunis",
    },
  });
  console.log("✅ Demo users created");

  // Create visa countries
  const countries = [
    {
      code: "FR" as const,
      name: "France",
      nameEn: "France",
      nameAr: "فرنسا",
      flag: "🇫🇷",
      embassy: "Ambassade de France à Tunis",
      embassyAddress: "Place de l'Indépendance, Tunis 1000",
      visaCenter: "TLSContact",
      processingDays: 15,
      agencyFee: 350,
      consularFee: 100,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      code: "DE" as const,
      name: "Allemagne",
      nameEn: "Germany",
      nameAr: "ألمانيا",
      flag: "🇩🇪",
      embassy: "Ambassade d'Allemagne à Tunis",
      visaCenter: "VFS Global",
      processingDays: 15,
      agencyFee: 350,
      consularFee: 100,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      code: "IT" as const,
      name: "Italie",
      nameEn: "Italy",
      nameAr: "إيطاليا",
      flag: "🇮🇹",
      visaCenter: "VFS Global",
      processingDays: 15,
      agencyFee: 320,
      consularFee: 100,
      sortOrder: 3,
    },
    {
      code: "ES" as const,
      name: "Espagne",
      nameEn: "Spain",
      nameAr: "إسبانيا",
      flag: "🇪🇸",
      visaCenter: "VFS Global",
      processingDays: 15,
      agencyFee: 320,
      consularFee: 100,
      sortOrder: 4,
    },
    {
      code: "US" as const,
      name: "USA",
      nameEn: "United States",
      nameAr: "الولايات المتحدة",
      flag: "🇺🇸",
      processingDays: 90,
      agencyFee: 800,
      consularFee: 160,
      isFeatured: true,
      sortOrder: 5,
    },
    {
      code: "CA" as const,
      name: "Canada",
      nameEn: "Canada",
      nameAr: "كندا",
      flag: "🇨🇦",
      visaCenter: "VFS Global",
      processingDays: 60,
      agencyFee: 600,
      consularFee: 100,
      sortOrder: 6,
    },
    {
      code: "UK" as const,
      name: "Royaume-Uni",
      nameEn: "United Kingdom",
      nameAr: "المملكة المتحدة",
      flag: "🇬🇧",
      visaCenter: "TLSContact",
      processingDays: 15,
      agencyFee: 400,
      consularFee: 115,
      sortOrder: 7,
    },
  ];

  for (const countryData of countries) {
    const country = await prisma.visaCountry.upsert({
      where: { code: countryData.code },
      update: {},
      create: countryData,
    });

    // Create visa types for France (Schengen)
    if (countryData.code === "FR") {
      const visaTypes = [
        {
          type: "SCHENGEN" as const,
          name: "Visa Schengen Court Séjour (C)",
          description: "Pour tourismes, visites familiales ou voyages d'affaires jusqu'à 90 jours",
          processingDays: 15,
          agencyFee: 350,
          consularFee: 100,
          maxStay: 90,
          validity: 180,
          isMultipleEntry: true,
        },
        {
          type: "LONG_STAY" as const,
          name: "Visa Long Séjour (D)",
          description: "Pour séjours de plus de 90 jours : études, travail, famille",
          processingDays: 30,
          agencyFee: 500,
          consularFee: 99,
          maxStay: 365,
          isMultipleEntry: false,
        },
        {
          type: "STUDENT" as const,
          name: "Visa Étudiant",
          description: "Pour études en France dans un établissement reconnu",
          processingDays: 21,
          agencyFee: 450,
          consularFee: 99,
          maxStay: 365,
          isMultipleEntry: true,
        },
      ];

      for (const typeData of visaTypes) {
        await prisma.visaCountryType.upsert({
          where: { countryId_type: { countryId: country.id, type: typeData.type } },
          update: {},
          create: { ...typeData, countryId: country.id },
        });
      }
    }

    // Create visa types for USA
    if (countryData.code === "US") {
      await prisma.visaCountryType.upsert({
        where: { countryId_type: { countryId: country.id, type: "TOURIST" } },
        update: {},
        create: {
          countryId: country.id,
          type: "TOURIST",
          name: "Visa B1/B2 Touriste/Affaires",
          description: "Pour visites touristiques et voyages d'affaires aux États-Unis",
          processingDays: 90,
          agencyFee: 800,
          consularFee: 160,
          maxStay: 180,
          isMultipleEntry: true,
        },
      });
    }
  }

  console.log("✅ Countries and visa types seeded");

  // Create a sample application
  const france = await prisma.visaCountry.findUnique({ where: { code: "FR" } });
  const schengenType = await prisma.visaCountryType.findFirst({ where: { countryId: france?.id, type: "SCHENGEN" } });

  if (france && schengenType) {
    const existingApp = await prisma.application.findFirst({ where: { clientId: client.id } });
    if (!existingApp) {
      const app = await prisma.application.create({
        data: {
          referenceNumber: "VFP-2024-DEMO01",
          clientId: client.id,
          agentId: agent.id,
          countryId: france.id,
          visaTypeId: schengenType.id,
          status: "IN_PROCESS",
          submittedAt: new Date(),
          formData: {
            firstName: "Mohamed",
            lastName: "Ben Ali",
            dateOfBirth: "1990-05-15",
            passportNumber: "AB123456",
            profession: "Ingénieur informatique",
            monthlyIncome: "4500",
            travelPurpose: "tourism",
            departureDate: "2024-07-01",
            returnDate: "2024-07-15",
          },
          totalAmount: france.agencyFee + france.consularFee,
          steps: {
            create: [
              { name: "Réception dossier", order: 1, isCompleted: true, completedAt: new Date() },
              { name: "Vérification documents", order: 2, isCompleted: true, completedAt: new Date() },
              { name: "Traitement ambassade", order: 3, isCompleted: false },
              { name: "Décision consulaire", order: 4, isCompleted: false },
              { name: "Notification résultat", order: 5, isCompleted: false },
            ],
          },
        },
      });
      console.log("✅ Demo application created:", app.referenceNumber);
    }
  }

  // Settings
  await prisma.setting.upsert({
    where: { key: "agency_name" },
    update: {},
    create: {
      key: "agency_name",
      value: "VisaFlow Pro",
      group: "general",
      isPublic: true,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
