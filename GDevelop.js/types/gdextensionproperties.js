// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdExtensionProperties {
  getValue(extension: string, property: string): string;
  setValue(extension: string, property: string, newValue: string): void;
  hasProperty(extension: string, property: string): boolean;
  getAllExtensionProperties(extension: string, project: gdProject): gdMapStringPropertyDescriptor;
  delete(): void;
  ptr: number;
};