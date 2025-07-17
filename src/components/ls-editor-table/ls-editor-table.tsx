import { Component, Host, Prop, h, Element } from '@stencil/core';
import { LsDocumentViewer } from '../ls-document-viewer/ls-document-viewer';

@Component({
  tag: 'ls-editor-table',
  styleUrl: 'ls-editor-table.css',
  shadow: true,
})
export class LsEditorTable {
  @Element() component: HTMLElement;
  /**
* The parent editor control.
* {LsDocumentViewer}
*/
  @Prop() editor: LsDocumentViewer;

  componentDidLoad() {
    var dataTable = this.component.shadowRoot.getElementById('ls-editor-table') as HTMLCanvasElement;
    Array.from(this.editor.component.shadowRoot.querySelectorAll('ls-editor-field')).forEach(fx => {

      const rowNode = document.createElement('tr');
      const idCellNode = document.createElement('td');
      idCellNode.innerText = fx.dataItem.id
      rowNode.appendChild(idCellNode);

      const valueCellNode = document.createElement('td');
      valueCellNode.innerText = fx.dataItem.value
      rowNode.appendChild(valueCellNode);

      const labelCellNode = document.createElement('td');
      labelCellNode.innerText = fx.dataItem.label
      rowNode.appendChild(labelCellNode);

      dataTable.appendChild(rowNode)
    })
  }

  render() {
    return (
      <Host>
        <table id="ls-editor-table">
        </table>
        <slot></slot>
      </Host>
    );
  }
}
