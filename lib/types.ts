export type Classroom = {
  id: string;
  class_name: string;
  grade: string;
  description: string | null;
  active: boolean;
  created_at: string;
};

export type Club = {
  id: string;
  name: string;
  description: string | null;
  president_name: string | null;
  president_phone: string | null;
  vice_president_name: string | null;
  vice_president_phone: string | null;
  logo_path: string | null;
  created_at: string;
};

export type RequestStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type ClubRequestClassroom = {
  classroom_id: string;
  classrooms: Pick<Classroom, "id" | "class_name" | "grade">;
};

export type ClubRequest = {
  id: string;
  club_id: string;
  usage_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  request_classrooms: ClubRequestClassroom[];
};
