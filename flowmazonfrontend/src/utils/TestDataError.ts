export class TestDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = TestDataError.name;
  }
}
