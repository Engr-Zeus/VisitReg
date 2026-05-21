import { prisma } from "@/lib/prisma"; // Adjust based on your prisma client location

export async function getAllAdmins() {
  return await prisma.admin.findMany({
    orderBy: { name: 'asc' }
  });
}



// export type AdminUser = {
//   id: string;
//   name: string;
//   email: string;
//   department?: string;
// };

// // Mock data – replace with Prisma later
// const MOCK_ADMINS: AdminUser[] = [
//   { id: "1", name: "Emmanuel Ewa", email: "emmauelewa@cyber1systemsnetwork.com" },
//   { id: "2", name: "Nathan Johnson", email: "nathan@cyber1systemsnetwork.com" },
//   { id: "3", name: "Kosy Mike", email: "kosy@homiezlimited.com" },
//   { id: "4", name: "Seyi Kuti", email: "seyi@cyber1systemsnetwork.com" }
// ];

// export function findAdminByName(name: string): AdminUser | undefined {
//   const normalized = name.trim().toLowerCase();
//   return MOCK_ADMINS.find(
//     (admin) => admin.name.toLowerCase() === normalized
//   );
// }

// export function getAllAdmins(): AdminUser[] {
//   return MOCK_ADMINS;
// }


