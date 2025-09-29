// src/database/course.ts
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

export async function getCourses(): Promise<Course[]> {
  const query = supabase.from("courses").select("*");
  const courses: PostgrestSingleResponse<Course[]> = await query;
  return courses.data || [];
};

export async function createCourse(course: NewCourse): Promise<Course> {
    const query = supabase.from("courses").insert(course).select().single();
    const response: PostgrestSingleResponse<Course> = await query;
    return response.data!;
};