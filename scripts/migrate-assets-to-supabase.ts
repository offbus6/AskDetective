import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import { uploadFromUrlOrDataUrl, ensureBucket } from "../server/supabase";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool, { schema });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const dry = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
  await ensureBucket("detective-assets");
  await ensureBucket("service-images");
  await ensureBucket("site-assets");

  const detectives = await db.select().from(schema.detectives);
  for (const d of detectives) {
    let changed = false;
    let logo = d.logo || undefined;
    if (logo && !logo.includes(".supabase.co/storage")) {
      logo = await uploadFromUrlOrDataUrl("detective-assets", `logos/${d.id}.png`, logo);
      changed = true;
    }
    let businessDocuments = d.businessDocuments || undefined;
    if (Array.isArray(businessDocuments)) {
      const next = [];
      for (let i = 0; i < businessDocuments.length; i++) {
        const doc = businessDocuments[i];
        if (doc && !doc.includes(".supabase.co/storage")) {
          next.push(await uploadFromUrlOrDataUrl("detective-assets", `documents/${d.id}-${i}.pdf`, doc));
          changed = true;
        } else {
          next.push(doc);
        }
      }
      businessDocuments = next as any;
    }
    let identityDocuments = d.identityDocuments || undefined;
    if (Array.isArray(identityDocuments)) {
      const next = [];
      for (let i = 0; i < identityDocuments.length; i++) {
        const doc = identityDocuments[i];
        if (doc && !doc.includes(".supabase.co/storage")) {
          next.push(await uploadFromUrlOrDataUrl("detective-assets", `identity/${d.id}-${i}.pdf`, doc));
          changed = true;
        } else {
          next.push(doc);
        }
      }
      identityDocuments = next as any;
    }
    if (changed && !dry) {
      await db.update(schema.detectives).set({
        logo: logo as any,
        businessDocuments: businessDocuments as any,
        identityDocuments: identityDocuments as any,
        updatedAt: new Date(),
      }).where(schema.detectives.id.eq(d.id));
      console.log(`Updated detective ${d.id}`);
    }
  }

  const services = await db.select().from(schema.services);
  for (const s of services) {
    const images = s.images || [];
    let changed = false;
    const next = [];
    for (let i = 0; i < images.length; i++) {
      const u = images[i];
      if (u && !u.includes(".supabase.co/storage")) {
        next.push(await uploadFromUrlOrDataUrl("service-images", `banners/${s.id}-${i}.jpg`, u));
        changed = true;
      } else {
        next.push(u);
      }
    }
    if (changed && !dry) {
      await db.update(schema.services).set({ images: next as any, updatedAt: new Date() }).where(schema.services.id.eq(s.id));
      console.log(`Updated service ${s.id}`);
    }
  }

  const settings = await db.select().from(schema.siteSettings);
  if (settings.length > 0) {
    const s = settings[0];
    let logoUrl = s.logoUrl || undefined;
    if (logoUrl && !logoUrl.includes(".supabase.co/storage")) {
      logoUrl = await uploadFromUrlOrDataUrl("site-assets", `logos/site-logo.png`, logoUrl);
      if (!dry) {
        await db.update(schema.siteSettings).set({ logoUrl: logoUrl as any, updatedAt: new Date() }).where(schema.siteSettings.id.eq(s.id));
        console.log("Updated site logo");
      }
    }
  }

  await pool.end();
  console.log("Migration complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

