import { BottomTabs } from '../../src';

const meta = {
  title: 'Design System/Organisms/BottomTabs',
  component: BottomTabs,
  parameters: {
    layout: 'centered'
  },
  args: {
    active: 'dashboard'
  }
};

export default meta;

export const HomeActive = {};

export const ProgressActive = {
  args: {
    active: 'progress'
  }
};
