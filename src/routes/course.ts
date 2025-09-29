import { Hono } from "hono";
import fs from "fs/promises";
import { courseValidator, courseQueryValidator } from "../validators/courseValidator.js";
import { supabase } from '../lib/supabase.js'
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import * as db from "../database/course.js";
import type { title } from "process";

const courseApp = new Hono();

courseApp.get("/", courseQueryValidator, async (c) => {
  const { limit, offset, department, q, sortby } = c.req.valid("query");

  try {
    // const startIndex = offset-1 > 0 ? offset-1 : 0
    // const endIndex = startIndex + limit -1
    const courses: Course[]= await db.getCourses()
    const response = {
      data: courses,
      offset,
      limit,
    };
    return c.json(response);
  } catch (error) {
    return c.json([]);
  }
});

courseApp.get("/:id", async (c) => {
    const { id } = c.req.param();
    try {
        const data: string = await fs.readFile("src/data/courses.json", "utf8");
        const courses: Course[] = JSON.parse(data);
        const course = courses.find((course) => course.course_id === id);
        if (!course) {
            throw new Error("Course not found");
        }
        return c.json(course);
    } catch (error) {
        console.error(error);
        return c.json(null, 404);
    }
});

courseApp.post("/", courseValidator, async (c) => {
    try {
        const newCourse: NewCourse = c.req.valid("json");
        const course: Course =  await db.createCourse(newCourse);
        return c.json(course, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to create course" }, 400);
    }
});

courseApp.put("/:id", courseValidator, async (c) => {
    const { id } = c.req.param();
    try {
        const body: NewCourse = c.req.valid("json");
        const { data } = await supabase
          .from('courses')
          .upsert({
            course_id: id,
            title: body.title,
            instructor: body.instructor,
            credits: body.credits,
            start_date: body.start_date,
            end_date: body.end_date,
            department: body.department,
            description: body.description
          })
          .select();

        return c.json({
            message: "Course updated successfully",
            course: data
        }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to update course" }, 400);
    }
});

courseApp.delete("/:id", async (c) => {

    const { id } = c.req.param();
    try {
        const courses: Course[] = await db.getCourses();
        const courseToDelete = courses.find((course) => course.course_id === id);
        
        if (!courseToDelete) {
            return c.json({ 
                error: "Course not found",
                message: `No course found with ID: ${id}` 
            }, 404);
        }

        const { data, error } = await supabase
        .from('courses')
        .delete()
        .eq('course_id', id)
        .select()
        .single();

        if (error) {
            throw new Error("Failed to delete course");
        }

        return c.json({
            message: "Course deleted successfully",
            deleted_course: data
        }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to delete course" }, 400);
    }
});

export default courseApp;
