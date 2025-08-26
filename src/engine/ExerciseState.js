/**
 * Exercise State Management
 * Handles the current state of an exercise session
 */

export class ExerciseState {
  constructor(exerciseId) {
    this.exerciseId = exerciseId;
    this.status = 'ready'; // ready, in_progress, paused, completed, failed
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
  
  updateStatus(newStatus) {
    const validStatuses = ['ready', 'in_progress', 'paused', 'completed', 'failed'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    
    this.status = newStatus;
    this.updatedAt = Date.now();
  }
  
  getState() {
    return {
      exerciseId: this.exerciseId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default ExerciseState;
