// Dashboard.spec.ts

import { mount } from '@vue/test-utils';
import Dashboard from '../views/Dashboard.vue';

describe('Dashboard.vue', () => {
  test('renders welcome message', () => {
    const wrapper = mount(Dashboard);
    expect(wrapper.text()).toContain('Welcome');
  });

  test('shortenUrl function is called when form is submitted', async () => {
    const wrapper = mount(Dashboard);
    const shortenUrlMock = jest.fn();
    // @ts-ignore
    wrapper.vm.shortenUrl = shortenUrlMock;

    await wrapper.find('form').trigger('submit');

    expect(shortenUrlMock).toHaveBeenCalled();
  });
});
