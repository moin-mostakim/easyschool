export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

export enum Permission {
  // Super Admin
  MANAGE_ALL_SCHOOLS = 'manage_all_schools',
  APPROVE_SCHOOLS = 'approve_schools',
  SUSPEND_SCHOOLS = 'suspend_schools',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',
  VIEW_SYSTEM_ANALYTICS = 'view_system_analytics',

  // School Admin
  MANAGE_SCHOOL_PROFILE = 'manage_school_profile',
  MANAGE_CLASSES = 'manage_classes',
  MANAGE_SECTIONS = 'manage_sections',
  MANAGE_SUBJECTS = 'manage_subjects',
  MANAGE_STUDENTS = 'manage_students',
  MANAGE_TEACHERS = 'manage_teachers',
  MANAGE_STAFF = 'manage_staff',
  VIEW_ATTENDANCE = 'view_attendance',
  MANAGE_EXAMS = 'manage_exams',
  MANAGE_RESULTS = 'manage_results',
  MANAGE_FEES = 'manage_fees',
  SEND_NOTICES = 'send_notices',

  // Teacher
  TAKE_ATTENDANCE = 'take_attendance',
  UPLOAD_HOMEWORK = 'upload_homework',
  UPLOAD_MATERIALS = 'upload_materials',
  ENTER_EXAM_MARKS = 'enter_exam_marks',
  SEND_CLASS_NOTICES = 'send_class_notices',
  COMMUNICATE_PARENTS = 'communicate_parents',
  VIEW_ASSIGNED_CLASSES = 'view_assigned_classes',
  VIEW_STUDENT_DATA = 'view_student_data',

  // Parent
  VIEW_CHILD_ATTENDANCE = 'view_child_attendance',
  VIEW_HOMEWORK = 'view_homework',
  VIEW_NOTICES = 'view_notices',
  VIEW_EXAM_RESULTS = 'view_exam_results',
  VIEW_PERFORMANCE = 'view_performance',
  VIEW_FEES = 'view_fees',
  COMMUNICATE_TEACHERS = 'communicate_teachers',

  // Student
  VIEW_OWN_HOMEWORK = 'view_own_homework',
  VIEW_OWN_RESULTS = 'view_own_results',
  VIEW_CLASS_ROUTINE = 'view_class_routine',
  VIEW_OWN_NOTICES = 'view_own_notices',
}
