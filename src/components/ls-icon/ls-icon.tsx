import { Component, Prop, h } from '@stencil/core';
import { icons } from './icons';
import { Icon, IconEnum, iconNames } from '../../types/Icon';

@Component({
  tag: 'ls-icon',
  shadow: true,
})
export class LsIcon {
  @Prop() name?: Icon;
  @Prop() solid?: boolean = false;
  @Prop() color?: string = "#000000";
  @Prop() size?: string = "20";
  @Prop() customStyle?: { [key: string]: string };

  // Added function to check that the Icon enum type has all the icons from the icons.ts file
  private arraysAreIdentical(arr1: string[], arr2: string[]): boolean {
    const modifiedArr1 = arr1[0] === 'none' ? arr1.slice(1) : arr1;
    const modifiedArr2 = arr2[0] === 'none' ? arr2.slice(1) : arr2;

    if (modifiedArr1.length !== modifiedArr2.length) {
      return false;
    }
    const sortedArr1 = [...modifiedArr1].sort();
    const sortedArr2 = [...modifiedArr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }
  iconNamesFromEnum = Object.values(IconEnum);
  componentDidLoad() {
    const areIdentical = this.arraysAreIdentical(
      iconNames,
      this.iconNamesFromEnum,
    );
    if (!areIdentical)
      console.warn(
        'Icons in src/components/ls-icon/icons.ts should be identical to the enum type in src/types/Icon.ts. Please add all icons to the enum type.',
      );
  }

  render() {
    return (
      <host>
        {icons
          ?.filter((icon) => icon.name === this.name)
          ?.map((icon) => (
            <div
              key={icon?.name}
              class='iconContainer'
              style={{
                height: `${this.size}px`,
                width: `${this.size}px`,
                ...this.customStyle,
                color: this.color
              }}
            >
              {this.solid ? (
                <div innerHTML={icon.svgSolid} style={{ top: '0px'}}/>
              ) : (
                <div innerHTML={icon.svgOutline} style={{ top: '0px'}} />
              )}
            </div>
          ))}
      </host>
    );
  }
}
