
// Add a role
const createRole = (role) => {
  const newParent = role?.signerParent ? `"${role.signerParent}"` : 'null';
  return `
  mutation LDVAddRole {
    createTemplateRole(input: {
      templateId: "${role.templateId}"       
        signerIndex: ${role.signerIndex}
        signerParent: ${newParent}
        name: ${JSON.stringify(role.name)}
        ordinal: ${role.ordinal}
        roleType: ${role.roleType}
        experience: "${role.experience}"
     })
  }`  
};

// Remove a role
const deleteRole = (role) => {
  return `
    mutation LDVremoveRole {
      deleteTemplateRole(input: {
        templateRoleId: "${role.id}"       
       })
    }`
};

// Save any changes to an role
const updateRole = (role) => {
  const newParent = role?.signerParent ? `"${role.signerParent}"` : 'null';
  return `
    mutation LDVupdateRole {
      updateTemplateRole(input: {
        templateRoleId: "${role.id}"       
        signerIndex: ${role.signerIndex}
        ordinal: ${role.ordinal}
        signerParent: ${newParent}
        name: ${JSON.stringify(role.name)}
        roleType: ${role.roleType}
        experience: "${role.experience}"
       })
    }`
};

// swap two adjacent roles
const swapRoles = (roleId1, roleId2) => {

  return `
    mutation LDVswapRole {
      swapRoles(input: {
        roleId1: "${roleId1}"       
        roleId2: "${roleId2}"
       })
    }`;

};


export { createRole, updateRole, deleteRole, swapRoles };
