// Shortener.spec.ts

import { mount } from '@vue/test-utils';
import Shortener from '@/views/Shortener.vue';

describe('Shortener.vue', () => {
  it('renders navigation links correctly', () => {
    const wrapper = mount(Shortener);
    const navLinks = wrapper.findAll('nav a');
    expect(navLinks.length).toBe(3); // Assuming there are three navigation links
    expect(navLinks[0].text()).toBe('Features');
    expect(navLinks[1].text()).toBe('Pricing');
    expect(navLinks[2].text()).toBe('Resources');
  });

  it('toggles mobile navigation when mobile nav toggle is clicked', async () => {
    const wrapper = mount(Shortener);
    const toggleButton = wrapper.find('.mobile-nav-toggle');
    await toggleButton.trigger('click'); // Simulate click event
    expect(wrapper.vm.showMobileNav).toBe(true); // Assuming `showMobileNav` is a reactive property
  });

  it('shortens a URL when the form is submitted', async () => {
    const wrapper = mount(Shortener);
    const originalUrl = 'https://example.com';
    const form = wrapper.find('form');
    const input = form.find('input[type="url"]');
    input.setValue(originalUrl); // Set the input value
    await form.trigger('submit'); // Simulate form submission
    expect(wrapper.vm.shortenedLinks.length).toBe(1); // Assuming `shortenedLinks` is a reactive property
    expect(wrapper.vm.shortenedLinks[0].originalUrl).toBe(originalUrl);
  });

  // Add more tests as needed to cover different aspects of the component
});
