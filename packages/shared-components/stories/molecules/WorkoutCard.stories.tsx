import { DesignWorkoutCard, workoutFixtures } from '../../src';

const meta = {
  title: 'Design System/Molecules/WorkoutCard',
  component: DesignWorkoutCard,
  parameters: {
    layout: 'centered'
  },
  args: {
    workout: workoutFixtures[0]
  }
};

export default meta;

export const Intermediate = {};

export const Beginner = {
  args: {
    workout: workoutFixtures[1]
  }
};

export const Advanced = {
  args: {
    workout: workoutFixtures[2]
  }
};
