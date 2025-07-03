import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';

@Component({
  tag: 'ls-document-options',
  styleUrl: 'ls-document-options.css',
  shadow: true,
})
export class LsDocumentOptions {
  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;
  
  @Watch('template')
  selectedHandler(newSelected, _oldSelected) {
    console.log(newSelected, 'document manager')
  }
    
  render() {
    return (
      <Host>
        <h1>Template Properties</h1>
         <ls-formfield label="Name" as="text" value={this.template?.title}/>
        <ls-formfield label="Auto Archive" as="radio" value={"false"}/>
        Pages {this.template?.pageDimensionArray?.length}
        Date Created {this.template?.created}
        Created By {this.template?.createdBy}
        <slot></slot>
      </Host>
    );
  }
}
