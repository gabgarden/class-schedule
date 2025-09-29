export class Teacher {
  name: string;
  email: string;
  subjects: string[];

  constructor(name: string, email: string, subjects: string[]) {
    this.name = name;
    this.email = email;
    this.subjects = subjects;
  }
}
