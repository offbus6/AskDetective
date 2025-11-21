import { db } from "./index";
import { users, detectives, services, servicePackages, reviews, orders } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seeding...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const [adminUser] = await db.insert(users).values({
    email: "admin@finddetectives.com",
    password: hashedPassword,
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  }).returning();

  console.log("✅ Admin user created");

  const detectiveUsers = await db.insert(users).values([
    {
      email: "john.holmes@detective.com",
      password: hashedPassword,
      name: "John Holmes",
      role: "detective",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
    },
    {
      email: "sarah.detective@pi.com",
      password: hashedPassword,
      name: "Sarah Connor",
      role: "detective",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      email: "mike.trace@investigate.com",
      password: hashedPassword,
      name: "Michael Trace",
      role: "detective",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
    },
    {
      email: "emma.watson@detective.uk",
      password: hashedPassword,
      name: "Emma Watson",
      role: "detective",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
    },
    {
      email: "carlos.mendez@investigacion.es",
      password: hashedPassword,
      name: "Carlos Mendez",
      role: "detective",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos"
    },
  ]).returning();

  console.log("✅ Detective users created");

  const clientUsers = await db.insert(users).values([
    {
      email: "client1@example.com",
      password: hashedPassword,
      name: "Alice Johnson",
      role: "user",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
    },
    {
      email: "client2@example.com",
      password: hashedPassword,
      name: "Bob Smith",
      role: "user",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob"
    },
  ]).returning();

  console.log("✅ Client users created");

  const detectiveProfiles = await db.insert(detectives).values([
    {
      userId: detectiveUsers[0].id,
      businessName: "Holmes Investigations",
      bio: "With over 15 years of experience in private investigations, specializing in corporate fraud and missing persons cases.",
      location: "New York, NY",
      country: "United States",
      phone: "+1-555-0101",
      whatsapp: "+1-555-0101",
      languages: ["English", "Spanish"],
      subscriptionPlan: "pro",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[1].id,
      businessName: "Connor Detective Agency",
      bio: "Former FBI agent with 20 years of experience. Expert in cybercrime investigation and digital forensics.",
      location: "Los Angeles, CA",
      country: "United States",
      phone: "+1-555-0102",
      languages: ["English", "Mandarin"],
      subscriptionPlan: "pro",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[2].id,
      businessName: "Trace Investigations",
      bio: "Specialized in insurance fraud investigations and workers' compensation cases.",
      location: "Chicago, IL",
      country: "United States",
      phone: "+1-555-0103",
      languages: ["English"],
      subscriptionPlan: "free",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[3].id,
      businessName: "Watson Investigations UK",
      bio: "Leading private investigator in London specializing in matrimonial cases and corporate due diligence.",
      location: "London",
      country: "United Kingdom",
      phone: "+44-555-0104",
      languages: ["English", "French"],
      subscriptionPlan: "pro",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[4].id,
      businessName: "Mendez Investigaciones",
      bio: "Spanish private detective with expertise in international cases and fraud investigation.",
      location: "Madrid",
      country: "Spain",
      phone: "+34-555-0105",
      languages: ["Spanish", "English", "Portuguese"],
      subscriptionPlan: "free",
      status: "active",
      isVerified: false,
    },
  ]).returning();

  console.log("✅ Detective profiles created");

  const servicesList = await db.insert(services).values([
    {
      detectiveId: detectiveProfiles[0].id,
      title: "Corporate Fraud Investigation",
      description: "Comprehensive investigation of suspected corporate fraud, embezzlement, and financial irregularities. Includes forensic accounting and detailed reporting.",
      category: "Corporate Investigation",
      basePrice: "2500.00",
      images: ["https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[0].id,
      title: "Missing Person Locator Service",
      description: "Professional missing person investigation using advanced databases and skip tracing techniques. 98% success rate.",
      category: "Missing Persons",
      basePrice: "1500.00",
      images: ["https://images.unsplash.com/photo-1508349937151-22b68b72d5b7?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[1].id,
      title: "Cybercrime Investigation & Digital Forensics",
      description: "Expert investigation of cyber crimes including hacking, identity theft, and online fraud. Former FBI specialist.",
      category: "Cybercrime",
      basePrice: "3000.00",
      images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[1].id,
      title: "Advanced Surveillance Package",
      description: "Professional surveillance services with detailed photo/video documentation.",
      category: "Surveillance",
      basePrice: "1200.00",
      images: ["https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[2].id,
      title: "Insurance Fraud Investigation",
      description: "Thorough investigation of suspected insurance fraud including workers' compensation and disability claims.",
      category: "Insurance Fraud",
      basePrice: "1800.00",
      images: ["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[3].id,
      title: "Matrimonial Investigation",
      description: "Discreet investigation of suspected infidelity and custody investigations. Handled with sensitivity.",
      category: "Matrimonial",
      basePrice: "2000.00",
      images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"],
      isActive: true,
    },
  ]).returning();

  console.log("✅ Services created");

  await db.insert(servicePackages).values([
    {
      serviceId: servicesList[0].id,
      name: "Basic Investigation",
      description: "Initial fraud assessment and preliminary report",
      price: "2500.00",
      features: ["Initial assessment", "Document review", "Preliminary report"],
      deliveryTime: 7,
      tierLevel: 1,
      isEnabled: true
    },
    {
      serviceId: servicesList[0].id,
      name: "Standard Investigation",
      description: "Comprehensive fraud investigation with detailed analysis",
      price: "4500.00",
      features: ["Full investigation", "Forensic analysis", "Detailed report", "Court testimony support"],
      deliveryTime: 14,
      tierLevel: 2,
      isEnabled: true
    },
  ]);

  console.log("✅ Service packages created");

  await db.insert(reviews).values([
    {
      serviceId: servicesList[0].id,
      userId: clientUsers[0].id,
      rating: 5,
      comment: "Outstanding work! John helped us uncover significant financial irregularities. Professional and discreet.",
      isPublished: true
    },
    {
      serviceId: servicesList[0].id,
      userId: clientUsers[1].id,
      rating: 5,
      comment: "Highly recommend Holmes Investigations. Detailed evidence that was crucial for our legal case.",
      isPublished: true
    },
    {
      serviceId: servicesList[1].id,
      userId: clientUsers[0].id,
      rating: 5,
      comment: "Found my missing sister after 3 years! Forever grateful to John and his team.",
      isPublished: true
    },
    {
      serviceId: servicesList[2].id,
      userId: clientUsers[1].id,
      rating: 5,
      comment: "Sarah's expertise in cybercrime is unmatched. Recovered all our stolen data.",
      isPublished: true
    },
  ]);

  console.log("✅ Reviews created");

  await db.insert(orders).values([
    {
      orderNumber: "ORD-2025-001",
      serviceId: servicesList[0].id,
      userId: clientUsers[0].id,
      detectiveId: detectiveProfiles[0].id,
      amount: "4500.00",
      status: "completed",
      requirements: "Need investigation of financial discrepancies",
    },
    {
      orderNumber: "ORD-2025-002",
      serviceId: servicesList[2].id,
      userId: clientUsers[1].id,
      detectiveId: detectiveProfiles[1].id,
      amount: "3000.00",
      status: "in_progress",
      requirements: "Investigate unauthorized database access",
    },
  ]);

  console.log("✅ Orders created");
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- 1 Admin user`);
  console.log(`- 5 Detective users`);
  console.log(`- 2 Client users`);
  console.log(`- 5 Detective profiles`);
  console.log(`- 6 Services`);
  console.log(`- 2 Service packages`);
  console.log(`- 4 Reviews`);
  console.log(`- 2 Orders`);
  console.log("\n🔐 Test credentials:");
  console.log("Admin: admin@finddetectives.com / password123");
  console.log("Detective: john.holmes@detective.com / password123");
  console.log("Client: client1@example.com / password123");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
