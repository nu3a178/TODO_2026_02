export class Todo {
  public id?: string;
  public title?: string;
  public time?: number;

  constructor(init: Partial<Todo>) {
    Object.assign(this, init);
  }
}
