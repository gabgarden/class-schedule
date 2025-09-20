export class Classroom {
  id: string;
  number: string;
  capability: number;

  constructor(id: string, number: string, capability: number) {
    this.id = id;
    this.number = number;
    this.capability = capability;
  }
}
