import { LSApiRole, LSApiRoleType } from '../../types/LSApiRole';
import { createRole } from './adapter/roleActions';
import { syncRoles } from './editorUtils';

//Generate roles for any role not already present
export async function generateRoles() {
  const defaultExperience = this.groupInfo.experienceConnection.experiences.find(x => x.defaultExperience === true);

  // We have to wait for parent roles to be created first for WITNESS roles
  const rolePromises = this._recipients
    .filter(r => r.roleType !== 'WITNESS')
    .map((rec, index) => {
      const role = this._template.roles.filter(ro => ro.roleType !== 'WITNESS').find(ro => ro.signerIndex === rec.signerIndex);
      const roleType = rec?.roleType ? rec?.roleType : ('SIGNER' as LSApiRoleType);

      if (!role || role === undefined) {
        const newRole: LSApiRole = {
          id: btoa('rol' + crypto.randomUUID()),
          signerIndex: rec?.signerIndex,
          name: rec?.lastName || roleType + (index + 1),
          roleType,
          ordinal: index + 1,
          signerParent: null,
          experience: defaultExperience ? defaultExperience.id : '',
          templateId: this._template.id,
        };
        return this.adapter.execute(this.token, createRole(newRole)).then(result => {
          this._template.roles= [...this._template.roles, { ...newRole, id: result.createTemplateRole}];
        });
      } else if (rec.signerIndex === 1 && rec.roleType !== role.roleType) {
        // If the detault generated role type has changed, update it
        this.mutate.emit([
          {
            action: 'update',
            data: { ...role, roleType: rec.roleType } as LSApiRole,
          },
        ]);

        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
      
    });

  await Promise.all(rolePromises);

  await checkWitness.bind(this)(defaultExperience);

  syncRoles
    .bind(this)()
    .then(() => {
      this.update.emit({ event: { recipients: this._recipients }, template: this._template });
    });
}

// Generate witness roles if needed
async function  checkWitness(defaultExperience) {

  const witActions = this._recipients
    .filter(r => r.roleType === 'WITNESS')
    .map(wit => {
      const parent = this._template.roles.find(ro => ro.signerIndex === wit.signerIndex % 100);
      const role = this._template.roles.find(ro => ro.signerIndex === wit.signerIndex);

      if (parent && parent !== undefined && (!role || role === undefined)) {

        const newRole: LSApiRole = {
            id: btoa('rol' + crypto.randomUUID()),
            signerIndex: wit?.signerIndex,
            name: wit?.roleType + wit?.signerIndex,
            roleType: 'WITNESS',
            ordinal: parent.ordinal + 1,
            signerParent: parent.id,
            experience: defaultExperience ? defaultExperience.id : '',
            templateId: this._template.id,
          }
        return this.adapter.execute(
          this.token,
          createRole(newRole),
        ).then(result => {
          this._template.roles= [...this._template.roles, { ...newRole, id: result.createTemplateRole }];
        });;
      } else {
        return Promise.resolve();
      }
    });

    await Promise.all(witActions);
}
