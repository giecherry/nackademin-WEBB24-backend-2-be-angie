export interface Course {
    course_id: string;
    title: string;
    instructor: string;
    credits: number;
    start_date: string;
    end_date?: string;
    department?: string;
    description?: string;
}

export interface Student {
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    major?: string;
    phone_number?: string;
    course_id: string;
}

export interface CreateCourseRequest {
    course_id: string;
    title: string;
    instructor: string;
    credits: number;
    start_date: string;
    end_date?: string;
    department: string;
    description?: string;
}

export interface UpdateCourseRequest {
    title?: string;
    instructor?: string;
    credits?: number;
    start_date?: string;
    end_date?: string;
    department?: string;
    description?: string;
}