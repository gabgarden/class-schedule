// Commands that modify state (create, update)
export interface ICommandUseCase<TInput, TOutput> {
  perform(data: TInput): Promise<TOutput>;
}
