import { db } from "./index";
import { users, serviceCategories } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seeding...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    email: "admin@finddetectives.com",
    password: hashedPassword,
    name: "Administrator",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  });

  console.log("✅ Admin user created");

  await db.insert(serviceCategories).values([
    {
      name: "Surveillance",
      description: "Discreet monitoring and observation services for individuals or locations",
      isActive: true,
    },
    {
      name: "Background Checks",
      description: "Comprehensive background investigations for employment, relationships, or due diligence",
      isActive: true,
    },
    {
      name: "Missing Persons",
      description: "Specialized investigations to locate missing individuals or lost contacts",
      isActive: true,
    },
    {
      name: "Infidelity Investigations",
      description: "Discreet investigations of suspected relationship infidelity",
      isActive: true,
    },
    {
      name: "Corporate Fraud",
      description: "Investigation of corporate fraud, embezzlement, and business misconduct",
      isActive: true,
    },
    {
      name: "Cyber Investigation",
      description: "Digital forensics and investigation of cybercrime, hacking, and online fraud",
      isActive: true,
    },
  ]);

  console.log("✅ Service categories created");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- 1 Admin user`);
  console.log(`- 6 Service categories`);
  console.log("\n🔐 Admin credentials:");
  console.log("Email: admin@finddetectives.com");
  console.log("Password: admin123");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
