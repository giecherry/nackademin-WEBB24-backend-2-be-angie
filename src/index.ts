import { serve } from "@hono/node-server";
import { readFileSync } from "fs";
import { join } from "path";
import type { Course, Student, CreateCourseRequest, UpdateCourseRequest } from "./hono-test/types/course.d.ts";
import { Hono } from "hono";
import dotenv from "dotenv";
import { runCocktailDemo } from "./cocktail-project/demo.js";
import { fetchRandomCocktail, fetchCocktailByName } from "./cocktail-project/api/cocktailApi.js";

dotenv.config();

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Welcome to the API Server! 🚀",
    cocktail_endpoints: {
      "GET /cocktail/random": "Get a random cocktail",
      "GET /cocktail/search/:name": "Search cocktails by name",
      "GET /cocktail/demo": "Run the simple cocktail demo"
    },
    course_management_endpoints: {
      "GET /courses": "Get all courses",
      "GET /courses/:id": "Get course by ID with enrolled students",
      "POST /courses": "Create a new course",
      "PUT /courses/:id": "Update a course",
      "DELETE /courses/:id": "Delete a course"
    },
  });
});


//---------------COURSE MA§NAGEMENT------------------------

const loadCourses = (): Course[] => {
  try {
    const coursesPath = join(process.cwd(), 'src/hono-test/data/courses.json');
    const coursesData = readFileSync(coursesPath, 'utf-8');
    return JSON.parse(coursesData);
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
};

const loadStudents = (): Student[] => {
  try {
    const studentsPath = join(process.cwd(), 'src/hono-test/data/students.json');
    const studentsData = readFileSync(studentsPath, 'utf-8');
    return JSON.parse(studentsData);
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};

let courses: Course[] = loadCourses();
let students: Student[] = loadStudents();


app.get('/courses', (c) => {
  return c.json({
    courses,
    count: courses.length
  });
});


// GET /courses/:id - Return a specific course and its enrolled students
app.get('/courses/:id', (c) => {
  const courseId = c.req.param('id');
  const course = courses.find(c => c.course_id === courseId);
  
  if (!course) {
    return c.json({ error: 'Course not found' }, 404);
  }
  
  const enrolledStudents = students.filter(s => s.course_id === courseId);
  
  return c.json({
    course,
    enrolled_students: enrolledStudents,
    student_count: enrolledStudents.length
  });
});


// POST /courses - Create a new course
app.post('/courses', async (c) => {
  try {
    const body = await c.req.json() as CreateCourseRequest;
    
    if (!body.course_id || !body.title || !body.instructor || !body.credits || !body.start_date || !body.department) {
      return c.json({
        error: 'Missing required fields',
        required: ['course_id', 'title', 'instructor', 'credits', 'start_date', 'department']
      }, 400);
    }
    
    // Check if course ID already exists
    if (courses.find(course => course.course_id === body.course_id)) {
      return c.json({ error: 'Course ID already exists' }, 409);
    }
    
    const newCourse: Course = {
      course_id: body.course_id,
      title: body.title,
      instructor: body.instructor,
      credits: body.credits,
      start_date: body.start_date,
      end_date: body.end_date,
      department: body.department,
      description: body.description
    };
    
    courses.push(newCourse);
    
    return c.json({
      message: 'Course created successfully',
      course: newCourse
    }, 201);
  } catch (error) {
    return c.json({ error: 'Invalid JSON data' }, 400);
  }
});


// PUT /courses/:id - Update a course
app.put('/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id');
    const body = await c.req.json() as UpdateCourseRequest;
    
    const courseIndex = courses.findIndex(course => course.course_id === courseId);
    
    if (courseIndex === -1) {
      return c.json({ error: 'Course not found' }, 404);
    }
    
    // Update only provided fields
    const updatedCourse: Course = {
      ...courses[courseIndex],
      ...body
    };
    
    courses[courseIndex] = updatedCourse;
    
    return c.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    return c.json({ error: 'Invalid JSON data' }, 400);
  }
});

// DELETE /courses/:id - Delete a course and remove its students
app.delete('/courses/:id', (c) => {
  const courseId = c.req.param('id');
  const courseIndex = courses.findIndex(course => course.course_id === courseId);
  
  if (courseIndex === -1) {
    return c.json({ error: 'Course not found' }, 404);
  }
  
  const deletedCourse = courses[courseIndex];
  courses.splice(courseIndex, 1);
  
  const removedStudents = students.filter(s => s.course_id === courseId);
  students = students.filter(s => s.course_id !== courseId);
  
  return c.json({
    message: 'Course deleted successfully',
    deleted_course: deletedCourse,
    removed_students_count: removedStudents.length,
    removed_students: removedStudents
  });
});

//---------------COCKTAILS------------------------
// Simple cocktail endpoints
app.get("/cocktail/random", async (c) => {
  try {
    const cocktail = await fetchRandomCocktail();
    if (!cocktail) {
      return c.json({ error: "No cocktail found" }, 404);
    }
    return c.json(cocktail);
  } catch (error) {
    return c.json({ error: "Failed to fetch cocktail" }, 500);
  }
});

app.get("/cocktail/search/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const cocktails = await fetchCocktailByName(name);
    return c.json({ cocktails, count: cocktails.length });
  } catch (error) {
    return c.json({ error: "Failed to search cocktails" }, 500);
  }
});

app.get("/cocktail/demo", async (c) => {
  try {
    console.log("Running simple cocktail demo...");
    await runCocktailDemo();
    return c.json({ message: "Demo completed! Check the server console for output." });
  } catch (error) {
    return c.json({ error: "Demo failed" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log("\nAvailable endpoints:");
    console.log("  GET / - Welcome message");
    console.log("  GET /cocktail/random - Get a random cocktail");
    console.log("  GET /cocktail/search/{name} - Search cocktails by name");
    console.log("  GET /cocktail/demo - Run the simple demo");

    console.log('  GET    /courses - Get all courses');
    console.log('  GET    /courses/:id - Get course by ID');
    console.log('  POST   /courses - Create a new course');
    console.log('  PUT    /courses/:id - Update a course');
    console.log('  DELETE /courses/:id - Delete a course');
    console.log('\n💡 Try these examples:');

  }
);
