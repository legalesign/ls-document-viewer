import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-feature-column',
  styleUrl: 'ls-feature-column.css',
  shadow: true,
})
export class LsFeatureColoumn {
  render() {
    return (
      <Host>
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.00595 8.99927V15M5.00595 8.99927L6.99907 8.99963M5.00595 8.99927L3.00342 9M5.00595 15H6.99907M5.00595 15H3.00342M19.9977 15C20.5512 15 21 15.4477 21 16V18C21 18.5523 20.5512 19 19.9977 19H12C11.4464 19 10.9977 18.5523 10.9977 18V16C10.9977 15.4477 11.4464 15 12 15H19.9977ZM19.9977 4.99927C20.5512 4.99927 21 5.44698 21 5.99927V7.99927C21 8.55155 20.5512 8.99927 19.9977 8.99927L12 9C11.4464 9 10.9977 8.55228 10.9977 8V6C10.9977 5.44771 11.4464 5 12 5L19.9977 4.99927Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>


        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.00595 8.99927V15M5.00595 8.99927L6.99907 8.99963M5.00595 8.99927L3.00342 9M5.00595 15H6.99907M5.00595 15H3.00342M19.9977 15C20.5512 15 21 15.4477 21 16V18C21 18.5523 20.5512 19 19.9977 19H12C11.4464 19 10.9977 18.5523 10.9977 18V16C10.9977 15.4477 11.4464 15 12 15H19.9977ZM19.9977 4.99927C20.5512 4.99927 21 5.44698 21 5.99927V7.99927C21 8.55155 20.5512 8.99927 19.9977 8.99927L12 9C11.4464 9 10.9977 8.55228 10.9977 8V6C10.9977 5.44771 11.4464 5 12 5L19.9977 4.99927Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>


        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.00595 8.99927V15M5.00595 8.99927L6.99907 8.99963M5.00595 8.99927L3.00342 9M5.00595 15H6.99907M5.00595 15H3.00342M19.9977 15C20.5512 15 21 15.4477 21 16V18C21 18.5523 20.5512 19 19.9977 19H12C11.4464 19 10.9977 18.5523 10.9977 18V16C10.9977 15.4477 11.4464 15 12 15H19.9977ZM19.9977 4.99927C20.5512 4.99927 21 5.44698 21 5.99927V7.99927C21 8.55155 20.5512 8.99927 19.9977 8.99927L12 9C11.4464 9 10.9977 8.55228 10.9977 8V6C10.9977 5.44771 11.4464 5 12 5L19.9977 4.99927Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>


        <slot></slot>
      </Host>
    );
  }
}
