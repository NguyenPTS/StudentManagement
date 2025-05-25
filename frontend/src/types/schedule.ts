export interface Schedule {
  dayOfWeek: number;  // 0-6 representing Sunday to Saturday
  startTime: string;  // Format: "HH:mm"
  endTime: string;    // Format: "HH:mm"
  room?: string;
}

export interface CreateScheduleDTO {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface UpdateScheduleDTO extends Partial<CreateScheduleDTO> {} 