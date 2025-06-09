import { Component, Host, Prop, h } from '@stencil/core';


@Component({
  tag: 'ls-send',
  styleUrl: 'ls-send.css',
  shadow: true,
})
export class LsSend {
  @Prop() format: 'compact' | 'standard'
  
  render() {
    return (
      <Host>
        <h1>Legalesign Send</h1>
        <p>Logo</p>
        <textarea>
          Your email and message preview here. Editable. 
          <a href=""></a>
        </textarea>
        <p>Signature</p>
          <button>Email via </button>
          <img src="./share.png" ></img>
        <slot></slot>
      </Host>
    );
  }
}
