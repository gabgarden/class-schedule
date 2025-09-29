export interface IValidationService {
  validate<T>(dtoClass: any, data: any): Promise<T>;
}
