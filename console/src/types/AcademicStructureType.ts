import type { CategoryProps } from "./Types";

export interface AcademicGroupProps {
  _id: string;
  academic_group: string;
  academic_classess: string[];
  status: string;
}

export interface AcademicClassProps {
  academic_class: string;
  status: string;
  _id: string;
}

export interface TaskProps extends Record<string, unknown> {
  _id: string;
  title: string;
  academic_group_id: AcademicGroupProps | string;
  difficulty_level: string | CategoryProps;
  task_type: string | CategoryProps;
  duration: {
    duration_value: number;
    duration_type: string;
  };
  objective: string;
  steps_to_implement: string;
  final_deliverable: string;
  important_details: string;
  status: string;
}
