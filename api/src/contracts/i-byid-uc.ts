// By Id operations (get, delete)
export interface IByIdUseCase<TOutput = void> {
  perform(id: string): Promise<TOutput>;
}
