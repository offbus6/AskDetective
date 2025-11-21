import { db } from "./index";
import { users, detectives, services, servicePackages, reviews, orders, serviceCategories } from "@shared/schema";
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
  ]).returning();

  console.log("✅ Detective users created");

  const clientUser = await db.insert(users).values({
    email: "client@example.com",
    password: hashedPassword,
    name: "Test Client",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=client"
  }).returning();

  console.log("✅ Client user created");

  const detectiveProfiles = await db.insert(detectives).values([
    {
      userId: detectiveUsers[0].id,
      businessName: "Holmes Investigations",
      bio: "Professional private investigator specializing in corporate fraud and missing persons cases.",
      location: "New York, NY",
      country: "United States",
      phone: "+1-555-0101",
      languages: ["English"],
      subscriptionPlan: "free",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[1].id,
      businessName: "Connor Detective Agency",
      bio: "Expert in cybercrime investigation and digital forensics with 20 years of experience.",
      location: "Los Angeles, CA",
      country: "United States",
      phone: "+1-555-0102",
      languages: ["English"],
      subscriptionPlan: "pro",
      status: "active",
      isVerified: true,
    },
    {
      userId: detectiveUsers[2].id,
      businessName: "Trace Investigations Agency",
      bio: "Full-service investigation agency with nationwide coverage and specialized teams.",
      location: "Chicago, IL",
      country: "United States",
      phone: "+1-555-0103",
      languages: ["English"],
      subscriptionPlan: "agency",
      status: "active",
      isVerified: true,
    },
  ]).returning();

  console.log("✅ Detective profiles created");

  // Fetch category IDs for services
  const categories = await db.select().from(serviceCategories);
  const backgroundChecksCategory = categories.find(c => c.name === "Background Checks");
  const cyberInvestigationCategory = categories.find(c => c.name === "Cyber Investigation");
  const corporateFraudCategory = categories.find(c => c.name === "Corporate Fraud");

  if (!backgroundChecksCategory || !cyberInvestigationCategory || !corporateFraudCategory) {
    throw new Error("Required service categories not found. Make sure serviceCategories were created successfully.");
  }

  const servicesList = await db.insert(services).values([
    {
      detectiveId: detectiveProfiles[0].id,
      categoryId: backgroundChecksCategory.id,
      title: "Background Check Investigation",
      description: "Comprehensive background investigation for employment or personal matters.",
      basePrice: "500.00",
      images: ["https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[1].id,
      categoryId: cyberInvestigationCategory.id,
      title: "Cybercrime Investigation",
      description: "Professional investigation of cyber crimes, hacking, and digital fraud.",
      basePrice: "2000.00",
      images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"],
      isActive: true,
    },
    {
      detectiveId: detectiveProfiles[2].id,
      categoryId: corporateFraudCategory.id,
      title: "Corporate Investigation",
      description: "Enterprise-level investigation services for corporate fraud and compliance.",
      basePrice: "5000.00",
      images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800"],
      isActive: true,
    },
  ]).returning();

  console.log("✅ Services created");

  await db.insert(servicePackages).values([
    {
      serviceId: servicesList[0].id,
      name: "Basic Package",
      description: "Standard background check",
      price: "500.00",
      features: ["Criminal record check", "Employment verification", "Basic report"],
      deliveryTime: 5,
      tierLevel: 1,
      isEnabled: true
    },
    {
      serviceId: servicesList[1].id,
      name: "Standard Package",
      description: "Comprehensive cyber investigation",
      price: "2000.00",
      features: ["Digital forensics", "Evidence collection", "Detailed report", "Expert testimony"],
      deliveryTime: 10,
      tierLevel: 1,
      isEnabled: true
    },
    {
      serviceId: servicesList[2].id,
      name: "Enterprise Package",
      description: "Full corporate investigation",
      price: "5000.00",
      features: ["Multi-location coverage", "Dedicated team", "Ongoing support", "Legal consultation"],
      deliveryTime: 15,
      tierLevel: 1,
      isEnabled: true
    },
  ]);

  console.log("✅ Service packages created");

  await db.insert(reviews).values([
    {
      serviceId: servicesList[0].id,
      userId: clientUser[0].id,
      rating: 5,
      comment: "Professional and thorough service. Highly recommended.",
      isPublished: true
    },
    {
      serviceId: servicesList[1].id,
      userId: clientUser[0].id,
      rating: 5,
      comment: "Excellent work in resolving our cybersecurity incident.",
      isPublished: true
    },
  ]);

  console.log("✅ Reviews created");

  await db.insert(orders).values([
    {
      orderNumber: "ORD-2025-001",
      serviceId: servicesList[0].id,
      userId: clientUser[0].id,
      detectiveId: detectiveProfiles[0].id,
      amount: "500.00",
      status: "completed",
      requirements: "Need background check for new employee",
    },
  ]);

  console.log("✅ Order created");
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- 1 Admin user`);
  console.log(`- 6 Service categories`);
  console.log(`- 3 Detective users (Free, Pro, Agency plans)`);
  console.log(`- 1 Client user`);
  console.log(`- 3 Detective profiles`);
  console.log(`- 3 Services`);
  console.log(`- 3 Service packages`);
  console.log(`- 2 Reviews`);
  console.log(`- 1 Order`);
  console.log("\n🔐 Test credentials:");
  console.log("Admin: admin@finddetectives.com / password123");
  console.log("Detective (Free): john.holmes@detective.com / password123");
  console.log("Detective (Pro): sarah.detective@pi.com / password123");
  console.log("Detective (Agency): mike.trace@investigate.com / password123");
  console.log("Client: client@example.com / password123");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
