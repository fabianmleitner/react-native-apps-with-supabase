import { HealthScreen } from '../../src';

const meta = {
  title: 'Design System/Screens/Health',
  component: HealthScreen,
  parameters: {
    layout: 'centered'
  },
  args: {
    status: 'IDLE'
  }
};

export default meta;

export const Idle = {};

export const Healthy = {
  args: {
    status: 'HEALTHY',
    message: 'Supabase API is reachable.'
  }
};

export const Unhealthy = {
  args: {
    status: 'UNHEALTHY',
    message: 'Health check failed. HTTP 503'
  }
};
