"use server";

import { prisma } from "@/lib/db";
import type { Category, Project } from "@/types/project";

export async function getApprovedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProjects: Project[] = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      githubUrl: p.githubUrl,
      websiteUrl: p.websiteUrl || "",
      status: "approved",
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      authorName: p.author.fullName,
      authorEmail: p.author.email,
      authorAvatar: "", // Add logic if you have avatars
      categories: p.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        color: pc.category.color,
        projectCount: 0, // Not needed here but for type safety
        createdAt: pc.category.createdAt.toISOString(),
      })),
    }));

    return { success: true, data: formattedProjects };
  } catch (error) {
    console.error("Fetch approved projects error:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const formattedCategories: Category[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      color: c.color,
      projectCount: 0, // Could be calculated but let's keep it simple
      createdAt: c.createdAt.toISOString(),
    }));

    return { success: true, data: formattedCategories };
  } catch (error) {
    console.error("Fetch categories error:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}
