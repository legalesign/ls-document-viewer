export class LsDocumentAdapter {
  handleEvent = (event) => {
    // Determine the object type being processed
    const obj = event.detail;
    if (!obj?.id) return 'invalid';

    const apiId = atob(obj.id);
    if (apiId.length < 3) return 'invalid';

    const prefix = atob(obj.id).substring(0, 3);

    switch (prefix) {
      case 'ele':

        return 'element';
      case 'rol':
        return 'role';
      case 'tpl':
        return 'template';
      case 'doc':
        return 'document';
      default:
        return 'unknown';
    }
  };
}


