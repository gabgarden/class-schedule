// Comandos que modificam estado (create, update)
export interface ICommandUseCase<TInput, TOutput> {
  perform(data: TInput): Promise<TOutput>;
}
