// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdInstruction {
  constructor(): void;
  clone(): gdInstruction;
  setType(type: string): void;
  getType(): string;
  setInverted(inverted: boolean): void;
  isInverted(): boolean;
  setParameter(id: number, value: string): void;
  getParameter(id: number): string;
  setParametersCount(count: number): void;
  getParametersCount(): number;
  getSubInstructions(): gdInstructionsList;
  delete(): void;
  ptr: number;
};