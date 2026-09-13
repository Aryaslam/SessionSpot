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
  created_at: string;
};
