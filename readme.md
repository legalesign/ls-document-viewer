# ls-document-viewer
This component allows you to edit, preview or customize a Legalesign template in order to
send a document for signing. It is purely HTML and javascript and platform agnostic.

### Useful attributes
- Filter toolbox

This allows you to choose which field types are available to your users.


## Editor Widget Modes

The most important setting is the mode in which you want to use the widget.

### Editor Mode
This setting provdes all the features that a user might need when creating and editing
a template in Console. You can allow them to use all the features and restrict some
features from being shown.

### Compose Mode

Commonly with integrated Legalesign clients, the template and signers have already been generated
by the client system. Usually this means that all recipient fields have been blended into the 
document, however what is required is the signature box for each party. Compose mode lets your
users quickly complete this task.

Compose automatically alters the normal editor in the following ways:

- Detect recipients pre-generated.
- Hide the Sender from the dropdown
- Hide document options
- Move required fields to left box and show by default
- Make participants read only
