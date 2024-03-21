// Signup.spec.ts

import { mount } from '@vue/test-utils';
import Signup from '../views/Signup.vue';

describe('Signup.vue', () => {
  test('renders signup form', () => {
    const wrapper = mount(Signup);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  test('signupUser function is called when form is submitted', async () => {
    const wrapper = mount(Signup);
    const signupUserMock = jest.fn();
    // @ts-ignore
    wrapper.vm.signupUser = signupUserMock;

    await wrapper.find('form').trigger('submit');

    expect(signupUserMock).toHaveBeenCalled();
  });

  test('signUpWithGoogle function is called when Google signup button is clicked', async () => {
    const wrapper = mount(Signup);
    const signUpWithGoogleMock = jest.fn();
    // @ts-ignore
    wrapper.vm.signUpWithGoogle = signUpWithGoogleMock;

    await wrapper.find('.provider-btn').trigger('click');

    expect(signUpWithGoogleMock).toHaveBeenCalled();
  });
});
