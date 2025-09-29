export interface IUpdateUseCase<TInput, TOutput> {
  perform(id: string, data: TInput): Promise<TOutput>;
}
